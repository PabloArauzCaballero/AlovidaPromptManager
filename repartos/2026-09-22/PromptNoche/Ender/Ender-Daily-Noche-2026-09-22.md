# Ender — daily de la noche del 2026-09-22

> **AVANCE: 0 / 48 — 0 %.** ← actualizá esta línea al cerrar. Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-SimuladorYCabecera.MockNavegacion`](Noche-SimuladorYCabecera.MockNavegacion/LatenciaAgendasParaTodosYChatsYTutorialesEnLaCabecera.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
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
<pegá la salida — tiene que dar 176>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 14>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 27 skills de mi lote, empezando por `synthetic-test-data-generation`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Archivo de evidencia |
|---|---|---|---|
| `yarn lint` | | | `evidencia/antes/lint.txt` |
| `yarn typecheck` | | | `evidencia/antes/typecheck.txt` |
| `yarn test --watch=false` | | | `evidencia/antes/test.txt` |
| `yarn stock:generate` ×2 + `diff` | | diff vacío: sí / no | `evidencia/antes/` |

## 3. Los dos números (H1.S2)

| Medida | Valor | Archivo |
|---|---|---|
| Latencia por prefijo (leída del interceptor) | | `evidencia/antes/latencia.md` |
| Latencia observada en 10 `GET /scheduling/slots` (mín–máx) | | idem |
| Profesionales en el directorio / con recurso / con cupos ±14 días | __ / __ / __ | `evidencia/antes/agendas.txt` |
| Peticiones y total de «elegir médico» (de Justin, o propia) | | `evidencia/antes/red-flujo-reserva.md` |

## 4. La tabla de latencia que publicás (H2.S1)

| Prefijo | ms | Motivo |
|---|---|---|
| `/terminology` | | |
| `/scheduling/slots` | | |
| `/profiles` | | |
| subida de documentos | | |
| resto | | |

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
| Renglón «Cotizaciones» (PATIENT, Mi cuenta) + ruta lazy | Justin | | renglón hacia ruta declarada con componente vacío |
| Retirar «Mis puntos» del menú + redirect `/my-account/loyalty` → pestaña | Itzan | | redirect a `/my-account`, declarado |
| Filtro por profesional en `GET /scheduling/slots` | Justin | | se decide y se escribe |
| Medición del flujo de reserva | Justin (te la da) | | la medís vos y lo declarás |

## 7. Lo que publicaste

| Qué | Para quién | Ruta + hora |
|---|---|---|
| Tabla de latencia por prefijo | Justin | |
| Escenarios de flujo completo en `core/mock/README.md` | los cinco | |

## 8. Al cerrar

- [ ] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (una vacía se escribe «ninguna»).
- [ ] Baseline repetido y comparado: ningún rojo **nuevo**.
- [ ] **`yarn start` arranca y `stock:generate` regenera idéntico.**
- [ ] `Math.random` fuera del interceptor; la latencia es una tabla con motivo.
- [ ] `navigation.service.spec.ts` en verde **con la lista nueva y su motivo**, no con aserciones borradas.
- [ ] Los enlaces nuevos de la cabecera: `aria-label` **y** globo, excepción escrita.
- [ ] Todo dato sembrado sintético, determinista y declarado.
- [ ] Capturas por rol, viewport y tema, **miradas**, con su línea.
- [ ] Procesos corriendo, enumerados y cerrados. Si no quedó nada, decilo.
