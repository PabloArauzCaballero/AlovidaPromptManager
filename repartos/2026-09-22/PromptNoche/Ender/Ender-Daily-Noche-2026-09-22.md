# Ender — daily de la noche del 2026-09-22

> **AVANCE: 30 / 48 — 62,5 %.** H1 9/9 · H2.S1 5/5 · H3 9/9 · H4.S1 7/7. Sin contar todavía: H4.S2.M1
> (Cotizaciones, de Justin, ya en `mockup`), H5 (lo que ya está en `mockup`) ni H6. `A MEDIAS` cuenta como **no hecha**.
> Corregido el 2026-09-23 (este daily había quedado con marcadores de conflicto sin resolver desde #34).

> **Dos ejecuciones del mismo reparto.** Este encargo lo corrieron dos carriles a la vez:
> `ender/simulador-cabecera-2026-09-22`, que entró a `mockup` por **#584, #592 y #598** y había declarado
> 41/48, y `ender/simulador-latencia-agendas-cabecera-2026-09-22`, que se **reconcilió** sobre ese `mockup`
> (`a43ad2b3`) y es la que fija el estado de arriba. La diferencia principal está en H3 (ver §3-bis): el
> contrato vigente es **D-H3-PROV-01 = C · equivalentes sintéticos**, y la versión de #584 (agenda para las
> personas reales de la planilla) quedó superada. **La rama reconciliada sigue local**: no está en `mockup`
> ni tiene PR.

- Carril: [`Noche-SimuladorYCabecera.MockNavegacion`](Noche-SimuladorYCabecera.MockNavegacion/LatenciaAgendasParaTodosYChatsYTutorialesEnLaCabecera.md)
- Corte vigente: `origin/mockup` @ `a43ad2b311e1a69ff708fba5cef1e5a2100bbbc2` (reconciliación). Cortes de las
  mediciones: `8ae7283a` (carril reconciliado) y `05d83cb8` (carril paralelo).
- Rama vigente: `ender/simulador-latencia-agendas-cabecera-2026-09-22` (local, 2 commits sobre `a43ad2b3`, sin push
  ni PR) · Peldaño (regla 30): `TESTED` en H2/H3/H4.S1 (specs dirigidos y suite completa sin rojos nuevos) ·
  `VERIFIED` visual de la cabecera (12/12 capturas miradas) y de los escenarios de reserva en el navegador.
- Plan y reporte del carril paralelo: `docs/trabajo/2026-09-22-ender-simulador-cabecera/` (en `mockup`).
- Daily de equipo: [`Daily-Noche-2026-09-22.md`](../Daily-Noche-2026-09-22.md)

## 0. Dos cosas que sólo vos podés romper, y dos números que sólo vos podés dar

- `yarn start` corre `stock:generate` antes de compilar: **si tu rama rompe el arranque, cuatro personas no
  trabajan.** Cada cierre repite `yarn start`.
- `app.routes.ts` es **tuyo y de nadie más** esta noche: Justin e Itzan te piden; vos escribís.
- Los números: **latencia por ruta** (medida y observada) y **profesionales con agenda / total**. Sin ellos
  R-02 y R-03 no tienen «antes».

**Tu carril del 21/09** (`Refactor-CatalogoEInventario`) queda `A MEDIAS` declarado en su propio reporte.

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
180   ← 176 del estándar + 4 propias del repo de producto (fable-refactor-orchestrator,
        frontend-production-gate, project-design-system, visual-quality-gate), fusionadas sin pisarlas
        (igual en los dos carriles)

$ ls .claude/rules/[0-9]*.md | wc -l
14

$ python .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

- [x] Leí `skills-router` y las skills de mi lote (síntesis priorizada, no las 27 una por una:
      `synthetic-test-data-generation`, `frontend-performance`, `root-cause-debugging`,
      `frontend-navigation-ia`, `frontend-accessibility`, `e2e-playwright`).
- [x] Creé el `PLAN.md` antes del primer `Edit`/`Write` de código. Carril paralelo:
      `docs/trabajo/2026-09-22-ender-simulador-cabecera/PLAN.md` (versionado en `mockup`). Carril
      reconciliado: `docs/trabajo/2026-09-22-simulador-latencia-agendas-cabecera/PLAN.md` (local, excluido
      del Git de producto).

> Instalación: el `settings.json` del producto está versionado y no se tocó; los hooks del estándar van en
> `.claude/settings.local.json`. `AGENTS.md` y `.agents/` no se copiaron porque quedarían sin ignorar.

## 2. Baseline

| Comando | Exit code | Rojos previos | Archivo de evidencia |
|---|---|---|---|
| `yarn lint` | 1 | 243 × `prefer-on-push-component-change-detection` en 194 archivos (deuda previa; en el carril sólo 3 specs). El carril paralelo registró exit 0 sobre su corte | `evidencia/antes/lint.txt` |
| `yarn typecheck` | 2 → 0 | 1.ª corrida: falta `env.generated.ts` en un checkout nuevo (`ENVIRONMENT`); 2.ª corrida verde | `evidencia/antes/typecheck.txt`, `typecheck-2.txt` |
| `yarn test --watch=false` | 1 | 3 de 7173 al corte `8ae7283a`: `shell-layout.spec.ts:147` y `:449` (lista cerrada y agrupación tras `b3af9887`, de Cotizaciones; en `mockup` ya resueltos por #581) · `fichas-estandar.spec.ts` (`ENVIRONMENT`: ruta de la API) | `evidencia/antes/test.txt` |
| `yarn stock:generate` ×2 + `diff` | 0 · 0 | diff vacío: **sí** (sha256 `f7380c47…` las dos veces; el carril paralelo, también) | `evidencia/antes/stock-generate.txt` |

## 3. Los dos números (H1.S2)

| Medida | Valor | Archivo |
|---|---|---|
| Latencia por prefijo (leída del interceptor, **antes**) | `/terminology*` 40 fijo · subida de documentos 600 fijo · resto `120 + floor(Math.random()·180)` = 120–299 (`mock-backend.interceptor.ts:250-259`) | `evidencia/antes/latencia.md` |
| Latencia observada en 10 `GET /scheduling/slots` (**antes**, mín–máx) | **139–323 ms**, media 228, desvío 68 · `/scheduling/resources` 172–299 · `/profiles` 142–263 · `/public/search` 140–296 · `/terminology` 46–47 → **NO determinista**. El carril paralelo midió 135,5–319,9 ms (9 de 10) | idem |
| Profesionales en el directorio / con recurso / con cupos ±14 días (**antes**) | **791 / 14 / 14** (15 escritos, 763 de la red de aseguradoras, 13 de la planilla del propietario) · **los 13 de la planilla: 13 / 0 / 0** | `evidencia/antes/agendas.txt` |
| Peticiones y total de «elegir médico» (**antes**) | **4–5 peticiones** en 2 ramas paralelas de 2 saltos en serie, **311–557 ms** (arnés, carril reconciliado). El carril paralelo contó **6** en vivo con la médica de 2 sedes (`evidencia/h2/elegir-medico-en-vivo.md`, en `mockup`). La de Justin no llegó con dato | `evidencia/antes/red-flujo-reserva.md` |

> **Cómo se midió, y por qué no con la Red.** En modo mock el interceptor responde **antes** de `next()`
> (`mock-backend.interceptor.ts:48-57`): las llamadas no salen a la red, así que DevTools Network y
> `page.waitForResponse` no las ven. Por eso la medición de Justin quedó sin dato. Se midió dentro de la app con un
> arnés reproducible (`HttpClient` + interceptor real + clientes reales, reloj real). No es observación de
> navegador: no incluye render ni navegación.

## 3-bis. H3 — estado vigente (D-H3-PROV-01 = C · equivalentes sintéticos)

- Las 13 personas de la planilla del propietario son **reales** y la planilla no dice dónde atienden: **no reciben
  agenda** (recursos nuevos: **0**).
- La agenda de R-03 la tienen **13 profesionales de demostración** (`origen: 'DEMO'`, «Profesional demo NN»): 13/13
  con recurso, plantilla de lunes a viernes y cupos ±21 días, en Clínica Los Olivos u Hospital San Lucas (las
  instituciones inventadas de la maqueta), sin credenciales ni matrícula.
- La versión de #584 (agenda para los registrados reales) quedó superada en la rama reconciliada, que sigue local.

## 4. La tabla de latencia que publicás (H2.S1)

| Prefijo | ms | Motivo |
|---|---|---|
| `/terminology` | 40 | mínimo elegido (Q-E1): ya se venía usando y el estado de carga se llega a ver |
| `/scheduling/slots` | 40 | ruta caliente de «elegir médico»: hasta 2 llamadas por sede, no multiplicar la espera |
| `/profiles` | 90 | trae más forma (perfiles, catálogos) |
| subida de documentos | 600 | la barra de «subiendo» necesita verse avanzar (el simulador no emite progreso) |
| resto | 120 | ni tan rápido que no se note, ni tan lento como llegaba el azar viejo (hasta 299) |

- `LATENCY_BEFORE` = la medición histórica de §3 (azar de 120 a 299 ms; `/scheduling/slots` 139–323 ms).
- `LATENCY_CURRENT_CONTRACT` = **40 / 40 / 90 / 600 / 120**, la tabla de arriba, que es la del código ejecutable
  (`mock-backend.interceptor.ts`, `LATENCIA_POR_PREFIJO`), sin `Math.random`. Spec: `mock-backend-latencia.spec.ts`.
- **Corrección 2026-09-23:** la versión anterior de esta sección (#32) publicaba `/scheduling/slots` **80** y
  `/profiles` **100**. Esos valores eran de una variante local que **no quedó**: en la reconciliación se adoptó la
  tabla ya mergeada en `mockup`. Los números de «antes» no cambian.
- **Justin puede medir contra esta tabla ahora:** `JUSTIN_CAN_MEASURE_CURRENT_LATENCY_ON_MOCKUP = YES` (está en
  `origin/mockup` desde #584).

## 5. Checkpoints del turno

```text
AVANCE — simulador y cabecera — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 6. Lo que te pidieron y su estado

| Qué | Quién | Estado | Si no llegó el pedido: contrato simulado (regla 65) |
|---|---|---|---|
| Renglón «Cotizaciones» (PATIENT, Mi cuenta) + ruta lazy | Justin | **Ya en `mockup`, lo escribió Justin** (`b3af9887`, #577), verificado contra código y no recreado. H4.S2.M1 todavía no se acredita | no aplica |
| Retirar «Mis puntos» del menú + redirect `/my-account/loyalty` → pestaña | Itzan | **Simulación previa en `mockup`**: renglón retirado y `/my-account/loyalty` → `/my-account`. El contrato final del handoff de Itzan es `/my-account?pestana=puntos` y su código **todavía no está en `mockup`**: esperando a Itzan | redirect a `/my-account`, declarado (regla 65) |
| Filtro por profesional en `GET /scheduling/slots` | Justin | No llegó | fuera del alcance (la ficha y sus peticiones son de Justin) |
| Medición del flujo de reserva | Justin (te la da) | No llegó con dato → **medición propia** (§3) | la medís vos y lo declarás |

## 7. Lo que publicaste

| Qué | Para quién | Ruta + hora |
|---|---|---|
| Números del «antes» (latencia, agendas, «elegir médico») | Justin | §3 de este daily · PR #32 de PromptManager · 2026-09-23 |
| Tabla de latencia por prefijo | Justin | §4 de este daily. Publicada en #32 con 80/100 (**incorrecto**) y **corregida** en este PR a 40/40/90/600/120 · 2026-09-23 |
| Escenarios de flujo completo en `core/mock/README.md` | los cinco | Rama reconciliada (local): escenario A con la médica de prueba y B con «Profesional demo 01»; la reserva del portal queda **solicitada** (`BK-REQUESTED`) |
| Estado de Cotizaciones y Mis puntos (N-02/N-03) · corrección de HALL-M5 | Justin, Itzan, Pablo | `Daily-Noche-2026-09-22.md` §4-bis (carril paralelo) |

## 8. Al cerrar

> **Cierre del carril paralelo** (`ender/simulador-cabecera-2026-09-22`, #584/#592/#598), tal como lo dejó. La
> casilla de «los 12 registrados con agenda» quedó **superada** por D-H3-PROV-01 (ver §3-bis).


- [x] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (`docs/trabajo/2026-09-22-ender-simulador-cabecera/REPORTE.md`).
- [x] Baseline repetido y comparado: los 2 rojos previos, corregidos con motivo; **con reserva**: `core/` 1541/1541, `shared/` 1439/1439, raíz 48/48; `features/` 4098-4099 de 4101 por corrida, 2-3 timeouts de 5 s en specs ajenos que pasan en aislamiento (ambiente, ver REPORTE H6.S1.M2).
- [x] **`ng serve` arranca limpio** (57,6 s) y `stock:generate` regenera idéntico (×2, diff vacío).
- [x] `Math.random` fuera del interceptor; la latencia es una tabla con motivo.
- [x] `navigation.service.spec.ts` **y** `shell-layout.spec.ts` en verde con la lista nueva y su motivo,
      sin aserciones borradas (85/85).
- [x] Los enlaces nuevos de la cabecera: `aria-label` **y** globo (`appTooltip`), excepción del menú/
      hamburguesa escrita.
- [x] Todo dato sembrado (los 12 registrados con agenda) sintético, determinista (`uuid(semilla)`) y
      declarado — no se sembró ningún nombre nuevo.
- [x] Capturas tomadas, **miradas** y con doble revisión (`evidencia/doble-revision.md`); 12 reales, no la matriz completa — declarado en A MEDIAS del `REPORTE.md`.
- [x] Procesos corriendo: **ninguno**. `ng serve :4203` detenido explícitamente y puerto confirmado
      libre con `netstat`; navegador Playwright cerrado.

## 9. Nota para quien cierre el turno (commit)

> Nota del carril paralelo, ya resuelta: ese trabajo entró a `mockup` por #584, #592 y #598.


No hice ningún `git commit` ni `git push` esta noche: 19 archivos modificados + 4 specs nuevos quedaron
en el árbol de trabajo de la rama `ender/simulador-cabecera-2026-09-22`, sin confirmar. El checkout
tiene un `.git/info/exclude` local (no compartido, no es `.gitignore`) que excluye `.claude/`,
`AGENTS.md`, `.agents/`, `evidencia/`, `PLAN.md` y `REPORTE.md` — probablemente de una sesión anterior.
Justin e Itzan **sí** commitearon sus `PLAN.md`/`REPORTE.md`/`evidencia/` a este mismo repo esta noche
(ver sus commits `docs: …`), así que ese exclude local no refleja la convención real del equipo. Quien
cierre: revisar `git status`, decidir si commitea (con `git add -f` para lo que el exclude local tapa, o
ajustando `.git/info/exclude`), y si corresponde, abrir el PR.
