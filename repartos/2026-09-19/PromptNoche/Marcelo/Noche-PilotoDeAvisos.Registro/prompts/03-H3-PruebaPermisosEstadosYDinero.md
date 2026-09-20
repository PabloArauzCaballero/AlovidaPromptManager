# Marcelo — H3: Prueba de permisos, estados y dinero del recorrido

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
| `PREDECESOR` | H2 cerrado con casos formalizados |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

Verificá la instalación del estándar antes de iniciar:

```bash
ls .claude/skills | wc -l        # -> 176
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

Entrá por `skills-router` y cargá las skills clave para H3:
- `authz-access-control`
- `multi-tenancy`
- `accounting-double-entry`
- `insurance-workflows`
- `state-machines-workflows`
- `data-privacy-phi`

## 2. Resultado observable

Al cerrar este hito, el recorrido tiene demostrado que un actor de otra organización no puede leer ni escribir recursos ajenos (ADV-04), que las transiciones ilegales de estado se rechazan en el backend (no solo escondiendo botones en la UI), y que el dinero no se calcula jamás con números flotantes ni mezcla monedas.

**Kill-test:** cambiá el identificador de la URL por el de otro paciente. Si devuelve datos, todo lo demás del recorrido es irrelevante.

## 3. Alcance

**IN:** matriz de autorización negativa del recorrido, prueba ADV-04 de lectura y escritura entre tenants, transiciones de estado legales e intento de transición ilegal en backend, verificación de montos en enteros de menor unidad, moneda, precisión y redondeo, registro de porcentajes/copagos sin definir.

**OUT:** implementar los controles faltantes (se reportan formalmente), definir porcentajes de comisiones o pólizas no dadas por el cliente, usar datos reales de personas, dar por bueno un control sin salida literal de su ejecución.

### Ambigüedades registradas

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-10 | Porcentajes de comisiones o fórmulas de copago sin definir | Se registran DECISION_REQUIRED sin inventar | Negocio / Cliente |
| Q-17 | Definición exacta de aprobación parcial por canal | Se registra la duda y se aíslan los casos | Aseguradora / Negocio |

---

## 4. Plan de ejecución

### H3 — Probar permisos, estados y dinero del recorrido
**CA:** Dado un actor de otra organización, cuando intenta leer o escribir un recurso del recorrido, entonces es rechazado y **no persiste ningún efecto**; y ningún monto del recorrido se calcula con números flotantes.
**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ningún control dado por bueno sin ejercitarlo. Ningún dato personal en logs, URLs ni en esta evidencia.
**Estado:** TODO

#### H3.S1 — Permisos
**CA:** Dado un identificador de otro paciente en la URL, cuando se lo consulta, entonces no devuelve datos; y en escritura, una consulta posterior demuestra que no se escribió nada.
**DoD:** Las 3 microtareas en `HECHO`, con el código de respuesta y la consulta posterior pegados. Las celdas sin ejercitar de la matriz se marcan NOT_RUN, no se asumen.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | ADV-04: actor o recurso de otra organización intenta leer | Rechazado, y **no** persiste ningún efecto | Salida pegada con el código de respuesta (regla 90.1.3: IDOR prohibido) | TODO |
| H3.S1.M2 | ADV-04 en escritura | Rechazado, sin escritura ni aviso indebido | Salida + consulta posterior que demuestra persistencia nula | TODO |
| H3.S1.M3 | Matriz rol × recurso × acción del recorrido | Cada celda tiene resultado esperado y observado | Matriz. Celdas sin ejercitar marcadas NOT_RUN | TODO |

#### H3.S2 — Estados
**CA:** Dada una transición de estado ilegal, cuando se la intenta, entonces la rechaza el **backend**, no la UI ocultando un botón.
**DoD:** Las 2 microtareas en `HECHO`, con la salida pegada y la tabla de transiciones legales con su fuente.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Listar transiciones legales del recorrido | Tabla o diagrama con precondiciones | Tabla con su fuente en REQUISITOS-CLIENTE-ALOVIDA.md | TODO |
| H3.S2.M2 | Intentar una transición ilegal | Rechazada en backend con código 4xx | Salida pegada demostrando rechazo del servidor | TODO |

#### H3.S3 — Dinero
**CA:** Dado el camino del dinero, cuando se lo inspecciona, entonces no hay flotantes, la moneda y el redondeo están declarados, y todo porcentaje sin definir figura como `DECISION_REQUIRED`.
**DoD:** Las 3 microtareas en `HECHO`. Un porcentaje inventado acá termina en una factura real.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Verificar montos en enteros de menor unidad | No hay flotantes en el camino del dinero | Evidencia de tipo de dato (regla: nunca float para moneda) | TODO |
| H3.S3.M2 | Verificar moneda, precisión y redondeo | Declarados y consistentes | Evidencia. Prohibido sumar monedas distintas sin tasa de cambio | TODO |
| H3.S3.M3 | Registrar qué porcentaje, deducible o copago no está definido | Lista con quién lo define | Lista DECISION_REQUIRED sin completar números a ojo | TODO |

---

## 5. Definition of Done del hito

- [ ] Las 8 microtareas en `HECHO` o `BLOCKED`.
- [ ] ADV-04 ejecutado con salidas literales pegadas.
- [ ] Transición ilegal probada contra el backend real.
- [ ] Cero campos flotantes en entidades de facturación y copago.

## 6. Handoff al cerrar H3

- **A Justin:** Los negativos de autorización para incorporarlos a la relación de mensajería/agenda.
- **A Ender:** Transiciones o reglas monetarias que el contrato actual no exprese.
- **A Pablo:** Lista de controles de seguridad y multi-tenancy faltantes para su priorización.
