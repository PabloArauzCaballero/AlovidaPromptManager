# Daily de Ender — turno noche — 2026-09-19

> **Estado:** `CERRADO CON H1 A MEDIAS` — completado el **2026-09-20** (el turno se ejecutó al día
> siguiente del reparto; ver Q-01). **Sólo se abrió H1.** H2–H6 quedan en `TODO`.

- **Persona:** Ender · **Turno:** noche · **Fecha:** 2026-09-19 · **Línea:** A · **Rol:** propietario de contrato
- **Tu prompt:** [El contrato del piloto: fijarlo, validarlo y gobernar su evolución](Noche-PilotoDeAvisos.Contrato/ContratoValidadorYCompatibilidad.md)
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)
- **6 hitos · 18 subtareas · 50 microtareas**

## 1. Instalación del estándar — es lo primero, no lo último

- [x] `ls .claude/skills | wc -l` → **176**, salida pegada acá abajo.
- [x] `python .claude/hooks/plan_gate.py --self-test` → **11 PASS, 0 FAIL**, salida pegada.
- [x] Cargaste `skills-router` y las skills de la sección 1 de tu prompt.
- [x] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

```text
$ ls .claude/skills | wc -l
176

$ ls .claude/rules/*.md | wc -l
15        # el prompt esperaba 14: el estándar publicado trae 15. Diferencia registrada, no corregida.

$ python .claude/hooks/plan_gate.py --self-test | tail -1
plan_gate self-test: 11 PASS, 0 FAIL

$ git status --porcelain        # en el checkout de mantra-core-health-api
                                # (vacío: el estándar no ensucia el árbol de producto)
```

**Instalación local y no versionada.** `.claude/` está ignorado por el `.gitignore` del repo de producto
(`/.claude/*` con `!settings.json`), así que no aparece en el diff; se preservó el `settings.json`
versionado. **No se copiaron `AGENTS.md` ni `.agents/`**, que **no** están ignorados y sí ensuciarían el
árbol. `PLAN.md` y `REPORTE.md` viven en el vault de evidencia, por la misma razón.

**Sin estas cuatro casillas, tu turno arranca en `BLOQUEADO`, no en `EN CURSO`.**

## 2. Avance por hito

**12 / 50 microtareas en `HECHO`** (todas de H1). Se calcula, no se estima. Las `A MEDIAS` cuentan como **no hechas**.

| Hito | Prioridad | Microtareas | HECHO | Estado |
|---|---|---:|---:|---|
| **H1** — Fijar el contrato real del puerto de avisos de agenda | `BLOQUEANTE` | 14 | **12** | **`A MEDIAS`** |
| **H2** — Convertir el contrato en un validador que rechaza lo que debe rechazar | `ALTA` | 8 | 0 | `TODO` |
| **H3** — Gobernar la evolución del contrato sin romper a quien lo consume | `MEDIA` | 7 | 0 | `TODO` |
| **H4** — Congelar la versión estable del contrato y su matriz de consumidores | `MEDIA` | 7 | 0 | `TODO` |
| **H5** — Probar que una versión incompatible rompe donde debe y que lo histórico no se toca | `ALTA` | 7 | 0 | `TODO` |
| **H6** — Cerrar el contrato y dejar sus pendientes con dueño | `ALTA` | 7 | 0 | `TODO` |
| **TOTAL** | | **50** | **12** | |

> Seis hitos no entran en una noche, y está dicho en tu prompt. **Lo que no cierres va `A MEDIAS`
> con qué anda, qué no anda y qué falta exactamente.** Disfrazarlo de `HECHO` es lo único prohibido.

## 3. Detalle de las microtareas que tocaste

*(Una fila por microtarea abierta. Las que no abriste quedan en `TODO` y no hace falta listarlas.)*

**Corte declarado:** `H1_CUT_SHA = 33f17785caa0306a4f3024c2a1ecc07181c001fa`. Se reconsultó `origin/dev`
con `git fetch` y **no había avanzado**; el `TARGET_REF` del prompt (`32ae939…`) es ancestro y queda sólo
como referencia histórica.

**Artefacto publicado:** `evidence/avisos-contrato-h1/CONTRATO-AgendaNoticePort-33f17785.md` en el vault
operativo de Ender (`mantra-waairren-ender`), junto al snapshot del archivo, la evidencia literal de los
comandos, el `PLAN.md` y el `REPORTE.md`. **Citable por versión**, no por rama:

- `PORT_SHA256 = b462700cd8f382c0c42676cd931a2281198abaf5dca614cb739a47910bfb5877`
- sha1 del blob (identidad git) = `4e262747735005c16262a907de3caf09a1268923`
- 133 líneas · 5966 bytes · `RESULT_FIELDS = 8`

| ID | Estado | Comando ejecutado | Exit code | Ruta de la evidencia |
|---|---|---|---|---|
| H1.S1.M1 | `HECHO` | `git rev-parse 33f17785:src/modules/scheduling/ports/agenda-notice.port.ts` + `git show … \| sha256sum` | 0 | `evidence/avisos-contrato-h1/evidencia-h1.txt` |
| H1.S1.M2 | `HECHO` | `git show 33f17785:…/agenda-notice.port.ts` | 0 | `…/agenda-notice.port.ts.snapshot` · firmas literales en §2 del artefacto |
| H1.S1.M3 | `HECHO` | `git show … \| grep -niE 'version\|@since'` | 1 (sin coincidencias, esperado) | §1 del artefacto: **el archivo no declara versión**; la identidad es **asignada** (`AgendaNoticePort@33f17785`). No se numeró `v1.0.0` porque **Q-05 sigue abierta** |
| H1.S1.M4 | `HECHO` | `git grep -ln AGENDA_NOTICE_PORT 33f17785 -- src test` | 0 | §9: **7** archivos de producción con el token, **5** artefactos de prueba con el tipo, **1** mención sin dependencia |
| H1.S2.M1 | `HECHO` | lectura del archivo en el corte | — | §3: los **8** campos, uno por uno |
| H1.S2.M2 | `HECHO` | ídem | — | §3: `delivered` es **sólo in-app** y **no prueba correo entregado**; el archivo remite a `emailRequestId` |
| H1.S2.M3 | `HECHO` | ídem | — | §4: cita literal + especificación del validador. **La forma del error queda `DECISION_REQUIRED`** |
| H1.S2.M4 | `HECHO` | ídem | — | §5: aislamiento de fallos **definido**; **orden, cardinalidad y error por elemento: `DECISION_REQUIRED`** |
| H1.S2.M5 | `HECHO` | ídem | — | §6: qué dice y qué no. **Sin inventar ventana ni TTL** |
| H1.S2.M6 | `HECHO` | ídem | — | §7: **hallazgo `SEC-PORT-1`** — `tenantId` es **opcional** en un puerto cuya bandeja separa por organización; el puerto **no transporta autorización** |
| H1.S2.M7 | `HECHO` | ídem | — | §8: forma de cada error declarada; **la reintentabilidad no se clasifica: `DECISION_REQUIRED`** |
| H1.S3.M1 | **`BLOCKED`** | búsqueda de `METAPROMPT_PARA_ASTRA(1).md` en el estándar y en los checkouts | — | **Fuente no accesible.** Pablo ya lo registró como límite de acceso en `…/Pablo/Noche-PilotoDeAvisos.Backend/evidencia/H1.S3.M4b_metaprompt-no-localizado.txt`. La cita del puerto sí está (§8); **Q-06 queda registrada y sin resolver** |
| H1.S3.M2 | `HECHO` | lectura del archivo | — | §8 (efectos posteriores) y §9 (compatibilidad: lectura, escritura y significado) |
| H1.S3.M3 | `HECHO` | publicación del artefacto + este aviso en el daily | 0 | Artefacto en el vault (arriba) y esta entrada. PR de este daily en `AlovidaPromptManager` |

> Una fila `HECHO` con la columna de comando vacía **no vale**. `command` y `exit_code` son `null`
> sólo cuando no hubo ejecución, y la causa va escrita en la columna de evidencia.

## 4. Qué entregás vos

| Al cerrar | A quién | Qué exactamente | Entregado |
|---|---|---|---|
| **H1** | Itzan | **Contrato congelado** `AgendaNoticePort@33f17785` · `PORT_SHA256 = b462700c…5877` · ficha de Autorización (§7) con el hallazgo `SEC-PORT-1`. **Fijar la versión, no la rama.** Matriz de consumidores en §9. **Ojo: lo que parece garantía suele ser comentario** — el tipo sólo obliga `delivered` y `kind` | **`SÍ`** |
| **H1** | Justin | **Semántica de los 8 campos** (§3) · la regla «**exactamente uno**» de `recipient` es **comentario, no garantía del tipo**: ambos campos son opcionales y el compilador acepta los dos vacíos o los dos llenos · **el error ante un `recipient` inválido sigue `DECISION_REQUIRED`** (lanzar contradice el «no lanza»; devolver `skippedReason` lo vuelve indistinguible de un fallo real). **Tu doble no debe inventar esa semántica** | **`SÍ`** |
| **H1** | Pablo | **Q-06 (durabilidad) sigue `DECISION_REQUIRED`**, sin elegir lado · **discrepancia registrada**: `PILOTO_MANTRA.md` paso 2 lista **6** campos y el archivo real tiene **8** (omite `skippedReason` y `chatSkippedReason`) — **gana el archivo** · **fuente inaccesible**: `METAPROMPT_PARA_ASTRA(1).md` no se pudo abrir y **bloquea H1.S3.M1** | **`SÍ`** |
| **H2** | Justin | El validador: su doble tiene que pasarlo | `NO` |
| **H2** | Pablo | Qué comprueba el validador dentro del harness | `NO` |
| **H2** | Itzan | Si el contrato cambió de hash desde ayer | `NO` |
| **H3** | Justin | La matriz: es la que dice contra qué versiones probar | `NO` |
| **H3** | Pablo | Qué contrato necesita la segunda capacidad | `NO` |
| **H3** | Itzan | Si el artefacto empaquetado referencia una versión que va a cambiar | `NO` |
| **H4** | Todo el equipo | La versión estable a consumir | `NO` |
| **H4** | Marcelo | Qué decisiones de negocio siguen abiertas y bloquean la aceptación | `NO` |
| **H4** | Justin | Contra qué versiones probar | `NO` |
| **H5** | Marcelo | Qué decisión abierta impide firmar la aceptación | `NO` |
| **H5** | Justin | Contra qué versión corre el candidato compuesto | `NO` |
| **H5** | Itzan | Si hay que reempaquetar por un cambio de contrato | `NO` |
| **H6** | Marcelo | Los pendientes que condicionan el dictamen | `NO` |
| **H6** | Todo el equipo | La versión final del contrato | `NO` |

## 5. Bloqueos

| Qué bloquea | Qué intentaste | Qué lo destraba | De quién depende |
|---|---|---|---|
| **H1.S3.M1** — pide citar **literal** el metaprompt junto al comentario del puerto | Búsqueda de `METAPROMPT_PARA_ASTRA(1).md` en el estándar y en los checkouts locales: no aparece. Pablo ya lo había registrado como límite de acceso | Que alguien publique el archivo o confirme su contenido. **No se afirma lo que no se pudo abrir** | Quien encargó el paquete / **Pablo** |
| Validador de H2: qué error devuelve un `recipient` inválido | Se especificó el validador (§4) sin implementarlo | Decidir entre lanzar —contra el «no lanza» del puerto— o un resultado distinguible de un fallo operacional | **El equipo** |

**Un bloqueo se reporta apenas aparece, no al final.** Si se confirma, no iteres: registrá la causa
y pasá a la siguiente microtarea independiente.

## 6. Ambigüedades que encontraste

*(Se registran, no se resuelven. Una ambigüedad resuelta por conveniencia es una decisión de
negocio tomada por quien no podía tomarla.)*

| ID | Qué | Supuesto que tomaste | A quién confirmárselo |
|---|---|---|---|
| **Q-06** | Durabilidad del aviso | **Ninguno.** Las dos posturas quedan citadas y enfrentadas, sin elegir | Negocio / Pablo |
| **Q-12** | Idempotencia sin definir | Ninguno | Negocio |
| **Q-13** | Reintentos, fallos terminales y agotamiento | Ninguno. Por eso la reintentabilidad de los errores queda sin clasificar (§8) | Negocio |
| **Q-05** | Convención de versionado | Ninguno: la identidad va por **commit + hash**, no por `v1.0.0` | El equipo |
| **Q-24** | Coordinación de despliegue con el frontend | Ninguno | Coordinación |
| **Q-01** | El paquete se fecha el 20/09 y el turno era del 19/09 | El turno se ejecutó el **20/09** y así se declara | Quien encargó el paquete |
| `emitMany` | Orden, cardinalidad y error por elemento | Ninguno: el archivo no los define y **no se asume** que la salida siga al orden de entrada | El equipo |
| `debounceKey` | Qué significa «mientras el primero siga vivo» | Ninguno. **No se inventó ventana ni TTL** | El equipo / negocio |
| **`SEC-PORT-1`** | `tenantId` **opcional** en un puerto cuya bandeja separa por organización | Ninguno: se registra como hallazgo de seguridad, no se corrige | Seguridad + negocio |

## 7. Antes de cerrar

- [x] Ninguna microtarea quedó en `EN CURSO`: todas en `HECHO`, `BLOCKED`, `A MEDIAS` o `TODO`.
- [x] Ningún `PASS` sin comando y exit code pegados.
- [x] Cada hito y cada subtarea que tocaste tienen su **Estado** actualizado, no sólo las microtareas.
- [x] *¿Algún éxito declarado depende de algo que no ejecutaste?* — **No.** Lo que no se pudo ejecutar está en `BLOCKED`, con su causa.
- [x] Si editaste después de verificar, **esa área volvió a `WRITTEN`** y la reverificaste. — No se editó código: **H1 es documental** y `PRODUCT_FILES_CHANGED = 0`.
- [x] Ninguna salida pegada contiene datos reales de pacientes. Si los tenía: enmascarada **y aclarado**.
- [ ] Tu fila del [daily del equipo](../Daily-Noche-2026-09-19.md) está actualizada. — **pendiente**: este PR sólo toca el daily propio.
