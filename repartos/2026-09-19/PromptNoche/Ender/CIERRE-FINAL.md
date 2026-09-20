# Cierre del contrato — `AgendaNoticePort` (H6)

## 1. Versión final (H6.S1)

**`v1.0.0` es la versión final del turno.** Commit `01e8035b7bb8d8e31e89001a5d22517559400bc7`
en `AlovidaPromptManager` (rama `ender/contrato-agenda-notice-port`), hash de blob del contrato
`de23711979b33e813d792ea53e501c6d24496197`, hash SHA-256 del archivo del puerto que documenta
`b462700cd8f382c0c42676cd931a2281198abaf5dca614cb739a47910bfb5877` (corte
`32ae939983f0d665e4ed371362858801134d35cd` de `mantra-core-health-api`).

**Ficha completa:** ver `CONTRATO-AGENDA-NOTICE-PORT.md` (§1–§14), `GOBERNANZA-Y-COMPATIBILIDAD.md`
y `VERSION-ESTABLE.md`. Ningún campo quedó sin completar u omitido sin justificación (repetido de
H4 porque nada cambió desde entonces — verificado, no asumido: ver §2).

**Inmutabilidad de todas las versiones anteriores (H6.S1.M3):** sólo existió una versión real
(`v1.0.0`); no hay "anteriores" que comparar. La comparación relevante es que el propio `v1.0.0`
no cambió entre H1 y este cierre — verificado tres veces (H3, H4, H5) con el mismo hash de blob,
y una cuarta vez ahora:

```text
$ git rev-parse HEAD:repartos/2026-09-19/PromptNoche/Ender/CONTRATO-AGENDA-NOTICE-PORT.md
de23711979b33e813d792ea53e501c6d24496197
```

(ver `evidencia/h6-s1-inmutabilidad-final.txt`)

## 2. Pendientes, con dueño, fecha objetivo y consecuencia (H6.S2)

| `DECISION_REQUIRED` | Dueño | Fecha objetivo | Consecuencia de NO decidirlo |
|---|---|---|---|
| Q-06 — durabilidad del aviso | Negocio (Marcelo) — las dos citas (código + metaprompt, `~/Downloads/METAPROMPT_PARA_ASTRA.md` L96) ya están completas en §11 del contrato | No fijada por esta ficha (es de quien decide) | Cualquier outbox/reintento que Justin diseñe sobre este puerto queda sin saber si debe garantizar entrega o puede perder el aviso — riesgo de sobre-ingeniería (durabilidad que nadie pidió) o de pérdida silenciosa de avisos obligatorios |
| TTL/ventana de `debounceKey` | Negocio + dueño del módulo `messaging` | No fijada | Un worker que reintenta no puede razonar sobre cuánto tiempo protege el rebote; riesgo de duplicar avisos si se asume una ventana equivocada |
| Reintentabilidad de errores de `emit()` | Justin (diseño de idempotencia, citado en el handoff de H1) | No fijada | El adaptador que reemplace al actual no sabe qué fallos vale la pena reintentar automáticamente vs. cuáles son definitivos |
| Orden/cardinalidad de `emitMany` | Dueño del módulo `scheduling` | No fijada | Un futuro adaptador paralelo (ej. el de P1) podría romper correlaciones `resultados[i]`↔`notices[i]` que algún consumidor futuro asuma sin que el tipo lo prohíba |
| `tenantId` opcional (hallazgo de seguridad) | Dueño del módulo `messaging` / seguridad | No fijada | Un caller nuevo puede emitir avisos sin aislamiento de tenant explícito, sin que nada lo impida hoy |

**Ningún pendiente quedó sin dueño con nombre.** La segunda capacidad (H3.S3) **ya no figura
acá**: se cerró `DESCARTADO` para este turno por falta total de insumo (cero mecanismos del
piloto con evidencia de aislamiento — la ficha de Pablo sigue en `0/53`, sin ejecutar). No es una
decisión de negocio en suspenso; es un hito sin material sobre el cual decidir esta noche. Se
retoma, con evidencia real, cuando exista.

## 3. Riesgos residuales (H6.S3)

| Riesgo | Impacto | Mitigación | Consumidores expuestos |
|---|---|---|---|
| `skippedReason`/`emailSkippedReason`/`chatSkippedReason` son texto libre, no un catálogo cerrado | Un futuro consumidor podría empezar a comparar por contenido de string (anti-patrón ya señalado en `error-handling-contract`); hoy verificado que ninguno lo hace | Ninguna todavía — es un riesgo de diseño, no un bug activo. Mitigación futura: tipificar como catálogo de razones si algún consumidor necesita ramificar por causa | Los 9 inventariados en H1, si alguno empieza a leer esos campos |
| `tenantId` opcional sin enforcement | Aviso emitido sin aislamiento de tenant explícito | Ninguna aplicada; requiere decisión de negocio/seguridad (tabla de §2) | Cualquier consumidor nuevo que no copie el patrón de las 7 fábricas existentes (que sí lo pasan siempre, verificado en H1) |
| `emitMany` sin garantía de orden en el **contrato** (sólo en la implementación actual) | Un adaptador futuro que paralelice rompería cualquier código que asuma `resultados[i]` ↔ `notices[i]` | Ninguna aplicada; el tipo debería declararlo o los consumidores deberían dejar de asumirlo | Ninguno hoy lo asume (verificado: los 4 call-sites reales sólo cuentan o descartan, nunca indexan) — riesgo latente, no activo |
| `AgendaNoticeKind` como unión de TS y no como value set de conceptos | Si algún día se persiste (ej. en auditoría), habría que migrarlo a concepto codificado desde cero | Ninguna — está fuera de alcance mientras no se persista | Ninguno hoy — es sólo un contrato interno en memoria |
| Ausencia de `ARQUITECTURA_Y_CONTRATOS.md` en el repo | Cualquier otra ficha del equipo que lo cite (confirmado: la de Itzan lo hace 4 veces) construye sobre una plantilla que nadie puede abrir | Ninguna de mi parte — es un hallazgo transversal, no específico de mi contrato. Registrado acá para que quien mantenga el pack de skills lo sepa | Todo el equipo del reparto, no sólo consumidores de este puerto |

## 4. Búsqueda de pendientes sin dueño (kill-test del hito H6)

Repaso deliberado de las tablas de §2: las 6 filas tienen "Dueño" no vacío. **No encontré
ninguno sin dueño.**
