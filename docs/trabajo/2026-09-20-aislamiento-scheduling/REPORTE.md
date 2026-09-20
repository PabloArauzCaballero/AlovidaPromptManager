# REPORTE — Aislamiento de la capacidad `scheduling` (piloto de avisos)

Fecha: 2026-09-20 · Corte de trabajo: `5d5007fb` · Copias: `mantra-core-health-api-copia-noche`
(H1, evidencia, plan) y `mantra-core-health-api-copia-noche-h2` (retiro de vecinos para H2,
sin remoto, descartable).

## Completado

- **H1 — Composición y baseline local** (14/14 microtareas HECHO): mapa completo de imports de
  `scheduling.module.ts` con ruta:línea, clasificación de cada uno, ORM/transacción
  verificados contra el código real (versión `@mikro-orm/nestjs` 7.0.2 distinta de
  `core/postgresql` 7.1.7), instancia Postgres efímera (`night-scheduling-pg`) con roles
  `night_prep`/`night_run` separados y probados, y script de limpieza que rechaza tocar el
  stack compartido (probado con caso negativo real).
- **H2 — Prueba material de ausencia** (bloqueante, cerrado con veredicto real): se retiraron
  físicamente `messaging` y `community` de la copia H2 y se demostró, con `tsc --noEmit`
  (exit 2, 143 errores nuevos contra una línea base en 0), que `scheduling` **no** compila sin
  ellos — 5 errores caen dentro del propio módulo. Veredicto declarado: `TRANSITIONAL_ISOLATION`,
  con las tres dependencias residuales nombradas (`clinical`, `messaging`, `community`).
- **H3 — Empaquetado y versión del artefacto**: artefacto de 117 archivos en
  `artefacto-h3/` (código real, DDL propio, lockfile, evidencia, `MANIFEST.md`), versión
  `scheduling-module-v0.1.0-transitional`, hash sha256 pegado, commit de origen `5d5007fb`.
  Escaneo de secretos y de datos reales de personas: ambos limpios. Tabla de gates A1–A8 con
  cada fila resuelta como PASS, FAIL o `NOT_RUN` — ninguna en verde por conveniencia.

## A medias

Ninguna. Cada microtarea que se abrió esta noche llegó a un estado terminal (HECHO, FAIL
declarado o BLOQUEADO) — no quedó nada en `EN CURSO`.

## Pendiente

- **H4 — Estabilizar el baseline y probar la migración conjunta**: BLOQUEADO. Exige el
  baseline de **producto completo** (1 184 tablas, ~1,46M filas de seed vía
  `mantra-core-health-model/salud-db/rebuild_stack.py`), una escala de infraestructura mayor
  que la instancia chica de `scheduling` ya autorizada esta noche. Se verificó que existe el
  intérprete (`py`, Python 3.14.0) y el script; no se ejecutó porque es una decisión de infra
  nueva — la regla del workspace es que esa decisión es de Itzan, y una autorización vale solo
  para la sesión en que se dio, no se estira por analogía. Detalle:
  `evidencia/H4-bloqueo-decision-infra.md`.
- **H5 — Empaquetar el candidato final** y **H6 — Reejecutar los gates**: BLOQUEADO en cascada,
  dependen de H4.

## No cubierto

- El aislamiento real de `clinical` (más allá de nombrar la dependencia) — el prompt solo pidió
  retirar mensajería y comunidad en H2; `clinical` queda para una decisión de corte posterior
  (Q-15 del documento fuente, para coordinación).
- Cualquier verificación en el navegador o de UI: esta tarea es puramente backend/infra.

## Desvíos y decisiones

- D-1 (Docker autorizado para una instancia efímera propia, nunca el stack compartido) —
  registrado en `PLAN.md` desde el arranque de la noche.
- Ambigüedad de la sección 1.3 del prompt (leer 25 skills antes del `PLAN.md`) vs. regla 70.5
  (`context-thrift`): resuelta cargando `skills-router` como entrada obligatoria y el resto
  bajo demanda — registrada, no resuelta por conveniencia. A confirmar con quien mantiene el
  estándar.
- H3.S1.M3 no cumple su CA literal (el artefacto sí trae imports a los vecinos, porque
  empaquetar la versión "limpia" de H2 no compila) — se declaró `FAIL` en esa fila en vez de
  forzar un artefacto roto o silenciar el import.

## Riesgos

- Si alguien retoma H4 sin leer este reporte, puede intentar el rebuild completo contra
  `night-scheduling-pg` (la instancia de H1) en vez de una instancia propia — eso mezclaría el
  alcance de dos hitos con niveles de riesgo distintos. Usar una instancia nueva, con label
  propio (`night-purpose=full-baseline-h4`), si se autoriza.

## Evidencia (índice)

Todo en `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/` y `artefacto-h3/`:
`H1.S1.M1-imports-literales.txt` · `H1.S1.M2-M4-clasificacion-imports.md` ·
`H1.S2.M1-M3-M4-orm-y-transaccion.md` · `H1.S2.M2-M5-propuestas.md` ·
`H1.S3.M1-docker-postgres.txt` · `H1.S3.M1-docker-postgres-hallazgo.txt` ·
`H1.S3.M2-M5-identidad-y-limpieza.txt` · `H1.S3.M3-M4-ddl-y-roles.txt` ·
`H2.S1.M1-copia-y-destruccion.txt` · `H2.S1.M2-M3-retiro-e-inventario.txt` ·
`H2.S2-gates-en-la-copia.txt` · `H2.S3-veredicto-honesto.md` ·
`H4-bloqueo-decision-infra.md` · `artefacto-h3/MANIFEST.md`.
