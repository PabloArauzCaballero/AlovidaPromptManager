# PLAN — Separar quién decide de quién pinta en los registros y en el perfil

> **AVANCE: 21 / 65 — 32,3 %.** El denominador subió de 64 a 65: el baseline destapó un rojo previo
> dentro de un archivo reservado (H1.S1.M5).

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

| Campo | Valor |
|---|---|
| **SHA fijado** | `d76e3054487eed8ed106fb834842d607f57b8351` |
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
| 5 | H4 | `my-profile` está tocado por un PR abierto de este mismo carril (#571): se trabaja cuando esté fusionado o se elige un contenedor de `register-*` |
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
**Estado:** EN CURSO

#### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompí yo, entonces la respuesta sale de un archivo.
**DoD:** salidas con su código de salida, pegadas.
**Estado:** EN CURSO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en `PLAN.md` | `git rev-parse origin/mockup && git branch --show-current` → `evidencia/antes/corte.txt` (`d76e3054…`, `itzan/separacion-smart-dumb-registros`, exit 0) | HECHO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `corepack yarn lint` · `corepack yarn typecheck` → `evidencia/antes/lint-typecheck.txt` (los dos exit 0; typecheck local depende del índice generado, ver archivo) | HECHO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `corepack yarn test --watch=false` → `evidencia/antes/test.txt` (exit 1 · 2 fallidos / 7 085 pasados de 7 087 · 571 archivos) | HECHO |
| H1.S1.M4 | Clasificar cada rojo previo | Cada uno con su clase de la regla 80.4 | tabla abajo + `evidencia/antes/clasificacion-rojos.md` (los dos reproducidos aislados) | HECHO |
| H1.S1.M5 | **Nueva (descubierta en H1.S1.M4).** El rojo previo propio de `register-practitioner.spec.ts:2002` pasa a verde sin tocar su aserción | Dado el spec, cuando corre aislado y dentro de la suite, entonces el test con backend simulado pasa y su aserción de la línea 2033 sigue igual | `corepack yarn test --watch=false --include=src/app/features/auth/register-practitioner/register-practitioner.spec.ts` → `97 passed` + `git diff` del spec sin cambios en la aserción | TODO |

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
**Estado:** TODO

#### H2.S1 — Clasificar los contenedores con la terna del §3

**CA:** Dado un contenedor, cuando lo clasifico, entonces tiene responsabilidad, nivel compositivo y ámbito, sacados de sus dependencias reales.
**DoD:** tabla con una fila por contenedor y sus dependencias transitivas relevantes.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Dependencias reales de dos registros | Hay lista, incluidas las transitivas relevantes | `evidencia/h2/terna-y-dependencias.md` §M1 (profesional y paciente, con la transitiva de `credenciales-del-medico`) | HECHO |
| H2.S1.M2 | Terna responsabilidad × composición × ámbito por pieza | Cada fila tiene las tres | `evidencia/h2/terna-y-dependencias.md` §M2 (8 piezas) | HECHO |
| H2.S1.M3 | Lo que en el contenedor NO es responsabilidad de contenedor | Hay lista con líneas | `evidencia/h2/terna-y-dependencias.md` §M3 (5 hallazgos con ruta:línea) | HECHO |
| H2.S1.M4 | Lo que en la plantilla es orquestación de negocio | Hay lista con líneas | `evidencia/h2/terna-y-dependencias.md` §M4 (**no hay**; sí `track $index` ×2 y `$any` ×2) | HECHO |

#### H2.S2 — La regla repetida

**CA:** Dada la afirmación «esto está duplicado», cuando se verifica, entonces hay dos copias de la misma regla citadas por línea y está dicho qué cambio se haría una sola vez.
**DoD:** la ficha del §7.3 completa, con el contraejemplo.
**Estado:** TODO

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
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Estados mutables del contenedor elegido | Hay lista | tabla en `PLAN.md` | TODO |
| H2.S3.M2 | Las cinco preguntas por estado | Ninguna fila incompleta | tabla | TODO |
| H2.S3.M3 | Estados derivados que hoy son copias mutables | Hay lista con líneas | tabla con ruta y línea | TODO |
| H2.S3.M4 | `effect` que copian estado en vez de derivarlo | Hay lista, o se declara que no hay | `git grep -n 'effect(' origin/mockup -- '<archivos>'` | TODO |

### H3 — La regla vive una sola vez, y dos consumidores la usan

**Prioridad:** `ALTA`
**CA:** Dada la regla extraída, cuando se la busca en el repo, entonces está escrita una sola vez; y los dos registros que la consumen se comportan igual que en las notas de H1.S2.
**DoD:** la regla en un archivo, dos consumidores migrados, los dos recorridos comparados contra H1.S2.
**Estado:** TODO

#### H3.S1 — Extraer sin cambiar comportamiento

**CA:** Dada la extracción, cuando se compara antes y después, entonces no hay diferencia de comportamiento sin justificar por escrito.
**DoD:** el test que protege la regla en verde, y el recorrido comparado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Test que protege la regla, escrito primero | Falla antes de extraer, pasa después | dos corridas pegadas | TODO |
| H3.S1.M2 | La regla como función pura tipada | No consulta DOM, no inyecta sesión, no hace HTTP | el archivo + revisión contra §3.1 | TODO |
| H3.S1.M3 | Migrar el primer consumidor | El registro se comporta igual | recorrido comparado contra H1.S2.M2 | TODO |
| H3.S1.M4 | Migrar el segundo consumidor | El registro se comporta igual | recorrido comparado contra H1.S2.M3 | TODO |
| H3.S1.M5 | La copia vieja ya no existe | `git grep` de la regla da una sola definición | `git grep -n '<patrón>' -- 'src/app/features/auth/register-*/**'` | TODO |

#### H3.S2 — Que no se pierda lo que la persona escribió

**CA:** Dado un fallo de guardado, cuando la persona vuelve al formulario, entonces sigue lo escrito; y dado un doble clic, no se envía dos veces.
**DoD:** los dos comportamientos probados y comparados contra H1.S2.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Error de guardado forzado: el borrador sigue | Nada se perdió | captura tras el fallo, comparada con H1.S2.M4 | TODO |
| H3.S2.M2 | Doble envío | No se envía dos veces | descripción + captura | TODO |
| H3.S2.M3 | El error del servidor se ancla al campo | El mensaje aparece en su campo | captura | TODO |
| H3.S2.M4 | Foco al primer error y etiqueta accesible | El foco va al primer error y todo campo tiene etiqueta | descripción por paso + captura del foco | TODO |

#### H3.S3 — Acreditar en el catálogo

**CA:** Dado lo tocado, cuando se monta en el catálogo, entonces se monta con contrato válido e hijos reales.
**DoD:** escenario en el catálogo con captura.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Pedir a Ender el escenario tipado si falta | El pedido está escrito | línea en el daily | TODO |
| H3.S3.M2 | Acreditar el organismo con contrato válido | La ficha monta con `paginas` y `form` reales | captura de la ficha | TODO |
| H3.S3.M3 | Mientras no exista, simular el contrato en tres niveles (regla 65) | Hay correcto, límite e inválido | tres corridas o tres capturas | TODO |

### H4 — Separar vista y contenedor en un contenedor grande

**Prioridad:** `ALTA`
**CA:** Dado el contenedor elegido, cuando alguien lee su plantilla, entonces ve regiones, estados y acciones con nombres del problema; y el contenedor muestra conexión de casos de uso, no renderizado.
**DoD:** el diff, el comportamiento comparado contra H1 y la tabla de propiedad del estado cumplida.
**Estado:** TODO

#### H4.S1 — Bajar la presentación a la vista

**CA:** Dada la vista extraída, cuando se le pasan entradas explícitas, entonces pinta sin conocer endpoints, sesión ni persistencia.
**DoD:** la vista con entradas y salidas tipadas, y su test de contrato.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Elegir el contenedor y declarar por qué | Hay criterio escrito | una línea en `PLAN.md` | TODO |
| H4.S1.M2 | Contrato de la vista según el §10 | Las diez áreas respondidas | el archivo de contrato | TODO |
| H4.S1.M3 | Extraer la vista con entradas explícitas y salidas tipadas | No inyecta clientes de negocio | revisión del diff + `node scripts/check-architecture.mjs` en verde | TODO |
| H4.S1.M4 | La vista no muta los objetos que recibe | Hay test que lo demuestra | `corepack yarn test --watch=false --include=<spec>` | TODO |
| H4.S1.M5 | Una intención no se emite al cargar datos | Hay test que lo demuestra | `corepack yarn test --watch=false --include=<spec>` | TODO |

#### H4.S2 — Que la plantilla describa la interfaz

**CA:** Dada la plantilla resultante, cuando se lee, entonces los eventos llaman una operación con intención clara y las colecciones tienen identidad estable.
**DoD:** revisión del diff contra el §5.2, con los hallazgos corregidos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Cálculos de dominio de la plantilla a funciones nombradas | La plantilla no calcula reglas | revisión del diff | TODO |
| H4.S2.M2 | Identidad estable en las colecciones | No hay `track $index` donde la identidad importa | `git grep -n 'track \$index' -- '<archivos>'` | TODO |
| H4.S2.M3 | Ningún evento hace tres cosas en una expresión | Cada evento llama una operación | revisión del diff | TODO |
| H4.S2.M4 | Comportamiento comparado con el recorrido de H1.S2 | Sin diferencias injustificadas | recorrido comparado | TODO |

### H5 — Las dos decisiones que no se pueden tomar en silencio

**Prioridad:** `MEDIA`
**CA:** Dado `form: FormGroup` sin tipar y las seis banderas, cuando alguien pregunta qué se decidió, entonces hay una decisión escrita por cada una, con plan de compatibilidad y alternativa descartada.
**DoD:** las decisiones en un archivo, con los 52 consumidores nombrados como superficie.
**Estado:** TODO

#### H5.S1 — La decisión sobre `FormGroup` tipado

**CA:** Dada la decisión, cuando se lee, entonces dice qué se gana, a quién rompe, qué adaptador temporal se usa y cuándo se elimina.
**DoD:** la decisión escrita + la lista de los 52 consumidores.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Listar los consumidores | El conteo da 52, o se registra el real | `git grep -l '<app-paginated-form' origin/mockup -- 'src/app/**/*.html' \| wc -l` | TODO |
| H5.S1.M2 | La decisión con su plan de compatibilidad | Dice qué adaptador y cuándo se retira | el archivo de decisión | TODO |
| H5.S1.M3 | La alternativa descartada | Hay al menos una, con motivo | el archivo de decisión | TODO |
| H5.S1.M4 | Si se implementa: cinco consumidores ajenos | Las cinco pantallas funcionan igual | cinco capturas comparadas | TODO |

#### H5.S2 — Las seis banderas, una por una

**CA:** Dada cada bandera booleana, cuando se evalúa, entonces queda decidido si se conserva, se convierte en variante o se resuelve por proyección, con el mecanismo del §8.
**DoD:** seis filas con decisión, motivo y quién la usa hoy.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Medir quién usa cada una | Seis conteos | `git grep -c '<bandera>' origin/mockup -- 'src/app/**/*.html'` por bandera | TODO |
| H5.S2.M2 | Decidir por cada una: conservar / variante / proyección | Seis decisiones con motivo | tabla en el archivo de decisión | TODO |
| H5.S2.M3 | Ninguna bandera lleva nombre de pantalla | Ninguna, o se registra la que sí | revisión del contrato | TODO |
| H5.S2.M4 | Ninguna se borra con consumidores vivos | Nada se borró con uso vivo | las mediciones pegadas | TODO |

### H6 — Regresión, gates y cierre

**Prioridad:** `ALTA`
**CA:** Dado el cierre, cuando alguien que no vio el turno lee el reporte, entonces sabe qué quedó demostrado, qué quedó a medias con sus cuatro respuestas y qué no se cubrió.
**DoD:** baseline repetido y comparado, capturas miradas, §19 respondido y `REPORTE.md` escrito.
**Estado:** TODO

#### H6.S1 — Regresión, con la muestra de consumidores ajenos

**CA:** Dado el cambio, cuando se corren los comandos del baseline, entonces ningún rojo es nuevo; y si se tocó `paginated-form` o `form-field`, cinco consumidores ajenos están comprobados a mano.
**DoD:** salidas comparadas + cinco capturas de consumidores ajenos.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M2 | `test` completo | Sin rojos nuevos | diff contra baseline | TODO |
| H6.S1.M3 | Cinco consumidores ajenos de `paginated-form`, a mano | Las cinco se comportan igual | cinco capturas comparadas | TODO |
| H6.S1.M4 | E2E dirigido al registro tocado, `--workers=1` | Pasa | salida pegada | TODO |
| H6.S1.M5 | Barrido de las rutas de `auth` y `my-profile` | Ninguna ruta rompe | salida pegada | TODO |

#### H6.S2 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado y ninguna palabra es más fuerte que la evidencia.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Capturas finales por viewport y tema | Cinco capturas con su línea | `evidencia/h6/` | TODO |
| H6.S2.M2 | Teclado en el formulario tocado | Se completa sin mouse | descripción por paso | TODO |
| H6.S2.M3 | Las 20 preguntas del §19 | Cada una con evidencia | sección en `REPORTE.md` | TODO |
| H6.S2.M4 | Peldaño por área (regla 30) | Hay peldaño por área | sección en `REPORTE.md` | TODO |
| H6.S2.M5 | `REPORTE.md` con el avance primero | `head -3` muestra el avance | `head -3 REPORTE.md` | TODO |

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
| D-1 | La familia que se extrae en H3 es **la validación del respaldo de un alta** (formato y peso), no la de la contraseña ni la del documento | Es la única de las tres con lógica propia, con **pieza canónica ya existente a medio adoptar** y con sus tres copias enteras dentro de la reserva | `evidencia/h2/ficha-familia-respaldo.md` |
| D-2 | Los dos consumidores que se migran son **profesional y laboratorio**; imagenología queda como tercero si los dos primeros pasan sin diferencia | El DoD pide dos consumidores reales migrados y comparados contra el «antes» | ficha, campo 7 |
| D-3 | **Desvío declarado del kill-test del encargo**: dice «profesional y paciente», pero el alta de paciente **no tiene adjuntos**. El kill-test se corre sobre profesional y laboratorio, que son los consumidores de la regla elegida | El kill-test comprueba que la regla viva una sola vez; se aplica a quienes la usan | `recorrido-paciente.md` (10 páginas, ninguna con adjunto) |
| D-4 | La familia B (contraseña, 8 copias idénticas respaldadas por `@MinLength(8)` de la API) queda **declarada para la oleada 2**, no se toca hoy | 3 de sus 8 consumidores están fuera de la reserva (`reset-password`, `activate-account`, `admin/user-registration`) | ficha, tabla de candidatas |
