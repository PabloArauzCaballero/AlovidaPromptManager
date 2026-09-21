# H5.S2.M1 — los campos del alta, cruzados con lo que el editor ofrece

> «En /my-account necesito que editar muestre todos los campos, no me sirve si no se hace.
> Necesito que TODAS las pestañas sean editables, o sea su información.» — doctor, 2026-09-20 (C-05)

El alta de médico pregunta **34 campos**. La lista no se escribió a mano: es
`CAMPO_DEL_ALTA_EN_PESTANA` más `CAMPOS_DEL_ALTA_SIN_PESTANA`, y hay un spec que lee los
`key:` del formulario de alta y falla si alguno no está declarado — así que si mañana el alta
gana un paso, esta tabla se pone incompleta sola.

Cruzarla no alcanzaba con mirar el editor: un campo se puede escribir sólo si el **contrato**
lo acepta. Por eso cada renglón dice también cuál es el contrato que lo lleva.

## Los contratos que puede usar el editor

| Contrato | Qué acepta |
|---|---|
| `PATCH /profiles/practitioners/me` | `professionalTitle` · `professionalBio` · `acceptsNewPatients` · `telehealthAvailable` · `name` · `middleName` · `lastName` · `motherLastName` · `birthDate` · `phone` · `mobilePhone` · `workMobilePhone` · `workLandline` · `personalEmail` · `residenceMunicipalityConceptId` · `taxId` · `taxHolderName` · `homeAddressLines` · `homeLatitude` · `homeLongitude` |
| Credencial (alta y corrección) | `credentialTypeConceptId` · `number` · `issuingInstitutionText` · `issueDate` · `fileId` |
| Matrícula (alta y corrección) | `licenseNumber` · `jurisdictionConceptId` · `regulatoryAuthority` · `practiceScopeConceptId` · `validFrom` · `validTo` · `fileId` |
| Especialidad | alta, principal y certificada |
| Consultorios y sedes | el bloque completo, con su QR |
| Foto | subida propia, desde la ficha |

## La tabla

| # | Campo del alta | ¿Se edita? | Dónde | Notas |
|---|---|---|---|---|
| 1 | `name` | **Sí** | Datos personales | |
| 2 | `lastName` | **Sí** | Datos personales | |
| 3 | `motherLastName` | **Sí** | Datos personales | |
| 4 | `nationalId` | **No** | — | El contrato de corrección del perfil no lo acepta. El propio tipo de la lectura lo dice: «no editable desde el perfil: tiene su circuito propio». Desde el 21/09 el editor lo **muestra** y dice que no se corrige acá |
| 5 | `issuerAdministrativeAreaConceptId` | **No** | — | Va con el documento, y por lo mismo |
| 6 | `sexAtBirth` | **No** | — | **Ni siquiera se puede mostrar**: la lectura del perfil médico no devuelve el dato. Se declara y se registra como Q-I5 |
| 7 | `birthDate` | **Sí** | Datos personales | |
| 8 | `mobilePhone` | **Sí** | Contacto | |
| 9 | `personalEmail` | **Sí** | Contacto | |
| 10 | `workMobilePhone` | **Sí** | Contacto | |
| 11 | `workLandline` | **Sí** | Contacto | |
| 12 | `email` (correo de trabajo) | **No, a propósito** | — | Es la identidad de acceso y se cambia por su propio trámite; el contrato lo excluye en una nota explícita. El editor lo muestra y lo dice |
| 13 | `municipio` (residencia) | **Sí** | Contacto | |
| 14 | `homeAddressLines` | **Sí** | Contacto | |
| 15 | `gpsDomicilio` | **Sí** | Contacto | Punto en el mapa |
| 16 | `officeName` | **Sí** | Dónde atiendo | Bloque de consultorios (H4) |
| 17 | `municipioConsultorio` | **Sí** | Dónde atiendo | |
| 18 | `officeAddressLines` | **Sí** | Dónde atiendo | |
| 19 | `gpsConsultorio` | **Sí** | Dónde atiendo | |
| 20 | `profilePhotoBase64` | **Sí, pero no acá** | Ficha | El retrato de la ficha es el disparador de la subida. Repetirlo en el editor daría dos lugares para lo mismo |
| 21 | `professionalTitle` | **Sí** | Datos personales | Lista cerrada |
| 22 | `professionalTitleEducation` | **Sí** | Trayectoria | Tipo de título |
| 23 | `professionalTitleUniversity` | **Sí** | Trayectoria | Institución, del catálogo o escrita |
| 24 | `professionalTitleCountry` | **No** | — | Ni la lectura ni la escritura de credenciales tienen dónde ponerlo: la institución es un texto solo |
| 25 | `professionalTitleCity` | **No** | — | Igual que el país |
| 26 | `professionalTitleFile` | **Sí** | Trayectoria | Diploma |
| 27 | `licenseNumber` | **Sí** | Credenciales | Con autoridad «Ministerio de Salud» |
| 28 | `sedesLicenseNumber` | **Sí** | Credenciales | **No hace falta un campo nuevo**: es otra matrícula con autoridad «SEDES (Gobernación)», que ya es una de las tres opciones del formulario. Es el mismo mecanismo que usa el alta |
| 29 | `regulatoryAuthority` | **Sí** | Credenciales | |
| 30 | `licenseIssueDate` | **Sí** | Credenciales | |
| 31 | `credentialAttachments` | **Sí** | Credenciales | |
| 32 | `academicTitles` | **Sí** | Trayectoria | |
| 33 | `specialtyPrimary` | **Sí** | Credenciales | |
| 34 | `especialidadesExtra` | **Sí** | Credenciales | |
| — | `password` | **No, a propósito** | — | Una contraseña no se muestra. La ficha ofrece el camino para cambiarla |

## Resultado

**28 de 34 se editan.** De los seis que no:

- **Dos son decisión y no falta**: la contraseña y el correo de trabajo. Los dos tienen su
  propio trámite porque los dos son la llave de la cuenta.
- **Uno es reubicación y no ausencia**: la foto se cambia desde la ficha.
- **Tres son un hueco del contrato, no del editor**: el documento, el departamento que lo
  emitió y el sexo al nacer. El alta los pregunta, y después no hay forma de corregirlos.
  Con el documento y el departamento se puede al menos **verlos**; el sexo al nacer no se
  puede ni mostrar, porque la lectura no lo devuelve.
- **Dos son un hueco más viejo**: el país y la ciudad donde se obtuvo el título. El alta los
  pregunta y el modelo de credenciales no tiene dónde guardarlos. No se pierden hoy por este
  cambio: no se guardaban desde antes.

Lo que se hizo con eso, en vez de dejarlo en un informe: los tres que sí se pueden leer
—documento, departamento emisor y correo de trabajo— **aparecen en el editor**, sin control y
con la razón escrita al lado. Quien entra a corregir su documento encuentra el dato y
encuentra por qué no lo puede tocar, en vez de no encontrar nada.

**Lo que sigue sin verificar contra el servicio real:** que la corrección de esos campos deba
vivir en el trámite de identidad y no en el perfil. Eso es una decisión de producto más una
pieza de la API, y va como Q-I4 y Q-I5.
