# H1.S2.M1 — Rutas de los seis registros y del perfil, sacadas del router y cargadas

Corte `d76e3054`, servidor de desarrollo de la maqueta (`mockBackend: true`), viewport 1440×900,
entrada por **URL directa** (no por navegación interna). Cuentas sintéticas declaradas.

## Del router (`src/app/app.routes.ts`)

| Ruta | Componente | Línea |
|---|---|---|
| `/auth/register` | `RegisterAccountType` (elección de tipo de cuenta) | 1901 |
| `/auth/register/patient` | `RegisterPatient` | 1907 |
| `/auth/register/practitioner` | `RegisterPractitioner` | 1922 |
| `/auth/register/organization` | `RegisterOrganization` | 1936 |
| `/auth/register/laboratory` | `RegisterLaboratory` | 1947 |
| `/auth/register/imaging-center` | `RegisterImagingCenter` | 1967 |
| `/my-account` | `MyProfile` | 190 |
| `/my-account/edit` | `PractitionerProfileEdit` (sólo quien atiende) | 720 |
| `/my-account/profile/edit` | `PatientProfileEdit` | 734 |

El inicio de sesión vive en `/auth` (`app.routes.ts:1887`), no en `/auth/login`.

## Carga de cada una

```text
$ node tmp/sonda-rutas.mjs        # sonda descartable, fuera del diff
exit=0
OK   /auth/register -> /auth/register | title="AloVida - Crear cuenta" | h1="Crear cuenta" | problemas=2
OK   /auth/register/patient -> /auth/register/patient | title="AloVida - Crear cuenta de paciente" | h1="Crear cuenta de paciente" | problemas=2
OK   /auth/register/practitioner -> /auth/register/practitioner | title="AloVida - Crear cuenta de profesional" | h1="Crear cuenta de profesional" | problemas=2
OK   /auth/register/organization -> /auth/register/organization | title="AloVida - Registrar aseguradora" | h1="Registrá tu aseguradora" | problemas=2
OK   /auth/register/laboratory -> /auth/register/laboratory | title="AloVida - Registrar laboratorio" | h1="Registrá tu laboratorio" | problemas=2
OK   /auth/register/imaging-center -> /auth/register/imaging-center | title="AloVida - Registrar centro de imagenología" | h1="Registrá tu centro de imagenología" | problemas=0
-- sesión: medica@alovida.mock
OK   /my-account -> /my-account | title="AloVida - Mi perfil" | h1="Mi perfil" | problemas=0
OK   /my-account/edit -> /my-account/edit | title="AloVida - Configurar tu perfil" | h1="Configurar tu perfil" | problemas=0
-- sesión: paciente@alovida.mock
OK   /my-account -> /my-account | title="AloVida - Mi perfil" | h1="Mi perfil" | problemas=0
OK   /my-account/profile/edit -> /my-account/profile/edit | title="AloVida - Editar tus datos" | h1="Editar tus datos" | problemas=0
```

Los `problemas=2` son, en las cinco rutas, el mismo par de errores de consola (recortado a 160
caracteres por la sonda):

```text
console.error: Executing inline script violates the following Content Security Policy directive 'script-src 'self' 'sha256-Ohy6Wz7NFFGmQaVW/a8g5BXylUJrN/hbRM2QuMglZ6Q=' 'sha25
```

**Preexistente**: se registra en el baseline de consola (H1.S3.M3) y es la línea contra la que se
compara al cierre. Ninguna ruta devolvió 4xx/5xx de red.
