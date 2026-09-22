# H1.S2.M3 — El alta de paciente ANTES de tocar nada

Ruta `/auth/register/patient`, corte `d76e3054`, maqueta (`mockBackend: true`), 1440×900, tema claro,
movimiento reducido. Datos **sintéticos** (Ana Paz, CI 9876543, `ana.paz@example.test`). Sonda
`sonda-alta-paciente.mjs`, descartable y fuera del diff. Localizadores de
`playwright/support/registro-paciente.ts`.

## Las 10 páginas y qué pasa al pulsar «Siguiente» sin completar

| # | Página | «Siguiente» vacío | Mensajes (tal cual) |
|---|---|---|---|
| 1 | ¿Cómo te llamás? | **no avanza** | «Ingresá tu apellido paterno.» |
| 2 | Tu documento de identidad | **no avanza** | «Ingresá tu documento: letras, números, punto y guion.» · «Elegí el departamento que expidió tu cédula.» |
| 3 | Contanos un poco sobre vos | **no avanza** | «Ingresá tu fecha de nacimiento.» · «Elegí una opción.» |
| 4 | ¿Cómo te contactamos? | **no avanza** | «Ingresá un número completo para el país elegido.» |
| 5 | ¿Dónde vivís? | **no avanza** | «Elegí tu departamento en el mapa y después tu ciudad.» (visible, **sin** `aria-invalid`: A-4) |
| 6 | ¿Dónde trabajás? | avanza | — |
| 7 | El lugar donde trabajás | avanza | — |
| 8 | Tu acceso | **no avanza** | «Ingresá un correo válido.» · «La contraseña necesita al menos 8 caracteres.» |
| 9 | Tu seguro de salud | avanza | — |
| 10 | Datos de facturación | (última: «Crear cuenta») | — |

Capturas: `capturas/pac-NN-pagina.png` (01–10) y `pac-NN-intento-vacio.png` (01, 02, 03, 04, 05, 08).

## Las seis preguntas del daily

| Comportamiento | Paciente (observado) | Profesional (de `recorrido-profesional.md`) | ¿Igual? |
|---|---|---|---|
| **¿Cuándo valida?** | Al pulsar «Siguiente», por página. **Al salir de un campo con valor mal formado NO marca nada** (documento «12#45», teléfono «7001», correo inválido → `inválidos: []`) | Por página al pulsar «Siguiente», **y además** marca al salir un valor mal formado (documento, correo) | **NO** |
| **¿Dónde aparece el error del servidor?** | Alerta arriba del formulario, «Simulado: fallo del servidor. (mock-fallo)», no anclada a campo; queda en la última página | Igual | Sí |
| **¿Se preserva lo escrito si falla el guardado?** | **Sí**: `formPaciente.getRawValue()` idéntico antes/después | Sí | Sí |
| **¿Se bloquea el doble envío?** | **Sí**: doble clic → 1 llamada a `auth.registerPatient` | Sí (1 llamada) | Sí |
| **¿El foco va al primer error?** | **No**: queda en «Siguiente» | No | Sí |
| **¿Qué pasa al cancelar a mitad?** | Sin botón cancelar. Salir y volver con «Atrás» del navegador **pierde lo escrito** | Igual | Sí |

La primera fila es la que importa para H2: el documento se valida con un patrón parecido en las dos
altas, pero **cuándo** se le avisa a la persona **no es lo mismo**. Cualquier regla que se centralice
tiene que conservar esa diferencia o declarar que la cambia, y cambiarla está fuera de alcance.

Fallo forzado igual que en el profesional: `mock:fallos` con patrón `/iam/auth/register-patient`,
modo `error`, `POST`; conteo con un envoltorio sobre `auth.registerPatient` puesto desde la página.

Consola: 1 error único, la violación de CSP ya registrada (A-3).
