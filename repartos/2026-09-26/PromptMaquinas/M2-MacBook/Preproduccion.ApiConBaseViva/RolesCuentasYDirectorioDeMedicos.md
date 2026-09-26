# M2 · MacBook — encargo de preproducción (2026-09-26)

> **Estado del encargo:** `TODO` · **Eje:** API con base de datos viva · **Hitos:** 4
> **Peldaño al repartir:** `DISCOVERED`. Nada de este encargo se ejecutó todavía.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Tu daily: [`M2-MacBook-Daily-Maquinas-2026-09-26.md`](../M2-MacBook-Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M2**. Sos la otra que puede levantar Postgres, así que te tocan los carriles
que **sólo se pueden verificar contra la base**. No necesitás los 46 workers:
`docker compose up -d postgres redis` alcanza.

**H1 va primero porque destraba media docena de pantallas de las otras máquinas.**

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

**Las skills de este encargo:** `nestjs-development`, `mikroorm-patterns`, `postgresql-advanced`, `authz-access-control`, `authn-identity`, `multi-tenancy`, `seed-data-catalogs`, `synthetic-test-data-generation`, `data-privacy-phi`, `terminology-value-sets`, `integrity-testing`, `evidence-and-verification`.

Los **hechos de cada proyecto** (comandos reales, invariantes del modelo, prohibiciones, rutas)
no viven en las skills: viven en el `CLAUDE.md` de ese repositorio, y **mandan sobre cualquier
skill**.

## 2. Resultado observable

Cada rol que un `@Roles` menciona existe y se asigna; las 105 personas del padrón y los ~960
médicos de Alianza y Nacional entran con `12345678`; el directorio muestra médicos reales, y uno
que trabaja en varios lugares aparece **una vez con varias sedes**; y el paciente puede bajar el
PDF de su propio resultado.

**Kill-test:** entrar con una cuenta del padrón y con una de un médico de Alianza. Si el login
devuelve 401, o el directorio devuelve el mismo médico dos veces, no está hecho.

## 3. Alcance

**IN:** `src/modules/authz/**`, `role-mapping.ts`, **todos** los `@Roles(...)` del repo, los
seeds nuevos de personas y de redes de aseguradoras, y `src/modules/common/files/**`.

**OUT:** **no** tocás `clinical`, `scheduling`, `pharmacy`, `billing` ni `accounting` —son de
M3 y M4—, **no** escribís DDL, y **no** corrés `db:vendor` hasta que M1 cierre su H3.

## 4. Contexto que no se deduce leyendo el repo

**Decisión del propietario, ya tomada y no se vuelve a preguntar:** los datos personales **se
inventan todos** —cédula, nacimiento, celular, correo, domicilio—, deterministas (uuid5 por fila,
mismo namespace que `deterministicId`) y marcados `synthetic: true`. Del markdown tomás **sólo**
nombre, matrícula del Ministerio, registro del SEDES, especialidad y ocupación. Dijo: «no tenemos
el dato real», y los repos de front y API son **públicos**.

Correo con el patrón `<nombre>.<apellido>@alovida.test`. Contraseña `12345678`, **sólo por
variable de entorno, nunca literal en el código**.

**La contraseña pasa la validación**: los DTO declaran `@MinLength(8)` sin regla de complejidad.

## 5. Plan

### H1 — Cada rol que un `@Roles` menciona existe y se asigna

**CA:** Dado un endpoint con `@Roles(X)`, cuando lo llama un actor con X, entonces responde 200; y cuando lo llama uno sin X, responde 403.
**DoD:** Las microtareas de H1 en `HECHO`, con una prueba de integración por par 200/403 y su salida pegada.
**Estado:** TODO

#### H1.S1 — Cerrar el `RoleCode` que descarta en silencio

**CA:** Dado `role-mapping.ts`, cuando llega un rol que el enum no declara, entonces **no se descarta callado**.
**DoD:** Las tres microtareas en `HECHO` con la prueba pegada.
**Estado:** TODO

`role-mapping.ts` declara un `RoleCode` **cerrado de seis** y descarta en silencio lo
desconocido: no existen `BILLING`, `FINANCE` ni `ACCOUNTING_APPROVER`. Consecuencia **medida**:
los 6 endpoints de solicitudes de seguro y el `approve` de asientos hoy **sólo son alcanzables
por `SUPERADMIN`**.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Inventariar los roles que los `@Roles` usan y nadie siembra | la lista sale del código, no de memoria | `grep` y su salida pegados | TODO |
| H1.S1.M2 | Sembrar los que falten en `authz.roles` | cada uno existe tras el seed | consulta a la base pegada | TODO |
| H1.S1.M3 | Hacer que un rol desconocido falle fuerte en vez de descartarse | hay prueba que lo fija | salida del test pegada | TODO |

#### H1.S2 — Que el médico autorregistrado deje de comerse 403

**CA:** Dado un médico recién registrado, cuando hace check-in, reserva de mostrador, abre la ficha del paciente o administra su laboratorio, entonces no recibe 403 por falta de rol.
**DoD:** Las dos microtareas en `HECHO` con los cuatro caminos ejercitados.
**Estado:** TODO

Hoy sólo recibe `PRACTITIONER`. `MEDICAL_VISITOR` y `PHARMA_LAB_ADMIN` **sí se siembran**: lo
que falta es que **alguien los asigne**. Sos el único carril de las seis máquinas que edita
`@Roles(...)` de endpoints existentes; si otra máquina te pide un rol, atendelo en rama propia.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Asignar los roles que el alta de médico debe dar | los cuatro caminos dan 200 | salida de integración pegada | TODO |
| H1.S2.M2 | Dejar el 403 donde corresponde | un actor sin el rol sigue recibiendo 403 | salida pegada | TODO |

### H2 — Las 105 personas del padrón entran con su cuenta

**CA:** Dada cada persona sembrada, cuando hace `POST /iam/auth/login` con `12345678`, entonces recibe 200 y un token con el rol correcto.
**DoD:** Las microtareas de H2 en `HECHO`, con el login de una muestra por rol y el conteo en `iam.users` pegados.
**Estado:** TODO

#### H2.S1 — Un seed que corre solo, no un script a mano

**CA:** Dado el arranque de la API con la compuerta encendida, cuando termina, entonces las cuentas existen; y al re-correrlo, inserta **0 filas nuevas**.
**DoD:** Las cuatro microtareas en `HECHO` con la salida de las dos pasadas pegada.
**Estado:** TODO

13 médicos (todos cirujano odontólogo) y 92 pacientes tienen fila con persona; el resto de las
170/165 están vacías. Seguí el patrón de `provider-accounts-seed.service.ts` y
`bootstrap-admin-seed.service.ts`: **reusá `IamUsersService.createUser`**, no INSERT — el hash
argon2id vive en un solo sitio y el registro CTI es atómico (regla 11).
`tools/bolivia-datasets/load_people.py` ya hace esto como script manual: es la referencia del
mapeo columna por columna.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Crear el seed con su compuerta de entorno | sin `SEED_PEOPLE_ENABLED` no hace nada | salida de las dos pasadas pegada | TODO |
| H2.S1.M2 | Inventar los datos personales de forma determinista | dos corridas dan los mismos valores | diff de dos corridas pegado | TODO |
| H2.S1.M3 | Marcar cada fila como sintética y con su procedencia | toda fila lleva `source_file` y `source_row` | consulta pegada | TODO |
| H2.S1.M4 | Comprobar el login de una muestra por rol | 200 con el rol correcto | respuesta pegada | TODO |

### H3 — El directorio muestra médicos reales, con sus varias sedes

**CA:** Dado un médico que trabaja en dos lugares, cuando se lo busca en el directorio público, entonces aparece **una vez, con sus dos direcciones**.
**DoD:** Las microtareas de H3 en `HECHO`, con la respuesta del directorio y el conteo de distintos pegados.
**Estado:** TODO

#### H3.S1 — Deduplicar sin perder sedes

**CA:** Dadas las 672 y 747 filas, cuando se siembran, entonces quedan 455 y 508 personas distintas, cada una con N sedes.
**DoD:** Las tres microtareas en `HECHO` con los conteos pegados.
**Estado:** TODO

**Un médico repetido no es un duplicado: son varias sedes**, y así tiene que quedar. Deduplicá
con `normalize_padron.py` del repo del modelo — el padrón llega TODO EN MAYÚSCULAS y **no se le
agregan acentos que no trae**, porque elegir cuál quiso decir es inventar el dato de una persona
real.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Normalizar nombres y deduplicar | 455 + 508 distintos | conteos pegados | TODO |
| H3.S1.M2 | Sembrar una sede por fila, con su dirección y teléfonos | un médico con 2 filas tiene 2 sedes | respuesta de la API pegada | TODO |
| H3.S1.M3 | Dar de alta la membresía en la red de cada aseguradora | usa el endpoint que ya existe | respuesta pegada | TODO |

#### H3.S2 — Que se vean en la guía pública sin trampas

**CA:** Dado `GET /public/.../practitioners?specialty=…`, cuando se consulta sin `DEV_VERIFICATION_BYPASS`, entonces devuelve decenas con dirección real.
**DoD:** Las dos microtareas en `HECHO` con la respuesta pegada.
**Estado:** TODO

`load_provider_networks.py` los crea **PENDIENTE**, y así **no aparecen** en la guía, que filtra
por verificado. Para este entorno van **verificados con procedencia «red de aseguradora»**, no
con `DEV_VERIFICATION_BYPASS` — esa variable **aborta el arranque** en producción, y apoyarse en
ella sería esconder el problema.

La especialidad se mapea contra `VS_MEDICAL_SPECIALTY` con
`observed-specialties.dataset.json`. **Lo que no mapea queda como designación: no se inventa un
código.**

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Verificar con procedencia en vez del bypass | la guía los muestra sin la variable | respuesta pegada | TODO |
| H3.S2.M2 | Mapear especialidades y dejar sin código lo que no mapea | ningún código inventado | lista de no mapeadas pegada | TODO |

### H4 — El paciente puede bajar el PDF de su propio resultado

**CA:** Dado un paciente con un resultado liberado, cuando pide su PDF, entonces lo recibe; y cuando otro actor pide el mismo archivo, recibe 403.
**DoD:** Las microtareas de H4 en `HECHO`, con los dos caminos ejercitados y su salida pegada.
**Estado:** TODO

#### H4.S1 — Descarga autenticada y cierre del IDOR

**CA:** Dado `GET /common/files/links`, cuando lo llama una sesión cualquiera, entonces **no** lista adjuntos ajenos.
**DoD:** Las tres microtareas en `HECHO` con la respuesta 403 pegada.
**Estado:** TODO

Dos defectos distintos. **CL-40:** el paciente recibe 403 por `canActorReadOwnFile` y 401
porque `window.open` sale sin token. **N-01, que es un IDOR de verdad:**
`GET /common/files/links` **no recibe al actor y no tiene `@Roles` ni guard**, así que cualquier
sesión lista los adjuntos de cualquier condición o procedimiento.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Cerrar el IDOR de `files/links` | una sesión ajena recibe 403 | respuesta pegada | TODO |
| H4.S1.M2 | Permitir al paciente leer lo suyo | recibe su propio PDF | respuesta pegada | TODO |
| H4.S1.M3 | Resolver la descarga sin token en la URL | el token no viaja en la query | petición pegada | TODO |


## 6. Ambigüedades registradas

Se **registran**, no se resuelven por conveniencia. Si una bloquea, se declara `BLOQUEADO` con
la evidencia y se sigue con lo que no dependa de ella.

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | Qué rol exacto necesita el mostrador del médico (decisión D-G del informe de brechas) | el propietario / M4 | H1.S2, y la reserva de mostrador de M4 |
| Q-02 | Si los ~960 médicos de las redes deben poder **publicar agenda** o sólo figurar | el propietario | nada hoy: se siembran con cuenta y sin agenda |
| Q-03 | Qué hacer con las especialidades del padrón que no mapean a `VS_MEDICAL_SPECIALTY` | el propietario | nada: quedan como designación, sin código inventado |

## 7. Definition of Done del encargo

Los cuatro hitos en `HECHO`. Login verificado contra la API viva para una muestra por rol; el
directorio devolviendo médicos reales con sedes múltiples; los dos seeds idempotentes (segunda
pasada = 0 filas nuevas); el IDOR de `files/links` cerrado con su 403 pegado. Todo en
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
- **No escribís DDL en el repo de la API.** Si falta una tabla o una columna, el trabajo empieza
  en `mantra-core-health-model` (`.puml` → `gen_ddl.py` → `SQL/`) y lo coordinás con M1. Nada de
  `CREATE TABLE`, nada de archivos de migración.
- **No corras `yarn db:vendor`** hasta que M1 cierre H3: hoy borra cuatro patches.
- Antes de crear un endpoint, **buscá el equivalente**. La validación global es
  `whitelist + forbidNonWhitelisted + transform`: todo campo que el front mande y el DTO no
  declare da **400**, y ésa es la causa más común de las brechas que vas a cerrar.
- Los conceptos van por `*_concept_id`. Sin enums de TS inventados, sin labels hardcodeados.
