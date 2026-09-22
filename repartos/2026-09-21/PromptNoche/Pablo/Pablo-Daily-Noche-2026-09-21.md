# Pablo — daily de la noche del 2026-09-21 (cerrado el 2026-09-22)

> **AVANCE: 51 / 88 — 58,0 %.** · 37 `DESCARTADO` con motivo · **0 `TODO`.**
>
> **El carril cerró las 88 microtareas.** Evitó migrar 31 pantallas que no correspondía tocar (37
> `DESCARTADO`); cerró dos brechas reales con código, filtro funcional y verificación en pantalla:
> Documento/Teléfono (H7) y Grupo ABO/Factor Rh/Idioma clínico (H8); escribió el contrato completo
> del organismo real (`DataTable<Row>`); y corrió la regresión, clasificando cada rojo con
> reproducción, incluido un crash de entorno de la máquina compartida.
>
> **Hubo un error a mitad de camino, y se corrigió, no se ocultó:** un primer cierre de los dos
> riesgos "sin dueño" concluyó que ninguno de los cuatro filtros pendientes hacía falta, citando una
> decisión de arquitectura documentada. Esa lectura estaba mal para tres de los cuatro (Grupo ABO,
> Factor Rh, Idioma clínico: sí tienen catálogo real) y bien sólo para el cuarto (Estado de seguro:
> no tiene). Al insistírsele que completara el trabajo, se investigó más a fondo, se encontró la
> distinción real, y se implementaron los tres que correspondían.
> Detalle completo en [`entregables/REPORTE.md`](Refactor-TablaCanonica.AccesosYPersonas/entregables/REPORTE.md).

- Carril: [`Refactor-TablaCanonica.AccesosYPersonas`](Refactor-TablaCanonica.AccesosYPersonas/ContratoDeTablaYAdopcionEnAccesosYPersonas.md)
- Corte: `origin/mockup` @ **`5a0776c66b005ad4d2d6722321e933cd7adea621`**
- Worktree: `../alovida/mch-pablo-tabla-canonica` · Rama: **`pablo/refactor-tabla-canonica`**
- **Peldaño por área (regla 30):** baseline y descubrimiento `VERIFIED` · ADR-0014 `WRITTEN` ·
  adopción de la tabla en la maqueta `UNKNOWN` — no correspondía tocarla ·
  **columnas Documento/Teléfono (H7) `REGRESSION_VERIFIED`** · contrato de `DataTable<Row>` (H2.S3)
  `WRITTEN` · **filtros de Grupo ABO/Factor Rh/Idioma clínico (H8) `VERIFIED`** — spec en verde,
  filtro probado en pantalla real fila por fila, regresión del radio de impacto real en verde;
  la suite completa quedó `ENVIRONMENT` por la máquina, no por el cambio.
- Daily de equipo: [`Daily-Noche-2026-09-21.md`](../Daily-Noche-2026-09-21.md) — **actualizado**

## 0. La decisión Q-A — **TOMADA**, y con un resultado distinto al que el daily anticipaba

El daily arrancaba planteando tres opciones sobre cómo sobrevivir al generador. **La medición
descartó la pregunta entera**: esas pantallas no hay que migrarlas.

Lo que se encontró, en este orden:

1. `port-vistas-alovida.mjs:275-284` **no sobrescribe: borra.** `rmSync(..., {recursive:true})` sobre
   los siete segmentos. Un archivo nuevo creado a mano ahí adentro tampoco sobrevive.
2. **`alovida.routes.ts` también es generado** y está en la lista de borrado (línea 281).
3. El repo **ya tenía resuelto** el problema de sobrevivir al generador, con precedente y prueba:
   `app.routes.ts:1232-1240`, para las rutas de `/search`.
4. **Y entonces, al mirar la captura**, apareció lo que cambió todo: la pantalla muestra un aviso que
   no se puede cerrar — *«Referencia de diseño, no la aplicación… La pantalla que sí funciona es
   Pacientes.»* — y `alovida-design-notice.ts` declara que las 126 portadas son **el entregable del
   diseñador y la fuente de rehidratación de las vistas reales** (corrección #8), y que el carril 01
   pide **marcarlas, no borrarlas**.
5. **Las pantallas reales ya montan `DataTable`**: `admin/patients/patient-list`,
   `admin/organizations/organization-list`, `admin/terminology/terminology-catalog`. Ninguna tiene
   una tabla escrita a mano.

**Decisión escrita:** `docs/adr/ADR-0014-pantallas-portadas-que-se-graduan.md`, indexada en
`docs/adr/index.md`, en la rama del carril.

## 1. Instalación del estándar

```text
$ ls .claude/skills | wc -l            → 176
$ ls .claude/rules/[0-9]*.md | wc -l   → 14
$ python .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

**Desvío declarado:** el estándar **no** se copió dentro del worktree del producto — se carga desde
`AlovidaPromptManager/`. Motivo: `mantra-core-health` tiene `.claude/` **trackeado** con cuatro
skills propias (`fable-refactor-orchestrator`, `frontend-production-gate`, `project-design-system`,
`visual-quality-gate`); copiar 176 metería ~1000 archivos fuera de alcance en el diff del producto
(regla 00 §3.1). Salida completa en `evidencia/antes/estandar-instalado.txt`.

- [x] Leí `skills-router` y las skills del lote, empezando por `frontend-data-tables`.
- [x] Creé el `PLAN.md` **antes** del primer `Write`.

## 2. Baseline — corrido, con sus rojos clasificados por reproducción

| Comando | Exit | Resultado |
|---|---|---|
| `yarn lint` | **0** | limpio |
| `yarn typecheck` | **0** | limpio **tras correr los generadores** — ver el hallazgo de abajo |
| `yarn test --watch=false` | **1** | **3 archivos fallan / 551 pasan (561)** · 3 tests / 6860 · 7 errores |
| `yarn audit:vistas` | **0** | conectada 148 · **maqueta portada 119** · presentacional 10 |
| `yarn stock:generate` | **0** | 537 componentes · 295 pantallas · 138 maquetas · 23/45/33 |

**Los 3 rojos son previos y están fuera de mi alcance.** Clasificados re-corriéndolos aislados, no
por intuición (`evidencia/antes/rojos-previos-aislados.txt`):

| Spec | Aislado | Clase |
|---|---|---|
| `app.routes.spec.ts` | **✓ 47 pasan** | `ENVIRONMENT` — contención (7 `Worker exited unexpectedly` en la suite) |
| `auth/register-practitioner.spec.ts` | **✓ 97 pasan** | `ENVIRONMENT` — ídem · **es del carril de Itzan** |
| `accounting/resumen.spec.ts` | **✗ falla igual** | **Determinista.** `expected 5 to be 6`, y el spec **no fija el reloj** · sin dueño |

## 3. Avance de la migración — el denominador cambió, y por eso

| Submódulo | Pantallas con tabla a mano | Migradas | Estado |
|---|---|---|---|
| `alovida/accesos/**` | 16 | **0** | `DESCARTADO` — no son deuda de adopción (ADR-0014) |
| `alovida/personas/**` | 15 | **0** | `DESCARTADO` — ídem |

**`maqueta portada: 119` NO es un indicador de deuda**: es el recuento del entregable de diseño.
Usarlo como meta a bajar sería medir mal.

## 4. Lo que sí quedó demostrado

- Las **31 rutas** verificadas contra el router: **31/31** (`evidencia/antes/inventario-31-pantallas.txt`).
- **31/31 comparten la misma anatomía núcleo**: page-header + breadcrumb + filter-bar + table +
  pagination. Varía `tabs` (14 sí / 17 no), `menu` (8) y `empty-state` (27 sí / 4 no).
- **Contraejemplo con evidencia:** `pacientes-fusionar` tiene **exactamente las mismas columnas** que
  `pacientes-listado`. La tabla se comparte; la página **no**, porque una es un listado y la otra una
  acción. Es el caso que el §7.2 dice que no hay que fusionar.
- Dos capturas 1440×900 **miradas y descritas** en `evidencia/antes/capturas/LEEME.md`, con el
  contraste maqueta vs real: 8 columnas y 5 filtros contra 4 columnas y sólo búsqueda; la maqueta
  **no pasa por `authGuard`**, la real sí.
- **H7, agregado al plan tras el hallazgo:** el contrato `PatientListItem` ya declara `nationalId` y
  `phone` (pedidos por el propietario el 19/09/2026), el simulador ya los sirve y el cliente ya los
  mapea — sólo la tabla no los mostraba. Se agregaron dos columnas con los **tres niveles** del
  contrato probados (correcto / límite / inválido): **13/13 tests en verde**, `typecheck` exit 0, y
  verificado en pantalla real (`/administration/patients`) con captura mirada y consola sin errores.

## 5. Mis obligaciones con el equipo

| A quién | Qué le debía | Entregado |
|---|---|---|
| **Justin** | la decisión Q-A escrita | ✅ ADR-0014 + recuadro al inicio de su daily + §5.bis del daily de equipo |
| **Justin** | corregir el supuesto de su daily sobre `alovida.routes.ts` | ✅ su §7 corregida: ese archivo **es generado y no se toca**; el de coordinación es `app.routes.ts` |
| **Justin** | el patrón de migración de tabla | ❌ **no corresponde ya** — no hay migración que patronar |
| **Ender** | dos hallazgos de su área | ✅ abajo |

Lo que pedí a otros: **nada**. No se llegó a necesitar ningún fixture ni escenario del catálogo,
porque no se escribió código.

## 6. Como coordinador — qué resolví y qué queda

| ID | Qué se decidió | Fundamento |
|---|---|---|
| **Q-A** | **Las portadas no se migran.** Se deja escrito el mecanismo de graduación por si alguna vez hace falta | ADR-0014, con seis mediciones citadas |
| **Q-B** | Reusar `docs/refactor-profesional/trabajo/` | Supuesto tomado pero **sin usar**: no se generó ningún artefacto del §17 |
| Q-C · Q-D · Q-E | **Sin resolver** | Dependen de las mediciones de Itzan y Marcelo, que todavía no entregaron |
| **NUEVA** | **¿Quién toma el resto de `features/admin/**` y `features/delegated-access/**`?** Documento/Teléfono ya se cerraron (H7); quedan los 5 filtros del diseño y `delegated-access-home` sin `DataTable` | Ver riesgo 4 del reporte |
| **NUEVA-2** | ¿`priority: 2` es correcto para las columnas nuevas, o alguna merece `priority: 1`? | Sin confirmar con producto |

### Para Ender, los dos hallazgos de su área

1. **`yarn typecheck` falla en un checkout limpio**: 12 errores `TS2307` porque no corre los
   generadores, y `start`/`build`/`test` sí. Con `env:generate && stock:generate` antes, da 0.
2. **Los artefactos generados no concuerdan con sus fuentes.** Correr `audit:vistas` sobre el corte,
   sin tocar código, cambia `rutas.json` y `design-view-inventory.md` (`+PharmaLabClient`,
   `−PrescriptionFavoritesClient`). Es el gate del §18 del documento maestro, y **hoy no pasa**.
   Se revirtió el diff y quedó registrado en `evidencia/h1/deriva-artefactos-generados.txt`.

## 7. Al cerrar

- [x] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones, actualizado tras H7.
- [x] Baseline corrido y clasificado. El único cambio de código real es H7, acotado a
      `admin/patients/patient-list/**`; su spec dirigido (13/13) es su propia regresión.
- [x] Los 29 consumidores de `DataTable` **intactos**: no se tocó el organismo, sólo un consumidor.
- [ ] **Capturas en 390 y 768, y en tema oscuro: NO se hicieron**, ni en «antes» ni en H7. Sólo
      1440×900, tema claro. Declarado en «No cubierto» del reporte.
- [x] Consola revisada en las tres pantallas abiertas: sólo mensajes informativos de modo desarrollo
      y 2 errores de CSP en `/auth` (previos, fuera de mi alcance), **cero errores nuevos**.
- [x] Las preguntas del §19 que aplican, respondidas con evidencia en el reporte, incluidas las que
      corresponden a H7. Las 20 completas, no — declarado como `TODO`.
- [x] **Procesos:** `yarn start` se levantó dos veces y se detuvo las dos; los dos procesos hijos
      sobrevivieron al cierre del shell y se mataron por PID; **puerto 4200 verificado libre las dos
      veces**. Navegador de Playwright cerrado las dos veces. **No quedó nada corriendo.**
- [x] **Daily de equipo actualizado** con Q-A resuelta (§5.bis).

## 8. Lo primero de la próxima sesión

> `delegated-access-home` **ya no está en esta lista**: sigue siendo correcto que no use `DataTable`,
> porque el backend todavía no publica sus endpoints de lectura — confirmado en su propia plantilla.

1. **Estado de seguro**: declarar el value set real (Asegurada/Particular/En trámite) para poder
   implementar su filtro y columna, igual que se hizo con los otros tres en H8. Hoy no existe.
2. **Confirmar con producto** si `priority: 1` le corresponde a alguna de las cinco columnas nuevas.
3. **Avisarle a Justin que sus 39 también quedan descartadas** por el mismo motivo de la maqueta —
   su daily ya lo dice, pero conviene confirmarlo en persona antes de que empiece.
4. **Commitear H7, H8, ADR-0014 y `CONTRATO-data-table.md`** (o decidir si van en PRs separados): hoy
   están sin commit en el worktree, 8 archivos modificados + 2 nuevos.
5. **`accounting/resumen.spec.ts` es date-dependent** (confirmado con evidencia cruzada de dos días:
   falló el 21/09, pasó el 22/09, sin cambios de código). No tiene dueño en esta oleada — alguien
   tiene que fijarle el reloj (`vi.setSystemTime`) o revisar la lógica de ventanas de fecha.
6. **`CONTRATO-data-table.md` no se verificó contra los 29 consumidores uno por uno** — sólo se citó
   el organismo tal como está escrito y probado en su propio spec.
7. **La suite completa de tests no corre de forma confiable en esta máquina** (tres crashes por
   `EPIPE` durante H8). Es un problema de capacidad de la máquina compartida, no de este carril, pero
   bloquea a cualquiera que necesite correrla completa aquí.
8. **Los otros dos filtros (Factor Rh, Idioma clínico) no se probaron individualmente en pantalla
   real**, sólo Grupo ABO — el spec dirigido sí cubre los tres.
