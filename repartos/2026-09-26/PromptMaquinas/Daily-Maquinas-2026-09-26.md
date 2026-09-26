# Daily de máquinas — preproducción, 2026-09-26

> **REPARTIDO: 7 / 7 máquinas · 29 hitos · 201 microtareas · 6 requisitos del pedido con dueño.** (M3 agregó 2 a su plan: 197 → 199; M4 agregó 2: 199 → 201.)
> **AVANCE: 45 / 201 microtareas — 22,4 %.** ← `microtareas HECHO / total` (M5 14 + M3 15 + M4 16).
> La **Ola 0 ya está ejecutada** y medida (`RUNS`), aparte de esas 95.
> M1 0/22 · M2 0/17 · **M3 15/15** (`TESTED`, PR #473 mergeado en `test`) · **M4 16/16** (`TESTED`, PRs #470 · #471 · #472 mergeados en `test`) · **M5 14/15** · M6 0/15 · M7 0/101.
> **`A MEDIAS` cuenta como no hecho. `DESCARTADO` no suma: se declara aparte con su motivo.**

> **Estado:** `REPARTIDO` al 2026-09-26. **Novedad respecto de los repartos anteriores: el eje no
> son personas, son máquinas.** El propietario ejecuta con siete computadoras, cada una como un
> programador, y el reparto se hace **por capacidad de la máquina** — que es precisamente lo que
> elimina los bloqueantes.

- **Turno:** completo · **Fecha:** 2026-09-26 · **Paquete fuente:** el pedido de llevar `mockup` a
  una rama `test` de preproducción, desplegada y sana en Contabo
- **Pedido (verbatim, con procedencia):** [`TEST-PREPRODUCCION-2026-09-26.md`](../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
- **Verificación contra el código real:** [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
- **Plan completo:** [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../planes/05-test-preproduccion-2026-09-26/README.md)
- **Repos de destino y cortes:** `alovida/mantra-core-health` · `origin/test` @ **`ec7037f7`** ·
  `alovida/mantra-core-health-api` · `origin/test` @ **`016caaa1`** ·
  `mantra-core-technologies/mantra-core-health-model` · `origin/dev` @ **`13dd040`**
- Peldaño de evidencia del reparto: **`DISCOVERED`** para el plan; **`RUNS`** para la Ola 0, que sí
  se ejecutó y está medida en la verificación.

## 0 · Los cinco hechos que ordenan todo el trabajo

1. **La base ya está arriba y compila, así que nadie espera para arrancar.** La rama `test` existe
   en los dos repos: front `ec7037f7` (`typecheck` 0, `build` exit 0) y API `016caaa1`
   (`typecheck` 0, `lint` 0). Era el único bloqueante de arranque.
2. **Hoy no existe ningún artefacto que hable con la API real.** `mockBackend: true` está fijo en
   `production` **y también en `origin/dev`**, y la única configuración sin simulador apaga el SSR.
   Por eso **A2 (M5) es el carril más importante de los 36**: sin él hay maqueta, no preproducción.
3. **Dos compuertas están rotas de antes, y le pegan a todos.** La suite del front **no es
   determinista** (dos corridas del mismo commit dieron 17 y 11 suites rojas, con conjuntos
   distintos) y su `lint` tiene **263 errores en 201 archivos idénticos a `mockup`**. Hasta que M6
   los cierre, **nadie usa la suite completa como compuerta**: specs dirigidos.
4. **`yarn db:vendor` de la API borra cuatro patches** que sólo existen en la copia vendorizada y
   nunca llegaron al repo del modelo. **Nadie lo corre** hasta que M1 cierre D4.
5. **Los datos del pedido 4 no llegan hoy.** De los doce markdown, cinco se siembran al arrancar;
   las personas y las dos redes de aseguradoras existen **sólo como scripts manuales que ningún
   despliegue corre**. Ése es el hueco, y es de M2 (siembra) y M6 (datasets).

## 1 · Quién tiene qué

| Máquina | Encargo | Su daily | Eje | Hitos | Micro | Estado |
|---|---|---|---|---:|---:|---|
| **M1** Mac mini | [Coolify, autodespliegue y la base del VPS](M1-MacMini/Preproduccion.InfraestructuraYDespliegue/CoolifyAutodespliegueYBaseDelVPS.md) | [daily](M1-MacMini/M1-MacMini-Daily-Maquinas-2026-09-26.md) | infraestructura, base de datos y despliegue | 6 | 22 | `TODO` |
| **M2** MacBook | [Roles, cuentas y el directorio de médicos](M2-MacBook/Preproduccion.ApiConBaseViva/RolesCuentasYDirectorioDeMedicos.md) | [daily](M2-MacBook/M2-MacBook-Daily-Maquinas-2026-09-26.md) | API con base viva | 4 | 17 | `TODO` |
| **M3** Dell Inspiron 1 | [Receta, notas, formularios y encuestas](M3-DellInspiron1/Preproduccion.ApiClinica/RecetaNotasFormulariosYEncuestas.md) | [daily](M3-DellInspiron1/M3-DellInspiron1-Daily-Maquinas-2026-09-26.md) | API clínica, sin base | 3 | 13 (+2) | `HECHO` · `TESTED` · PR #473 **mergeado en `test`** |
| **M4** Dell Inspiron 2 | [Agenda, farmacia, cotizaciones y contabilidad](M4-DellInspiron2/Preproduccion.ApiAgendaDirectoriosYDinero/AgendaFarmaciaCotizacionesYContabilidad.md) | [daily](M4-DellInspiron2/M4-DellInspiron2-Daily-Maquinas-2026-09-26.md) | API de agenda, directorios y dinero, sin base | 3 | 14 | `HECHO` (`TESTED`) · 14/14 |
| **M5** Laptop Justin | [El build real, el simulador honesto y el enrutado](M5-LaptopJustin/Preproduccion.FrontSalidaDelSimulador/BuildRealMockHonestoYEnrutado.md) | [daily](M5-LaptopJustin/M5-LaptopJustin-Daily-Maquinas-2026-09-26.md) | front: la salida del simulador | 3 | 15 | `A MEDIAS` (14/15) |
| **M6** Acer Aspire 3 | [Los doce markdown, la suite determinista y el lint](M6-AcerAspire3/Preproduccion.DatosYCalidadDeLaSuite/LosDoceMarkdownSuiteDeterministaYLint.md) | [daily](M6-AcerAspire3/M6-AcerAspire3-Daily-Maquinas-2026-09-26.md) | datos y calidad de la suite | 4 | 15 | `3/4 HECHO · H2 A MEDIAS` |
| **M7** Lenovo Legion | [Las brechas de la API que ningún encargo tomó](M7-Legion/Preproduccion.BrechasSinMaquina/BrechasDeApiSinDueno.md) | [daily](M7-Legion/M7-Legion-Daily-Maquinas-2026-09-26.md) | brechas front ↔ API sin dueño (BR-04, 05, 07, 08, 09, 14–17, 20, 22, 26–30) | 6 | 101 | `TODO` |
| | **Ola 0** — ya ejecutada | — | la rama `test` de los dos repos | 3 | — | `RUNS` |
| | | | **total** | **29** | **197** | |

> ⚠️ **Esto es más de lo que entra en un turno, y está dicho a propósito.** Cada encargo dice en
> qué orden ir y qué vale más si hay que elegir. Lo que no cierre va **`A MEDIAS`** con qué anda,
> qué no anda y qué falta exactamente. **Recortar alcance es decisión de coordinación, y se
> registra.**

## 2 · Cobertura del pedido — el kill-test del reparto

Una fila sin máquina significa que ese requisito **no está repartido**.

| # | Requisito del propietario | Máquina | Carril |
|---|---|---|---|
| 1 | Llevar todos los contratos de `mockup` a `dev` del front | **hecho** (Ola 0) | A1 · `ec7037f7` |
| 2 | Encontrar las brechas del backend que el front necesita | M6 (refresca el inventario) + M2/M3/M4 (las cierran) | B0 · B3–B13 |
| 3 | Reformar back y front para que funcione todo | M2, M3, M4, M5 | los 13 carriles `B*` y `A*` |
| 4 | Los doce markdown como seeders de arranque | M6 (datasets) + M2 (siembra) + M1 (verifica contra la base) | C6, C1, C2, C0 |
| 5 | Variables declarativas y en inglés | M6 | F1 |
| 6 | Skills cargadas para la máxima calidad | todas: cada encargo declara las suyas | — |
| — | Rama `test` desplegada, sana, y espejo a `dev` | M1 | D2, D3, E1, E2 + merges |
| — | Cuentas logueables con `12345678` | M2 | C1, C2 |
| — | Directorio de médicos con sedes múltiples | M2 | C2 |

## 3 · Lo primero, para todas las máquinas

Antes de la primera microtarea, instalá el estándar y **pegá la salida de los dos comandos** en tu
reporte. Un turno que arranca sin eso arranca en `BLOQUEADO`.

```bash
ls .claude/skills | wc -l
ls .claude/rules/[0-9]*.md | wc -l
```

Después, el worktree del carril, **siempre desde `origin/test`**:

```bash
git -C <repo> worktree add ../wt-<carril> -b justin/test-<carril>-<slug> origin/test
```

## 4 · Las cuatro reglas anti-bloqueo

1. **Nadie comparte checkout.** Un worktree por carril, dentro de tu propia máquina.
2. **Toda rama sale de `origin/test` y vuelve por PR contra `test`.** No esperás el merge: abrís el
   PR y arrancás el siguiente carril. Si tu PR quedó atrás, `merge origin/test` **al final**.
3. **Dueño exclusivo de archivos.** Lo que necesitás de otro carril se pide como **contrato
   escrito** (forma del DTO, ruta, códigos), no como código.
4. **Un solo dueño por compuerta compartida:** M1 hace los merges a `test`, el despliegue y el
   espejo a `dev`. Nadie más toca Coolify ni la base del VPS.

### El único punto de serialización, y por qué no bloquea

**M2 es la única que edita `@Roles(...)` de endpoints existentes**, porque `role-mapping.ts`
declara un `RoleCode` cerrado y descarta en silencio lo desconocido: dos carriles agregando roles a
la vez chocan de forma semántica y ningún merge lo caza. Los demás **no esperan**: anotan el rol
que necesitan en su reporte y siguen. Un 403 pendiente de rol no impide escribir el servicio ni el
DTO.

## 5 · Contratos congelados

No se discuten por máquina. Están en el [§5 del plan](../../../planes/05-test-preproduccion-2026-09-26/README.md);
los cuatro que más se van a usar:

| Qué | Valor |
|---|---|
| Configuración Angular real | `production-api` |
| Dominio del front de prueba | `https://test.173.249.39.237.sslip.io` |
| Contraseña de prueba | `12345678`, **sólo por variable de entorno**, nunca literal en el código |
| Datos personales | **todos inventados**, deterministas, marcados `synthetic: true`. El markdown aporta nombre, matrícula, especialidad y ocupación |

## 6 · Lo que bloquea al propietario, no a las máquinas

Ninguno de los dos impide que las siete arranquen. Se dicen acá para que nadie los descubra a mitad
de camino.

- **La llave SSH del VPS no está autorizada** (`Permission denied (publickey,password)`). Sólo
  afecta a M1, y sólo para inspeccionar la base y reiniciar volúmenes: D2, D3 y D4 no la necesitan.
- **El disco de la Mac mini está al 100 %**: 377 MiB libres de 228 GiB, con 78 worktrees y 31 GB de
  `node_modules`. Se liberaron 3,2 GiB de cachés regenerables; **qué worktrees se borran lo decide
  el propietario**, porque pueden ser de sesiones vivas.

## 7 · Cierre — se llena al terminar

| Máquina | Carriles cerrados | Peldaño alcanzado | PRs | Qué quedó `A MEDIAS` |
|---|---:|---|---|---|
| M1 | 0/6 | — | — | — |
| M2 | 0/4 | — | — | — |
| M3 | 3/3 | `TESTED` (sin base; lo que falta correr a M1 está en el reporte de la API, `docs/trabajo/2026-09-26-m3-api-clinica/REPORTE.md`) | **#473** `MERGEABLE`/`CLEAN` → **mergeado en `test`** @ `f5c8c11c` (Jsaldias39). El PR lo abrió el propietario: `gh pr create` estaba denegado para la sesión automática | Nada (este daily: PR #58 del PM, `MERGEABLE`, a la espera de review). ⚠️ **`test` tiene el código de M3 y no el DDL de M1: no desplegar antes del patch** (`encounter_id`, `indication_text`, tabla D-B) |
| M4 | 3/3 (B10, B12, B13) | `TESTED` (techo sin base; lo que falta correr a M1 está en `docs/progress/evidence/lane-B1x/REPORT.md` de la API) | API **#470 · #471 · #472 → mergeados en `test`** ([#470](https://github.com/mdavila-2001/mantra-core-health-api/pull/470) · [#471](https://github.com/mdavila-2001/mantra-core-health-api/pull/471) · [#472](https://github.com/mdavila-2001/mantra-core-health-api/pull/472)) | ninguna; D-A, D-F y D-G registradas sin resolver; `VERIFIED` pendiente de M1 |
| M5 | 2/3 `HECHO` (H1, H2) + 1 `A MEDIAS` (H3) | `VERIFIED` (H1, H2) · `TESTED` (H3) | [#711](https://github.com/mdavila-2001/mantra-core-health/pull/711) | H3.S1.M2: sin nginx/API real levantados en esta máquina (sin el stack Docker de M1); `check-api-prefixes`/`check-client-prefixes` sí en verde |
| M6 | 3/4 (H1, H3, H4) + 1 `A MEDIAS` (H2) | `REGRESSION_VERIFIED` (H1, H3, H4) · `VERIFIED` parcial (H2) | Ramas pusheadas contra `origin/test`: [API](https://github.com/mdavila-2001/mantra-core-health-api/tree/marcelo/test-m6-datasets-lint) · [front](https://github.com/mdavila-2001/mantra-core-health/tree/marcelo/test-m6-suite-lint) — `gh pr create` denegado para la sesión automática, igual que M3; los abre el propietario | H2: 3 causas raíz reales corregidas (2 specs + 6 servicios `providedIn:'root'` con `effect()` sin guarda sobre `auth.userId()`/`session.isAuthenticated()`), pero la suite sigue sin ser determinista — queda al menos una instancia más del mismo patrón sin aislar, diagnóstico y recomendación en el reporte |
