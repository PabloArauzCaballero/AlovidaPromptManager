# H3.S1.M7 — El código muerto que destapó la extracción, y por qué se retiró

## Lo que se encontró

La regla del respaldo (formato y peso) estaba escrita tres veces, pero **sus tres llamadores no los
invoca ninguna plantilla** desde que los adjuntos pasaron a la molécula `app-file-input`:

| Método | Dónde | Quién lo llamaba |
|---|---|---|
| `archivoValidado` + `adjuntarRespaldo` + `adjuntarArchivoATitulo` + `quitarRespaldo` + `quitarArchivoDeTitulo` | `register-practitioner.ts` | sólo su propio spec |
| `adjuntar` + `quitarAdjunto` + `pesoLegible` | `register-laboratory.ts` | sólo su propio spec |
| `adjuntar` + `quitarAdjunto` + `pesoLegible` | `register-imaging-center.ts` | sólo su propio spec |

Las plantillas usan `(filesChange)` → `updateSupportFiles` / `updateTitleFiles` / `updateAttachment`
(`register-practitioner.html:194,261,395`, `register-laboratory.html:12`, `register-imaging-center.html:12`).

**Quién valida hoy de verdad:** la molécula, en `shared/components/molecules/file-input/file-input.ts:231`
(`matchesFileAccept` + `maxSizeBytes`), con sus propios textos: «`<archivo>`: Formato no permitido.» y
«`<archivo>`: Supera el límite de 5 MB.». Verificado en pantalla en las dos altas
(`evidencia/h3/despues-adjuntos.txt` y `capturas/lab-respaldo-formato-rechazado.png`).

## Qué se hizo

1. Se retiraron esos métodos de los tres registros.
2. Las pruebas que cubrían un **requisito vivo** se reapuntaron al camino vivo, sin debilitarlas:
   «el adjunto queda pegado al título al que se le cargó», «quitar un título se lleva su adjunto»,
   «los dos respaldos de la habilitación son independientes» y «guarda el archivo elegido con su
   nombre y su peso» ahora entran por `updateTitleFiles` / `updateSupportFiles` / `updateAttachment`.
3. Las pruebas que sólo ejercían la regla muerta se retiraron **con su motivo escrito en el spec**
   (rechazo por formato, rechazo por peso, vaciado del `<input>`, peso legible): su sujeto ya no
   existe en esas pantallas, y esa regla se prueba donde vive, en el spec de la molécula.
4. El módulo `respaldo-de-registro.ts` que se había extraído quedó **sin consumidores** y se retiró
   con su spec: una abstracción sin uso es lo que el §7.2 del documento maestro prohíbe. Su valor
   fue destapar este hallazgo, que queda escrito acá.

## Qué NO se tocó

- `app-file-input` y su regla: es una molécula compartida, fuera de la reserva de este carril.
- El bloque `@if (errorAdjunto())` de las tres plantillas: `errorAdjunto` hoy sólo se pone en `null`,
  así que ese aviso no se dibuja nunca. **Queda declarado como pendiente**, no borrado: tocar el DOM
  de esas páginas excede lo que esta microtarea necesita.
- `matchesFileAccept` vs. el `split(',').includes(type)` que usaban las altas: **no son la misma
  regla** (la primera acepta además por extensión y por comodín). No se unificó nada; se documenta.
