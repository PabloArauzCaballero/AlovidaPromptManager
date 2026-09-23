# H1.S3 — El perfil de profesional ANTES de tocar nada

Sesión `medica@alovida.mock` (sintética declarada), corte `d76e3054`, maqueta. Sonda `sonda-perfil.mjs`
(descartable). Espera por **datos cargados** (sin `app-skeleton` ni `aria-busy`), no por el `h1`.

> Primera corrida descartada: esperaba el `h1`, que aparece antes que los datos, y las ocho capturas
> salieron en el **esqueleto de carga**. Se vio al mirarlas y se re-capturó. Las de abajo son las buenas.

```text
$ node tmp/sonda-perfil.mjs <capturas>
exit=0
  (/my-account: texto en main tras cargar = 934 caracteres)
perfil-consulta-escritorio-light.png · 1440×900 · fondo body=rgb(255, 255, 255) · desborde horizontal=0px · problemas=0
  (/my-account/edit: texto en main tras cargar = 1494 caracteres)
perfil-edicion-escritorio-light.png · 1440×900 · fondo body=rgb(255, 255, 255) · desborde horizontal=0px · problemas=0
perfil-consulta-movil-light.png · 390×844 · … · desborde horizontal=0px · problemas=0
perfil-edicion-movil-light.png · 390×844 · … · desborde horizontal=0px · problemas=0
perfil-consulta-escritorio-dark.png · 1440×900 · fondo body=rgb(8, 22, 28) · desborde horizontal=0px · problemas=0
perfil-edicion-escritorio-dark.png · 1440×900 · fondo body=rgb(8, 22, 28) · desborde horizontal=0px · problemas=0
perfil-consulta-movil-dark.png · 390×844 · fondo body=rgb(8, 22, 28) · desborde horizontal=0px · problemas=0
perfil-edicion-movil-dark.png · 390×844 · fondo body=rgb(8, 22, 28) · desborde horizontal=0px · problemas=0
```

## Inspección, una línea por captura

| Captura | Viewport · tema | Qué se ve |
|---|---|---|
| `perfil-consulta-escritorio-light.png` | 1440 · claro | «Tus datos» con avatar, 7 pestañas (Datos personales, Contacto, Facturación, Dónde atiendo, Trayectoria, Credenciales, Actividad), especialidades con «Verificado». OK. Las pastillas de la maqueta «Datos de prueba / Ver componentes» tapan en parte «Cambiar contraseña» (herramienta de la maqueta, preexistente) |
| `perfil-consulta-escritorio-dark.png` | 1440 · oscuro | Mismo contenido, fondo oscuro aplicado. OK |
| `perfil-consulta-movil-light.png` | 390 · claro | Una columna, pestañas con flechas de desplazamiento. OK |
| `perfil-consulta-movil-dark.png` | 390 · oscuro | Igual en oscuro; tarjetas de especialidad legibles; sin desborde. OK |
| `perfil-edicion-escritorio-light.png` | 1440 · claro | Formulario en una tarjeta con pestañas: nombres, apellidos, fecha, título profesional, biografía (244/4000), telemedicina, documento de sólo lectura, «Guardar cambios». OK |
| `perfil-edicion-escritorio-dark.png` | 1440 · oscuro | Igual, legible. El título profesional sale **vacío** con el aviso «Tu título figura como «Cardióloga», que no está en la lista» (dato de la maqueta, preexistente) |
| `perfil-edicion-movil-light.png` | 390 · claro | Una columna. La barra fija «Guardar cambios» se dibuja **sobre** «Apellido materno»: puede ser artefacto de la captura de página completa con un elemento fijo. **Se confirma en H6 con captura de viewport**, no se afirma acá |
| `perfil-edicion-movil-dark.png` | 390 · oscuro | Igual en oscuro. Misma observación de la barra fija |

## H1.S3.M3 — Consola y red antes de tocar

| Superficie | Consola | Red (≥ 400) |
|---|---|---|
| Perfil (`/my-account`, `/my-account/edit`), las 8 celdas | 0 errores | 0 |
| Altas (`/auth/register/*`) | 2 violaciones de CSP por carga de página en 5 de las 6 (A-3, `rutas.md`) | 0 |
| Alta de paciente, recorrido completo | 1 error único: la misma CSP | 0 |

Ésta es la línea contra la que se compara al cierre: cualquier error nuevo en estas superficies es
regresión hasta que se demuestre lo contrario.
