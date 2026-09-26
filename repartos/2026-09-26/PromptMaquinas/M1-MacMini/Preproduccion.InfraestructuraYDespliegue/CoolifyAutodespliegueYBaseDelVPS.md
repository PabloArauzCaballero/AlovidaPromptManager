# M1 · Mac mini — encargo de preproducción (2026-09-26)

> **Estado:** `TODO` · **Eje:** infraestructura, base de datos y despliegue · **Carriles:** 6
> **Peldaño al repartir:** `DISCOVERED`. Nada de este encargo se ejecutó todavía.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M1** del esfuerzo de preproducción de AloVida. Sos la única con el
stack Docker, el token de Coolify y el vigilante de autodespliegue, así que tu trabajo
es **todo lo que exige base de datos viva o el servidor**, y nada que otra máquina
pueda hacer.

Leé primero `docs/plan-test-preproduccion-2026-09-25/REPARTO-6-MAQUINAS.md`. La rama
base de los dos repos es **`test`** (front `ec7037f7`, API `016caaa1`); `mockup` no se
toca. Cada carril va en su propio worktree desde `origin/test` y termina en un PR
contra `test`. Vos además sos quien mergea a `test` y quien abre el espejo a `dev`.

## Antes de nada, dos cosas que te bloquean

1. **Disco al 100 %.** Quedan pocos GB y hay 78 worktrees con 31 GB de `node_modules`.
   Pedile al propietario qué worktrees se borran; **no los borres por tu cuenta**, pueden
   ser de sesiones vivas. Sí podés borrar cachés (`.angular/`, `~/.yarn/berry/cache`).
2. **La llave SSH del VPS.** Comprobá `ssh -i ~/.ssh/alovida_contabo -o BatchMode=yes root@173.249.39.237 hostname`.
   Si da `Permission denied`, el propietario todavía no completó el `ssh-copy-id`: decilo
   y seguí con lo que no lo necesite.

## Tu cola, en orden

### 1 · D2 — el front real en Coolify
`alovida-frontend` (uuid `zslh6pytstjjgf5mexeopvkz`) está `exited:unhealthy`: apunta a
`/docker-compose.yaml` de la raíz y **debería apuntar a `deploy/docker-compose.coolify.yml`**,
no tiene ninguna variable (le falta `APP_DOMAIN`) y no tiene dominio. El runbook correcto
es `mantra-core-health-api/docs/operations/coolify.md` §5.
- Dominio: `test.173.249.39.237.sslip.io`, asignado al servicio `proxy`, puerto 80.
- `SSR_ALLOWED_HOSTS` sale de `APP_DOMAIN`; sin eso el SSR devuelve 400 a todo visitante real.
- La red `alovida` la crea el stack de la API, que ya está `running:healthy`.
- Token en `~/.config/alovida/coolify.env`. Un `PATCH`/`deploy` pide confirmación del
  propietario: pedila antes, no la fuerces.
- **Terminado cuando** `https://test.173.249.39.237.sslip.io` responde 200 y el contenedor
  queda `running:healthy`.

### 2 · D3 — autodespliegue de `test`
Hoy el vigilante launchd sólo mira `mockup`. Duplicá `tools/autodeploy/` para `test` y para
**las dos** apps (`AUTODEPLOY_RAMA=test`, un uuid por app), con `--estado` por app.
Coolify no tiene webhook y la cuenta no es admin del repo: el vigilante es el camino.
**Terminado cuando** un push a `test` reconstruye las dos apps solo.

### 3 · D4 — reconciliar el modelo con la copia vendorizada de la API
**Esto bloquea a todos: nadie puede correr `yarn db:vendor` hasta que cierres.** Hay 4
patches que existen sólo en `mantra-core-health-api/database/SQL/patches/` y nunca llegaron
al repo del modelo, así que `db:vendor` los **borra**:
- `2026-09-18_v4219_data_catalog.sql` — módulo 67, 8 tablas, schema nuevo
- `2026-09-18_v4220_qa_execution.sql` — módulo 68, 4 tablas, schema nuevo
- `2026-09-19_v4219_custodian_tenant_rls.sql` — política RLS sobre 28 tablas
- `2026-09-19_v4220_restore_test_runs_objective_status.sql` — y su columna ya horneada en
  `database/SQL/11_system_ops/02_tables.sql`

Los dos primeros **declaran en su encabezado** que son un desvío del proceso canónico
(ADR-0021) porque no tienen `.puml`. El trabajo es promoverlos: escribir
`diagram_67_data_catalog.puml` y `diagram_68_qa_execution.puml` **transcribiendo** lo que
ya declaran las entidades MikroORM y el catálogo de índices (no inventes ni una columna),
regenerar con `gen_ddl.py`, y recién entonces `yarn db:vendor` y `db:vendor:check`.
Ojo con la colisión de numeración: hay dos `v4219` y dos `v4220`.
**Terminado cuando** `db:vendor` no borra nada y `rebuild_stack.py --yes` da PASS.

### 4 · C0 — auditoría de seeds contra la base viva
Matriz de los 12 `.md` de `mantra-core-health-model/markdown_convertidos/` → qué seed los
lee → qué tabla → cuántas filas hay de verdad. Ya sé que 5 llegan por
`tools/bolivia-datasets/extract_datasets.py` y que las personas y las redes de aseguradoras
**sólo existen como scripts manuales** que ningún despliegue corre. Medí, no supongas: hay
tres cifras en circulación y las tres distintas. Sólo lees.

### 5 · E1 — smoke real contra el VPS
Suite `*.real.spec.ts` con `--workers=1`, contra `https://test.…`: salud de la API por el
proxy, login de una cuenta por rol, directorio con médicos de Alianza, páginas públicas SSR
en 200, consola sin errores, red sin 4xx/5xx inesperados, en 375/768/1440 y en modo oscuro.
**Terminado cuando** pasa 3 veces seguidas sobre el mismo commit.

### 6 · E2 — el bucle hasta healthy
Cada merge a `test` → Coolify construye → E1 corre → clasificás el fallo
(`PRODUCT_BUG` / `TEST_BUG` / `ENVIRONMENT` / `DATA`) → lo mandás al carril dueño → otra
vuelta. El build tarda 15–30 min medidos: pacealo por eso, no por reloj.
**Terminado cuando** las 2 apps están `running:healthy`, E1 verde 3 veces y 24 h sin caída.

## Reglas que no se negocian
- `corepack yarn`, nunca `npm`.
- **No corras `yarn smoke`** sin avisar: trunca las tablas de negocio y después hace falta
  `rebuild_stack.py --yes`, no `load_seeds.py --refresh`.
- Nada se declara hecho por debajo de `REGRESSION_VERIFIED`; la evidencia va a
  `docs/progress/evidence/lane-<id>/REPORT.md` con comandos y salidas literales.
- Un solo navegador a la vez en esta máquina, `--workers=1`.
- Identificadores nuevos en inglés; prosa de pantalla en castellano.
