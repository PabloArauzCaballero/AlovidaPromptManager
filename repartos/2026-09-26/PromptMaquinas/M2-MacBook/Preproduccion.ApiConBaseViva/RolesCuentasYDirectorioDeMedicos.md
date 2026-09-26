# M2 · MacBook — encargo de preproducción (2026-09-26)

> **Estado:** `TODO` · **Eje:** API con base de datos viva · **Carriles:** 4
> **Peldaño al repartir:** `DISCOVERED`. Nada de este encargo se ejecutó todavía.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M2**. Trabajás en `mantra-core-health-api` con **base de datos viva**:
sos la única, además de M1, que puede levantar Postgres, así que te tocan los carriles
que sólo se pueden verificar contra la base.

No necesitás los 46 workers:

```bash
cd mantra-core-health-api && docker compose up -d postgres redis
```

Rama base: **`test`** (`016caaa1`, con `typecheck` y `lint` en 0). Un worktree por carril
desde `origin/test`, un PR por carril contra `test`. M1 mergea; vos no esperás el merge:
abrís el PR y arrancás el siguiente.

**No corras `yarn db:vendor`** hasta que M1 cierre el carril D4: hoy borra 4 patches que
sólo existen en la copia vendorizada.

## Tu cola, en orden

### 1 · B3 — roles sembrados y `@Roles` alineados al actor real
Es el carril que **destraba media docena de pantallas de otras máquinas**, así que va primero.

`role-mapping.ts` declara un `RoleCode` cerrado de seis y descarta en silencio lo
desconocido: no existen `BILLING`, `FINANCE` ni `ACCOUNTING_APPROVER`. Consecuencia medida:
los 6 endpoints de solicitudes de seguro y el `approve` de asientos hoy **sólo son
alcanzables por `SUPERADMIN`**. Además hay ~25 roles que el menú y los `@Roles` usan y que
nadie siembra, y el médico autorregistrado sólo recibe `PRACTITIONER`, así que le dan 403
el check-in, la reserva de mostrador, la ficha del paciente y la administración de su
propio laboratorio. `MEDICAL_VISITOR` y `PHARMA_LAB_ADMIN` **sí** se siembran: lo que falta
es que alguien los asigne.

Especificación completa: `mantra-core-health/docs/brechas-front-back-2026-09-24/prompts/BR-06-roles-sembrados-y-autorizacion.md`
y el anexo A para ID-18 e ID-15.

**Sos el único carril de las 6 máquinas que edita `@Roles(...)` de endpoints que ya
existen.** Los demás anotan el rol que necesitan en su REPORT y vos lo aplicás. Si te
llega un pedido así, atendelo en una rama propia y seguí.

**Terminado cuando** cada rol que un `@Roles` menciona existe en `authz.roles`, se asigna
por algún flujo, y hay una prueba de integración que ejercita el 200 del actor correcto y
el 403 del incorrecto.

### 2 · C1 — cuentas logueables de las personas del padrón
Fuente: `mantra-core-health-model/markdown_convertidos/USUARIO_MEDICOS_1.md` (13 filas con
persona, todas de cirujano odontólogo) y `USUARIO_PACIENTES_1.md` (92 filas con persona).
El resto de las 170/165 filas están vacías.

Creá `PeopleAccountsSeedService` en la cadena de `SeedBootstrapService`, con compuerta
`SEED_PEOPLE_ENABLED` + `SEED_PEOPLE_PASSWORD` + `SEED_ALLOW_PRODUCTION`, siguiendo el
patrón exacto de `provider-accounts-seed.service.ts` y `bootstrap-admin-seed.service.ts`:
reusá `IamUsersService.createUser` y el alta real, no INSERT — el hash argon2id vive en un
solo sitio y el registro CTI es atómico (regla 11).

**Decisión del propietario, ya tomada:** los datos personales **se inventan todos**
(cédula, nacimiento, celular, correo, domicilio) de forma **determinista** (uuid5 por fila,
mismo namespace que `deterministicId`) y se marcan `synthetic: true`. Del markdown tomás
sólo nombre, matrícula del Ministerio, registro del SEDES, especialidad y ocupación.
Correo con el patrón `<nombre>.<apellido>@alovida.test`. Contraseña `12345678`, **sólo por
variable de entorno, nunca literal en el código**.

Ya existe `tools/bolivia-datasets/load_people.py`, que hace esto como script manual: leelo,
es la referencia de cómo mapear cada columna. Lo que construís es el seed que corre solo.

**Terminado cuando** cada una de las 105 cuentas hace `POST /iam/auth/login` → 200 con el
rol correcto, y re-correr el seed deja 0 filas nuevas.

### 3 · C2 — el directorio de médicos de las aseguradoras
Fuente: `Alianza_Medicos_Habilitados.md` (672 filas → **455 médicos distintos**) y
`Nacional_Seguros_Red_Medica_Bolivia.md` (747 filas → **508 distintos**). Un médico
repetido **no es un duplicado: son varias sedes**, y así tiene que quedar — una persona con
N filas en sus sedes, con la dirección y los teléfonos de cada una.

- Deduplicá por nombre normalizado con `mantra-core-health-model/salud-db/normalize_padron.py`
  (el padrón llega TODO EN MAYÚSCULAS y no se le agregan acentos que no trae).
- La especialidad se mapea contra `VS_MEDICAL_SPECIALTY` usando
  `src/common/seed/data/bolivia/observed-specialties.dataset.json`. Lo que no mapea queda
  como designación: **no inventes un código**.
- Membresía en la red de cada aseguradora: el endpoint ya existe
  (`POST /insurance-backbone/provider-networks/:id/memberships`).
- El propietario pidió que **cada uno tenga cuenta logueable** (correo inventado con el
  patrón de arriba, `12345678`), y que lo obligatorio que falte se invente salvo el nombre.
- `tools/bolivia-datasets/load_provider_networks.py` es la referencia. Cuidado con lo que
  dice: los crea con verificación PENDIENTE, y así **no aparecen en la guía pública**. Para
  este entorno van **verificados con procedencia «red de aseguradora»**, no con
  `DEV_VERIFICATION_BYPASS`, que aborta el arranque en producción.

**Terminado cuando** `GET /public/.../practitioners?specialty=cardiología` devuelve decenas
con dirección real, un médico con 2 sedes aparece una vez con 2 direcciones, y el conteo
coincide con los distintos del `.md`.

### 4 · B4 — archivos: descarga autenticada e IDOR
`mantra-core-health/docs/brechas-front-back-2026-09-24/prompts/BR-05-archivos-descarga-y-acceso.md`.
Cierra CL-40 (el paciente no puede bajar el PDF de su propio resultado: 403 por
`canActorReadOwnFile` y 401 porque `window.open` sale sin token), TX-09, y el hallazgo
**N-01**, que es un IDOR de verdad: `GET /common/files/links` no recibe al actor y no tiene
`@Roles` ni guard, así que cualquier sesión lista los adjuntos de cualquier condición o
procedimiento.

## Reglas que no se negocian
- `corepack yarn`, nunca `npm`. Compuertas: `yarn typecheck && yarn lint && yarn test`, y
  `yarn test:integration` para lo tuyo, que sí exige la base.
- **No escribas DDL en este repo.** Si te falta una tabla o una columna, el trabajo empieza
  en `mantra-core-health-model` (`.puml` → `gen_ddl.py` → `SQL/`) y lo coordinás con M1.
  Nada de `CREATE TABLE`, nada de archivos de migración.
- Sin números ni strings mágicos: los conceptos van por `*_concept_id`.
- Nada se declara hecho por debajo de `REGRESSION_VERIFIED`, con evidencia en
  `docs/progress/evidence/lane-<id>/REPORT.md`.
- Identificadores nuevos en inglés; prosa de pantalla en castellano.
