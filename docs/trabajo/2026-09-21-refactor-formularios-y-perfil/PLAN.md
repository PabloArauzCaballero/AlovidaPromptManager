# PLAN — Separar quién decide de quién pinta en los registros y en el perfil

> **AVANCE: 62 / 68 — 91,2 %.** El denominador subió de 64 a 68: el baseline destapó un rojo previo
> propio (H1.S1.M5), la extracción destapó código muerto y tres consumidores más de la misma regla
> (H3.S1.M6 y M7), y separar la vista del perfil destapó una auto-referencia que el propio contrato
> daba por viva y ya no existe (H4.S1.M6). Cifra calculada, no estimada:
> `py -3 .claude/hooks/plan_status.py --path <este archivo>`.

- **Persona:** Itzan · **Turno:** noche · **Fecha del reparto:** 2026-09-21 · **Línea:** C
- **Encargo:** [`SeparacionSmartDumbDeLosSeisRegistrosYDelPerfil.md`](../../../repartos/2026-09-21/PromptNoche/Itzan/Refactor-FormulariosYPerfil.RegistroYMiPerfil/SeparacionSmartDumbDeLosSeisRegistrosYDelPerfil.md)
- **Fuente del pedido:** [`REFACTOR-FRONTEND-2026-09-21.md`](../../requisitos/REFACTOR-FRONTEND-2026-09-21.md) §3.1, 4, 5, 7, 10.1 y 14 ·
  **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-21.md`](../../verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md) §3, 10 y 11
- **Repos afectados:** `alovida/mantra-core-health` (frontend) · este repo (plan, reporte, daily)
- **Predecesor:** [`2026-09-20-correcciones-doctor-perfil-y-disenio`](../2026-09-20-correcciones-doctor-perfil-y-disenio/PLAN.md) (62/62)

Este plan **no repite** el encargo: el CA y el DoD completos de cada microtarea viven ahí y son la
fuente. Acá van el corte, el resultado, el alcance, el orden de ejecución, el estado vivo de las 64 y
las decisiones que se vayan tomando.

## 0. Resultado observable

```text
RESULTADO
Actor:          persona que se registra (profesional, paciente) en la maqueta
Dónde:          los formularios de alta de auth/register-* (rutas sacadas del router en H1.S2.M1)
Estado inicial: sin sesión, maqueta con backend simulado (mockBackend: true)
Acción:         completa el formulario, se equivoca en un campo, fuerza un error de guardado, hace doble clic en enviar
Observable:     los mismos errores por campo que hoy, el doble envío bloqueado, lo escrito preservado tras el fallo
Persistencia:   ninguna nueva: la maqueta no persiste; lo que se compara es el comportamiento del formulario
Borde / error:  error de guardado simulado con medio formulario lleno → no se pierde lo escrito
Fuera:          cambiar una validación o un requisito de datos; tipar FormGroup; consumidores ajenos de paginated-form
Peldaño:        UNKNOWN
```

**Kill-test (definido al arrancar, del encargo §2):** abrir el registro de profesional y el de
paciente y buscar en el código la validación que se dice centralizada. Si sigue escrita en los dos
archivos, H3 no está hecho. Después llenar medio formulario, forzar un error de guardado y mirar si se
perdió lo escrito: si se perdió, es regresión.

## 1. El corte

```text
$ git fetch origin && git log -1 --format='%H %ad %s' origin/mockup
d76e3054487eed8ed106fb834842d607f57b8351 Tue Sep 22 11:45:09 2026 -0400 fix(scripts): usar ng directamente en lugar de npx para compatibilidad nativa con Yarn Berry
```

> **El corte se movió a mitad del trabajo, y se declara.** Al reverificarlo antes de abrir H4,
> `origin/mockup` había avanzado **un** commit: `d40b5631` — *«fix(mi-perfil): el rechazo del
> servidor, junto a su campo (#571)»*—, que toca `practitioner-profile-edit`, es decir **dentro de
> la reserva de este carril y en la carpeta donde entra H4**. Se rebasó sobre él antes de empezar.
>
> - Fusión de prueba (`git merge-tree`) **limpia**, sin conflictos; la diferencia real son 2
>   archivos (`practitioner-profile-edit.ts` +8 líneas, su spec +40) más capturas.
> - Rebase ejecutado: el commit del front pasa de `6b598346` a **`caaf77dd`**, sobre `d40b5631`.
> - **Consecuencia sobre el baseline (regla 30 §4):** el baseline de H1 se midió en `d76e3054`. El
>   commit nuevo agrega **2 pruebas**, así que el total esperado sube de 7 087 a 7 089. Se vuelve a
>   medir en H6, que ya exige la corrida completa; hasta entonces las cifras de H1 se leen con esta
>   nota al lado. Lint y typecheck se reverificaron tras el rebase.
> - *Por qué se rebasó en vez de congelar el corte:* el resto del trabajo ocurre en
>   `my-profile/practitioner-profile/`, y el commit nuevo cae en la carpeta hermana. Separarle la
>   vista a una versión ya superada es rehacer trabajo.

| Campo | Valor |
|---|---|
| **SHA fijado** | `d40b56312…` (rebasado el 2026-09-22; el corte original fue `d76e3054487eed8ed106fb834842d607f57b8351`) |
| **Rama de trabajo (front)** | `itzan/separacion-smart-dumb-registros` |
| **Base del PR (front)** | `mockup` |
| **Rama de este repo** | `itzan/refactor-formularios-y-perfil` → PR a `main` |
| **Corte de referencia del reparto** | `5a0776c66b005ad4d2d6722321e933cd7adea621` |

El corte del reparto quedó **16 commits atrás** del que fijo, y **ninguno toca un archivo reservado**:
`git diff --stat 5a0776c6 origin/mockup -- <los seis reservados>` devuelve vacío. Manda el mío, como
indica el encargo.

## 2. Alcance — la frontera

**IN (reservados para mí):** `src/app/shared/components/organisms/{paginated-form,form-section,form-actions}/**` ·
`src/app/shared/components/molecules/form-field/**` · `src/app/features/auth/register-*/**` ·
`src/app/features/account/my-profile/**`.

**OUT (se documentan con `ruta:línea`, no se tocan):**
- De Pablo: `organisms/{data-table,view-state-host,filter-bar}/**`, `features/alovida/{accesos,personas}/**`.
- De Justin: `organisms/{directory-page,page-header}/**`, `molecules/{search-field,pagination}/**`,
  `features/alovida/{terminologia,datos-compartidos,buscar,directorio,inicio}/**`.
- De Ender: `scripts/**`, `features/component-stock/**`, `core/mock/**` (incluido `core/mock/faker/**`) y los
  tres barrels `shared/components/*/index.ts`.
- De Marcelo: `organisms/{content-dialog,attachment-dialog,attachment-uploader,fact-section}/**`, `features/clinical-record/**`.
- Consumidores ajenos de `paginated-form` (`form-builder`, `admin`, `delegated-access`, `health-context`,
  `identity-assurance`, `geo`, `auth-providers`): oleada 2 si hiciera falta tocarlos.
- `features/auth/login*` y todo `auth` que no sea `register-*`.
- Tipar `FormGroup` sin plan de compatibilidad · borrar una bandera sin medir quién la usa · cambiar una
  validación o un requisito de datos · cazar `any` (hay 0) · imponer `ControlValueAccessor` a lo que no es control ·
  perder el borrador ante fallo · debilitar un spec.

## 3. Orden de ejecución

| Orden | Qué | Por qué acá |
|---|---|---|
| 1 | H1 completo | Es `BLOQUEANTE`: sin baseline ni recorrido previo no se puede demostrar que no cambió el comportamiento |
| 2 | H2 | Encontrar la regla repetida **con dos citas** antes de extraer nada |
| 3 | H3 | La regla vive una vez y la consumen dos registros; el test se escribe en rojo primero |
| 4 | H5 | Decisiones escritas; es documento, no depende de H4 |
| 5 | H4 | Se planificó para después de H5 porque `my-profile` tenía un PR en vuelo (#571). **Ya no es así:** ese PR está fusionado y es el commit `d40b5631` sobre el que se rebasó, así que la carpeta quedó libre y H4 arrancó con el contenedor elegido de `my-profile`, no con uno de `register-*` |
| 6 | H6 | Regresión, gates y cierre |

## 4. Ambigüedades registradas

Las Q-I1…Q-I5 de **este encargo (2026-09-21, §5)**; no son las del 2026-09-20 aunque compartan ID.

| ID | Supuesto con el que trabajo | Quién resuelve |
|---|---|---|
| Q-I1 (21/09) | `FormGroup` tipado se **decide** esta noche y se **implementa** en la oleada 2, salvo que el plan de compatibilidad salga trivial | Pablo |
| Q-I2 (21/09) | Ninguna bandera se retira sin consumidores en cero medidos | Pablo |
| Q-I3 (21/09) | Si los registros comparten política de borrador se **demuestra** en H2.S2, no se asume | Producto |
| Q-I4 (21/09) | Si la entidad cambia mientras se edita el perfil, se mantiene lo que hace hoy y se registra | Producto |
| Q-I5 (21/09) | Los consumidores ajenos de `paginated-form` no se tocan en esta oleada | Pablo |
| Q-I6 | H4 sobre `my-profile` depende de la fusión del #571 (que toca `my-profile`). Supuesto: si no se fusiona durante el turno, H4 se hace sobre un contenedor de `register-*` o queda `A MEDIAS` con las cuatro respuestas | Itzan |
| Q-I7 | **`features/auth/registro-compartido/` ya existe** (`ubicacion-picker`, `location-picker`) y es donde las altas comparten piezas, pero **no entra en la reserva** (`register-*/**` no la abarca). Supuesto: la regla que se extraiga en H3 vive dentro de `register-*`, o se propone `registro-compartido/` y se pide confirmación antes de escribir ahí; no se toca sin OK | Pablo |

---

## 5. Estado vivo de las 64 microtareas

### H1 — Corte, baseline y capturas previas

**Prioridad:** `BLOQUEANTE`
**CA:** Dado mi entorno, cuando alguien pregunta contra qué versión trabajé y cómo se veían y comportaban los formularios antes, entonces hay SHA, capturas y descripción, no un recuerdo.
**DoD:** salidas del baseline en `evidencia/antes/`, seis capturas descritas, comportamiento de dos formularios anotado paso por paso.
**Estado:** HECHO — las 13 microtareas cerradas. **Con una nota viva:** el corte se movió después de medir el baseline, así que la cifra de pruebas esperada sube de 7 087 a 7 089 y se vuelve a medir en H6 (ver §1).

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompí yo, entonces la respuesta sale de un archivo.
**DoD:** salidas con su código de salida, pegadas.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git rev-parse origin/mockup && git branch --show-current` → `evidencia/antes/corte.txt` (`d76e3054…`, `itzan/separacion-smart-dumb-registros`, exit 0) | HECHO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `corepack yarn lint` · `corepack yarn typecheck` → `evidencia/antes/lint-typecheck.txt` (los dos exit 0; typecheck local depende del índice generado, ver archivo) | HECHO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `corepack yarn test --watch=false` → `evidencia/antes/test.txt` (exit 1 · 2 fallidos / 7 085 pasados de 7 087 · 571 archivos) | HECHO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase de la regla 80.4 | tabla abajo + `evidencia/antes/clasificacion-rojos.md` (los dos reproducidos aislados) | HECHO |
| H1.S1.M5 | **Nueva (descubierta en H1.S1.M4).** El rojo previo propio de `register-practitioner.spec.ts:2002` pasa a verde sin tocar su aserción | Dado el spec, cuando corre aislado y dentro de la suite, entonces el test con backend simulado pasa y su aserción sigue igual | `corepack yarn test --watch=false --include=…/register-practitioner.spec.ts` → **`95 passed (95)`, exit 0**. Tope propio de 20 s con la causa medida (~10,4 s contra la latencia simulada); ninguna aserción tocada | HECHO |

**Rojos previos del baseline (regla 80.4):**

| Test | Aislado | Clase | Dueño | Qué se hace |
|---|---|---|---|---|
| `features/auth/register-practitioner/register-practitioner.spec.ts:2002` — timeout 5000 ms | Falla igual (5 029 ms); con tope de diagnóstico 60 s **pasa en 10 351 ms** | `TEST_BUG`: presupuesto de tiempo menor que la latencia simulada del mock (`core/mock/mock-backend.interceptor.ts:251-258`) | este carril (archivo reservado) | H1.S1.M5 |
| `core/mock/handlers/insurance-analytics.handlers.spec.ts:86` — `expected 1 to be +0` | **Pasa** 5/5 | `TEST_BUG`: depende del orden o de estado compartido | Ender (`core/mock/**`) | Se documenta; no se toca. Rojo previo ajeno para la comparación de H6 |

#### H1.S2 — El comportamiento de antes, anotado

**CA:** Dado un formulario que voy a separar, cuando alguien pregunte si cambió su comportamiento, entonces hay una descripción previa paso por paso.
**DoD:** dos formularios recorridos y anotados, con captura de cada paso relevante.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Rutas de los seis registros y del perfil, sacadas del router | Hay lista de URLs verificadas | `git grep -n "register-" origin/mockup -- 'src/app/**/*.routes.ts'` + carga de cada URL → `evidencia/antes/rutas.md` (10/10 OK por URL directa) | HECHO |
| H1.S2.M2 | Recorrer el registro de profesional | Hay lista de pasos, validaciones y mensajes | descripción + capturas en `evidencia/antes/` → `recorrido-profesional.md` (13 páginas, 7 con obligatorios, 6 preguntas contestadas) | HECHO |
| H1.S2.M3 | Recorrer el registro de paciente | Hay lista de pasos, validaciones y mensajes | descripción + capturas en `evidencia/antes/` → `recorrido-paciente.md` (10 páginas; **difiere del profesional en cuándo valida al salir del campo**) | HECHO |
| H1.S2.M4 | Error de guardado: ¿se preserva lo escrito? | Hay un sí o un no observado | captura del formulario tras el fallo → **Sí** (profesional): valores idénticos antes/después, `capturas/pro-13-tras-error-de-guardado.png` | HECHO |
| H1.S2.M5 | Doble envío | Hay un sí o un no observado | captura o descripción del intento → **Sí, bloqueado** (profesional): doble clic = 1 envío | HECHO |

#### H1.S3 — Capturas del perfil

**CA:** Dado el perfil de profesional, cuando alguien pregunte cómo se veía, entonces hay captura previa en dos viewports y en los dos temas.
**DoD:** cuatro capturas descritas.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Perfil en modo consulta, escritorio y móvil | Dos capturas, miradas | `evidencia/antes/capturas/` con su línea → 4 (2 anchos × 2 temas), inspeccionadas en `capturas-perfil.md` | HECHO |
| H1.S3.M2 | Perfil en modo edición | Dos capturas, miradas | `evidencia/antes/capturas/` con su línea → 4 (2 anchos × 2 temas), inspeccionadas en `capturas-perfil.md` | HECHO |
| H1.S3.M3 | Consola y red antes de tocar | Hay lista de errores previos | lista en `evidencia/antes/` → `capturas-perfil.md` §H1.S3.M3 (perfil: 0; altas: la CSP de `rutas.md`) | HECHO |

### H2 — Encontrar la regla repetida, no el archivo grande

**Prioridad:** `ALTA`
**CA:** Dado el conjunto de registros, cuando afirmo que hay duplicación, entonces señalo la misma regla escrita dos o más veces, con archivo y línea de cada copia, y declaro un contraejemplo.
**DoD:** ficha de familia del §7.3 con las copias citadas por línea.
**Estado:** HECHO — las tres subtareas cerradas. La regla repetida quedó nombrada con sus copias por línea, y la propiedad del estado, escrita.

#### H2.S1 — Clasificar los contenedores con la terna del §3

**CA:** Dado un contenedor, cuando lo clasifico, entonces tiene responsabilidad, nivel compositivo y ámbito, sacados de sus dependencias reales.
**DoD:** tabla con una fila por contenedor y sus dependencias transitivas relevantes.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Dependencias reales de dos registros | Hay lista, incluidas las transitivas relevantes | `evidencia/h2/terna-y-dependencias.md` §M1 (profesional y paciente, con la transitiva de `credenciales-del-medico`) | HECHO |
| H2.S1.M2 | Terna responsabilidad × composición × ámbito por pieza | Cada fila tiene las tres | `evidencia/h2/terna-y-dependencias.md` §M2 (8 piezas) | HECHO |
| H2.S1.M3 | Lo que en el contenedor NO es responsabilidad de contenedor | Hay lista con líneas | `evidencia/h2/terna-y-dependencias.md` §M3 (5 hallazgos con ruta:línea) | HECHO |
| H2.S1.M4 | Lo que en la plantilla es orquestación de negocio | Hay lista con líneas | `evidencia/h2/terna-y-dependencias.md` §M4 (**no hay**; sí `track $index` ×2 y `$any` ×2) | HECHO |

#### H2.S2 — La regla repetida

**CA:** Dada la afirmación «esto está duplicado», cuando se verifica, entonces hay dos copias de la misma regla citadas por línea y está dicho qué cambio se haría una sola vez.
**DoD:** la ficha del §7.3 completa, con el contraejemplo.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Validaciones o normalizaciones repetidas entre registros | Hay al menos una con dos copias citadas | `evidencia/h2/ficha-familia-respaldo.md` → **3 copias** de la regla del respaldo (profesional, laboratorio, imagenología) + familias B (contraseña, 8 copias) y C (documento, 2) | HECHO |
| H2.S2.M2 | Las cinco dimensiones del §7.1 sobre esa regla | Cinco veredictos | la tabla de cinco filas de la ficha | HECHO |
| H2.S2.M3 | Ficha con los once campos del §7.3 | Tiene los once | `evidencia/h2/ficha-familia-respaldo.md` §M3 | HECHO |
| H2.S2.M4 | Contraejemplo | Hay una regla nombrada que NO se fusiona, con motivo | foto de perfil (JPG/PNG/WebP, sin PDF) y el NIT del paciente vs. el de la empresa | HECHO |
| H2.S2.M5 | El cambio que se hará una sola vez después de extraer | Hay un cambio concreto nombrado | cambiar formato o tope de peso: hoy 3 funciones + 3 pares de constantes; después, 1 y 1 | HECHO |

#### H2.S3 — La propiedad del estado, escrita

**CA:** Dado cada estado mutable del contenedor elegido, cuando alguien pregunta de quién es, entonces está escrito quién lo crea, lo cambia, lo lee, qué lo invalida y cuándo se destruye.
**DoD:** la tabla del §4 completa para el contenedor elegido.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Estados mutables del contenedor elegido | Hay lista | tabla en `PLAN.md` (abajo) + inventario por familia en `evidencia/h2/propiedad-del-estado.md` §1 — **27** en profesional, **34** en paciente, +1 fuera del grafo de signals | HECHO |
| H2.S3.M2 | Las cinco preguntas por estado | Ninguna fila incompleta | las 8 familias de `propiedad-del-estado.md` §1, cada una con las cinco respondidas | HECHO |
| H2.S3.M3 | Estados derivados que hoy son copias mutables | Hay lista con líneas | `propiedad-del-estado.md` §2 — 7 pares de catálogo + **4 campos de referencia con 4 dueños distintos** | HECHO |
| H2.S3.M4 | `effect` que copian estado en vez de derivarlo | Hay lista, o se declara que no hay | `git grep -n 'effect(' d40b5631 -- <alcance IN>` → **6 en total, 0 en las altas**; los 6 clasificados en `propiedad-del-estado.md` §3 → **ninguno copia estado derivable** | HECHO |

> **Desvío de orden, declarado (regla 20 §6.7).** Esta subtarea es de H2 pero se ejecutó después de
> abrir H4.S1.M1 y M2. El plan la ponía antes de tocar código y se respetó en lo que importa:
> H4 todavía no escribió una línea de código, así que el diagnóstico sigue siendo previo a la
> extracción. Lo que sí cambió es el motivo por el que se retomó — buscar trabajo que no chocara
> con H4 — y no el contenido.

**La tabla del §4, para los dos contenedores que H2.S1 clasificó.** El detalle con las cinco
preguntas por familia está en [`evidencia/h2/propiedad-del-estado.md`](./evidencia/h2/propiedad-del-estado.md).

| Categoría del §4 | Dueño hoy | Miembros | Veredicto |
|---|---|---|---|
| Entidad remota / estado de petición | Contenedor | 7 catálogos + sus 7 banderas `*Caido` | **A medias.** Una fuente por catálogo y sin carrera posible, pero 14 signals donde alcanzarían 7 `ViewState` — ver §2.1 |
| Parámetros navegables | — | Ninguno: el alta no lee nada de la URL | No aplica, declarado |
| Datos derivados | Contenedor, **por copia** | `tituloProfesionalElegido`, `ocupacionSeleccionada` | **NO cumple.** Son espejos mutables de un `FormControl` — ver §2.2 |
| Foco, expansión, resaltado | El organismo `paginated-form` | `indice`, `visitedIndex`, el foco del título | Cumple: es estado local del organismo y no sale de ahí |
| Selección | **Mixto — y ése es el hallazgo** | Título, ocupación, empresa, fecha de nacimiento | **NO cumple.** Cuatro campos hermanos, cuatro dueños distintos del mismo tipo de dato |
| Borrador | Contenedor (el `FormGroup`) | `formProfesional` / `formPaciente` + los arreglos que crecen | Cumple. Política ante cierre: no hay recuperación, y está declarado desde H1 |
| Guardado y error remoto | Contenedor | `state`, `registered`, `verificationSent` | Cumple. `isSubmitting` y `errorMessage` son derivaciones puras de `state`: **es el ejemplo bien hecho del archivo** |

**Lo que sale de acá y no estaba previsto:** los cuatro campos de referencia resuelven la misma
pregunta —cómo llega el valor de un `FormControl` a un `computed`— de cuatro maneras distintas, y
sólo una de ellas (`toSignal`, `register-patient.ts:1652`) no puede desincronizarse. Esto **refuerza
D-5**: tipar el `FormGroup` no vería el caso de la empresa, cuyo id nunca entra al formulario. Un
contrato tipado escrito sin resolver antes la propiedad de cada campo queda tipado y equivocado.
Nada de esto se corrige en este carril: es diagnóstico, con su medida y su consecuencia.

### H3 — La regla vive una sola vez, y dos consumidores la usan

**Prioridad:** `ALTA`
**CA:** Dada la regla extraída, cuando se la busca en el repo, entonces está escrita una sola vez; y los dos registros que la consumen se comportan igual que en las notas de H1.S2.
**DoD:** la regla en un archivo, dos consumidores migrados, los dos recorridos comparados contra H1.S2.
**Estado:** A MEDIAS — la regla vive una sola vez y los cinco consumidores se comportan igual (H3.S1 completo, H3.S3 acreditado). Lo que no se cumple son las dos microtareas de anclaje del error por campo y foco al primer error, **anteriores a este trabajo** y detalladas en `evidencia/h3/deuda-anclaje-y-foco.md`.

#### H3.S1 — Extraer sin cambiar comportamiento

**CA:** Dada la extracción, cuando se compara antes y después, entonces no hay diferencia de comportamiento sin justificar por escrito.
**DoD:** el test que protege la regla en verde, y el recorrido comparado.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Test que protege la regla, escrito primero | Falla antes de extraer, pasa después | `evidencia/h3/test-de-la-regla.txt` (respaldo: rojo `TS2307` → `6 passed`) y la política de contraseña (rojo `TS2307` → `5 passed`) | HECHO |
| H3.S1.M2 | La regla como función pura tipada | No consulta DOM, no inyecta sesión, no hace HTTP | `registro-compartido/politica-de-contrasena.ts` (constantes + validadores; sin DOM, sin sesión, sin HTTP) | HECHO |
| H3.S1.M3 | Migrar el primer consumidor | El registro se comporta igual | profesional: `evidencia/h3/despues-profesional.txt` comparado con `antes/recorrido-profesional.md` — mismo mensaje, 1 envío, valores idénticos | HECHO |
| H3.S1.M4 | Migrar el segundo consumidor | El registro se comporta igual | paciente: `evidencia/h3/despues-paciente.txt` comparado con `antes/recorrido-paciente.md` | HECHO |
| H3.S1.M5 | La copia vieja ya no existe | `git grep` de la regla da una sola definición | `MIN_PASSWORD` ya no existe en **ninguna** de las 5 altas; la única definición es `politica-de-contrasena.ts`. Quedan fuera de la reserva `reset-password`, `activate-account` y `admin/user-registration` (oleada 2, declarados) | HECHO |
| H3.S1.M6 | **Nueva.** Migrar también las otras tres altas (organización, laboratorio, imagenología) | Ninguna declara ya su mínimo ni su mensaje | `corepack yarn typecheck` y `corepack yarn lint` exit 0 · suite completa **7 082 pruebas, 0 fallos** | HECHO |
| H3.S1.M7 | **Nueva.** Retirar el código muerto de adjuntos que la extracción destapó | Ningún método de adjuntos sin plantilla que lo llame sigue en pie, y las pruebas que lo ejercían se reapuntaron al camino vivo o se retiraron con su motivo | `evidencia/h3/codigo-muerto-retirado.md`; suite completa en verde | HECHO |

#### H3.S2 — Que no se pierda lo que la persona escribió

**CA:** Dado un fallo de guardado, cuando la persona vuelve al formulario, entonces sigue lo escrito; y dado un doble clic, no se envía dos veces.
**DoD:** los dos comportamientos probados y comparados contra H1.S2.
**Estado:** A MEDIAS — el CA de la subtarea (lo escrito sobrevive, un solo envío) está demostrado; las dos microtareas de anclaje y foco no se cumplen y son **anteriores a este trabajo**.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Error de guardado forzado: el borrador sigue | Nada se perdió | captura tras el fallo, comparada con H1.S2.M4 | HECHO |
| H3.S2.M2 | Doble envío | No se envía dos veces | descripción + captura | HECHO |
| H3.S2.M3 | El error del servidor se ancla al campo | El mensaje aparece en su campo | captura | A MEDIAS |
| H3.S2.M4 | Foco al primer error y etiqueta accesible | El foco va al primer error y todo campo tiene etiqueta | descripción por paso + captura del foco | A MEDIAS |

**H3.S2.M1 — HECHO.** Con «error» forzado y doble clic sobre «Crear cuenta»: la página no se
mueve del paso 13, la contraseña sigue en su campo y los valores del formulario son idénticos
antes y después (`evidencia/h3/despues-profesional.txt:48-55`). Comparado con el mismo recorrido
del baseline (`evidencia/antes/recorrido-profesional.md`): sin diferencias. Captura mirada:
`evidencia/h3/capturas/pro-13-tras-error-de-guardado.png` — se ve la contraseña conservada y el
paso 13 intacto.

**H3.S2.M2 — HECHO.** Mismo ejercicio: `envíos al servicio: 1` con doble clic
(`evidencia/h3/despues-profesional.txt:49`), y el botón vuelve a habilitarse después del fallo.

**H3.S2.M3 — A MEDIAS.** Detalle y contrato a simular en
[`evidencia/h3/deuda-anclaje-y-foco.md`](./evidencia/h3/deuda-anclaje-y-foco.md).
- *Qué anda:* el borde HTTP ya deduce el campo desde el mensaje del servidor y lo publica en
  `ViewStateIssue.field` (`core/http/error-to-view-state.ts:199`).
- *Qué no anda:* el alta lo descarta —`errorMessage` toma sólo `issues[0].message`
  (`register-patient.ts:2097`, `register-practitioner.ts:2024`)— y lo pinta en una alerta genérica
  arriba del formulario (`register-patient.html:42`). El motor no tiene entrada para errores
  externos por campo: `errorDe(campo)` (`paginated-form.ts:493`) sale de `mensajeDeError`, que
  sólo reconoce claves de validador conocidas.
- *Qué falta exactamente:* (1) un input aditivo en el organismo para errores por campo venidos de
  afuera; (2) mapear `state().issues` a ese input en las altas; (3) **simular el contrato en tres
  niveles (regla 65)**, porque el simulador de fallos en modo `error` devuelve sólo
  `code: 'INTERNAL'` y un mensaje genérico (`core/mock/fallos-simulados.ts:105-126`) y
  `core/mock/**` está declarado OUT.

**H3.S2.M4 — A MEDIAS.**
- *Qué anda:* al intentar enviar, `enviar()` marca todo como tocado y **salta a la primera página
  con error** (`paginated-form.ts:598-613`), y un effect sobre `indice()` lleva el foco **al título
  de esa página** (`paginated-form.ts:453-466`).
- *Qué no anda:* el foco no llega al primer control inválido. Medido en el baseline: queda en el
  propio botón «Siguiente» en las 7 páginas con obligatorios
  (`evidencia/antes/recorrido-profesional.md:37`). La segunda mitad del CA —«todo campo tiene
  etiqueta»— no se verificó por separado.
- *Qué falta exactamente:* mover el foco al primer control inválido de la página tras
  `markAllAsTouched()`, y recorrer los campos comprobando su etiqueta accesible. Lo primero cambia
  el foco en los **53** consumidores del organismo, así que exige la regresión de cinco
  consumidores ajenos que el propio encargo pide en H5.S1.M4.

#### H3.S3 — Acreditar en el catálogo

**CA:** Dado lo tocado, cuando se monta en el catálogo, entonces se monta con contrato válido e hijos reales.
**DoD:** escenario en el catálogo con captura.
**Estado:** HECHO — el escenario ya existía y ya estaba tipado; se acreditó por observación.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Pedir a Ender el escenario tipado si falta | El pedido está escrito | línea en el daily | DESCARTADO |
| H3.S3.M2 | Acreditar el organismo con contrato válido | La ficha monta con `paginas` y `form` reales | captura de la ficha | HECHO |
| H3.S3.M3 | Mientras no exista, simular el contrato en tres niveles (regla 65) | Hay correcto, límite e inválido | tres corridas o tres capturas | DESCARTADO |

**H3.S3.M1 — DESCARTADO.** *Por qué:* no hace falta pedirlo, **ya existe y ya está tipado**.
`organisms-gallery.ts:339-345` declara `formDemo` como un `FormGroup` con controles tipados
(`nonNullable: true`, `FormControl<Date | null>`), y `paginasDemo` (línea 352) arma las páginas con
`paginarCampos`. *Quién lo decidió:* Itzan, sobre la medición, el 2026-09-22.

**H3.S3.M2 — HECHO.** Observado en `/design-system` con el servidor de desarrollo: el organismo
monta con **dos pasos** en el indicador («Identidad» y «Acceso») y **cuatro controles** con su
etiqueta; con los obligatorios vacíos no avanza y dibuja «Este dato es obligatorio.» **debajo de
cada campo**. Salida en `evidencia/h3/catalogo.txt`; capturas
`evidencia/h3/capturas/catalogo-motor-montado.png` y `catalogo-motor-avanzado.png`, miradas.
Consola: 2 errores, los dos de CSP por script en línea, **preexistentes** — los mismos que ya
registraba el baseline (`evidencia/antes/recorrido-profesional.md:57`).

**H3.S3.M3 — DESCARTADO.** *Por qué:* su premisa es «mientras no exista». El escenario existe, se
montó y se ejercitó, así que no hay contrato ausente que simular. La simulación de tres niveles que
la regla 65 **sí** reclama en este trabajo es la de `H3.S2.M3`, y queda escrita con sus tres casos
en [`evidencia/h3/deuda-anclaje-y-foco.md`](./evidencia/h3/deuda-anclaje-y-foco.md).
*Quién lo decidió:* Itzan, sobre la observación, el 2026-09-22.

> **Insumo para H5, medido acá:** el catálogo ya le pasa al motor un `FormGroup` **tipado**, y el
> motor lo acepta, porque `input.required<FormGroup>()` es `FormGroup<any>` y cualquier grupo
> tipado le es asignable. Tipar **el input** del organismo es lo incompatible, no tipar los
> formularios de los consumidores. Ver `H5.S1`.

### H4 — Separar vista y contenedor en un contenedor grande

**Prioridad:** `ALTA`
**CA:** Dado el contenedor elegido, cuando alguien lee su plantilla, entonces ve regiones, estados y acciones con nombres del problema; y el contenedor muestra conexión de casos de uso, no renderizado.
**DoD:** el diff, el comportamiento comparado contra H1 y la tabla de propiedad del estado cumplida.
**Estado:** HECHO — las diez microtareas cerradas. La vista quedó con **cero inyecciones**; las
tres operaciones viven en el contenedor; la plantilla ya no decide reglas; y el comportamiento se
comparó en el navegador contra el baseline, con lo no cubierto declarado.

#### H4.S1 — Bajar la presentación a la vista

**CA:** Dada la vista extraída, cuando se le pasan entradas explícitas, entonces pinta sin conocer endpoints, sesión ni persistencia.
**DoD:** la vista con entradas y salidas tipadas, y su test de contrato.
**Estado:** HECHO — seis microtareas cerradas. La vista quedó con **cero inyecciones**: seis
entradas, cuatro salidas y ninguna escritura. `corepack yarn build` en verde, `98/98` entre los dos
specs, `typecheck` y `lint` en 0.

> **Las tres pruebas que fijan el contrato, y por qué prueban algo.**
> `no muta el perfil que recibe` le pasa el objeto **congelado**: cualquier escritura revienta en
> el acto, porque el módulo es estricto, y además se compara el objeto antes y después por si
> alguien le colgara algo que `Object.freeze` no alcanza.
> `no emite ninguna intención al dibujarse ni al llegarle datos nuevos` engancha **las cuatro**
> salidas **antes** del primer `detectChanges()`; para eso el ayudante de montaje del spec ganó un
> gancho. Suscribirse después no distingue «no emitió» de «emitió y no lo vi», que es la trampa que
> vuelve vacua a esta clase de prueba.
> Y la tercera comprueba que lo recibido **sí se dibuja**, para que ninguna de las dos pase por no
> haber pintado nada.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Elegir el contenedor y declarar por qué | Hay criterio escrito | una línea en `PLAN.md` | HECHO |
| H4.S1.M2 | Contrato de la vista según el §10 | Las diez áreas respondidas | el archivo de contrato | HECHO |
| H4.S1.M3 | Extraer la vista con entradas explícitas y salidas tipadas | No inyecta clientes de negocio | revisión del diff + `corepack yarn build` + los dos specs en verde (ver desvío) | HECHO |
| H4.S1.M4 | La vista no muta los objetos que recibe | Hay test que lo demuestra | `corepack yarn test --watch=false --include=<spec>` | HECHO |
| H4.S1.M5 | Una intención no se emite al cargar datos | Hay test que lo demuestra | `corepack yarn test --watch=false --include=<spec>` | HECHO |
| H4.S1.M6 | Retirar la auto-referencia muerta que el contrato daba por viva | `verPreview`, `TAB` y el import de sí mismo no existen más; `previewMode` sigue | `corepack yarn build` + los dos specs en verde | HECHO |

**H4.S1.M3 — HECHO.** Las **siete** inyecciones salieron de la vista. Quedó con seis entradas y
cuatro salidas; las tres operaciones viven en `PractitionerProfile`.

| Qué | Antes | Ahora |
|---|---|---|
| Subir la foto, fijarla y propagarla a la vitrina | `practitioner-profile-view.ts:259-347` | `practitioner-profile.ts`, `subirFoto` + `propagarAVitrina` |
| Retirar una credencial, con confirmación | ídem `:479-497` | ídem, `retirarCredencial` |
| El aviso único de «Credenciales» | un `effect` en `:206-218` | `alVerPestana`, llamado sólo por acción de una persona |

**Lo que hizo falta y no estaba previsto: mudar ocho pruebas.** El spec de la vista dio **8 rojos**,
todos de las tres operaciones. Clasificación (regla 80.4): `TEST_BUG` — el producto hace lo pedido,
las pruebas afirmaban sobre el dueño anterior. **No se borró ninguna**: las ocho se reescribieron en
`practitioner-profile.spec.ts`, contra peticiones reales, y en el spec de la vista quedaron las que
fijan lo que ahora promete —que avisa, con qué, y que no llama a nadie—. `96/96` en verde.

> **Desvío declarado del DoD (regla 20 §6.7).** El DoD pedía `node scripts/check-architecture.mjs`
> **en verde**, y ese gate **ya estaba rojo antes de tocar nada**. Comprobado como manda el
> `CLAUDE.md` del front —corriéndolo también sobre el commit base en un árbol aparte— y comparando
> la salida literal: los tres bloques (3 ciclos en `core/mock/fixtures` y `features/agenda`, 1
> import contra las capas en `core/mock/mock-backend.spec.ts`, 1 petición fuera de
> `core/data-access` en `core/messaging/adjunto-metadata.ts`) son **idénticos**, y ninguno toca los
> cuatro archivos del cambio. La salida de este árbol es un **subconjunto estricto** de la del base.
> Se sustituye por: sin hallazgos nuevos respecto del baseline, **más `corepack yarn build`**, que
> es lo que de verdad revisa las plantillas — `yarn typecheck` es `tsc --noEmit` y **no las mira**.
> Los cinco hallazgos son deuda ajena y quedan anotados, no arreglados (regla 00 §3.2).

> **Hallazgo que refuta el propio contrato de `H4.S1.M2`.** Decía que hay **tres** consumidores y
> que uno es la vista previa embebida, con `previewMode` cortando la recursión. **Son dos.** La
> pestaña «Vista previa» se quitó en `f70d6580`, ajeno a este carril: en toda la plantilla no queda
> un solo `<app-practitioner-profile-view>`, `TAB` no aparece, `verPreview()` no se llama desde
> ningún lado y **nadie pasa `[previewMode]` en el repo entero**. El contrato quedó corregido y esto
> abre `H4.S1.M6`. Lo que **sí** sigue vivo es el input `previewMode`: cinco guardas de la plantilla
> cuelgan de él y dos pruebas lo ejercitan pasándolo a mano.

> **Un detalle verificado en vez de supuesto, y que decidió el diseño.** `app-tabs` declara
> `selectedIndex` como `model()` y **sólo lo escribe dentro de `select()`**, su manejador de clic
> (`tabs.ts:93`). Por eso la plantilla desarmó el `[(selectedIndex)]` en entrada + evento: escuchar
> `(selectedIndexChange)` significa exactamente «lo cambió una persona» y no se dispara en el primer
> dibujo. Con un `effect` sobre la señal sí se dispararía — que es justo lo que `H4.S1.M5` prohíbe.

**H4.S1.M1 — HECHO. El contenedor elegido es `practitioner-profile-view`**
(`features/account/my-profile/practitioner-profile/practitioner-profile-view/`).

*El criterio es cohesión, no tamaño* — el §5.6 prohíbe explícitamente usar líneas como definición
de calidad, y el encargo lo repite: «el tamaño NO es el defecto».

**Por qué éste:** es el único del árbol que **se llama vista y no lo es**. Recibe el perfil por
`input.required<PerfilProfesionalVisible>()` (`practitioner-profile-view.ts:170`) —la forma de un
presentacional— y al mismo tiempo inyecta **siete** dependencias de datos y servicio
(`:185-191`: `FilesClient`, `ProfilesClient`, `CommunityClient`, `AuthService`, `DialogService`,
`ToastService`, `HelpBlockDismissalStore`) con las que hace **escrituras reales**, no lecturas:

| Escritura | Dónde |
|---|---|
| Sube la foto y la persiste en dos sitios | `:288-292` |
| Sincroniza el perfil público de comunidad | `:330-335` |
| Retira una credencial | `:489` |

Y todo eso sostiene **la plantilla más grande de `my-profile/`: 1 413 líneas**
(`practitioner-profile-view.html`), la menos partida en organismos reutilizables. Un componente que
decide y pinta a la vez es exactamente lo que el §5.6 llama mal repartido, y el nombre del archivo
lo vuelve peor: **miente sobre su rol**, así que nadie lo revisa como contenedor.

**Segundo mejor, y por qué no:** `practitioner-profile-edit` tiene **más** inyecciones (10) y más
llamadas a servicio (18 sitios), pero su plantilla ya está segmentada en organismos —`DataTable`,
`ViewStateHost`, `ContentDialog`, pestañas—, así que su vista pesa menos en motivos de cambio.
Además acaba de cambiar en `d40b5631`, y tocarlo encima de un cambio recién fusionado agrega riesgo
sin agregar demostración.

**H4.S1.M2 — HECHO.** Las diez áreas del §10 respondidas en
[`evidencia/h4/contrato-de-la-vista.md`](./evidencia/h4/contrato-de-la-vista.md): tres entradas
nuevas con valor por defecto, tres salidas nuevas, la tabla de propiedad del estado (que también
cierra lo que `H2.S3` dejó abierto), las tres clases de error separadas y la compatibilidad con
consumidores nombrados. Sin adaptador temporal, con el motivo escrito.

> **Un hallazgo del propio contrato, por verificar en vez de suponer.** La primera versión decía
> «fuera de este carril no hay consumidores». Es **falso**: `git grep app-practitioner-profile-view`
> devuelve un tercero en `features/directory/practitioner-detail/practitioner-detail.html:15` — la
> Guía—, **fuera de la reserva**. No hay que tocarlo: monta la vista con `[esPropio]="false"` y las
> tres operaciones están cerradas por esa bandera en la plantilla (`:17`, `:707`) y en el `effect`
> (`practitioner-profile-view.ts:207`), así que ve una ficha de sólo lectura. Queda declarado como
> consumidor ajeno y entra en la muestra de regresión de H6.

**Descartado con evidencia el candidato obvio:** `register-practitioner.ts` es el archivo más
grande del carril (108 165 bytes), pero **no es un problema de mezcla vista/contenedor**: ~40 % son
declaraciones de campos y páginas (`TITULOS_MEDICOS` `:137-252`, `TIPOS_DE_TITULO` `:253-361`,
`AYUDA_PROFESIONAL` `:395-539`, `paginasProfesional` `:1464-1960`) y **el marcado es ~0 %** — su
vista ya vive en el motor de formularios. Separarlo no demostraría nada de lo que H4 pide.

#### H4.S2 — Que la plantilla describa la interfaz

**CA:** Dada la plantilla resultante, cuando se lee, entonces los eventos llaman una operación con intención clara y las colecciones tienen identidad estable.
**DoD:** revisión del diff contra el §5.2, con los hallazgos corregidos.
**Estado:** HECHO — cuatro microtareas cerradas.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Cálculos de dominio de la plantilla a funciones nombradas | La plantilla no calcula reglas | revisión del diff | HECHO |
| H4.S2.M2 | Identidad estable en las colecciones | No hay `track $index` donde la identidad importa | `git grep -n 'track \$index' -- '<archivos>'` | HECHO |
| H4.S2.M3 | Ningún evento hace tres cosas en una expresión | Cada evento llama una operación | revisión del diff | HECHO |
| H4.S2.M4 | Comportamiento comparado con el recorrido de H1.S2 | Sin diferencias injustificadas | recorrido comparado | HECHO |

**H4.S2.M4 — HECHO, PASS con cobertura declarada.** Todo en
[`evidencia/h4/recorrido-comparado.md`](./evidencia/h4/recorrido-comparado.md), con sus once
capturas. Las ocho celdas del baseline re-tomadas con **la misma sonda, verbatim**: desborde 0,
problemas 0, fondos correctos, y la ficha de consulta **indistinguible** de la del baseline abierta
al lado. `/my-account/edit` entra como control: no se tocó y se ve igual.

*(El baseline del perfil es `H1.S3`, no `H1.S2` —que son los recorridos de alta—. El plan nombraba
la subtarea equivocada; se compara contra la que existe.)*

> **El hallazgo que más lejos llega: el instrumento del baseline no mide el código.** La primera
> corrida dio 931 caracteres donde el baseline decía 934, y parecía una diferencia que explicar. Se
> comprobó en **las dos direcciones**, devolviendo los cuatro archivos al commit anterior: el mismo
> código produce 931 y 934, y el código anterior también. El volcado del texto en los dos estados es
> idéntico línea a línea. La causa se aisló forzando una recompilación **sin cambiar una sola
> línea** (`touch`, `git status` vacío después): los sellos de Trayectoria pasaron de 2 a 6. **La
> maqueta regenera sus datos en cada compilación.** Dentro de una compilación es estable.
>
> **Consecuencia para `H6`:** ninguna cuenta tomada a un lado y otro de un rebuild —caracteres,
> sellos, filas— vale como huella. Se compara estructura y comportamiento, no cifras.

**Las tres operaciones que bajaron al contenedor, en el navegador.** El aviso de «Credenciales»:
0 al abrir la ficha, **1** al abrir esa pestaña con su texto completo visible en la captura, y sigue
en 1 al volver. Retirar: **no ejercitado**, esta compilación no trae ningún título pendiente — la
regla la fijan cuatro pruebas dirigidas. La foto: el manejador corre y no sale ninguna petición, con
**dos** instrumentos distintos y **exactamente igual con el código anterior**, así que no hay
regresión; qué falla —el producto o la emulación del diálogo de archivo— no se afirma, y el camino
queda para el E2E dirigido de `H6.S1.M4`.

> **Un defecto propio del método, anotado.** La primera corrida murió con el overlay de error de
> vite tapando la pantalla, y **no había ningún error de compilación**: la sonda había arrancado
> mientras el servidor recompilaba. Se resolvió esperando por condición —contando las marcas de
> compilación completa— en vez de correr y ver.

Las tres primeras, con su medida, en
[`evidencia/h4/la-plantilla-describe-la-interfaz.md`](./evidencia/h4/la-plantilla-describe-la-interfaz.md).
`corepack yarn build` y `lint` en 0, `98/98` entre los dos specs.

- **M1 — dos reglas salieron de la plantilla, y una vivía dos veces con dos redacciones
  distintas.** «Un título se retira sólo mientras está pendiente» se decidía en los dos dibujos de
  la ficha; en el propio le faltaba «sólo el dueño», que quedaba implícita en un `@if` de más
  arriba. Ahora es `sePuedeRetirar`. La otra es la condición de cinco términos que decide si
  aparece «Tus datos», hoy `tieneDatosDeFiliacion` — con el detalle que la hacía frágil escrito
  donde se lee: `edad` se compara contra `null`, porque un `0` legítimo borraría la sección entera.
- **M2 — se cumplía ya.** Los **quince** `@for` llevan `track` por identidad; el comando del DoD no
  devuelve nada. Importa acá más que en una lista cualquiera: la trayectoria se reordena al alta y
  a la baja, y con el índice Angular reusaría el nodo equivocado.
- **M3 — quince enlaces de evento, cada uno una sola operación.** `H4.S1` mejoró este número sin
  proponérselo: `(fileDropRejected)="errorDeFoto.set($event)"` escribía una señal **desde la
  plantilla**, que es peor que hacer tres cosas — es hacer una que no debería poder hacerse.

> **Hueco declarado y NO corregido (regla 00 §3.2).** El botón «Retirar» del dibujo de la Guía no
> respeta `previewMode`, que promete suprimir toda acción de escritura. Se eligió que
> `sePuedeRetirar` sea la **unión exacta** de lo que las dos redacciones decían y no la regla
> «mejor»: añadirle `!previewMode()` habría cambiado comportamiento, y estas microtareas nombran
> reglas. Es inalcanzable hoy —nadie pasa el input— e inofensivo: `alPedirRetiro` sí lo comprueba
> antes de emitir, así que sería un botón muerto en un modo que nadie usa.

### H5 — Las dos decisiones que no se pueden tomar en silencio

**Prioridad:** `MEDIA`
**CA:** Dado `form: FormGroup` sin tipar y las seis banderas, cuando alguien pregunta qué se decidió, entonces hay una decisión escrita por cada una, con plan de compatibilidad y alternativa descartada.
**DoD:** las decisiones en un archivo, con los 52 consumidores nombrados como superficie.
**Estado:** HECHO — las dos decisiones tomadas con medición, no con razonamiento: **D-5** y **D-6** en [`DECISIONES-DEL-MOTOR.md`](./DECISIONES-DEL-MOTOR.md).

#### H5.S1 — La decisión sobre `FormGroup` tipado

**CA:** Dada la decisión, cuando se lee, entonces dice qué se gana, a quién rompe, qué adaptador temporal se usa y cuándo se elimina.
**DoD:** la decisión escrita + la lista de los 52 consumidores.
**Estado:** HECHO — decisión **D-5** en [`DECISIONES-DEL-MOTOR.md`](./DECISIONES-DEL-MOTOR.md).

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Listar los consumidores | El conteo da 52, o se registra el real | `git grep -l '<app-paginated-form' origin/mockup -- 'src/app/**/*.html' \| wc -l` | HECHO |
| H5.S1.M2 | La decisión con su plan de compatibilidad | Dice qué adaptador y cuándo se retira | el archivo de decisión | HECHO |
| H5.S1.M3 | La alternativa descartada | Hay al menos una, con motivo | el archivo de decisión | HECHO |
| H5.S1.M4 | Si se implementa: cinco consumidores ajenos | Las cinco pantallas funcionan igual | cinco capturas comparadas | DESCARTADO |

**H5.S1.M1 — HECHO.** El conteo da **53**, no 52, y se registra el real. Y una medición que el
encargo no pedía pero que es la que decide: **52 de los 53 arman su `FormGroup` de forma estática**
y el único dinámico es `features/form-builder/form-builder.ts`, que está declarado fuera de
alcance. Salida literal en
[`evidencia/h5/consumidores-y-forma.txt`](./evidencia/h5/consumidores-y-forma.txt).

**H5.S1.M2 — HECHO.** D-5 dice qué se gana (la `key` deja de ser un string libre y el error de
campo inexistente pasa de aviso en ejecución a error de compilación), a quién rompe (1 de 53), qué
adaptador se usa (genérico con tipo abierto por defecto + vía explícita para el caso dinámico) y
**cuándo se retira** (cuando `form-builder` sea el único que la declare, comprobado con esta misma
medición).

**H5.S1.M3 — HECHO.** Dos alternativas descartadas con motivo en D-5: tipar de un tirón sin escape
—dejaría a `form-builder` sin compilar y su única salida sería un `as any` en un consumidor ajeno,
en un repo que hoy tiene cero— y no hacer nada nunca.

**H5.S1.M4 — DESCARTADO, y esta vez verificado.** *Por qué:* la microtarea es condicional («**si se
implementa**») y la decisión D-5 es **no implementar** el tipado en este trabajo.

*Cómo se comprobó que no es pereza.* La primera versión de D-5 se escribió razonando desde el
conteo, sin correr nada — la racionalización que la regla 60 llama «es obvio». Así que se hizo el
experimento: genéricos los tres archivos del motor con `key: keyof TControles`,
`corepack yarn typecheck`, y **revertido** (árbol limpio y `typecheck` exit 0 después).

**19 errores, no cientos.** Nueve son internos del organismo, mecánicos. Los otros diez destaparon
lo que decide: `key` significa **dos cosas distintas** en este repo. En un campo normal nombra un
control; en un campo `control: 'custom'` nombra una **ranura de proyección**, y su valor puede vivir
fuera del formulario (`child-organization-new.ts:202,222,389`) **o** ser el mismo control
(`register-patient.ts:1380-1400`, donde la clave se mantiene a propósito al cambiar de `custom` a
`select`). Son **55 campos `custom` en 12 de los 53 consumidores**, y decidir cuál es cuál es una
decisión sobre pantallas de `admin/`, `geo/` y `delegated-access/`, todas fuera de alcance.

Por eso va a oleada 2: no por el conteo de consumidores, sino porque el contrato necesita una unión
discriminada que nadie puede escribir sin repasar esos 55 campos. Detalle en
[`DECISIONES-DEL-MOTOR.md`](./DECISIONES-DEL-MOTOR.md). *Quién lo decidió:* Itzan, el 2026-09-22.

#### H5.S2 — Las seis banderas, una por una

**CA:** Dada cada bandera booleana, cuando se evalúa, entonces queda decidido si se conserva, se convierte en variante o se resuelve por proyección, con el mecanismo del §8.
**DoD:** seis filas con decisión, motivo y quién la usa hoy.
**Estado:** HECHO — decisión **D-6** en [`DECISIONES-DEL-MOTOR.md`](./DECISIONES-DEL-MOTOR.md).

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Medir quién usa cada una | Seis conteos | `git grep -c '<bandera>' origin/mockup -- 'src/app/**/*.html'` por bandera | HECHO |
| H5.S2.M2 | Decidir por cada una: conservar / variante / proyección | Seis decisiones con motivo | tabla en el archivo de decisión | HECHO |
| H5.S2.M3 | Ninguna bandera lleva nombre de pantalla | Ninguna, o se registra la que sí | revisión del contrato | HECHO |
| H5.S2.M4 | Ninguna se borra con consumidores vivos | Nada se borró con uso vivo | las mediciones pegadas | HECHO |

**H5.S2.M1 — HECHO, con el instrumento corregido.** Las banderas booleanas son **cinco**, no seis;
la sexta que cuenta el encargo es `cancelLabel`, que no es booleana pero opera como tal (con `''`
no hay botón). Y el comando del DoD **mide otra cosa**: cuenta archivos que contienen la palabra,
no consumidores que le pasan la bandera al motor. Medido bien —extrayendo el tag
`<app-paginated-form>` de cada uno de los 53 y buscando dentro—: `pending` **49**, `iconOnlyNav`
**4**, `cancelLabel` **4**, `compactSteps` **1**, `interactiveSteps` **0**, `destructive` **0**.
Con el comando ingenuo, `destructive` habría dado 5 y parecería viva. Salida literal en
[`evidencia/h5/banderas-medidas.txt`](./evidencia/h5/banderas-medidas.txt).

**H5.S2.M2 — HECHO.** Seis filas con decisión y motivo en D-6: conservar `pending`, `iconOnlyNav` y
`compactSteps` (esta última vigilada); `cancelLabel` a variante semántica en oleada 2;
`interactiveSteps` conserva el comportamiento y pierde la bandera; `destructive` se retira con
`confirmTitle` y `confirmMessage`.

**H5.S2.M3 — HECHO.** Revisado el contrato completo (`paginated-form.ts:198-272`): las doce
entradas nombran qué hace el organismo, ninguna nombra a un consumidor. La más cerca del olor del
§5.6 es `compactSteps`, con un solo usuario, pero dice «pasos compactos», no «paciente».
**Ninguna incumple.**

**H5.S2.M4 — HECHO.** No se retiró ninguna bandera en este trabajo. Las dos con cero consumidores
quedan declaradas para oleada 2 con su medición pegada; las cuatro con uso vivo se conservan. Se
comprobó además que `destructive` e `interactiveSteps` tampoco se fijan desde TypeScript: los
`destructive: true` del repo son de `DialogService`, `app-menu-item` y `app-form-actions`, ninguno
del motor.

### H6 — Regresión, gates y cierre

**Prioridad:** `ALTA`
**CA:** Dado el cierre, cuando alguien que no vio el turno lee el reporte, entonces sabe qué quedó demostrado, qué quedó a medias con sus cuatro respuestas y qué no se cubrió.
**DoD:** baseline repetido y comparado, capturas miradas, §19 respondido y `REPORTE.md` escrito.
**Estado:** EN CURSO — adelantada la muestra de consumidores ajenos, cuyo sujeto ya está congelado. El resto espera el estado final de H4.

#### H6.S1 — Regresión, con la muestra de consumidores ajenos

**CA:** Dado el cambio, cuando se corren los comandos del baseline, entonces ningún rojo es nuevo; y si se tocó `paginated-form` o `form-field`, cinco consumidores ajenos están comprobados a mano.
**DoD:** salidas comparadas + cinco capturas de consumidores ajenos.
**Estado:** A MEDIAS — cuatro de cinco microtareas cerradas y **ningún rojo nuevo** en ninguna de
las cuatro. Lo que falta es el quinto consumidor ajeno de `M3`, que necesita una cuenta con otras
habilitaciones; sus tres respuestas están abajo.

> **Lo que el cierre destapó, y que ningún gate en verde habría mostrado (`M4`).** Dos
> instrumentos que devolvían el número esperado por el motivo equivocado:
> - **Los cinco rojos del E2E no son de los adjuntos**: los cinco son el mismo test a cinco anchos
>   y mueren en la aserción de consola. Se demostró con un A/B —devolviendo `register-laboratory`
>   al commit del corte— que **fallan igual sin este carril**. Causa: el baseline de consola que
>   ese spec versiona (del 2026-09-09, ajeno) ya no contiene el mensaje de CSP que la app emite
>   hoy, y el filtro compara el texto entero.
> - **«La foto no sale» era el instrumento, no el producto.** El backend simulado es un
>   `HttpInterceptorFn`, no un servidor: **ninguna** operación de la maqueta llega a la capa de red
>   que la sonda de `H4` observaba, así que «cero peticiones» era el valor esperado siempre. Medido
>   por señales en vez de por red, la subida **sí ocurre**; lo que no se puede dibujar es el sobre
>   `{body, headers}` que devuelve el manejador de archivos de la maqueta. Ajeno, anotado, y la
>   evidencia de `H4` quedó corregida en su propio archivo en vez de reescrita.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | los dos en `exit=0` y sin salida, igual que el baseline → [`evidencia/h6/lint-typecheck.txt`](./evidencia/h6/lint-typecheck.txt) | HECHO |
| H6.S1.M2 | `test` completo | Sin rojos nuevos | de 2 rojos previos queda **1**, el ajeno, reproducido aislado; `7 094` medidas contra `7 094` esperadas → [`evidencia/h6/regresion-comparada.md`](./evidencia/h6/regresion-comparada.md) | HECHO |
| H6.S1.M3 | Cinco consumidores ajenos de `paginated-form`, a mano | Las cinco se comportan igual | **4 de 5** observadas y miradas → [`evidencia/h6/consumidores-ajenos.md`](./evidencia/h6/consumidores-ajenos.md) | A MEDIAS |
| H6.S1.M4 | E2E dirigido al registro tocado, `--workers=1` | Pasa | **9 pasan · 5 rojos previos ajenos demostrados con A/B** contra el commit del corte; la foto del perfil, cerrada por observación → [`evidencia/h6/e2e-dirigido.md`](./evidencia/h6/e2e-dirigido.md) | HECHO |
| H6.S1.M5 | Barrido de las rutas de `auth` y `my-profile` | Ninguna ruta rompe | **10/10 cargan, 0 desvíos**, mismos títulos y mismo ruido preexistente que el baseline → [`evidencia/h6/barrido-de-rutas.md`](./evidencia/h6/barrido-de-rutas.md) | HECHO |

> **H6.S1.M3 — `A MEDIAS`, las tres respuestas (regla 20 §5).**
> - **Qué anda:** cuatro consumidores ajenos de cuatro funcionalidades distintas montan el motor y
>   paginan bien, observados y mirados uno por uno: vitrina de organismos, alta asistida de paciente,
>   activos y pasivos, y la vista previa del constructor de formularios —donde 20 campos se dibujan
>   como 5 páginas de 4, que es el tope de `paginarCampos`. Cero desborde, cero error de consola o de
>   red salvo el de CSP ya registrado en el baseline.
> - **Qué no anda:** nada roto. Lo que falta es alcance: la quinta pantalla no se abrió.
> - **Qué falta exactamente:** observar un consumidor de las secciones de organizaciones o de equipo
>   (`/administration/organizations/new`, `/administration/users`). Las dos devuelven al Panel: la
>   cuenta disponible es de una profesional y esas secciones no están entre las que habilita. Hace
>   falta una cuenta con otras habilitaciones, que no es de las declaradas para este trabajo.
>
> **Se adelantó a propósito, y se puede:** su sujeto quedó congelado al cerrar H3. El carril no tocó
> el organismo ni nada de lo que el organismo importa —`git diff` vacío sobre `paginated-form/` y
> `shared/forms/`, y ningún consumidor ajeno importa de `features/auth`— y H4 trabaja en el perfil.
> Por eso esta evidencia no se invalida con lo que falta de H4.

#### H6.S2 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado y ninguna palabra es más fuerte que la evidencia.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba.
**Estado:** HECHO — `plan_status.py` responde `REPORTE.md: completo`, y la primera línea es
`**AVANCE: 62 / 68 — 91,2 %.**`. El reporte declara el peldaño del trabajo en **`VERIFIED`**, no en
`REGRESSION_VERIFIED`: nombra las dos cosas que lo impiden en vez de usar una palabra más fuerte
que la evidencia (regla 30 §6).

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Capturas finales por viewport y tema | Cinco capturas con su línea | **20 celdas** (5 altas × 2 anchos × 2 temas), desborde 0 y etiquetas 100 % en todas; seis abiertas y miradas, una comparada contra el baseline → [`evidencia/h6/capturas-finales.md`](./evidencia/h6/capturas-finales.md) | HECHO |
| H6.S2.M2 | Teclado en el formulario tocado | Se completa sin mouse | `Paso 1 de 10` → `Paso 2 de 10` sin un clic; 7 paradas en orden visual, anillo de foco medido esperando por condición → [`evidencia/h6/teclado.md`](./evidencia/h6/teclado.md) | HECHO |
| H6.S2.M3 | Las 20 preguntas del §19 | Cada una con evidencia | **19 respondidas con `ruta:línea`; la 19.20 declarada inalcanzable** porque el documento maestro no está en el repo y ningún encargo la transcribe → [`REPORTE.md`](./REPORTE.md) §6 | HECHO |
| H6.S2.M4 | Peldaño por área (regla 30) | Hay peldaño por área | **5 áreas** con su peldaño, su evidencia y qué le falta a cada una → [`REPORTE.md`](./REPORTE.md) §7 | HECHO |
| H6.S2.M5 | `REPORTE.md` con el avance primero | `head -3` muestra el avance | `head -3 REPORTE.md` → la primera línea es `**AVANCE: 59 / 68 — 86,8 %.**` | HECHO |

## 6. Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| `paginated-form` y `form-field` tienen 52 consumidores en 12 features | Un cambio ahí rompe pantallas ajenas | Extraer la regla en el ámbito de `register-*`; si se toca el organismo, cinco consumidores ajenos a mano (H6.S1.M3) |
| PR #571 abierto sobre `my-profile` | Conflicto al rebasar H4 | Orden de ejecución: H4 al final (Q-I6) |
| Suite completa ~320 s con 2 rojos ajenos conocidos | Confundir rojos previos con regresión | Baseline guardado y clasificado en H1.S1 antes de tocar |
| El servidor de desarrollo tarda varios minutos y deja un proceso en el 4200 al detenerlo | Proceso huérfano (regla 70.2) | Esperar por puerto, cerrarlo por puerto al terminar y volver a medir |

## 7. Decisiones

| # | Decisión | Motivo | Evidencia |
|---|---|---|---|
| D-1 | La familia que se extrae en H3 es **la validación del respaldo de un alta** (formato y peso), no la de la contraseña ni la del documento. **Se cumplió a medias y se corrige debajo:** el respaldo se unificó, pero la contraseña **también** | Es la única de las tres con lógica propia, con **pieza canónica ya existente a medio adoptar** y con sus tres copias enteras dentro de la reserva | `evidencia/h2/ficha-familia-respaldo.md` |
| D-2 | Los dos consumidores que se migran son **profesional y laboratorio**; imagenología queda como tercero si los dos primeros pasan sin diferencia | El DoD pide dos consumidores reales migrados y comparados contra el «antes» | ficha, campo 7 |
| D-3 | **Desvío declarado del kill-test del encargo**: dice «profesional y paciente», pero el alta de paciente **no tiene adjuntos**. El kill-test se corre sobre profesional y laboratorio, que son los consumidores de la regla elegida | El kill-test comprueba que la regla viva una sola vez; se aplica a quienes la usan | `recorrido-paciente.md` (10 páginas, ninguna con adjunto) |
| D-4 | La familia B (contraseña, 8 copias idénticas respaldadas por `@MinLength(8)` de la API) quedaba **declarada para la oleada 2**, sin tocarse hoy. **No se cumplió: se extrajo igual** — corrección debajo | 3 de sus 8 consumidores están fuera de la reserva (`reset-password`, `activate-account`, `admin/user-registration`) | ficha, tabla de candidatas · `registro-compartido/politica-de-contrasena.ts` |

> **Corrección de D-1 y D-4 — escrita el 2026-09-22 al cerrar `H6.S1.M2` (regla 20 §6.7).**
> El plan decía una cosa y el árbol hace otra. Se detectó al explicar por qué la suite tiene un
> archivo de spec más que el baseline, y se comprobó midiendo, no recordando:
>
> ```text
> $ git diff --diff-filter=A --name-only d40b5631 HEAD
> src/app/features/auth/registro-compartido/politica-de-contrasena.spec.ts
> src/app/features/auth/registro-compartido/politica-de-contrasena.ts
> ```
>
> **Los únicos dos archivos que el carril creó son los de la familia B**, la que D-4 mandaba a la
> oleada 2. Y las cinco altas de la reserva la importan
> (`register-{practitioner,patient,laboratory,imaging-center,organization}.ts`).
>
> **La familia A (el respaldo), que es la que D-1 eligió, sí se unificó — pero sin archivo nuevo**,
> y por eso no saltaba a la vista: su pieza canónica **ya existía** a medio adoptar, tal como D-1
> anticipaba. Terminar de adoptarla fue reemplazar las constantes propias por
> `MAX_ATTACHMENT_BYTES` y `SUPPORT_FILE_FORMATS` de
> `registro-compartido/credenciales-del-medico` y borrar las copias
> (`register-laboratory.ts`, `-imaging-center.ts`, `-practitioner.ts`, −63/−63/−77 líneas).
> D-1 se cumplió; lo que su redacción negaba —«no la de la contraseña»— es lo que no se sostuvo.
>
> **Qué parte de D-4 sí se respetó, y es la que importaba:** su motivo era que 3 de los 8
> consumidores viven **fuera de la reserva**. Esos tres —`reset-password`, `activate-account`,
> `admin/user-registration`— **siguen intactos**: `H3.S1.M5` los deja declarados y medidos. La
> extracción alcanzó sólo a los cinco de adentro, así que **no se invadió territorio ajeno**; lo que
> falló es el registro de la decisión, no la frontera.
>
> **Por qué se corrige acá y no se deja pasar:** el `REPORTE.md` se escribe desde este plan. Sin
> esta nota diría que la política de contraseña quedó para otra oleada mientras el diff la muestra
> extraída — y quien lea el reporte no tendría cómo saber cuál de los dos miente.
