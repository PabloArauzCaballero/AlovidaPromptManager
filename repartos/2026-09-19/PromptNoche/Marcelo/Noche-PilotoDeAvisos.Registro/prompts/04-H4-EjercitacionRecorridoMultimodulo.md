# Marcelo — H4: Ejercitación del recorrido que cruza varios módulos

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
| `PREDECESOR` | H3 cerrado con controles de seguridad y dinero validados |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

Verificá la instalación del estándar antes de iniciar:

```bash
ls .claude/skills | wc -l        # -> 176
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

Entrá por `skills-router` y cargá las skills clave para H4:
- `concurrency-and-locking`
- `clinical-records`
- `audit-trail-history`
- `qa-strategy`
- `data-privacy-phi`
- `scope-discipline`

## 2. Resultado observable

Al cerrar este hito, el recorrido que cruza varios módulos se ejercitó de punta a punta, cada paso declara explícitamente si su participante fue **real o doble**, se verificó la atomicidad con ADV-08 (sin éxito parcial confirmado tras un fallo previo al commit), y las lecturas clínicas dejan rastro sin fugar PHI.

**Kill-test:** preguntá si el recorrido pasa. Si nadie puede nombrar qué participante era un doble, el resultado no significa nada.

## 3. Alcance

**IN:** ejecución del recorrido multi-módulo, declaración obligatoria de participante real vs doble por paso, prueba de atomicidad ADV-08 con consulta independiente, lista de proveedores externos pendientes, registro de pasos `NOT_RUN`, auditoría de lecturas clínicas sin contenido sensible, verificación de ausencia total de PHI en logs y URLs.

**OUT:** sustituir integración externa por fixtures sin declararlo, declarar el recorrido aprobado si falta un participante exigido, rellenar reglas desconocidas por conveniencia, ignorar fallos atómicos en rollback.

### Ambigüedades registradas

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-21 | Qué proveedor externo se puede probar dentro del plazo | Se declaran como pendientes de aceptación externa | Coordinación |
| Q-06 | Durabilidad del aviso ante caída de la transacción | Se verifica según comportamiento actual | Negocio / Arquitectura |

---

## 4. Plan de ejecución

### H4 — Ejercitar el recorrido que cruza varios módulos
**CA:** Dado el recorrido que cruza varios módulos, cuando se lo ejercita, entonces cada paso declara si su participante fue **real o doble**; y un fallo antes del commit compartido no deja éxito parcial visible desde una conexión independiente.
**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ninguna regla desconocida rellenada. Ningún dato de persona en logs, URLs ni evidencia.
**Estado:** TODO

#### H4.S1 — El recorrido de punta a punta
**CA:** Dado el recorrido completo, cuando corre, entonces cada paso tiene resultado y marca de real/doble, y ADV-08 demuestra que no queda éxito parcial confirmado.
**DoD:** Las 3 microtareas en `HECHO`, con las consultas hechas desde una **conexión independiente** pegadas. Sin la marca real/doble, el resultado es inútil.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Ejecutar recorrido completo con los participantes disponibles | Corre o se detiene en un paso identificado | Salida literal pegada paso por paso | TODO |
| H4.S1.M2 | Declarar por paso si el participante fue real o doble | Cada paso tiene su marca explícita | Tabla paso × participante × real/doble (sin dobles ocultos) | TODO |
| H4.S1.M3 | ADV-08: fallar tras escritura y antes del commit compartido | Consulta independiente no encuentra éxito parcial | Consultas pegadas desde conexión de base independiente | TODO |

#### H4.S2 — Lo que el recorrido exige y no está
**CA:** Dado lo que el recorrido exige y no está, cuando se cierra, entonces hay lista de proveedores externos pendientes y de pasos `NOT_RUN` con motivo.
**DoD:** Las 3 microtareas en `HECHO`, con la correspondencia contra el documento del cliente actualizada.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Lista de proveedores externos pendientes | Cada uno con qué acredita y qué falta | Lista formal de dependencias externas pendientes de homologación | TODO |
| H4.S2.M2 | Registrar pasos que quedaron NOT_RUN y por qué | Cada paso no corrido tiene su motivo documentado | Lista de pasos excluidos o bloqueados | TODO |
| H4.S2.M3 | Contrastar recorrido ejecutado contra REQUISITOS-CLIENTE-ALOVIDA.md | Cada paso tiene su párrafo o está marcado como no cubierto | Tabla de correspondencia actualizada | TODO |

#### H4.S3 — Rastro
**CA:** Dada una lectura de datos clínicos, cuando ocurre, entonces deja rastro auditable, y ese rastro no contiene el contenido clínico.
**DoD:** Las 2 microtareas en `HECHO`, con la consulta pegada. Regla 90.2.7: **incluidas las lecturas**.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Verificar que lecturas de datos clínicos dejan rastro auditable | El rastro existe y registra actor/recurso sin volcar contenido clínico | Consulta a tabla de auditoría pegada demostrando el registro | TODO |
| H4.S3.M2 | Verificar ausencia de datos de personas en logs y URLs del recorrido | Cero PHI en trazas, parámetros de consulta o encabezados | Evidencia de logs de la corrida (enmascarando y declarando) | TODO |

---

## 5. Definition of Done del hito

- [ ] Las 8 microtareas en `HECHO` o `BLOCKED`.
- [ ] Matriz paso a paso con clasificación estricta de participantes (real / doble / ausente).
- [ ] Prueba ADV-08 verificada con sesión independiente de base de datos.
- [ ] Auditoría de lectura de PHI validada sin filtración de contenido clínico.

## 6. Handoff al cerrar H4

- **A Justin:** Pasos del recorrido que fallaron debido a la relación o al contrato con mensajería.
- **A Ender:** Decisiones abiertas de contrato que bloquearon la secuencia de integración.
- **A Pablo:** Lista consolidada de proveedores externos pendientes para decisión de coordinación.
