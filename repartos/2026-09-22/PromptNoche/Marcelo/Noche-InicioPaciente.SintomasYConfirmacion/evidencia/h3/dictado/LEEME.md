# Dictado (H3.S2) — prueba real en dos navegadores

Sesión de `paciente@alovida.mock` (cuenta sintética) sobre `http://localhost:4200/dashboard` (`yarn dev`).
2026-09-23. Cada captura fue **mirada**. Números y textos literales en `mediciones-chromium.json` y `firefox.txt`.

## Navegadores probados

| Navegador | Cómo | `SpeechRecognition` | Botón «Dictar» |
|---|---|---|---|
| Chrome 153.0.0.0 (UA), el del Playwright MCP | `browser_run_code` | sí (`SpeechRecognition` y `webkitSpeechRecognition`) | sí, con ícono + texto |
| Firefox 153.0 (Playwright `firefox-1538`) | `node artifacts/dictado-firefox.mjs` (copia en `dictado-firefox.mjs`) | no | **no** (el bloque entero ausente); el área de texto sigue |

## Capturas

| # | Archivo | Viewport | Qué se vio |
|---|---|---|---|
| 01 | `01-375-boton-dictar.png` | 375×812 · claro · Chrome | Bajo el área de texto: el aviso «Lo que dictás lo transcribe tu navegador; no lo guardamos.» y después el botón «Dictar» con el ícono de micrófono y el texto. El aviso está antes en el DOM y en pantalla, y el botón lo referencia con `aria-describedby`. |
| 02 | `02-375-sin-permiso.png` | 375×812 · claro · Chrome | Tras pulsar «Dictar»: el ciclo pasó por «Detener» + «Escuchando… decí qué te pasa.» (observado por DOM en `mediciones-chromium.json`, no llegó a la foto: dura ~100 ms antes del error) y terminó en «Activá el micrófono en el navegador o escribí.» con el botón de vuelta en «Dictar». Los avisos flotantes del simulador se cerraron antes para que no taparan la línea. |
| 05 | `05-firefox-375-sin-boton.png` | 375×812 · claro · Firefox | El panel «Contanos con tus palabras» completo y **ningún** botón ni aviso de dictado: sin reconocedor no se ofrece lo que no puede funcionar. |

## Por qué siempre termina en «sin permiso» en esta máquina

Dos causas, las dos verificadas:

1. **La app bloquea el micrófono para todo el documento**: `Permissions-Policy: camera=(), microphone=(),
   geolocation=(self)` sale del servidor SSR (`src/server/security-headers.ts:268`). Con
   `context.grantPermissions(['microphone'])` → `navigator.permissions.query` = `granted`, y aun así Chrome
   avisa «AudioCapture permission has been blocked because of a permissions policy» y el reconocedor devuelve
   `not-allowed`. Es HALL-M4; Pablo decidió abrir `microphone=(self)` (H3.S2.M9).
2. Hasta ahí se creyó que además no había micrófono en la máquina; **lo hay** (ver la sección siguiente):
   con la política abierta, Chrome escuchó y transcribió.

## No cubierto

- Una frase dictada a propósito que se reconozca como síntoma (por ejemplo «me duele la cabeza»): la
  transcripción real observada fue audio ambiente y no se repite. El reconocimiento de síntomas a partir
  del texto ya lo cubren los specs del chequeo; el agregado al final sin pisar lo tipeado, el spec «dictar».
- Los estados «sin resultado» y «sin red» en navegador real: sólo contra el doble.

## Después de H3.S2.M9 (política `microphone=(self)`, decisión de Pablo)

Misma prueba en Chrome 153 con permiso concedido: la cabecera servida ya es
`camera=(), microphone=(self), geolocation=(self)`, `document.featurePolicy.allowsFeature('microphone')` es
`true`, **ningún** warning ni error en consola, `onerror` del reconocedor no se disparó, y el estado se
sostuvo en «Detener» + «Escuchando… decí qué te pasa.» durante 15 s. **Hubo transcripción real**: el
micrófono de la máquina captó una frase de audio ambiente (una persona cerca, hablando de otra cosa) y
esa frase apareció en el área de texto, pasó por `escribir()` y el chequeo contestó «No reconocimos ningún
síntoma…». Es la prueba de punta a punta del mecanismo.

**La frase y la captura que la mostraba (`06`) se eliminaron de la evidencia**: es la voz de una persona
real, ajena a la prueba (regla 90.2). Por la misma razón no se repitió la prueba con audio real. Se detuvo
con «Detener» (botón de vuelta en «Dictar», `aria-pressed="false"`) y se vació el área.

Salida literal, sin el contenido: `mediciones-chromium.json` → `tras_H3_S2_M9_politica_microphone_self`.
