# H6.S1.M5 — Las diez rutas del carril, cargadas de nuevo

**Veredicto: PASS. Ninguna ruta rompe y ninguna cambió.** Diez de diez cargan, ninguna desvía, y
el único ruido de consola es el mismo par preexistente, en las mismas cinco rutas.

Salida literal completa en [`barrido-de-rutas.txt`](./barrido-de-rutas.txt). Commit `4146fcd3`,
maqueta (`mockBackend: true`), 1440×900, entrada por **URL directa**, cuentas sintéticas
declaradas. `exit=0` en 39 s.

## 1. El instrumento es el mismo del baseline

Se corrió **la misma sonda, sin tocarle una línea**: la de `H1.S2.M1`. Eso es lo que hace que la
comparación signifique algo — un instrumento nuevo habría medido otra cosa.

Y lo que esta sonda compara **sí sirve** en esta maqueta: ruta final, título, encabezado y errores
de consola y de red. Ninguno de esos cuatro es un conteo de datos generados, que es lo que el
hallazgo de `H4.S2.M4` invalidó.

## 2. Las diez celdas, contra el baseline

| Ruta | Sesión | Baseline `d76e3054` | Cierre `4146fcd3` |
|---|---|---|---|
| `/auth/register` | anónima | OK · «Crear cuenta» · problemas=2 | **idéntico** |
| `/auth/register/patient` | anónima | OK · «Crear cuenta de paciente» · problemas=2 | **idéntico** |
| `/auth/register/practitioner` | anónima | OK · «Crear cuenta de profesional» · problemas=2 | **idéntico** |
| `/auth/register/organization` | anónima | OK · «Registrá tu aseguradora» · problemas=2 | **idéntico** |
| `/auth/register/laboratory` | anónima | OK · «Registrá tu laboratorio» · problemas=2 | **idéntico** |
| `/auth/register/imaging-center` | anónima | OK · «Registrá tu centro de imagenología» · problemas=0 | **idéntico** |
| `/my-account` | `medica@alovida.mock` | OK · «Mi perfil» · problemas=0 | **idéntico** |
| `/my-account/edit` | `medica@alovida.mock` | OK · «Configurar tu perfil» · problemas=0 | **idéntico** |
| `/my-account` | `paciente@alovida.mock` | OK · «Mi perfil» · problemas=0 | **idéntico** |
| `/my-account/profile/edit` | `paciente@alovida.mock` | OK · «Editar tus datos» · problemas=0 | **idéntico** |

**Cero `DESVIO`**: las diez terminan en la ruta que se pidió. Mismos títulos de documento, mismos
`h1`, mismo reparto de errores de consola. **Ninguna respuesta 4xx o 5xx.**

Las cinco rutas con `problemas=2` traen **el mismo par** de violaciones de CSP por script en línea
que el baseline registró como preexistente (`evidencia/antes/rutas.md`). Que `imaging-center` siga
en 0 y las cuatro privadas también, es parte de la comparación: si mi cambio hubiera agregado
ruido, habría aparecido ahí.

## 3. Qué prueba esto y qué no

**Prueba** que las cinco altas y las cuatro pantallas de cuenta siguen montando, resolviendo su
ruta, titulando igual y sin errores nuevos — con las dos sesiones que las ven. Es la comprobación
de que nada quedó roto de arranque.

**No prueba** que el comportamiento dentro de cada formulario sea el mismo: eso lo cubren los
recorridos comparados de `H3` y `H4`, el E2E dirigido de `H6.S1.M4` y las capturas de `H6.S2`.
Cargar no es funcionar.

## 4. No cubierto

- `/auth` (inicio de sesión) se ejercita como medio para entrar, no como sujeto: está fuera de la
  reserva del carril.
- Las rutas de `my-account` que no son del perfil (historia, turnos, pedidos) no entran: el carril
  no las toca y el baseline tampoco las midió.
