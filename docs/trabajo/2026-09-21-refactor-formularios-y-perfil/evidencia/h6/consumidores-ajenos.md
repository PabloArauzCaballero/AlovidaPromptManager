# H6.S1.M3 — Los consumidores ajenos del motor de formularios

**Veredicto: PASS parcial — 4 de 5 pantallas observadas, ninguna rota. La quinta no la alcanza la
cuenta disponible.** Estado de la microtarea: `A MEDIAS`.

## 1. Por qué esta comprobación se pudo hacer ahora y no al final

El motor `paginated-form` lo consumen **53 pantallas**: 5 de altas (reservadas para este carril) y
**48 ajenas**. Esta microtarea vive en H6, pero su sujeto quedó congelado apenas cerró H3: el carril
**no tocó el organismo ni nada de lo que el organismo importa**, y H4 trabaja en el perfil, que
tampoco lo toca. Por eso se adelantó.

```text
$ git diff --stat d40b5631..HEAD -- src/app/shared/components/organisms/paginated-form/ src/app/shared/forms/
(vacío)

$ git diff --name-only d40b5631..HEAD
src/app/features/auth/register-imaging-center/register-imaging-center.spec.ts
src/app/features/auth/register-imaging-center/register-imaging-center.ts
src/app/features/auth/register-laboratory/register-laboratory.spec.ts
src/app/features/auth/register-laboratory/register-laboratory.ts
src/app/features/auth/register-organization/register-organization.ts
src/app/features/auth/register-patient/register-patient.ts
src/app/features/auth/register-practitioner/register-practitioner.spec.ts
src/app/features/auth/register-practitioner/register-practitioner.ts
src/app/features/auth/registro-compartido/politica-de-contrasena.spec.ts
src/app/features/auth/registro-compartido/politica-de-contrasena.ts

$ git grep -l "features/auth" -- '<las carpetas de los 48 consumidores ajenos>'
NINGUNO
```

**Diez archivos tocados, los diez bajo `features/auth/register-*` y `features/auth/registro-compartido/`,
y ningún consumidor ajeno importa nada de `features/auth`.** El cierre de imports del organismo
—26 piezas entre átomos, moléculas y `shared/forms/paginated/`— está intacto byte a byte.

**Eso convierte la palabra «comparadas» del DoD en una comparación de la que ya se conoce el
resultado: el antes y el después los produce el mismo código fuente.** Capturar las dos versiones
sería teatro. Lo que las capturas sí aportan, y por eso se tomaron, es otra cosa: **confirmar que
esas pantallas dibujan el motor hoy**, para que un defecto preexistente no aparezca en el cierre
disfrazado de regresión de este carril.

## 2. Lo observado

Corrida en el navegador, ancho 1440×900, tema claro, `reducedMotion: reduce`, sesión
`medica@alovida.mock` (cuenta sintética declarada). Consola, errores de página y respuestas ≥400
registrados por pantalla.

| # | Pantalla | Ruta | Motor | Campos | Pasos | Desborde | Consola/red | Captura |
|---|---|---|---|---|---|---|---|---|
| 1 | Vitrina de organismos | `/design-system` | 1 | 4 | 1 | 0 px | **2** (ver §3) | `capturas/ajeno-vitrina-organismos.png` |
| 2 | Alta asistida de paciente | `/administration/patients/assisted-registration` | 1 | 4 | 1 | 0 px | 0 | `capturas/ajeno-alta-asistida-de-paciente.png` |
| 3 | Activos y pasivos | `/administration/accounting/assets-liabilities` | 1 | 2 | 1 | 0 px | 0 | `capturas/ajeno-activos-y-pasivos.png` |
| 4 | Constructor de formularios — vista previa | `/form-builder` → ficha → «Vista previa» | 1 | 4 | 1 | 0 px | 0 | `capturas/ajeno-form-builder-vista-previa.png` |
| 5 | — | — | — | — | — | — | — | **no alcanzada, ver §4** |

Son **cuatro funcionalidades distintas**, no cuatro pantallas de la misma: catálogo de componentes,
padrón de pacientes, contabilidad y constructor de formularios.

### Inspección de cada captura

- **Vitrina de organismos** — el motor monta con contrato válido: barra de pasos, cuatro campos,
  navegación. Es la misma ficha que ya se había acreditado en H3.S3.M2.
- **Alta asistida de paciente** — barra de tres pasos («Datos del paciente 1 de 2», «2 de 2»,
  «Justificación»), cuatro campos con sus obligatorios marcados y sus textos de ayuda
  («Si no tiene, dejalo vacío»), botón «Siguiente» alineado a la derecha. Sin recorte ni desborde.
- **Activos y pasivos** — barra de tres pasos («Qué se compró», «Contra qué cuentas», «Por cuánto y
  hasta cuándo»), dos campos obligatorios. El motor convive con el resto de la pantalla —selector de
  práctica, pestañas Activos/Pasivos, lista de activos— sin pisarse.
- **Constructor, vista previa** — el caso más exigente y el que mejor demuestra la regla:
  un formulario de **20 campos** se dibuja como **5 páginas de 4**, que es exactamente el tope de
  `paginarCampos`. El texto de la pantalla lo dice: «de a una página, con un tope de cuatro campos y
  una barra que dice cuánto falta». La paginación sigue funcionando en el consumidor que más la usa.

**Ninguna de las cuatro tiene desborde horizontal ni recorte de contenido.**

## 3. Lo que salió en consola, y de quién es

La vitrina reporta dos entradas, las dos de la misma causa: **la política de seguridad de contenido
rechaza un script en línea**. Es el hallazgo **preexistente** ya registrado en el baseline de H1
(`evidencia/antes/rutas.md`), no lo produce este carril y no tiene que ver con el motor. Las otras
tres pantallas reportan **cero**.

## 4. La quinta pantalla: por qué no se observó

Las candidatas naturales para completar las cinco eran el alta de organización
(`/administration/organizations/new`) y el alta de integrante del equipo (`/administration/users`).
**Las dos devuelven a la persona al Panel**: la cuenta con la que se puede entrar es la de una
profesional, y su cuenta no habilita las secciones de organizaciones ni de equipo — el propio Panel
lo dice, muestra diez secciones en cuatro zonas y esas dos no están entre ellas.

Alcanzarlas exige una cuenta con otras habilitaciones, que no es de las declaradas para este
trabajo. **No se inventa una**: la microtarea queda `A MEDIAS` con las cuatro observadas y ésta
nombrada.

Lo que sí cubre a las 48 sin excepción es el argumento estructural de §1. No sustituye a la
observación —leer el código nunca es verificar— pero sí acota el riesgo: para que una de las 44
pantallas no observadas hubiera cambiado, tendría que haber cambiado algo de su cierre de imports,
y no cambió nada.

## 5. Observación anotada, ajena a este carril

En las capturas se ven dos insignias flotantes de desarrollo —«Datos de prueba» y «Ver
componentes»— ancladas al borde inferior izquierdo. En dos de las cuatro pantallas **tapan una
etiqueta de campo** (en «Activos y pasivos», «Cuenta de gasto por depreciación»; en la vista previa,
«Antecedentes patológicos»). Son herramientas de la maqueta, no interfaz de producto, y están fuera
del alcance de este carril: **se anotan, no se tocan.**

## 6. Un defecto propio, de la primera corrida de la sonda

La primera versión de la sonda leía la URL de llegada **antes** de esperar, y el guard de secciones
redirige de forma asíncrona: tres pantallas se reportaron como alcanzadas cuando en realidad habían
rebotado al Panel, y la captura mostraba el Panel. Se detectó **mirando las capturas**, que es
exactamente para lo que se miran. Corregido: la URL se lee después de una carrera entre «aparece el
motor» y «cambia la ruta», y las capturas mentirosas se borraron y se rehicieron.

## 7. No cubierto

- 44 de los 48 consumidores ajenos no se abrieron. Cubiertos sólo por el argumento de §1.
- Un solo ancho (1440×900) y un solo tema (claro). La matriz de viewports y temas es de H6.S2.M1 y
  se hace sobre las pantallas del carril, no sobre las ajenas.
- No se completó ningún formulario ajeno ni se envió: lo que se comprueba acá es que el motor monta
  y pagina, no el flujo de negocio de esas pantallas, que es territorio de quien las lleva.
