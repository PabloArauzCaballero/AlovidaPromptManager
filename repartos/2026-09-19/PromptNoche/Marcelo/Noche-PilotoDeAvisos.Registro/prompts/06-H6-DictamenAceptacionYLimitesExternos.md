# Marcelo — H6: Emisión del dictamen de aceptación con sus límites externos

> **Rol:** cierre funcional e integración · **Línea:** B · **Fecha:** 2026-09-19 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · **Requisitos del cliente:** [`REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)
> **1 hito · 3 subtareas · 9 microtareas**, todas con criterio de aceptación y Definition of Done.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `WORKSPACE` | Checkout real de `mantra-core-health-api` y frontends |
| `TARGET_REF` | `32ae939983f0d665e4ed371362858801134d35cd` |
| `AUTHORIZED_BATCH` | Directorio de evidencia de Marcelo |
| `PREDECESOR` | H5 cerrado con matriz de aceptación preliminar |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

Verificá la instalación del estándar antes de iniciar:

```bash
ls .claude/skills | wc -l        # -> 176
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

Entrá por `skills-router` y cargá las skills clave para H6:
- `work-report-md`
- `uat-acceptance-signoff`
- `finish-your-turn`
- `evidence-and-verification`
- `rationalization-guard`

## 2. Resultado observable

Al cerrar este hito, existe un **dictamen de cierre transparente y no eufemístico** que le permite a cualquiera que no vio la sesión saber con precisión qué funciona con comandos y salidas verificadas, qué quedó a medias con sus cuatro respuestas obligatorias, qué quedó pendiente, y cuáles son los límites externos y riesgos residuales.

**Kill-test:** dale el dictamen a alguien que no participó del turno. Si después de leerlo no sabe con certeza qué puede usar en producción y qué no, el dictamen es inválido.

## 3. Alcance

**IN:** dictamen formal con completado / a medias / pendiente, respuestas a las 4 preguntas obligatorias para cada ítem a medias, consolidación de la sección «No cubierto» arriba en el documento, proveedores externos no verificados como pendientes, avance calculado por fórmula matemática (`HECHO / 54`), riesgos residuales categorizados.

**OUT:** firmar `PRODUCT_ACCEPTANCE_VERIFIED` si falta alcance exigido, enterrar limitaciones técnicas en notas al pie o reportes anidados, utilizar estimaciones de porcentaje a ojo, borrar u omitir microtareas que no se alcanzaron a realizar.

### Ambigüedades registradas

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-C1 | Seis bloques en una noche | Se reporta avance matemático estricto sin maquillar | Coordinación |
| Q-04 | Registro original como documento físico | Se cita la evidencia alcanzada frente a REQUISITOS-CLIENTE-ALOVIDA.md | Quien encargó el paquete |

---

## 4. Plan de ejecución

### H6 — Emitir el dictamen de aceptación con sus límites externos
**CA:** Dado el dictamen, cuando lo lee alguien que no vio la semana, entonces sabe qué puede usar, qué no, y de quién depende lo que falta.
**DoD:** Las 9 microtareas en `HECHO` o `BLOCKED`. Ningún ítem aprobado sin salida literal. Ningún ítem a medias sin las cuatro respuestas. El porcentaje sale de la fórmula.
**Estado:** TODO

#### H6.S1 — El dictamen
**CA:** Dado el trabajo de la semana, cuando se escribe el dictamen, entonces lo aprobado lleva comando y salida, lo a medias lleva las cuatro respuestas, y lo pendiente dice qué lo destraba.
**DoD:** Las 3 microtareas en `HECHO`. Si no podés pegar la salida, no va en aprobado. «Casi listo» está prohibido.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Escribir qué quedó aprobado, con su evidencia | Cada ítem con comando y salida literal | Tabla de aprobados con DoD ejecutado pegado | TODO |
| H6.S1.M2 | Escribir qué quedó a medias, con las cuatro respuestas | Qué anda, qué no anda, qué falta exactamente, dónde quedó | Bloque formal por cada microtarea no cerrada (regla 40) | TODO |
| H6.S1.M3 | Escribir qué quedó pendiente o bloqueado | Cada uno con qué lo destraba y de quién depende | Tabla de pendientes y bloqueos | TODO |

#### H6.S2 — Los límites
**CA:** Dado cualquier reporte anidado, cuando se consolida, entonces su sección «No cubierto» aparece **arriba**, en el dictamen.
**DoD:** Las 3 microtareas en `HECHO`. Regla 40.7: prohibido que una limitación quede enterrada en un reporte anidado.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Declarar cada proveedor externo no verificado | Cada uno como aceptación externa pendiente | Lista consolidada de dependencias no homologadas | TODO |
| H6.S2.M2 | Consolidar el «No cubierto» de todos los reportes anidados | Nada queda enterrado abajo | Sección consolidada destacada al inicio (regla 40.7) | TODO |
| H6.S2.M3 | Declarar el estado de entrega del producto | El que la evidencia literal sostiene | Veredicto formal emitido con peldaño de evidencia | TODO |

#### H6.S3 — Honestidad del cierre
**CA:** Dado el cierre, cuando se informa el avance, entonces sale de `HECHO / total`, los fallos críticos abren el documento, y los riesgos residuales están listados con su impacto.
**DoD:** Las 3 microtareas en `HECHO`. **Ningún porcentaje a ojo.**
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Calcular el avance como `HECHO / total` | El número sale de la fórmula matemática | Cálculo explícito pegado (ej. 14 / 54 = 25.9%) | TODO |
| H6.S3.M2 | Poner los fallos críticos en la primera línea | Si hay rojo, abre el documento | Cabecera del dictamen con alertas destacadas | TODO |
| H6.S3.M3 | Listar los riesgos residuales con su impacto | Cada riesgo con impacto y mitigación | Tabla de riesgos residuales | TODO |

---

## 5. Definition of Done del hito

- [ ] Las 9 microtareas en `HECHO` o `BLOCKED`.
- [ ] Completado, A Medias (4 respuestas obligatorias) y Pendiente documentados.
- [ ] Porcentaje de avance calculado exactamente con fórmula matemática.
- [ ] Riesgos residuales y límites externos claramente visibles sin eufemismos.

## 6. Handoff al cerrar H6

- **A Todo el equipo:** Dictamen final de aceptación con lo verificado y lo pendiente.
- **A Pablo:** Decisiones de alcance consolidadas para el cierre general.
- **A Quien encargó el paquete:** Lista de pendientes de negocio y definiciones regulatorias que solo negocio puede destrabar.
