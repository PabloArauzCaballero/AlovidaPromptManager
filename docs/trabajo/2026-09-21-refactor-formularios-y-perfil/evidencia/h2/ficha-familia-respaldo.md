# H2.S2 — La regla repetida: ficha de familia (§7.3)

Corte `d76e3054`. Se evaluaron tres familias candidatas. Se elige **A** para H3 y se registran B y C.

## Las tres candidatas, medidas

| Familia | Copias (ruta:línea) | ¿Misma regla? | Pieza canónica existente |
|---|---|---|---|
| **A. Respaldo de un alta: formato y peso** | `register-practitioner.ts:1099-1106` · `register-laboratory.ts:714-721` · `register-imaging-center.ts:860-867` | **Sí**: mismas dos comprobaciones, mismos dos mensajes literales, mismo vaciado del `<input>` | **Sí, a medias**: `features/auth/registro-compartido/credenciales-del-medico.ts:7,9` tiene las constantes; sólo el profesional las usa |
| B. Contraseña de la cuenta | `MIN_PASSWORD = 8` + `required, minLength` + «La contraseña necesita al menos 8 caracteres.»: `register-patient.ts:82,527,1320` · `register-practitioner.ts:86,779,2007` · `register-organization.ts:64,424,712` · `register-laboratory.ts:110,368,655` · `register-imaging-center.ts:158,483,801` · y fuera de la reserva `auth/reset-password.ts:18,46`, `auth/activate-account.ts:20,87`, `admin/user-registration/user-registration.ts:18,97` | **Sí** (8 copias idénticas). La dueña es la API: `@MinLength(8)` en `register-practitioner.dto.ts:94`, `register-patient.dto.ts:138`, `register-organization.dto.ts:587`, `activate-account.dto.ts:29`, `password-reset.dto.ts:65`, `create-user.dto.ts:44` | No |
| C. Carácter válido del documento | `DOCUMENTO_VALIDO = /^[A-Za-z0-9.-]+$/`: `register-patient.ts:86,492` · `register-practitioner.ts:89,786` | **Parcial**: el patrón es idéntico, pero el paciente además exige mínimo 4 (`:83,491`) y el profesional no; y **cuándo avisa** difiere (el profesional marca al salir del campo, el paciente no: `recorrido-paciente.md`) | No |

**Por qué A y no B:** A es una regla con lógica (dos comprobaciones con su motivo), ya tiene pieza
canónica a medio adoptar y sus tres copias están enteras dentro de la reserva. B es una constante con dos
validadores: centralizarla vale, pero cinco de sus ocho consumidores y su dueña real (la API) quedan
afuera, y queda como candidata declarada para la oleada 2. **Por qué no C:** la regla no es la misma; unir
el patrón obligaría a elegir un mínimo y un momento de aviso, y eso es cambiar un requisito (§2.3).

## H2.S2.M2 — Las cinco dimensiones del §7.1 sobre A

| Dimensión | Profesional | Laboratorio | Imagenología | Veredicto |
|---|---|---|---|---|
| Propósito | Aceptar o rechazar el archivo de respaldo de una habilitación | Ídem, de un papel legal del laboratorio | Ídem, del centro | **Igual** |
| Anatomía | Función del contenedor que lee `input.files[0]`, vacía el `<input>`, deja el motivo en `errorAdjunto` | Igual | Igual | **Igual** (la parte pura); lo que hace con el archivo aceptado **difiere** (devuelve vs. `control.setValue`) y se queda en cada contenedor |
| Contrato | PDF/JPEG/PNG, ≤ 5 MB → motivo o nada | Igual | Igual | **Igual** |
| Comportamiento | Rechaza por formato antes que por peso; mensajes literales «El respaldo tiene que ser un PDF, un JPG o un PNG.» / «El archivo supera el límite de 5 MB.» | Igual, mismos textos | Igual, mismos textos | **Igual** |
| Apariencia | La plantilla pinta `errorAdjunto` | La suya | La suya | **Fuera de la regla**: no se toca |

## H2.S2.M3 — Ficha (los once campos del §7.3)

| Campo | Contenido |
|---|---|
| 1. Miembros y ubicaciones | `register-practitioner.ts:1092-1108` (`archivoValidado`) · `register-laboratory.ts:707-727` (`adjuntar`) · `register-imaging-center.ts:853-873` (`adjuntar`); constantes redeclaradas en `register-laboratory.ts:104,107` y `register-imaging-center.ts:152,155` |
| 2. Invariantes de comportamiento | Formato antes que peso; los dos mensajes literales; un archivo vacío no es error; el `<input>` se vacía siempre (lo hace el contenedor, no la regla) |
| 3. Diferencias visuales | Ninguna que viva en la regla: cada plantilla pinta su `errorAdjunto` como ya lo hace |
| 4. Diferencias de dominio | Qué papel respalda (habilitación del profesional vs. papeles legales de la empresa) y **qué se hace con el archivo aceptado**: eso queda en cada contenedor |
| 5. Pieza canónica | **Existente a medias**: `registro-compartido/credenciales-del-medico.ts` (constantes). Se le suma la regla como función pura tipada al lado de sus constantes. Ubicación sujeta a **Q-I7** |
| 6. Alternativas descartadas | (a) dejar la función en `register-practitioner/` y que los otros la importen: acopla un alta con otra; (b) `core/`: ámbito más ancho que los consumidores verificados (§3.3); (c) `shared/forms/`: no es una regla de UI genérica, es la política de respaldo del alta; (d) un organismo «adjunto de registro»: la anatomía visual de los tres no es la misma y §7.2 dice «misma política pura, vistas distintas → compartir función, no fabricar un organismo» |
| 7. Consumidores a migrar | En esta oleada: **profesional y laboratorio** (los dos del DoD). Imagenología es idéntica y está en la reserva: tercer consumidor, se migra si los dos primeros pasan sin diferencia; si no, queda declarado |
| 8. Pruebas de equivalencia | Test unitario de la función pura (tipo inválido, peso límite 5 MB exactos, 5 MB + 1 byte, sin archivo); los specs existentes de cada registro sobre adjuntos siguen en verde sin cambios; recorrido en navegador del rechazo por formato y por peso en los dos consumidores, comparado con el «antes» |
| 9. Riesgo | Bajo: la regla no toca `paginated-form` ni `form-field` (0 de sus 52 consumidores afectados). Riesgo real: cambiar sin querer el orden formato→peso o un mensaje; lo cubre el test |
| 10. Contraejemplo | **La foto de perfil** (`register-practitioner.ts:1136-1157`): también «valida un archivo de 5 MB», pero acepta JPG/PNG/**WebP** y **no** PDF, tiene otro mensaje («El formato de la imagen debe ser JPG, PNG o WebP.») y lee la imagen en base64. Es la imagen pública del perfil, no un respaldo documental: **no se fusiona**. Segundo contraejemplo, de otra familia: el **NIT** del paciente (`/^[0-9]{4,20}$/`, `register-patient.ts:89`, NIT de facturación de la persona) contra el del laboratorio (`/^[0-9][0-9-]{3,19}$/`, `register-laboratory.ts:117`, NIT de la empresa) |
| 11. Cambio que se hará una sola vez | Si el backend acepta otro formato de respaldo (p. ej. HEIC) o cambia el tope de peso, hoy hay que tocar **tres** funciones y **tres** pares de constantes. Después de extraer: **una** función y **un** par de constantes |

**Estado de la familia:** decisión tomada (sujeta a Q-I7) · extracción no iniciada.

## H2.S2.M4 — Contraejemplo declarado

Ver campo 10: foto de perfil (misma forma, otra política) y NIT (mismo nombre, otra regla y otro dominio).

## H2.S2.M5 — Qué cambio se hará una sola vez

Ver campo 11.
