# Marcelo — H5: Ejecución de aceptación del registro con participantes reales disponibles

> **Rol:** cierre funcional e integración · **Línea:** B · **Fecha:** 2026-09-19 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · **Requisitos del cliente:** [`REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)
> **1 hito · 3 subtareas · 8 microtareas**, todas con criterio de aceptación y Definition of Done.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `WORKSPACE` | Checkout real de `mantra-core-health-api` y frontends |
| `TARGET_REF` | `32ae939983f0d665e4ed371362858801134d35cd` |
| `AUTHORIZED_BATCH` | Directorio de evidencia de Marcelo |
| `PREDECESOR` | H4 cerrado con recorrido multi-módulo ejercitado |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

Verificá la instalación del estándar antes de iniciar:

```bash
ls .claude/skills | wc -l        # -> 176
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

Entrá por `skills-router` y cargá las skills clave para H5:
- `uat-acceptance-signoff`
- `qa-evidence-reporting`
- `progress-reporting`
- `exploratory-testing`
- `data-privacy-phi`

## 2. Resultado observable

Al cerrar este hito, existe una **matriz de pasos del recorrido con evidencia estricta**, que especifica para cada uno si se ejercitó con participantes reales, con dobles o no se ejercitó. Los fallos críticos y bloqueantes están colocados **en la primera línea del reporte**, sin maquillajes optimistas.

**Kill-test:** leé la primera línea del reporte de aceptación. Si hay algo en rojo y la primera línea no lo dice explícitamente, el reporte está maquillado y es nulo.

## 3. Alcance

**IN:** matriz de pasos del recorrido exigido con resultado y evidencia, marcado obligatorio real vs doble vs ausente (gate C2: sin dobles ocultos), fallos críticos documentados primero, registro de decisiones de alcance y sus responsables, actualización de correspondencia con requisitos de cliente, declaración de estado de entrega y límites externos.

**OUT:** firmar aceptación del producto si falta un participante exigido, presentar un resumen optimista cuando hay algo en rojo, recortar requisitos en silencio, ocultar dobles detrás de etiquetas genéricas.

### Ambigüedades registradas

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-C1 | Seis hitos completos en una noche exceden la capacidad | Se entrega lo verificado y el resto va formalmente A MEDIAS | Coordinación |
| Q-R5 | 8 módulos del cliente frente al plazo del paquete | Se acota el dictamen al recorrido probado | Coordinación |

---

## 4. Plan de ejecución

### H5 — Ejecutar la aceptación del registro con los participantes reales disponibles
**CA:** Dada la matriz de aceptación, cuando alguien la lee, entonces sabe para cada paso si se ejercitó con participantes reales, con dobles o no se ejercitó — y los fallos críticos están en la primera línea, no al final.
**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ningún paso sin declarar real/doble. Ninguna decisión de alcance sin dueño.
**Estado:** TODO

#### H5.S1 — La ejecución
**CA:** Dados los pasos del recorrido exigido, cuando se ejecutan, entonces cada uno tiene resultado, evidencia y marca de participante; y si hay rojo, el reporte abre con eso.
**DoD:** Las 3 microtareas en `HECHO`. Gate C2: **sin dobles ocultos**. *Prohibido el resumen optimista cuando hay algo en rojo.*
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Ejecutar todos los pasos del recorrido exigido | Cada uno con resultado | Matriz paso × resultado × evidencia con código de retorno | TODO |
| H5.S1.M2 | Marcar por paso si el participante fue real, doble o ausente | Los tres estados, ninguno implícito | Columna obligatoria de la matriz (gate C2: sin dobles ocultos) | TODO |
| H5.S1.M3 | Registrar fallos críticos y ponerlos primero | El reporte abre con lo que está en rojo | Reporte de aceptación. Prohibido el resumen optimista cuando hay algo en rojo | TODO |

#### H5.S2 — El alcance, explícito
**CA:** Dado lo que no se ejecutó, cuando se cierra, entonces está listado con motivo, y toda decisión de alcance tomada tiene nombre de quién la tomó.
**DoD:** Las 3 microtareas en `HECHO`. Un cambio de alcance requiere decisión explícita, no un reporte que disimula pendientes.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Listar los recorridos exigidos que NO se ejecutaron | Cada uno con motivo fundado | Lista de recorridos no abordados en el turno | TODO |
| H5.S2.M2 | Registrar decisiones de alcance tomadas y quién las tomó | Cada una con nombre y cargo | Tabla de decisiones de alcance | TODO |
| H5.S2.M3 | Actualizar la correspondencia con REQUISITOS-CLIENTE-ALOVIDA.md | Cada ítem del cliente: cubierto, parcial o no cubierto | Tabla de requisitos actualizada con estado real | TODO |

#### H5.S3 — El dictamen preliminar
**CA:** Dado el estado del producto, cuando se lo declara, entonces es el que la evidencia sostiene, y cada proveedor externo no verificado figura como aceptación externa pendiente.
**DoD:** Las 2 microtareas en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Declarar el estado de entrega del producto | PRODUCT_ACCEPTANCE_VERIFIED solo si C está completo; si no, el estado real | Estado formal respaldado por comandos ejecutados | TODO |
| H5.S3.M2 | Declarar los límites externos | Cada proveedor externo no verificado queda como aceptación externa pendiente | Lista de dependencias no homologadas | TODO |

---

## 5. Definition of Done del hito

- [ ] Las 8 microtareas en `HECHO` o `BLOCKED`.
- [ ] Matriz de ejecución completa con enlaces a evidencias literales.
- [ ] Si hay rojos, encabezan el informe de aceptación.
- [ ] Estado del producto sustentado en evidencia, sin sobreafirmaciones.

## 6. Handoff al cerrar H5

- **A Todo el equipo:** La matriz de aceptación con los pasos en verde, dobles y rojos.
- **A Pablo:** Decisiones de alcance para reporte consolidado de turno.
- **A Justin:** Pasos fallados que requieren reejecución con adaptadores refinados.
