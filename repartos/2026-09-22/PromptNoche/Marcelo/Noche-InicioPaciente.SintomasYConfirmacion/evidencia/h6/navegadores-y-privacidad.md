# H6.S1.M3 — navegadores probados y privacidad del dictado

## Navegadores

| Navegador | Versión | Qué se probó |
|---|---|---|
| Chromium (Playwright MCP) | Chrome/153.0.0.0 | Silueta (teclado completo), panel de texto, dictado (ciclo completo con permiso, `microphone=(self)`), confirmación D-08, capturas por viewport/tema |
| Firefox (Playwright `firefox-1538`) | 153.0 | Dictado (sin `SpeechRecognition`/`webkitSpeechRecognition` → sin botón, área de texto sigue), confirmación D-08 (apilamiento y foco) |

## Nada de lo dictado se registra

```text
$ git grep -n 'console\.' -- src/app/features/symptom-check
(sin salida)
```

Verificado en `evidencia/h3/dod-h3s2.txt`. `Dictado` (`dictado.ts`) no llama a ningún cliente HTTP
propio ni a ningún servicio de terceros: la transcripción la hace el reconocedor del navegador
(`SpeechRecognition`/`webkitSpeechRecognition`) y el resultado sólo se entrega al callback que le
pasa `symptom-check.ts`. El único dato que salió del navegador durante las pruebas fue una frase de
audio ambiente captada sin querer al abrir el micrófono con la política ya en `microphone=(self)`
(ver `evidencia/h3/dictado/LEEME.md`, sección «Después de H3.S2.M9»); esa frase se excluyó de la
evidencia y se borró la captura que la mostraba, por ser la voz de una persona real ajena a la
prueba (regla 90.2).
