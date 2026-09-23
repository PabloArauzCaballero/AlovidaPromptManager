# H1.S2.M2 · M4 · M5 — El alta de profesional ANTES de tocar nada

Ruta `/auth/register/practitioner`, corte `d76e3054`, maqueta (`mockBackend: true`), 1440×900, tema
claro, movimiento reducido. Datos **sintéticos** (Ana Paz, CI 1234567, `ana.paz@example.test`).
Sondas: `sonda-alta-profesional.mjs` y `sonda-alta-profesional-extra.mjs`, descartables y fuera del
diff. Localizadores tomados de `playwright/registro-doctor-universidad-y-profesiones.spec.ts:95-150`.

## Las 13 páginas y qué pasa al pulsar «Siguiente» sin completar

| # | Página | Obligatorios | «Siguiente» vacío | Mensajes (tal cual) |
|---|---|---|---|---|
| 1 | ¿Cómo te llamás? | primer nombre, apellido paterno | **no avanza** | «Ingresá tu nombre.» · «Ingresá tu apellido paterno.» |
| 2 | Tu documento de identidad | cédula, departamento de emisión | **no avanza** | «Ingresá un documento válido: letras, números, punto y guion.» · «Elegí el departamento que expidió tu cédula.» |
| 3 | Contanos un poco sobre vos | sexo, fecha de nacimiento | **no avanza** | «Elegí una opción.» · «Indicá tu fecha de nacimiento.» |
| 4 | Cómo te contactamos en privado | celular personal, correo personal | **no avanza** | «El número está incompleto para el país elegido.» · «Ingresá un correo válido.» |
| 5 | El contacto de tu trabajo | — | avanza | — |
| 6 | ¿Dónde vivís? | — (el motor deja pasar vacío) | avanza | — |
| 7 | Tu consultorio propio | — | avanza | — |
| 8 | Tu título profesional y foto | título profesional | **no avanza** | «Elegí tu título profesional en la lista.» |
| 9 | Tu habilitación para ejercer | matrícula, registro del SEDES | **no avanza** | «Ingresá tu matrícula profesional.» · «Ingresá tu número de registro del SEDES.» |
| 10 | Los respaldos de tu habilitación | — | avanza | — |
| 11 | Tus títulos | — | avanza | — |
| 12 | Tus especialidades | — | avanza | — |
| 13 | Tu contraseña | contraseña (≥ 8) | **no avanza** | «La contraseña necesita al menos 8 caracteres.» |

Capturas: `capturas/pro-01-pagina.png`, `pro-NN-intento-vacio.png` (01, 02, 03, 04, 08, 09, 13) y
`pro-NN-pagina.png` de las opcionales.

## Las seis preguntas del daily, contestadas por observación

| Comportamiento | Observado | Evidencia |
|---|---|---|
| **¿Cuándo valida cada campo?** | Al pulsar «Siguiente», **por página**: marca todos los obligatorios vacíos de esa página y no avanza. Al **salir** de un campo, sólo si el valor está **mal formado** (documento «12#45», correo «no-es-un-correo» → marcado); un obligatorio **vacío** que se toca y se deja no se marca hasta «Siguiente» | sonda extra: `P01 fresca … inválidos: []` · `P02 fresca … [registro-pro-documento]` · `P04 fresca … [registro-pro-correo-personal]` · `capturas/pro-02-documento-invalido-al-salir.png` |
| **¿Dónde aparece el error del servidor?** | Arriba del formulario, en una alerta de error («Simulado: fallo del servidor. (mock-fallo)»), **no** anclada a un campo; la pantalla se queda en el paso 13 | `capturas/pro-13-tras-error-de-guardado.png` |
| **¿Se preserva lo escrito si falla el guardado?** (H1.S2.M4) | **Sí.** `formProfesional.getRawValue()` idéntico antes y después del fallo; la contraseña sigue en su campo; volviendo hacia atrás, nombre «Ana» y apellido «Paz» siguen ahí | `valores del formulario idénticos antes/después: true` · `capturas/pro-13-tras-error-de-guardado.png` |
| **¿Se bloquea el doble envío?** (H1.S2.M5) | **Sí.** Doble clic sobre «Crear cuenta» → **1** llamada al servicio de alta. El botón vuelve a habilitarse después del fallo | `envíos al servicio: 1` · `botón habilitado otra vez: true` |
| **¿El foco va al primer error?** | **No.** Tras «Siguiente» con errores el foco queda en el propio botón «Siguiente», en las 7 páginas con obligatorios | `foco: button testid=paginated-form-continuar` ×7 |
| **¿Qué pasa al cancelar a mitad?** | El alta **no tiene** botón de cancelar (no declara `cancelLabel`). Salir a otra ruta y volver con «Atrás» del navegador **pierde lo escrito**: vuelve a la página 1 vacía | `SALIR A MITAD Y VOLVER … página «¿Cómo te llamás?» · nombre=«»` |

Cómo se forzó el fallo, declarado como doble: `sessionStorage['mock:fallos'] = [{patron:
'/iam/auth/register-practitioner', modo: 'error', metodos: ['POST']}]` (simulador propio de la maqueta,
`core/mock/fallos-simulados.ts`), y el conteo de envíos con un envoltorio sobre
`iam.registerPractitioner` puesto desde la página (`ng.getComponent`), sin tocar el código.

## Defectos preexistentes vistos en el camino (se documentan, no se tocan)

| # | Qué | Dónde se ve | Nota |
|---|---|---|---|
| A-1 | El error «Ingresá tu nombre.» se dibuja **debajo de «Tercer nombre»**, no del «Primer nombre», y el primer nombre no se marca en rojo | `capturas/pro-01-intento-vacio.png` | El primer nombre es un campo proyectado (`register-practitioner.html:67-78`) bajo la clave `name`; el mensaje lo pone el motor al pie del bloque |
| A-2 | El error del título profesional **se ve** pero el combobox queda con `aria-invalid=false`: un lector de pantalla no lo asocia | `capturas/pro-08-titulo-vacio-tras-siguiente.png` · `combobox aria-invalid=false` | Regla 95.3.1: error vinculado al campo |
| A-3 | Consola: 2 violaciones de CSP por carga de página (script en línea) | `rutas.md` | Preexistente en 5 de las 6 altas |

Cualquier cambio de estos tres comportamientos **no** es de esta tarea: el encargo prohíbe cambiar el
comportamiento del formulario. Si H3 o H4 los tocan por accidente, es regresión o hay que declararlo.
