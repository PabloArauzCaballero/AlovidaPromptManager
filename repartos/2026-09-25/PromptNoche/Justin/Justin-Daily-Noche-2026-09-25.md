# Justin — daily de la noche del 2026-09-25

> **AVANCE COMBINADO: 0 / 109 — 0,0 %.** Sale de `microtareas HECHO / total`, sumando los dos carriles de
> abajo. `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md) — **dos paquetes esta noche**, uno por sección de este documento.

---

## Carril A — Farmacia: la tienda, el buscador y la receta al carrito

> **AVANCE: 0 / 41 — 0,0 %.**

- Carril: [`Noche-Farmacia.TiendaYReceta`](Noche-Farmacia.TiendaYReceta/BuscadorPorPrecioYDistanciaYLaRecetaAlCarrito.md) (carriles 43 y 45 del plan)
- Corte: `origin/mockup` @ `bf2c3545…` → **el tuyo (después de la Ola 0):** `________`
- Rama: `justin/farmacia-tienda-y-receta-2026-09-25` · Peldaño alcanzado (regla 30): `UNKNOWN`

### 0. Arrancás cuando la Ola 0 esté publicada — y no antes de una hora

Mirá §4-bis del Paquete 1 del daily de equipo: cuando Pablo (H2) y Marcelo (H2) estén **PUBLICADO**, fijás tu
corte desde ese `origin/mockup`. Si a la hora no llegaron, codeás contra el contrato del plan §4 con un doble
local y lo declarás (regla 65). **Tu primera entrega visible es H3.S5**: la ruta `/my-account/pharmacy`
apuntando a la tienda — Pablo la espera para borrar el hub.

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 179>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 15>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 23 skills de mi lote, empezando por `search-and-filtering`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

### 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `corepack yarn lint` | | | |
| `corepack yarn typecheck` | | | |
| `corepack yarn test --watch=false` | | | |

### 3. El servicio de búsqueda (H2) — lo que fija el spec

| Caso | Esperado | Resultado |
|---|---|---|
| «paracetamol», dos sedes 10,00 y 8,00, orden precio | 8,00 primero | |
| sin origen, orden distancia | sin reordenar, `sinOrigen = true` | |
| término de 1 letra | ninguna petición | |
| fila con precio sin `availability()` | **no existe** | |

### 4. La receta al carrito (H5) — lo que fija el spec

| Caso | Esperado | Resultado |
|---|---|---|
| receta con 3 medicamentos, 2 disponibles en la sede | 2 líneas + aviso «1 no se pudo agregar» | |
| carrito previo de otra sede | confirm; cancelar no cambia | |
| `createOrderRequest(toDraft(...))` | trae `medicationRequestId` | |

### 5. Checkpoints del turno

```text
AVANCE — tienda y receta — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

### 6. Cierre

| Hito | Microtareas HECHO / total | Estado | Peldaño |
|---|---|---|---|
| H1 | / 3 | | |
| H2 | / 6 | | |
| H3 | / 18 | | |
| H4 | / 5 | | |
| H5 | / 6 | | |
| H6 | / 3 | | |
| **Total** | **/ 41** | | |

- PRs: `________`
- `git diff --stat origin/mockup -- src/app/features/account/cotizaciones` → tiene que estar vacío: `________`
- Qué quedó `A MEDIAS` (con las cuatro respuestas): `________`
- Qué quedó corriendo y se cerró: `________`

---

## Carril B — Carga masiva: la pantalla (elegir modelo, arrastrar, validar, resumen)

> **AVANCE: 0 / 68 — 0 %.**

- Carril: [`Noche-CargaMasiva.PantallaDragAndDrop`](Noche-CargaMasiva.PantallaDragAndDrop/QueSeCargaArrastrarValidarSinGuardarVistaPreviaYResumen.md)
- Contrato: [`CONTRATO-CARGA-MASIVA.md`](../CONTRATO-CARGA-MASIVA.md) §2 (consumís), §3 (`data-testid`: los ponés vos)
- Repo: `alovida/mantra-core-health` · Ref: `origin/mockup` — **el mismo repo que el Carril A, pero en un
  worktree y rama propios** (`justin/carga-masiva-pantalla-2026-09-25`), no mezclés commits de los dos carriles
- Peldaño alcanzado (regla 30): `DISCOVERED` al repartir · se actualiza al cerrar

### 0. Tu carril destraba a Marcelo: publicá temprano

| Qué publicás | Para quién | Hito | Cuándo | Publicado (SHA + hora) |
|---|---|---|---|---|
| Doble del simulador en tres niveles (`terminology.handlers.ts`) | Marcelo (corre su E2E contra tu rama) | H2 | **hora 1,5** | |
| Pantalla con los `data-testid` de §3 | Marcelo (H3, H4.S2) | H4 | segunda mitad | |

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pendiente>

$ ls .claude/rules/[0-9]*.md | wc -l
<pendiente>

$ python .claude/hooks/plan_gate.py --self-test
<pendiente>
```

- [ ] Leí `skills-router` y las 26 skills del lote, empezando por `frontend-forms-ux`.
- [ ] Creé el `PLAN.md` antes del primer `Edit`/`Write` de código.

### 2. Avance por hito (se llena al cerrar)

| Hito | Micro | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO | Nota |
|---|---|---|---|---|---|---|
| H1 Corte, baseline, pantalla de hoy | 10 | | | | | |
| H2 Doble del simulador | 7 | | | | | |
| H3 Cliente y tipos | 7 | | | | | |
| H4 Pantalla en tres pasos | 27 | | | | | |
| H5 Prueba visual y regresión | 6 | | | | | |
| H6 API real, PR, cierre | 11 | | | | | |

### 3. Qué se cerró contra el doble (regla 65)

<todo lo verificado con `mockBackend: true`; qué se recorrió contra la API real (H6.S1) o por qué no>

### 4. Defectos que Marcelo te reportó

1. **MAYOR — Contraste insuficiente en `.carga__nota`**
   (`src/app/features/admin/terminology/version-import/version-import.css:134-138`):
   `color: var(--text-muted)` sobre fondo blanco da **4,27:1**; WCAG 2 AA exige 4,5:1 para texto
   normal de 12px. Afecta 4 párrafos: la nota de la plantilla, `importar-tope`, la nota de
   habilitación de «Importar» y `carga-sin-resultado`. Hallado con `axe-core`
   (`color-contrast`, `serious`) corriendo el spec del contrato contra tu pantalla ya integrada
   en `mockup`. Probablemente afecta a otras pantallas que usan el mismo token para texto chico
   — no es exclusivo de esta. Evidencia completa:
   `mantra-core-health/docs/trabajo/2026-09-25-marcelo-calidad/defectos.md`.
   **Estado: pendiente.**

### 5. Procesos que quedaron corriendo

<lista o «ninguno»>

---

## Cómo repartís tu noche entre los dos carriles

Los dos son del mismo repo (`mantra-core-health`) pero en **worktrees y ramas separadas** — nunca mezclés un
commit del Carril A con uno del Carril B. **No hay orden impuesto** (decisión del propietario: ambos se hacen).
El Carril A tiene una precondición externa (Ola 0 de Pablo/Marcelo, hasta una hora); mientras esperás eso podés
adelantar H1 del Carril B. Si el tiempo aprieta, decilo en este daily con qué carril priorizaste y por qué.

---

## Carril C — Encuentro clínico (Paquete 3, agregado por el propietario): C4, C6, C8

> **AVANCE DEL CARRIL C: 0 / 31.** Sale de `microtareas HECHO / total`. `A MEDIAS` cuenta como no hecha. Se suma a tus carriles A y B, no los reemplaza.

- Plan maestro del paquete: [`PLAN-MAESTRO.md`](../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) · Daily de equipo, sección «Paquete 3»: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)
- Repo: `mantra-core-health` · Ref: `origin/mockup` · Corte de referencia `bf2c3545` → **el tuyo:** (reconsultalo y anotalo por carril)
- Instalación del estándar: la misma de arriba (no la repitas; si abriste un worktree nuevo, fusioná `.claude/` sin pisar y pegá los tres números).
- Cómo entra en tu noche: C4, después C6, y C8 a la mañana cuando los demás tengan PR. Cruce con tu carril A (Farmacia) en la carpeta `account/medical-record/`: C6 no entra en `where-to-buy/**`; Farmacia no entra en `medical-record.{ts,html,css,spec.ts}`.

| Carril | Prompt | Corte propio | Rama | HECHO/total | Peldaño (regla 30) | PR | Push a `mockup` | Bloqueos / avisos |
|---|---|---|---|---|---|---|---|---|
| C4 · Reconsulta como cita real | [prompt](Noche-EncuentroClinico.C4-Reconsulta/ReconsultaComoCitaReal.md) | | `claude/clinica-c4-reconsulta` | 0/12 | | | | |
| C6 · Historia clínica del paciente con encuentros | [prompt](Noche-EncuentroClinico.C6-HistoriaPaciente/HistoriaClinicaDelPacienteConEncuentros.md) | | `claude/clinica-c6-historia-paciente` | 0/9 | | | | |
| C8 · Integración y recorrido completo (mañana) | [prompt](Noche-EncuentroClinico.C8-Integracion/IntegracionYRecorridoCompleto.md) | | `claude/clinica-c8-integracion` | 0/10 | | | | |

### Lo que publicás para otros (con SHA + hora)

(ver «Lo que destraba a otros» en la sección Paquete 3 del daily de equipo)

### Baseline del worktree de este carril

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | | | |
| `yarn typecheck` | | | |
| `yarn test --watch=false --include=<mis carpetas>` | | | |

### Doble revisión crítica de las capturas (regla 35)

(una entrada por captura Playwright: primera mirada · segunda mirada adversarial · qué se corrigió)

### Cierre

- PR: · Push a `mockup` verificado: · `REPORTE.md`: · Pendiente de backend redactado: · `// TODO C8` dejados:
