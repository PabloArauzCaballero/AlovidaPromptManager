# Receta — levantar el baseline en un entorno aislado, sin tocar el compartido

Reproduce el baseline de esta noche en ~10 minutos. **No destruye nada**: crea un proyecto
compose aparte, con sus propios volúmenes, y convive con el entorno compartido.

## Por qué así y no con `rebuild_stack.py`

`rebuild_stack.py` arranca con `docker compose down -v` sobre un compose de **ruta fija**
(`salud-db/paths.py:55`). Sin aislar el proyecto, ese borrado apunta a los volúmenes del
entorno compartido. La ruta de abajo no necesita ese paso y no puede alcanzarlos.

## 1 · Archivo de entorno para compose

El compose ya está parametrizado: `name:` (línea 24) y **cada** `name:` de volumen (1211-1225)
cuelgan de `COMPOSE_PROJECT_NAME`, y los puertos de `POSTGRES_PORT` / `MONGO_PORT`.

```env
COMPOSE_PROJECT_NAME=mantra-h4-baseline
POSTGRES_DB=mantra_h4_baseline
POSTGRES_USER=mantra
POSTGRES_PASSWORD=<una contraseña local de un solo uso>
POSTGRES_PORT=<puerto libre, distinto del de la instancia compartida>
MONGO_PORT=<idem>
SQL_MODEL_DIR=../mantra-core-health-model/SQL
NOSQL_MODEL_DIR=../mantra-core-health-model/NoSQL
```

**Comprobar el aislamiento ANTES de levantar nada** — este paso no se saltea:

```bash
docker compose --env-file <env> -p mantra-h4-baseline --profile local-db config \
  | grep -A1 -E "^  (postgres_data|mongodb_data):"
# todos los name: deben decir mantra-h4-baseline_*, ninguno mantra-redesa_*
```

## 2 · Levantar

```bash
cd mantra-core-health-api
docker compose --env-file <env> -p mantra-h4-baseline --profile local-db up -d --wait postgres mongodb
```

## 3 · DDL

```bash
docker compose --env-file <env> -p mantra-h4-baseline --profile local-db run --rm postgres-init
```

**Sale 3.** Es lo esperado hoy: dos patches impiden una base limpia (HALL-08). Todo lo anterior
a ellos sí queda aplicado. Aplicar después los posteriores, **omitiendo los dos**:

```bash
for f in $(ls SQL/patches/*.sql | sort | sed -n '/2026-09-08_v428/,$p'); do
  case "$(basename "$f")" in
    2026-09-08_v428_billing_quotations.sql|2026-09-19_v4221_aseguradoras_codigo_unico.sql)
      echo "[OMITIDO] $(basename "$f")"; continue ;;
  esac
  docker exec -i mantra-h4-baseline-postgres-1 \
    psql -U mantra -d mantra_h4_baseline -v ON_ERROR_STOP=1 -q < "$f" \
    && echo "[OK] $(basename "$f")" || echo "[FALLA] $(basename "$f")"
done
```

Cuando HALL-08 se corrija aguas arriba, este bucle sobra y `postgres-init` alcanza.

## 4 · Seeds, sin abrir el `.env` real

`load_seeds.py` lee el `.env` de la API **como archivo** (`load_seeds.py:55-62`), no por
variables de entorno. Para no abrir el del checkout real se usa la escotilla que el propio
`paths.py:32` deja: un **workspace sombra**.

```
<sombra>/mantra-core-health-api/.env   ← sólo POSTGRES_* del entorno de prueba, y MONGODB_URI
```

Las rutas del modelo (seeds, SQL) cuelgan de `MODEL_ROOT`, no del workspace, así que siguen
siendo las reales.

```bash
cd mantra-core-health-model/salud-db
SALUD_WORKSPACE=<sombra> <intérprete> load_seeds.py --skip-prod --skip-opensearch --skip-redis
```

## 5 · Conteos de referencia (medidos el 2026-09-20)

```
tablas 1201 · FK 6792 (0 sin validar) · índices 9236 · schemas 65
```

Idempotencia: una segunda corrida del cargador da `TOTAL insertados: 0`.
Ojo con Mongo: informa `ya:16` donde la colección tiene 8 documentos — cuenta registros de
semilla procesados (boot + mock, que se solapan), no documentos almacenados.

## 6 · Dar de baja, con sus volúmenes

```bash
docker compose --env-file <env> -p mantra-h4-baseline --profile local-db down -v
```

`-v` es seguro **acá y sólo acá**, porque `-p` acota el borrado a los volúmenes
`mantra-h4-baseline_*`. Verificar después que los del compartido siguen:

```bash
docker volume ls --filter name=mantra-redesa
```
