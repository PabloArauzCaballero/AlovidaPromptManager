# M1 · Mac mini — encargo de preproducción (2026-09-26)

> **Estado del encargo:** `TODO` · **Eje:** infraestructura, base de datos y despliegue · **Hitos:** 6
> **Peldaño al repartir:** `DISCOVERED`. Nada de este encargo se ejecutó todavía.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Tu daily: [`M1-MacMini-Daily-Maquinas-2026-09-26.md`](../M1-MacMini-Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M1**. Sos la única con el stack Docker, el token de Coolify y el vigilante de
autodespliegue, así que te toca **todo lo que exige base de datos viva o el servidor**, y nada
que otra máquina pueda hacer. Además sos quien mergea a `test` y quien abre el espejo a `dev`.

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

El estándar de la casa vive en `AlovidaPromptManager`. Instalalo en el repo donde vayas a
trabajar y **pegá la salida de los tres comandos** en tu daily. Un turno que arranca sin esto
arranca en `BLOQUEADO`, porque produce trabajo sin plan, sin evidencia y sin reporte — que
después hay que rehacer.

```bash
ls .claude/skills | wc -l
ls .claude/rules/[0-9]*.md | wc -l
python .claude/hooks/plan_gate.py --self-test
```

Entrá por **`skills-router`**, que es el índice: mapea la situación concreta a la skill que hay
que cargar y fija la precedencia cuando dos se contradicen. Con 178 skills, leer el catálogo
entero no sirve; el router sí.

**Las skills de este encargo:** `coolify-deployment`, `coolify-operations`, `deployment-verification-smoke`, `e2e-playwright`, `e2e-failure-triage`, `model-driven-schema`, `data-modeling-plantuml`, `seed-data-catalogs`, `evidence-and-verification`, `git-workflow-multirepo`, `release-and-rollback`.

Los **hechos de cada proyecto** (comandos reales, invariantes del modelo, prohibiciones, rutas)
no viven en las skills: viven en el `CLAUDE.md` de ese repositorio, y **mandan sobre cualquier
skill**.

## 2. Resultado observable

`https://test.173.249.39.237.sslip.io` sirve la aplicación real —no la maqueta—, las dos apps
de Coolify quedan `running:healthy`, el recorrido de punta a punta pasa tres veces seguidas, y
un push a `test` reconstruye solo. Además, `yarn db:vendor` deja de borrar DDL.

**Kill-test:** pedir `/auth` al dominio público desde **fuera** del servidor. Si devuelve 400, el
SSR no tiene su lista de hosts y el despliegue no sirve, por más verde que esté el healthcheck.

## 3. Alcance

**IN:** los dos recursos de Coolify, el vigilante de autodespliegue, el repo del modelo
(`.puml`, `gen_ddl.py`, `SQL/`), la auditoría de seeds contra la base viva, el recorrido real y
el bucle hasta sano. Los merges a `test` y el espejo a `dev`.

**OUT:** **no** tocás `mockup-frontend` —es la maqueta que mira el cliente—, **no** escribís
código de producto de ningún carril de las otras máquinas, y **no** corrés `yarn smoke`, que
trunca las tablas de negocio y obliga a `rebuild_stack.py --yes` después.

## 4. Contexto que no se deduce leyendo el repo

**El disco está al 100 %** (377 MiB libres de 228 GiB, 78 worktrees, 31 GB de `node_modules`). Se
liberaron 3,2 GiB de cachés regenerables. **Qué worktrees se borran lo decide el propietario**:
pueden ser de sesiones vivas, y matar un proceso ajeno ya pasó una vez.

**La llave SSH puede no estar autorizada todavía.** Comprobalo con
`ssh -i ~/.ssh/alovida_contabo -o BatchMode=yes root@173.249.39.237 hostname`. Si da
`Permission denied`, decilo y seguí: **H1, H2 y H3 no la necesitan**. Sólo hace falta para
inspeccionar la base y reiniciar volúmenes.

**`api-migrate` corre con `ORM_SCHEMA_SYNC=safe`**, que es aditivo y **no aplica
`SQL/patches/`**. Sobre una base vieja puede dejar tablas creadas por el ORM sin sus patches;
`vector_rag` sin dimensión es el caso ya documentado, y ese índice **nunca va a poder existir**
sin recrear la tabla.

## 5. Plan

### H1 — El front real vuelve a levantar en Coolify

**CA:** Dado `https://test.173.249.39.237.sslip.io`, cuando se abre en un navegador, entonces responde 200 con la aplicación, y el recurso queda `running:healthy`.
**DoD:** Las microtareas de H1 en `HECHO`, con la respuesta HTTP y el estado del recurso pegados en el reporte.
**Estado:** TODO

#### H1.S1 — Corregir la configuración del recurso

**CA:** Dado el recurso `alovida-frontend`, cuando se lee por la API de Coolify, entonces declara el compose de `deploy/` y tiene `APP_DOMAIN`.
**DoD:** Las tres microtareas en `HECHO` con la respuesta de la API pegada.
**Estado:** TODO

Hoy `alovida-frontend` (uuid `zslh6pytstjjgf5mexeopvkz`) está `exited:unhealthy`, apunta a
`/docker-compose.yaml` de la raíz en vez de `deploy/docker-compose.coolify.yml`, y **no tiene una
sola variable**. Un `PATCH` o un `deploy` pide confirmación del propietario: pedila antes, no la
fuerces. El token está en `~/.config/alovida/coolify.env`.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Apuntar el recurso a `deploy/docker-compose.coolify.yml` | `GET /applications/<uuid>` devuelve ese `docker_compose_location` | salida del GET pegada | TODO |
| H1.S1.M2 | Cargar `APP_DOMAIN` con el dominio de prueba | `GET /applications/<uuid>/envs` la lista | salida del GET pegada | TODO |
| H1.S1.M3 | Asignar el dominio al servicio `proxy`, puerto 80 | `docker_compose_domains` lo declara | salida del GET pegada | TODO |

#### H1.S2 — Desplegar y comprobar que sirve de verdad

**CA:** Dado el despliegue terminado, cuando se pide `/auth` al dominio público, entonces devuelve 200 y no 400.
**DoD:** Las dos microtareas en `HECHO` con el código HTTP pegado.
**Estado:** TODO

Sin `SSR_ALLOWED_HOSTS` —que sale de `APP_DOMAIN`— el SSR devuelve **400 a todo visitante
real** aunque el healthcheck dé verde, porque el healthcheck pide `localhost`. Es el modo de
fallo que ya documenta el compose.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Disparar el despliegue y esperar a que termine | el recurso queda `running:healthy` | estado del recurso pegado | TODO |
| H1.S2.M2 | Pedir `/auth` al dominio público desde fuera del servidor | 200, no 400 | `curl -o /dev/null -w '%{http_code}'` pegado | TODO |

### H2 — Un push a `test` reconstruye las dos apps solo

**CA:** Dado un commit nuevo en `test`, cuando pasan los minutos del vigilante, entonces las dos apps se reconstruyen sin que nadie toque nada.
**DoD:** Las microtareas de H2 en `HECHO` y el diario del vigilante mostrando un despliegue disparado por un commit real.
**Estado:** TODO

#### H2.S1 — Extender el vigilante a `test` y a las dos apps

**CA:** Dado `--estado`, cuando se corre, entonces informa rama y sha desplegado **por app**.
**DoD:** Las tres microtareas en `HECHO` con la salida de `--estado` pegada.
**Estado:** TODO

Hoy el vigilante launchd sólo mira `mockup` y una sola app. Coolify **no tiene webhook** y la
cuenta no es admin del repositorio, así que crear uno no es una opción: el vigilante es el
camino. Fuente en `tools/autodeploy/`.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Parametrizar el guion por rama y por app | `AUTODEPLOY_RAMA=test` y un uuid por app funcionan | `--estado` de las dos apps pegado | TODO |
| H2.S1.M2 | Instalar el plist de `test` sin tocar el de `mockup` | `launchctl list` muestra los dos | salida pegada | TODO |
| H2.S1.M3 | Comprobar con un commit real | el diario anota `DESPLEGADO <sha>` | líneas del diario pegadas | TODO |

### H3 — El modelo y la copia vendorizada de la API dejan de divergir

**CA:** Dado `yarn db:vendor` seguido de `git status database`, cuando se corre, entonces **no borra ningún patch** y el árbol queda limpio.
**DoD:** Las microtareas de H3 en `HECHO`, con `db:vendor:check` en exit 0 y `rebuild_stack.py --yes` en PASS.
**Estado:** TODO

#### H3.S1 — Promover al modelo los dos módulos que sólo viven en la API

**CA:** Dado `mantra-core-health-model`, cuando se regenera con `gen_ddl.py`, entonces `SQL/patches/` contiene los cuatro patches y el DDL de los módulos 67 y 68.
**DoD:** Las cuatro microtareas en `HECHO` con el diff del DDL generado pegado.
**Estado:** TODO

**Esto bloquea a las otras cinco máquinas: nadie corre `db:vendor` hasta que cierre.** Los dos
primeros patches **declaran en su propio encabezado** que son un desvío del proceso canónico
(ADR-0021) porque el módulo no tiene `.puml`. El `.puml` **transcribe** lo que ya declaran las
entidades MikroORM y el catálogo de índices: no se inventa ni una columna. Ojo con la colisión
de numeración: hay dos `v4219` y dos `v4220`.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Escribir `diagram_67_data_catalog.puml` transcribiendo las entidades | el DDL generado coincide con el patch existente | diff del DDL pegado | TODO |
| H3.S1.M2 | Escribir `diagram_68_qa_execution.puml` igual | idem | diff del DDL pegado | TODO |
| H3.S1.M3 | Llevar al modelo los patches de RLS de custodia y de `objective_status` | los cuatro están en `SQL/patches/` | `ls` pegado | TODO |
| H3.S1.M4 | Resolver la colisión de numeración | no hay dos patches con la misma versión | `ls` pegado | TODO |

#### H3.S2 — Vendorizar sin pérdida

**CA:** Dado `yarn db:vendor`, cuando se corre, entonces `git status database` no muestra ninguna `D`.
**DoD:** Las dos microtareas en `HECHO` con la salida de `db:vendor:check` y del rebuild pegadas.
**Estado:** TODO

`db:vendor:check` **no caza esta deriva en CI**, porque ahí no existe el repo del modelo contra
el que comparar. La comprobación real es local.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Correr `yarn db:vendor` y comprobar que no borra nada | `git status database` sin líneas `D` | salida pegada | TODO |
| H3.S2.M2 | Reconstruir el stack desde cero | `rebuild_stack.py --yes` da PASS | veredicto pegado | TODO |

### H4 — Se sabe qué siembra cada uno de los doce markdown

**CA:** Dada la matriz de auditoría, cuando se lee, entonces cada archivo tiene su seed, su tabla y su conteo **medido** contra la base viva.
**DoD:** La matriz publicada con las consultas y sus resultados pegados.
**Estado:** TODO

#### H4.S1 — Medir, no suponer

**CA:** Dado cada uno de los doce archivos, cuando se busca su destino, entonces queda dicho si llega, por qué camino y con cuántas filas.
**DoD:** Las dos microtareas en `HECHO` con las consultas pegadas.
**Estado:** TODO

**Hay tres cifras en circulación y las tres distintas.** Este hito sólo lee: no cambia nada.
Cinco archivos llegan por `tools/bolivia-datasets/extract_datasets.py`; las personas y las dos
redes de aseguradoras **existen sólo como scripts manuales que ningún despliegue corre**.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Cruzar los doce archivos contra los seeds que los leen | cada archivo tiene camino o dice «ninguno» | matriz pegada | TODO |
| H4.S1.M2 | Contar filas reales por tabla en la base viva | cada fila de la matriz tiene su conteo | salida de `psql` pegada | TODO |

### H5 — El recorrido real contra el VPS pasa tres veces seguidas

**CA:** Dada la suite `*.real.spec.ts` contra `https://test.…`, cuando se corre tres veces sobre el mismo commit, entonces las tres dan verde.
**DoD:** Las microtareas de H5 en `HECHO` con las tres salidas y las fotos de los tres viewports.
**Estado:** TODO

#### H5.S1 — Escribir y correr el recorrido

**CA:** Dado el sitio desplegado, cuando la suite corre, entonces cubre salud de la API por el proxy, login por rol, directorio con médicos reales y páginas públicas en 200.
**DoD:** Las tres microtareas en `HECHO` con salida y fotos.
**Estado:** TODO

Siempre `--workers=1`. Consola sin errores y red sin 4xx/5xx inesperados forman parte del
criterio, no son un extra. Viewports 375, 768 y 1440, claro y oscuro.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Escribir la suite contra el dominio de prueba | cubre los cuatro puntos del CA | archivo y salida pegados | TODO |
| H5.S1.M2 | Correrla y sacar foto de cada viewport | 3 viewports × 2 temas | fotos en `docs/progress/evidence/` | TODO |
| H5.S1.M3 | Repetirla tres veces sobre el mismo commit | tres verdes seguidos | las tres salidas pegadas | TODO |

### H6 — El bucle deja el servidor sano y estable

**CA:** Dadas las dos apps, cuando pasan 24 h, entonces siguen `running:healthy` y el recorrido real sigue en verde.
**DoD:** Las microtareas de H6 en `HECHO`, con el estado de las apps al inicio y a las 24 h.
**Estado:** TODO

#### H6.S1 — Cerrar el ciclo merge → build → recorrido → corrección

**CA:** Dado un fallo del recorrido, cuando se clasifica, entonces queda como `PRODUCT_BUG`, `TEST_BUG`, `ENVIRONMENT` o `DATA`, con su evidencia, y va al carril dueño.
**DoD:** Las tres microtareas en `HECHO` con la bitácora del bucle.
**Estado:** TODO

El build tarda **15–30 min medidos**: el bucle se pacea por eso, no por reloj. Un fallo de
entorno **no se maquilla como PASS**: se documenta y se resuelve si está bajo control.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Mergear a `test` lo que llegue de las otras cinco | cada merge dispara build | bitácora pegada | TODO |
| H6.S1.M2 | Clasificar cada fallo y mandarlo a su dueño | ninguno queda sin clasificar | tabla de fallos pegada | TODO |
| H6.S1.M3 | Abrir el PR espejo `test → dev` en los dos repos | los dos abiertos y verdes | URLs pegadas | TODO |


## 6. Ambigüedades registradas

Se **registran**, no se resuelven por conveniencia. Si una bloquea, se declara `BLOQUEADO` con
la evidencia y se sigue con lo que no dependa de ella.

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | Qué worktrees de la Mac mini se pueden borrar para recuperar disco | el propietario | H1 en adelante, si el disco se llena otra vez |
| Q-02 | Si el dominio final es `sslip.io` o un subdominio real de `alovidasalud.com` | el propietario | nada hoy: es cambiar una variable |
| Q-03 | Si la base del VPS se reinicia desde cero o se migra en caliente | el propietario, con la evidencia de H4 | H6, si la deriva de esquema rompe el recorrido |

## 7. Definition of Done del encargo

Las dos apps `running:healthy`, el recorrido real verde **tres veces sobre el mismo commit**,
`yarn db:vendor` sin borrar nada, la matriz de seeds publicada con sus conteos medidos, el
vigilante de `test` andando, y los dos PR espejo a `dev` abiertos. Todo con su salida literal en
`docs/progress/evidence/`.

## 8. Reglas que no se negocian

- `corepack yarn`, nunca `npm`.
- **Nada se declara hecho por debajo de `REGRESSION_VERIFIED`.** La evidencia va a
  `docs/progress/evidence/lane-<id>/REPORT.md` con los comandos y su **salida literal pegada**.
  Compilar no es verificar; «debería funcionar» es FAIL.
- **No inventar.** Antes de crear una entidad, tabla, endpoint o componente, localizá el
  equivalente **por código**. «Seguramente ya hay algo así» no es evidencia.
- **Diff mínimo.** Nada de refactors ni renombres fuera de lo pedido.
- Identificadores nuevos en **inglés**; prosa de pantalla en **castellano rioplatense**.
- Si tocás datos de personas, `data-privacy-phi` aplica aunque nadie lo haya pedido.
- **No corras `yarn smoke`** sin avisar: trunca las tablas de negocio y la recuperación es
  `rebuild_stack.py --yes`, no `load_seeds.py --refresh`.
- **Un solo navegador a la vez en esta máquina**, `--workers=1`.
- Un `PATCH` o un `deploy` de Coolify **pide confirmación del propietario**. No lo fuerces.
