# Itzan — daily de la noche del 2026-09-25

> **AVANCE COMBINADO: 0 / 154 — 0,0 %.** Sale de `microtareas HECHO / total`, sumando los dos carriles de
> abajo. `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md) — **dos paquetes esta noche**, uno por sección de este documento.

---

## Carril A — Farmacia: la página de cada farmacia y los tres recorridos de punta a punta

> **AVANCE: 0 / 45 — 0,0 %.**

- Carril: [`Noche-Farmacia.PaginaDeFarmaciaYQA`](Noche-Farmacia.PaginaDeFarmaciaYQA/CatalogoConPrecioRealYRecorridosDePuntaAPunta.md) (carriles 44 y 48 del plan)
- Corte: `origin/mockup` @ `bf2c3545…` → **el tuyo (después de la Ola 0):** `________`
- Ramas: `itzan/farmacia-pagina-de-tienda-2026-09-25` (H2–H4) · `itzan/farmacia-qa-e2e-2026-09-25` (H5–H6) · Peldaño alcanzado (regla 30): `UNKNOWN`

### 0. Dos mitades separadas por el reloj

Primera mitad (H2–H4): la página de farmacia, reciclando `pharmacy-hub/pharmacy-shop/` **sin borrarlo**. Arrancás
cuando la Ola 0 esté **PUBLICADO** (§4-bis del Paquete 1 del daily de equipo); si a la hora no llegó,
`HttpTestingController` con las formas del plan §4.4 y lo declarás. **Publicá H4 apenas esté**: Pablo borra el hub con eso.

Segunda mitad (H5–H6): recién cuando Pablo, Justin y Marcelo estén mergeados. Hasta entonces H5 y H6 son `TODO`
con la precondición escrita — nunca `BLOQUEADO` — y preparás los specs contra los testids congelados (§4.5).

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 179>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 15>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 24 skills de mi lote, empezando por `frontend-ux-states`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

### 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `corepack yarn lint` | | | |
| `corepack yarn typecheck` | | | |
| `corepack yarn test --watch=false` | | | |
| e2e existentes de farmacia (3 specs, `--workers=1`) | | | |

### 3. El precio de la tienda es el de la sede (H3.S1)

| Producto | `curl …/pharmacy/sites/<siteId>/prices` | En pantalla | Igual |
|---|---|---|---|
| | | | |

### 4. Los tres recorridos (H5) — resultado y clasificación de cada fallo

| Spec | Verde / rojo | Fallo (si hay) | Clase | Dueño |
|---|---|---|---|---|
| `pharmacy-store.spec.ts` | | | | |
| `pharmacy-cart.spec.ts` | | | | |
| `pharmacy-prescription-to-cart.spec.ts` | | | | |

### 5. Regla visual (H6.S1) — números, no impresiones

| Ruta | Viewport | Fondo | Centrado (px) | Ancho (%) | Scroll X | Consola | PASS |
|---|---|---|---|---|---|---|---|
| `/my-account/pharmacy` | 375 / 768 / 1440 / 1440 oscuro | | | | | | |
| `/my-account/pharmacy/stores/<id>` | idem | | | | | | |
| `/my-account/pharmacy/cart` | idem | | | | | | |
| `/my-account/pharmacy/prescriptions` | idem | | | | | | |

### 6. Checkpoints del turno

```text
AVANCE — página de farmacia y QA — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

### 7. Cierre — y el veredicto del producto entero (H6.S2.M4)

| Hito | Microtareas HECHO / total | Estado | Peldaño |
|---|---|---|---|
| H1 | / 4 | | |
| H2 | / 4 | | |
| H3 | / 13 | | |
| H4 | / 3 | | |
| H5 | / 12 | | |
| H6 | / 9 | | |
| **Total** | **/ 45** | | |

| Requisito | Hecho / a medias / no hecho | Evidencia |
|---|---|---|
| R1 tienda sin pestañas | | |
| R2 ícono del carrito | | |
| R3 carrito por farmacia con conflicto | | |
| R4 buscador precio + distancia, dos modos | | |
| R5 Lugares cercanos fuera; Cotizaciones intacta | | |
| R6 receta completa al carrito | | |
| R7 botón de receta junto al buscador | | |

- PRs: `________`
- Qué quedó `A MEDIAS` (con las cuatro respuestas): `________`
- Qué quedó corriendo y se cerró (el `yarn start` de los e2e incluido): `________`

---

## Carril B — Carga masiva: motor + parseo (contrato, detector, CSV, perfiles)

> **AVANCE: 0 / 109 — 0 %.**

- Carril: [`Noche-CargaMasiva.MotorDryRunIdempotencia`](Noche-CargaMasiva.MotorDryRunIdempotencia/ServicioEnsanchadoDryRunTodoONadaIdempotenciaAutorizacionYPlantilla.md)
- Contrato: [`CONTRATO-CARGA-MASIVA.md`](../CONTRATO-CARGA-MASIVA.md) §1 (copiás los tipos), §2 (lo implementás)
- Repo: `alovida/mantra-core-health-api` · Ref: `origin/dev` (**otro repo, otro checkout** que el Carril A) · Corte: se fija en H1.S1.M1 · Rama: `itzan/carga-masiva-motor-2026-09-25`
- Peldaño alcanzado (regla 30): `DISCOVERED` al repartir · se actualiza al cerrar

### 0. Lo que otros leen de tu daily

| Qué avisás | Para quién | Cuándo |
|---|---|---|
| `row-contract.ts` pusheado (SHA + hora) | Marcelo (parseador XLSX), Pablo | **hora 1** |
| `index.ts` con `[ndjson, csv]`, detector y perfiles | Pablo (cablea XLSX) | al cerrar H2 |
| Qué devuelve `skipped` hoy y si hoy inserta las válidas con errores parciales (H1.S2.M6/M7) | Pablo (Q-2, Q-7) | al cerrar H1 |
| HTTP del dry-run: 200 o 201 (H3.S3.M3) | Justin (su cliente acepta ambos, pero lo necesita saber) | al cerrar H3.S3 |
| Rama pusheada y arrancable | Justin (H6.S1), Marcelo (H5.S2, H6.S1), Pablo | apenas H3 esté verde |

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pendiente>

$ ls .claude/rules/[0-9]*.md | wc -l
<pendiente>

$ python .claude/hooks/plan_gate.py --self-test
<pendiente>
```

- [ ] Leí `skills-router` y las 28 skills del lote, empezando por `seed-data-catalogs`.
- [ ] Creé el `PLAN.md` antes del primer `Edit`/`Write` de código.

### 2. Avance por hito (se llena al cerrar)

| Hito | Micro | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO | Nota |
|---|---|---|---|---|---|---|
| H1 Corte, baseline, API viva, import de hoy | 14 | | | | | |
| H2 Contrato, detector, CSV, perfiles, provider | 33 | | | | | |
| H3 Servicio ensanchado | 23 | | | | | |
| H4 Idempotencia y autorización | 15 | | | | | |
| H5 Plantilla | 8 | | | | | |
| H6 OpenAPI y códigos | 4 | | | | | |
| H7 Regresión, PR, cierre | 12 | | | | | |

### 3. Qué se cerró contra el doble (regla 65)

<no aplica: los parseadores NDJSON y CSV son reales. XLSX queda «pendiente de integrar» (rama de Marcelo)>

### 4. Procesos que quedaron corriendo

<lista o «ninguno»>

---

## Cómo repartís tu noche entre los dos carriles

**No hay orden impuesto entre paquetes** (decisión del propietario: ambos se hacen). Sugerencia, no mandato:
arrancá el Carril B (Carga Masiva) primero porque **publicás `row-contract.ts` en tu hora 1** y eso destraba a
Marcelo y a Pablo; en paralelo o después, el Carril A (Farmacia) espera tu Ola 0 propia (Pablo/Marcelo) así que
tampoco perdés nada si entrás un poco más tarde. Si el tiempo aprieta, **decilo en este daily** con qué carril
priorizaste y por qué — es una decisión de coordinación, se registra, no se esconde.
