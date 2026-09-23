# Reporte — Cierre de verificación remota de Cotizaciones

- Fecha: 2026-09-23 · Plan: [PLAN.md](./PLAN.md) · Rama: `justin/cerrar-validacion-coolify-cotizaciones-2026-09-23`.
- Peldaño de evidencia alcanzado: `VERIFIED contra el doble`: el despliegue remoto y el recorrido de navegador fueron observados sobre el backend simulado del mockup. No es una verificación de API real ni una regresión completa.
- Avance de este cierre: **4 / 4 — 100 %**. El avance publicado del carril original se conserva en **29 / 51 — 56.9 %**.

## Completado

| ID | Qué se logró | Evidencia | Resultado |
|---|---|---|---|
| H1.S1.M1 | Trazar el despliegue remoto que contiene los merges de Cotizaciones | [coolify-despliegue-2026-09-23.txt](evidencia/coolify-despliegue-2026-09-23.txt) | Coolify reportó `Success` para `fc8adc4e491f2cca9c159ba1ce74cb214d4359dd`; ese commit incluye como padre `5dc38c9`, merge de [#583](https://github.com/mdavila-2001/mantra-core-health/pull/583), y conserva el merge `66bbcb76` de [#581](https://github.com/mdavila-2001/mantra-core-health/pull/581). |
| H1.S1.M2 | Ejecutar Cotizaciones en el mockup público | [e2e-remoto-cotizaciones.txt](evidencia/e2e-remoto-cotizaciones.txt) | `1 passed (29.2s)` en Chromium; el escenario comprueba la ruta sin cargar ni mostrar documentos personales. |
| H2.S1.M1 | Rectificar el daily personal | `rg -n 'fc8adc4|29 / 51' repartos/2026-09-22/PromptNoche/Justin/Justin-Daily-Noche-2026-09-22.md` | Registra la validación remota sin modificar el avance publicado. |
| H2.S1.M2 | Rectificar el daily de equipo | `rg -n 'fc8adc4|Mockup observado anterior a #579' repartos/2026-09-22/PromptNoche/Daily-Noche-2026-09-22.md` | Sustituye el bloqueo remoto obsoleto por su evidencia y preserva los pendientes reales. |

## A medias

Ninguna dentro de este cierre documental. El carril original no queda cerrado por esta prueba remota puntual.

## Pendiente

| Pendiente del carril original | Estado | Qué lo destraba |
|---|---|---|
| Medición antes/después del directorio y reserva | `A MEDIAS` | Línea base histórica comparable, recorrido instrumentado y resultado repetido. |
| Precios, procedencia y acción de negocio para Cotizaciones (Q-16) | `DECISION_REQUIRED` | Fuente y decisión explícita de Negocio; no se inventa precio ni procedencia. |
| Capturas por tema/viewport, barridos y gates del carril | `A MEDIAS` | Ejecutar los DoD originales y adjuntar su evidencia. |
| Suite/lint global | `A MEDIAS` | Triage de rojos preexistentes y ejecución que separe los nuevos de los heredados. |

## Evidencia

```text
$ gh pr view 583 -R mdavila-2001/mantra-core-health --json number,state,mergedAt,mergeCommit,headRefName,baseRefName,title,url
{"baseRefName":"mockup","headRefName":"justin/verificar-cotizaciones-navegador-2026-09-23","mergeCommit":{"oid":"5dc38c907828346d05eec936dbbf94f8d0d06263"},"mergedAt":"2026-09-23T20:05:13Z","number":583,"state":"MERGED","title":"test: verificar Cotizaciones del paciente en navegador","url":"https://github.com/mdavila-2001/mantra-core-health/pull/583"}

$ gh pr view 584 -R mdavila-2001/mantra-core-health --json number,state,mergedAt,mergeCommit,headRefName,baseRefName,title,url
{"baseRefName":"mockup","headRefName":"ender/simulador-cabecera-2026-09-22","mergeCommit":{"oid":"fc8adc4e491f2cca9c159ba1ce74cb214d4359dd"},"mergedAt":"2026-09-23T20:33:10Z","number":584,"state":"MERGED","title":"Ender: latencia fija, agenda para los registrados, Chats y Tutoriales en la cabecera","url":"https://github.com/mdavila-2001/mantra-core-health/pull/584"}
```

La observación de Coolify y la salida completa de Playwright están en los archivos de evidencia enlazados arriba. No contienen datos clínicos reales.

## No cubierto

- No se probó la API real: el mockup usa su backend simulado.
- No se ejecutó una matriz visual completa de tema y viewport.
- No se generó una medición histórica antes/después ni se ejecutaron los gates completos del carril original.
- `demo.alovidasalud.com` no se usó: Coolify indica DNS no coincidente y su arreglo se pospuso por decisión de Justin.

## Desvíos del plan

Ninguno. El registro sustituye la investigación por SSH prevista anteriormente porque Coolify ofreció un estado terminal, el SHA exacto y un dominio público con DNS coincidente.

## Riesgos residuales

- Un despliegue exitoso de una versión posterior no convierte esta prueba en integración con servicios reales.
- La cobertura es un escenario focalizado de Cotizaciones; no representa una suite de regresión total.
- El dominio de demostración sigue fuera del flujo hasta que se decida corregir sus registros DNS.

## Decisiones y ambigüedades

- Se conserva `29 / 51`: el E2E remoto cierra una verificación pendiente, pero no sustituye los DoD que aún requieren línea base, datos de negocio, capturas/barridos o gates globales.
- Se usa `sslip.io` porque es el único dominio de esta aplicación que Coolify muestra con DNS coincidente.
- El PR de PromptManager se abrirá hacia `main`; no se fusiona automáticamente.
