# H2.S1 — Dependencias reales y terna de dos registros

Corte `d76e3054`. Rutas relativas a `src/app/`. Terna del §3 del documento maestro:
**responsabilidad × composición × ámbito**, sacada de lo que cada pieza importa y hace, no de su carpeta.

## H2.S1.M1 — Dependencias reales (imports de primer nivel)

Comando: lectura de los `import` de las primeras 120 líneas de cada archivo (salida completa en el
registro de la sesión; acá, agrupadas).

| Dependencia | `register-practitioner.ts` | `register-patient.ts` | Qué es |
|---|---|---|---|
| `@angular/forms` (`FormGroup`, `FormControl`, `Validators`) | sí | sí (+ `AbstractControl`, `ValidationErrors`) | Formulario reactivo |
| Cliente de alta | `core/data-access/iam/iam.client` → `IamClient` | `core/auth/auth.service` → `AuthService` | **Adaptador remoto** (I/O de negocio) |
| Catálogos | `bo-departments`, `bo-municipalities`, `medical-specialties`, `system-context.client` | `bo-departments`, `bo-municipalities`, `bo-employers`, `bo-occupations`, `related-person-relationships`, `insurance.client` | Adaptadores de terminología |
| Estado de vista | `core/view-state/view-state` (`loading`, `ready`, `validation`), `core/http/error-to-view-state` | igual (`loading`, `ready`) | Contrato de estado M34 |
| Motor | `organisms/paginated-form` (+ `campo-personalizado`), `shared/forms/paginated/paginar-campos` y sus tipos | igual | Organismo de UI genérica |
| Piezas UI | `atoms/{button,nav-icon,tooltip,avatar,input,select,link}`, `molecules/{form-field,alert,file-input,reference-combobox}`, `organisms/{auth-split,registro-ayuda}`, `shared/forms/file-drop-target` | `atoms/{button,nav-icon,tooltip,input,link}`, `molecules/{form-field,alert,reference-combobox}`, `organisms/{auth-split,registro-ayuda,map}` | Presentación |
| Validador compartido | `molecules/phone-input` → `telefonoCompleto` | igual | Regla de UI compartida (ya centralizada) |
| **Compartido entre altas** | `features/auth/registro-compartido/{location-picker,ubicacion-picker,credenciales-del-medico}` | `features/auth/registro-compartido/location-picker` | Ámbito **funcionalidad** (auth) |
| Reglas puras de dominio | `core/profesion/{nombres-adicionales,autoridades-reguladoras,titulos-profesionales}` | — | Ámbito **dominio** |

Transitiva relevante: `credenciales-del-medico.ts:7,9` exporta `MAX_ATTACHMENT_BYTES` y
`SUPPORT_FILE_FORMATS`; el profesional los reexporta como `MAX_BYTES_ADJUNTO` y `FORMATOS_DE_RESPALDO`
(`register-practitioner.ts:361,364`). Laboratorio e imagenología **no** los importan: los redeclaran
(`register-laboratory.ts:104,107` · `register-imaging-center.ts:152,155`).

## H2.S1.M2 — Terna por pieza

| Pieza | Responsabilidad | Composición | Ámbito |
|---|---|---|---|
| `RegisterPractitioner` / `RegisterPatient` | Contenedor smart (ruta, cliente de alta, catálogos, estado de envío) | Página | Funcionalidad (auth) |
| `PaginatedForm` | Presentación genérica (pinta un esquema de páginas sobre un `FormGroup` que recibe) | Organismo | UI genérica (52 consumidores) |
| `paginarCampos` | Regla pura de UI (tope de campos por página) | — (función) | UI genérica |
| `LocationPicker`, `UbicacionPicker` | Presentación de dominio (ubicación del alta) | Organismo | Funcionalidad (auth) |
| `credenciales-del-medico.ts` | Contrato de datos compartido (formatos y peso de respaldo) | — (constantes) | Funcionalidad (auth) |
| `core/profesion/*` | Reglas puras de dominio (títulos, colegios, nombres) | — (funciones) | Dominio |
| `IamClient`, `AuthService`, catálogos `bo-*` | Adaptador | — | Dominio / core |
| `telefonoCompleto` | Regla pura (validador) | — | UI genérica (vive en la molécula) |

## H2.S1.M3 — Lo que vive en el contenedor y NO es responsabilidad de contenedor

| # | Qué | Dónde | Por qué no es del contenedor | Repetido en |
|---|---|---|---|---|
| 1 | Validación de formato y peso del respaldo | `register-practitioner.ts:1092-1108` (`archivoValidado`) | Es una **regla pura** (entrada: tipo y tamaño; salida: motivo o nada) escrita dentro de un smart | `register-laboratory.ts:707-721`, `register-imaging-center.ts:853-867` |
| 2 | Peso legible de un archivo | `register-practitioner.ts:1111-1115` (`pesoLegible`) | Formateo puro de presentación | `register-laboratory.ts:736`, `register-imaging-center.ts:882` |
| 3 | Política de contraseña (8 + obligatoria + mensaje) | `register-practitioner.ts:86,779,2007` | Política de la cuenta; la dueña es la API (`@MinLength(8)`) | 8 copias en el front (ver ficha, familia B) |
| 4 | Carácter válido del documento | `register-practitioner.ts:89,786` | Regla pura de formato | `register-patient.ts:86,492` (con mínimo 4 extra) |
| 5 | Validación de la foto de perfil | `register-practitioner.ts:1130-1160` | Regla pura + lectura de archivo | — (única; **contraejemplo** de la familia A) |

Lo que **sí** es de contenedor y se queda: el esquema de páginas `paginasProfesional`
(`:1529-2011`, qué se pregunta y en qué orden), la carga de catálogos (`:2265`, `:2287`), el envío
con su guarda de doble envío (`:2353-2409`) y el armado del contrato de alta `datosProfesional()`
(`:2422`).

## H2.S1.M4 — Lo que en la plantilla es orquestación de negocio

Búsqueda: eventos con varias sentencias, `@if` con condiciones largas, `getRawValue/setValue/patchValue`
y `track $index`, sobre `register-practitioner.html` y `register-laboratory.html`.

| Hallazgo | Dónde | Lectura |
|---|---|---|
| Ningún evento hace más de una cosa; no hay `setValue`/`patchValue` en plantilla | — | **No hay orquestación de negocio en la plantilla**: las dos llaman métodos con nombre |
| `track $index` en colecciones donde la identidad importa (se puede quitar una del medio) | `register-practitioner.html:105` (`nombresExtra`), `:446` (`especialidadesExtra`) | Insumo para H4.S2.M2 |
| `$any($event.target).value` en dos `(input)` | `register-practitioner.html:327`, `:348` | Cast en plantilla. El conteo de «0 `any`» del encargo mide `: any`/`as any` en `.ts` y no ve `$any(` en `.html`. Se anota; **no se sale a cazarlo** (OUT del encargo) |
