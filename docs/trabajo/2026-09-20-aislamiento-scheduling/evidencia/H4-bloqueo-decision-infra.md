# H4 — Estabilizar el baseline y probar la migración conjunta: BLOQUEADO

## Qué se intentó

H4 exige, según el DoD literal, un **baseline de producto completo** levantado desde cero:
no la porción de `scheduling` (17 tablas, lo que ya se levantó en H1.S3), sino el modelo
entero — `mantra-core-health-model/salud-db/rebuild_stack.py`, que según el propio `CLAUDE.md`
del proyecto materializa **1 184 tablas, ~9 100 índices y 1 464 894+ filas de seed** vía
generadores Python (`gen_ddl.py`, `gen_seeds.py`, `load_seeds.py`).

Se confirmó que el intérprete existe en esta máquina (`py --version` → Python 3.14.0, via el
launcher `C:\Windows\py.exe` — no como `python`/`python3` en PATH de git-bash) y que el repo
`mantra-core-health-model/salud-db/rebuild_stack.py` está presente.

## Por qué se para acá, no se ejecuta

1. **Escala distinta a la autorizada esta noche.** La autorización de Docker (D-1 del PLAN.md)
   fue para "una instancia Postgres efímera y propia de este trabajo" en el contexto de aislar
   `scheduling` (17 tablas). Un rebuild de 1 184 tablas + 1,46M filas es una operación de
   volumen, tiempo y consumo de recursos de otro orden — no es la misma decisión de infra que
   Itzan ya tomó, aunque la autorización general de Docker siga en pie.
2. **Riesgo real ya observado esta misma sesión**: la corrida de `corepack yarn test` con
   Docker levantado murió por la protección de memoria baja del entorno (ver notas de sesión
   previas a este plan). Lanzar un rebuild de esa escala sin que Itzan esté para monitorear
   el consumo de su máquina toda la noche repite ese riesgo, ahora contra una carga aún mayor.
3. **Regla propia del workspace**: *"La infraestructura la levanta Itzan (...) si una
   verificación la necesita y no está, se anuncia y se para: BLOCKED, no PASS por analogía.
   Una autorización explícita para levantarla vale solo para la sesión en que se dio."* — la
   sesión de esta noche autorizó una instancia chica y puntual; extenderla a un rebuild
   completo de producto es una decisión de infra nueva, no una continuación automática de la
   anterior.

## Qué queda listo para cuando se autorice

- El comando exacto: `py salud-db/rebuild_stack.py --yes` desde `mantra-core-health-model/`,
  apuntado (vía variables de entorno, no hardcodeado) a un contenedor Postgres nuevo y propio
  de H4 — nunca `mantra-redesa-postgres-1` ni Neon.
- El veredicto esperado documentado en `CLAUDE.md` del equipo: PASS con 18/18 comprobaciones
  en `[OK]`, para comparar contra lo que salga acá.
- H4.S2 (migración conjunta) y H4.S3 (deriva) dependen de que H4.S1 exista primero — quedan
  igual de `BLOQUEADO`, no se puede probar migración ni deriva sobre un baseline que no se
  levantó.

## Efecto en cascada

H5 (empaquetar el candidato final, depende de H4) y H6 (reejecutar gates sobre la versión
final, depende de H5) quedan **BLOQUEADO** por la misma causa raíz. No se fuerza ninguno de
los dos fingiendo una base que no existe.

## Actualización tras autorización de Itzan ("si es necesario si")

Antes de lanzar nada, se investigó CÓMO aislarlo de verdad, porque `rebuild_stack.py` hace
`docker compose down -v` contra `COMPOSE_FILE = API_DIR/docker-compose.yml` **hardcodeado**
(`salud-db/paths.py:55`) — sin aislar, habría borrado los volúmenes del stack compartido
`mantra-redesa`. Se confirmó que SÍ hay escape hatch legítimo sin tocar el script: el propio
compose parametriza `name:`, los 6 volúmenes y la red con `${COMPOSE_PROJECT_NAME:-mantra-redesa}`,
y el puerto de Postgres con `${POSTGRES_PORT:-5433}`; `postgres-init` además acepta
`SQL_MODEL_DIR`/`NOSQL_MODEL_DIR` para apuntar al modelo real sin `yarn db:vendor`. Exportando
`SALUD_WORKSPACE` a una carpeta propia con su propio `mantra-core-health-api/{docker-compose.yml,.env,docker/db-init/}`
(compose real sin editar, `.env` con `COMPOSE_PROJECT_NAME`/puertos propios) se podía correr
`rebuild_stack.py` contra una copia de infraestructura totalmente aparte, sin volúmenes ni
puertos compartidos con `mantra-redesa` ni con `night-scheduling-pg` de H1.

**Se paró antes del `docker compose up` por un dato duro, no una hipótesis:**

  PowerShell: Get-CimInstance Win32_OperatingSystem -> FreeGB: 1.58 / TotalGB: 15.64

Con 1,58 GB libres AHORA MISMO (stack compartido `mantra-redesa-api-1` + 12 workers ya
corriendo, más `night-scheduling-pg` de H1), levantar un segundo stack completo de 5 servicios
(Postgres + Mongo + Redis + OpenSearch + MinIO) para cargar ~1,46M filas de seed repite con
alta probabilidad el mismo OOM que ya mató un `yarn test` esta misma sesión con Docker arriba
— y esta vez el riesgo no es solo perder el rebuild: OpenSearch en particular reserva heap
significativo, y quedarse sin memoria puede degradar o tirar el stack COMPARTIDO que otros
carriles están usando en vivo, no solo el contenedor propio de esta tarea.

**Decisión:** H4 sigue BLOQUEADO. No es un "no" a la autorización de Itzan — es que la
autorización ("si es necesario sí") no tenía este dato al momento de darse, y la propia regla
del workspace pide anunciar y parar ante un blocker de infra real, no forzarlo. Recomendación
concreta para retomar: liberar memoria del host (cerrar lo que no haga falta) o esperar a un
momento con más margen, y entonces sí levantar el segundo stack por `SALUD_WORKSPACE` +
`COMPOSE_PROJECT_NAME` propio, como quedó diseñado arriba — no hace falta rediseñar nada, solo
tener memoria disponible.

## Segunda causa independiente, aportada por el carril B (2026-09-20)

`PREGUNTAS-EQUIPO-CARRIL-B-2026-09-20.md` §10 (HALL-06) reporta, con salida literal, que
`rebuild_stack.py --yes` **aborta en el paso 0/4** para cualquiera que lo corra hoy: su chequeo
de fuentes de DDL (`check_ddl_sources.py`) rechaza la copia vendorizada `database/SQL`, que el
repo mantiene A PROPOSITO desde v4.0.9 para el despliegue (ver cabecera de
`scripts/db/vendor-ddl.sh`: una plataforma que clona solo el repo de la API necesita esa copia,
si no el contenedor de init arranca con `/init/SQL` vacio).

Es decir: aun con memoria disponible, la herramienta que `CLAUDE.md` declara "el UNICO camino de
recuperacion" no arranca. Son dos causas independientes del mismo bloqueo, no una.

Lo bueno: ese rechazo ocurre ANTES del `down -v` (comentado a proposito en
`rebuild_stack.py:385`), asi que no destruye nada.

**Advertencia sobre el ciclo manual que propone esa misma pregunta como alternativa:** empieza con
`docker compose --profile "*" down -v`. Corrido con el nombre de proyecto por defecto, eso borra
los volumenes del stack compartido `mantra-redesa` — datos vivos de otros carriles. El camino
aislado ya disenado aca (SALUD_WORKSPACE + COMPOSE_PROJECT_NAME propios) esquiva las dos cosas a
la vez: el `down -v` solo alcanzaria volumenes propios, y el chequeo 0/4 pasa porque la carpeta
aislada no contiene `database/SQL`.
