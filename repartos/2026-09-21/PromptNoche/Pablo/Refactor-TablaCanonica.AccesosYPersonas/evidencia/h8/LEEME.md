# Evidencia H8 — filtros de Grupo ABO, Factor Rh e Idioma clinico

Corte 5a0776c6, rama pablo/refactor-tabla-canonica. Cuenta superadmin@alovida.mock.
Viewport 1440x900.

## h8-antes-filtros.png
Pantalla /administration/patients con los tres filtros nuevos junto al buscador
(Grupo ABO, Factor Rh, Idioma clinico) y las tres columnas nuevas pobladas con
etiquetas legibles (A, B, O, AB, Positivo, Negativo, Aymara, Ingles, Quechua),
nunca el uuid del concepto. Confirmado en el arbol de accesibilidad: los tres
son <select> con las opciones reales del catalogo (VS_BLOOD_GROUP, VS_RH_FACTOR,
VS_LANGUAGE).

## h8-filtro-aplicado.png
Tras elegir "A" en el filtro Grupo ABO: la URL cambio a
?aboGroupConceptId=<uuid-real-del-concepto> (la misma clave que declara
PatientSearchQuery), aparecio el chip "Grupo ABO: A" con "Limpiar todo", y la
tabla se acoto a las filas que tienen A en su columna Grupo ABO -- verificado
fila por fila en la captura, todas dicen "A".

## Consola
0 errores en las dos capturas (solo el log informativo de modo desarrollo de
Angular).

## Regresion completa: ENVIRONMENT, no HECHO

`yarn test --watch=false` (los 561 archivos) crasheo 3 veces seguidas con EPIPE / SyncWriteStream
(solo 36-46 de 561 archivos llegaron a correr cada vez, ~525 errores). Se investigo: no son workers
huerfanos mios -- son ~32 procesos node.exe de OTROS proyectos del usuario corriendo en la misma
maquina (tsservers, instancias de Playwright MCP, otros dev servers). No se tocaron: no son mios.

Se clasifica ENVIRONMENT (regla 80.4), con evidencia de las 3 corridas (test-completo-despues.txt).
No se reintento una cuarta vez (regla 60: "con un reintento pasa" es exactamente la racionalizacion
prohibida).

## Regresion acotada: HECHO, 221/221

En su lugar se corrio la regresion sobre el radio de impacto REAL del cambio: los 12 specs que
importan `ProfilesClient`, tocan `searchPatients`, o dependen de `PatientDetail`/`fichaDe`
(el mapeo que se corrigio en el mock). **12/12 archivos, 221/221 tests, exit 0**
(`regresion-acotada.txt`). `quotation-list.spec.ts` no existe -- no es un hallazgo de este cambio.
