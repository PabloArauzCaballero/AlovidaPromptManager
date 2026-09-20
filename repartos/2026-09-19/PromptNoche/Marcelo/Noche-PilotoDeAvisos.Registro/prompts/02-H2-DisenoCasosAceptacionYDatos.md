# Marcelo — H2: Diseño de los casos de aceptación del recorrido y sus datos

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
| `PREDECESOR` | H1 cerrado o con recorrido prioritario fijado |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

Verificá la instalación del estándar antes de iniciar:

```bash
ls .claude/skills | wc -l        # -> 176
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

Entrá por `skills-router` y cargá las skills clave para H2:
- `test-case-design-techniques`
- `synthetic-test-data-generation`
- `edge-case-data-catalog`
- `requirements-and-acceptance`
- `data-privacy-phi`
- `seed-data-catalogs`

## 2. Resultado observable

Al cerrar este hito, el recorrido elegido tiene sus casos de aceptación formalmente redactados en **dado/cuando/entonces**, con datos sintéticos sin PHI, oráculos externos identificados (nunca el propio sistema como oráculo) y la matriz de contraste contra el documento de requisitos del cliente.

**Kill-test:** tomá un caso y preguntá de dónde sale el resultado esperado. Si la respuesta es «de lo que hace el sistema», no es un caso de aceptación: es una foto del bug.

## 3. Alcance

**IN:** casos en dado/cuando/entonces del recorrido elegido, datos sintéticos con ownership coherente, oráculo por caso citando `REQUISITOS-CLIENTE-ALOVIDA.md`, casos negativos (autorización, validación, estado), registro de datos no generables (`DECISION_REQUIRED`), procedencia de catálogos oficiales, tabla de correspondencia y brechas contra requisitos del cliente.

**OUT:** implementar los casos, ejecutar código o pruebas reales, inventar fórmulas, porcentajes o reglas no provistas por el cliente, utilizar datos reales de pacientes o profesionales.

### Ambigüedades registradas

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-10 | Fórmulas, deducibles y cláusulas sin definir en el documento original | Se marcan DECISION_REQUIRED sin inventar | Negocio / Cliente |
| Q-R4 | Marcas de estado del cliente sin verificar en código | Se conservan textuales como insumo | Cliente |

---

## 4. Plan de ejecución

### H2 — Diseñar los casos de aceptación del recorrido y sus datos
**CA:** Dado cada caso de aceptación, cuando se pregunta de dónde sale su resultado esperado, entonces la respuesta es una fuente externa al sistema — nunca «lo que hace el sistema».
**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ningún caso usa el sistema como oráculo de sí mismo. Ningún dato de prueba es real.
**Estado:** TODO

#### H2.S1 — Los casos
**CA:** Dado el recorrido, cuando se escriben sus casos, entonces están en dado/cuando/entonces, incluyen los negativos, y cada uno cita la sección del documento del cliente de la que sale.
**DoD:** Las 3 microtareas en `HECHO`. Un recorrido sin casos negativos no está diseñado. Si la fuente del esperado es el propio sistema, el caso no vale.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Escribir los casos del camino feliz en dado/cuando/entonces | Cada uno es observable y no menciona implementación | Casos escritos. Cada uno cita la sección del documento del cliente de la que sale | TODO |
| H2.S1.M2 | Escribir los casos negativos | Están los de autorización, dato inválido y estado incorrecto | Casos escritos con fallos esperados explícitos | TODO |
| H2.S1.M3 | Identificar el oráculo de cada caso | Cada uno dice de dónde sale el esperado | Tabla caso → fuente del esperado (regla 00: el sistema no es su oráculo) | TODO |

#### H2.S2 — Los datos
**CA:** Dados los datos de prueba, cuando se los define, entonces son sintéticos, con ownership coherente, y todo catálogo oficial que el recorrido necesite tiene fuente, fecha y licencia o está marcado como sintético.
**DoD:** Las 3 microtareas en `HECHO`. Regla 97.6: prohibido usar datos reales de personas como datos de prueba.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Definir datos sintéticos con relaciones y ownership coherentes | Ningún dato real de persona | Definición de fixtures sintéticos respetando jerarquía organizacional | TODO |
| H2.S2.M2 | Declarar procedencia de todo catálogo que el recorrido necesite | Cada catálogo: fuente, fecha y licencia, o marcado sintético | Tabla de procedencia (SEGIP, aseguradoras, especialidades) | TODO |
| H2.S2.M3 | Registrar qué datos NO se pueden generar por falta de regla | Lista con quién define cada uno | Lista DECISION_REQUIRED sin completar porcentajes ni montos a ojo | TODO |

#### H2.S3 — Lo que no cierra
**CA:** Dado el documento del cliente, cuando se contrasta contra el recorrido elegido, entonces cada paso tiene su párrafo o está marcado como agregado, y los ítems no cubiertos están listados.
**DoD:** Las 2 microtareas en `HECHO`. Es el insumo de la conversación de alcance: evita que el piloto se lea como todo Mantra.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Contrastar el recorrido elegido contra REQUISITOS-CLIENTE-ALOVIDA.md | Cada paso del recorrido tiene su párrafo en el documento del cliente, o está marcado como agregado | Tabla de correspondencia biunívoca | TODO |
| H2.S3.M2 | Registrar los ítems del cliente que el recorrido NO cubre | Lista completa de brechas | Lista de ítems no cubiertos para ajuste de alcance | TODO |

---

## 5. Definition of Done del hito

- [ ] Las 8 microtareas en `HECHO` o `BLOCKED`.
- [ ] Oráculos identificados formalmente sin autoreferencia.
- [ ] Cero PHI y datos sintéticos estructurados.
- [ ] Tabla de brechas contra requisitos del cliente completada.

## 6. Handoff al cerrar H2

- **A Justin:** Casos negativos de autorización para incorporarlos a su matriz de dobles e integración.
- **A Ender:** Qué reglas del recorrido el contrato de avisos todavía no contempla.
- **A Pablo:** Qué datos de prueba sintéticos necesita el laboratorio para ejercitar los casos.
