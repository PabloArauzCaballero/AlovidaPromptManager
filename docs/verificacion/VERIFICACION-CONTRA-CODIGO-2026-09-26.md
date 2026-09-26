# Verificación contra el código — preproducción en seis máquinas (2026-09-26)

> **Qué es:** los hechos con los que se armó el plan, cada uno medido en esta máquina y con el
> comando que lo produjo. Lo que no se pudo medir dice «sin confirmar».
>
> Peldaño de evidencia: **`RUNS`** para lo que se construyó y se comprobó acá (la rama `test` de
> los dos repos); **`DISCOVERED`** para lo que sólo se leyó. Ninguna afirmación de esta página es
> `VERIFIED`: nada se ejercitó contra la API desplegada todavía.
>
> Cortes: front `origin/mockup` @ `c38a2918` y `origin/dev` @ `9870b83a` · API `origin/dev` @
> `710e6f1a` · modelo `origin/dev` @ `13dd040` (v4.2.23).

---

## 1 · La base de partida, construida y medida

La rama `test` se creó en los dos repos y **compila**. Es lo que permite que las seis máquinas
arranquen sin esperar a nadie.

| Repo | `test` | Medición |
|---|---|---|
| `mantra-core-health` | `ec7037f7` | `yarn typecheck` exit 0 · `yarn build` exit 0 (1,29 MB inicial) · `yarn test` 602/613 suites |
| `mantra-core-health-api` | `016caaa1` | `yarn typecheck` exit 0 · `yarn lint` exit 0 |

### 1.1 Cómo se resolvieron los 45 conflictos de `mockup` sobre `dev`

La regla no fue «la rama más nueva» ni «la fecha»: fue medir, archivo por archivo, qué commits
tiene cada lado que el otro **no tiene por patch-id**.

```bash
git log --cherry-pick --left-right --no-merges --format='%m %h %s' origin/mockup...origin/dev -- <archivo>
```

- **44 archivos → `mockup`.** En todos, el único lado con commits propios es `mockup`. Lo que
  `dev` parecía aportar eran los ports de Pablo (`sync(perfil-médico): traer #613/#624/#625/#627/#644/#645 a dev`)
  y `ea66c564`, que dice **en su propio cuerpo** «se trae la versión vigente en mockup»: el mismo
  cambio con otra historia. Tomar `dev` ahí habría revertido lo que `mockup` hizo encima.
- **1 archivo → `dev`:** `src/app/core/mock/handlers/insurance.handlers.ts`. Acá `mockup` no tiene
  ningún commit propio y `dev` sí (`36b5efb9`, la liquidación con exclusiones formales del PR
  #663). Medido: 12 apariciones de `settlementAvailability`/`policyClauseReference`/`totalPatientAmount`
  en `dev` contra 2 en `mockup`.

Dos resoluciones que no se leen en el diff y quedan asentadas:

- **`ubicacion-picker`:** `dev` reponía los avisos «pin sin confirmar» y «mover pin» con
  `7b32af30` («restaurar contenido que el merge automático descartó en silencio») y `mockup` los
  había sacado a pedido del cliente con `a25fd5b3`. **Gana `mockup`**: es una decisión del cliente
  sobre una pantalla que él revisó, no la pérdida de un merge. Se tomó `mockup` en los 15 archivos
  que toca ese commit, porque si no las plantillas quedaban apuntando a propiedades inexistentes.
- **Menú lateral:** `dev` ajustó los specs «al menú real de dev» (`e6a104cf`), pero `mockup` tiene
  siete cambios de menú posteriores que ese menú no conoce (sacar «Panel», unir «Mis pedidos» y
  «Cotizaciones» en Farmacia, «Evoluciones» → «Notas médicas», ocultar «Mis cuestionarios»,
  promociones en la cabecera, H6 «Lugares cercanos»). Se toma el menú de `mockup` y con él su spec.

---

## 2 · Los seis hallazgos que cambian el plan

### H-1 · El merge de tres vías duplicó código en silencio · CORREGIDO

`src/app/features/auth/register-patient/register-patient.ts` **no estaba en la lista de
conflictos** y salió con **siete identificadores duplicados**: el bloque de las direcciones
vaciadas por el mapa entró por `dev` y por `mockup` en commits distintos con el mismo contenido, y
git lo insertó **dos veces** porque el contexto de alrededor difería.

```
src/app/features/auth/register-patient/register-patient.ts(943,20): error TS2300: Duplicate identifier 'domicilioVaciadoPorElMapa'.
… 7 errores TS2300
```

**Lo caza `tsc`; ninguna prueba lo habría cazado, porque el archivo ni compila.** Corregido en
`f5c9de9c` tomando la versión de `mockup`.

**Consecuencia para el estándar:** después de mezclar dos ramas grandes, `yarn typecheck` va
**antes** que las pruebas. Un `git status` sin conflictos no dice que el merge esté bien.

### H-2 · `yarn db:vendor` de la API es destructivo hoy · ABIERTO, bloquea a todos

Cuatro patches existen **sólo** en `mantra-core-health-api/database/SQL/patches/` y nunca llegaron
al repo del modelo. `yarn db:vendor` los **borra**:

| Patch | Qué trae | Autor y commit |
|---|---|---|
| `2026-09-18_v4219_data_catalog.sql` | módulo 67, schema nuevo, 8 tablas | Pablo, `3ca6af0f` |
| `2026-09-18_v4220_qa_execution.sql` | módulo 68, schema nuevo, 4 tablas | Pablo, `3ca6af0f` |
| `2026-09-19_v4219_custodian_tenant_rls.sql` | política RLS sobre 28 tablas con `custodian_tenant_id` | Pablo, `bf6d4470` |
| `2026-09-19_v4220_restore_test_runs_objective_status.sql` | y su columna, ya horneada en `11_system_ops/02_tables.sql` | Pablo, `da13582d` |

Los dos primeros **declaran en su propio encabezado** que son un desvío del proceso canónico
(ADR-0021) porque el módulo no tiene `.puml`. Hay además colisión de numeración: dos `v4219` y dos
`v4220`.

```bash
corepack yarn db:vendor
git status --short database
#  M database/SQL/11_system_ops/02_tables.sql
#  D database/SQL/patches/2026-09-18_v4219_data_catalog.sql
#  D database/SQL/patches/2026-09-18_v4220_qa_execution.sql
#  D database/SQL/patches/2026-09-19_v4219_custodian_tenant_rls.sql
#  D database/SQL/patches/2026-09-19_v4220_restore_test_runs_objective_status.sql
```

**`db:vendor:check` de CI no lo caza**: el script dice que en CI, donde sólo se clona ese repo,
«no hay contra qué comparar». O sea que la deriva es invisible en la compuerta.

**Nadie corre `db:vendor` hasta que se cierre.** Cierra promoviendo los cuatro al modelo.

### H-3 · La suite del front no es determinista · ABIERTO, bloquea la compuerta

Dos corridas del **mismo commit** dieron conjuntos rojos distintos:

| Corrida | Suites rojas | Pruebas rojas |
|---|---|---|
| 1.ª | 17 | (no registrada) |
| 2.ª | 11 | 127 |

Y `core/mock/handlers/insurance-portability.handlers.spec.ts` **falla en la corrida completa y
pasa aislada**. Síntomas dominantes: 12 × `Cannot configure the test module when the test module
has already been instantiated` y 6 × `Cannot read properties of undefined (reading 'verify')`.

**La causa está escrita en el propio `src/test-setup.ts`**, que ya arregló una instancia del
patrón: un throw en un hook marca fallada cada prueba del archivo **y deja el `TestBed`
instanciado**, así que los archivos que siguen en el **mismo worker** caen con un error que no
tiene nada que ver con lo que probaban. Queda al menos una causa más; candidato visto:
`TypeError: this.auth.userId is not a function`.

**Es de `mockup`, no del merge.** Consecuencia práctica: **hoy la suite completa no sirve como
compuerta**. Hasta que se cierre, cada carril corre specs dirigidos.

### H-4 · `mockup` ya traía rojo · ABIERTO, es la línea base

Medido corriendo la suite sobre `origin/mockup` en el mismo worktree (mismo `yarn.lock`, sin
reinstalar):

```
Test Files  12 failed | 600 passed (612)
     Tests  104 failed | 7927 passed (8031)
```

Y el lint del front: **263 errores en 201 archivos**. Los 201 son **byte a byte idénticos a
`origin/mockup`** (medido con `git diff --quiet origin/mockup -- <archivo>` sobre cada uno: 0
difieren), así que el merge no introdujo ninguno.

| Regla | Errores |
|---|---|
| `@angular-eslint/prefer-on-push-component-change-detection` | 244 |
| `@typescript-eslint/no-unused-vars` | 4 |
| `@typescript-eslint/no-empty-function` | 2 |
| `@typescript-eslint/array-type` | 2 |

### H-5 · Un defecto real heredado de `dev` · CORREGIDO

`insurance-portability.handlers.spec.ts` afirmaba 14 reclamos y el simulador ya daba 15. Se
**reprodujo en `origin/dev`** con el mismo mensaje (`expected 15 to be 14`), así que no es del
merge: lo introdujo `36b5efb9` (PR #663), que sumó `CLM-2026-0183` para cubrir CA-3.3 y no
actualizó la prueba.

La cifra buena se **midió con una sonda temporal sobre el propio simulador**, no se calculó a
mano: `recordCount=15 covered=12530.00 billed=13500.00`. Corregido en `ed096b66`, **sin debilitar
la aserción**: sigue exacta y se le sumó `billedAmount`, que antes no se comprobaba.

### H-6 · Tres defectos de calidad heredados de `dev` en la API · CORREGIDOS

Ninguno lo introdujo el merge de `test` (que sólo cambió
`src/persistence/config/data-sources.env.{ts,spec.ts}`, medido con `git diff --name-only origin/dev HEAD`),
y los tres dejaban `lint` y `typecheck` en rojo, que son dos compuertas de CI:

1. `reproducciones.spec.ts` pasaba `riskScore: 90` numérico y `CreateRiskAssessmentDto` declara
   `riskScore!: string` (TS2345 y TS2322). Se corrige la prueba, no el contrato.
2. `xlsx-parser.spec.ts`: 18 errores de formato, `yarn lint --fix`.
3. **`xlsx-parser.ts` era un defecto real.** `textoDeCelda` terminaba en `String(valor)` y
   `sheet_to_json` devuelve un **objeto** cuando la celda trae error de fórmula, así que lo que
   entraba al catálogo de terminología era «[object Object]» — un concepto con ese display es
   indistinguible de uno bueno para quien mire la tabla, que es exactamente lo que la regla
   anti-invención prohíbe.

Corregidos en `016caaa1`. Verificado: `lint` 0 · `typecheck` 0 ·
`yarn test --testPathPatterns="xlsx-parser|reproducciones"` 18/18.

---

## 3 · El estado del despliegue, medido por la API de Coolify

```bash
curl -sS -H "Authorization: Bearer $TOKEN" http://173.249.39.237:8000/api/v1/applications
```

| App | uuid | Rama | Estado | Compose | Dominio |
|---|---|---|---|---|---|
| `alovida-backend-central` | `33sxkfqwp1axlkrishtgildb` | `test` | `running:healthy` | `/docker-compose.coolify.yml` | ninguno (red interna) |
| `alovida-frontend` | `zslh6pytstjjgf5mexeopvkz` | `test` | **`exited:unhealthy`** | **`/docker-compose.yaml`** ← equivocado | ninguno, y **sin una sola variable** |
| `mockup-frontend` | `miwmlirpzpz9p5hdvbx1urjo` | `mockup` | `running:healthy` | — | `mockup.173.249.39.237.sslip.io`, `demo.alovidasalud.com` |

El front real debería apuntar a **`deploy/docker-compose.coolify.yml`**, y le falta `APP_DOMAIN`
—sin eso el SSR devuelve **400 a todo visitante real**, aunque el healthcheck dé verde porque pide
`localhost`—. El runbook correcto es `mantra-core-health-api/docs/operations/coolify.md` §5.

`mockup-frontend` **no se toca**: es la maqueta que mira el cliente, y la redespliega el vigilante
launchd de la Mac mini (última pasada verificada: `c38a2918`).

**Acceso SSH: no autorizado todavía.**

```
ssh -i ~/.ssh/alovida_contabo -o BatchMode=yes root@173.249.39.237
root@173.249.39.237: Permission denied (publickey,password).
```

---

## 4 · Los datos: qué hay en los doce markdown y qué llega hoy

Fuente: `mantra-core-health-model/markdown_convertidos/` (el repo del modelo, **privado**; los de
front y API son **públicos**).

| Archivo | Filas con dato | Llega hoy a la API |
|---|---|---|
| `USUARIO_MEDICOS_1.md` | **13** personas (de 170 filas; el resto vacías), todas cirujano odontólogo | **no** — sólo el script manual `load_people.py` |
| `USUARIO_PACIENTES_1.md` | **92** personas (de 165) | **no** — idem |
| `Alianza_Medicos_Habilitados.md` | 672 filas → **455 médicos distintos** | **no** — sólo `load_provider_networks.py` |
| `Nacional_Seguros_Red_Medica_Bolivia.md` | 747 filas → **508 distintos** | **no** — idem |
| `LISTADO_DE_ASEGURADORAS_1.md` | 21 compañías | **sí** (`bolivia-insurance-seed`) |
| `Arancel_Honorarios_Medicos_…_2025_…md` | 4 780 | **sí** (`bolivia-fee-schedule-seed`) |
| `LISTA_DE_HOSPITAL_DE_PRIMER_NIVEL_…md` | 470 | **sí, en parte** (`bolivia-facilities-seed`, 642 establecimientos, sólo Santa Cruz) |
| `LISTA_DE_CLINICAS_PRIVADAS_1.md` | 30 | **no** |
| `LISTA_DE_HOSPITAL_DE_TERCER_SEGUNDO_NIVEL_Y_CAJAS_1.md` | 35 | **no** |
| `LISTA_DE_FARMACIAS__LABORATORIOS_Y_ANALISIS_MEDICOS.md` | 34 | **no** |
| `LISTADO_ARANCEL_ODONTOLOGICO_2026_1.md` | 186 (en dólares) | **no** |
| `LISTA_DE_ESPECIALIDADES_ODONTOLOGICAS.md` | 14 | **no** |

Cinco llegan por `tools/bolivia-datasets/extract_datasets.py` → `src/common/seed/data/bolivia/*.json`
→ los seeders de `SeedBootstrapService`. **Las personas y las dos redes de aseguradoras existen
sólo como scripts manuales que ningún despliegue corre**, y eso es el hueco central del pedido 4.

Dos activos que ya resolvieron parte del trabajo y se reusan en vez de rehacerse:

- `mantra-core-health-model/salud-db/gen_seeds.py` tiene `build_real_pharmacies` y
  `build_real_labs_and_clinics`, con las direcciones ya corregidas del UTF-16 roto. **Pero ese
  paquete (`seedsGenerales/`) no lo carga nadie en el despliegue de Coolify**: ni
  `init-postgres.sh` ni el compose lo mencionan.
- `mantra-core-health/data/markdown-institutions/` **ya tiene coordenadas** de Nominatim con su
  `precision` por punto. Es lo que destraba «Cómo llegar» y «los más cercanos», que hoy no tienen
  destino.

**La contraseña `12345678` pasa la validación**: los DTO de alta de paciente, de médico y
`POST /iam/users` declaran `@MinLength(8)` sin regla de complejidad.

---

## 5 · Las brechas front ↔ API ya estaban relevadas

El informe del 2026-09-24 (`mantra-core-health/docs/brechas-front-back-2026-09-24/`) tiene **202
hallazgos, 18 bloqueantes y 30 prompts ejecutables** con Gherkin y archivos a tocar, sobre front
`mockup@9b3e0101` y API `dev@7541797c`. El plan no lo rehace: lo ejecuta. Los tres números que
ordenan el trabajo:

- **21 operaciones** que el front llama y **la API no tiene**.
- **868 de 1 362 rutas** de la API sin pantalla (≈390 del producto de lanzamiento).
- **154 de 220 casos de uso** con actor paciente, médico u organización, sin pantalla.

Y el hecho que define la etapa: **`mockBackend: true` está fijo en `production` y también en
`origin/dev`**; la única configuración sin simulador apaga el SSR. **Hoy no existe ningún
artefacto que hable con la API real.**

---

## 6 · La máquina donde se armó todo esto

- **Disco al 100 %** al empezar: 377 MiB libres de 228 GiB. **78 worktrees, 31 GB de
  `node_modules`.** Fue lo que hizo fallar la primera corrida de pruebas con
  `ENOSPC: no space left on device` — un fallo de entorno que se veía como 17 suites rotas.
- Se liberaron 3,2 GiB de cachés **regenerables** (`~/.yarn/berry/cache` y los `.angular/` de los
  worktrees). **No se borró ningún worktree**: pueden ser de sesiones vivas, y eso lo decide el
  propietario.
- La regla de recursos (`20-resource-control.md`) se leía como global y es **por máquina**. Con
  seis máquinas, seis navegadores y seis builds simultáneos son correctos.

## No cubierto

- **Nada se ejercitó contra la API desplegada.** Todo «→ 400», «→ 403» o «→ 404» de §5 sale de
  leer el DTO, el `@Roles` o el controlador, no de una llamada.
- **La base del VPS no se inspeccionó**: sin SSH no se pudo mirar su esquema, que es del 13/09 y
  está 540 commits atrás de `dev`.
- **El bundle inicial del front es 1,29 MB contra un presupuesto de 620 kB.** Son avisos, no
  errores, así que el build pasa. No se asignó a ningún carril todavía.
- No se midió el lint ni la suite sobre `origin/dev` completos: la línea base se tomó contra
  `origin/mockup`, que es la rama con más trabajo.
