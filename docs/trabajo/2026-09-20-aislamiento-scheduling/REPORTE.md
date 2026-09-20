> **AVANCE: 43 / 52 — 82,7 %.**

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


## H4 — Baseline (turno del 20/09 noche)

Se retomó con el stack **aislado** que autorizó Itzan: proyecto `mantra-h4-baseline`, volúmenes
propios, sin tocar el entorno compartido en ningún momento. El `.env` del checkout real no se abrió:
la conexión del cargador se apunta con un workspace sombra.

**Baseline construido y medido:** 1 201 tablas · 6 792 FK (**0 sin validar** → huérfanas imposibles
por construcción) · 9 236 índices · 65 schemas. Idempotencia probada en una tercera corrida:
`TOTAL insertados: 0 · ya existentes: 26 493 · exit 0`.

**Microtareas cerradas:** H4.S1.M2, H4.S1.M3, H4.S3.M1, H4.S3.M2.

**Dos hallazgos que valen más que el baseline:**

- **HALL-08 — la cadena de patches no es reproducible en base limpia.** `postgres-init` sale 3 en
  el patch 32 de 46. Dos lo impiden: `v428` verifica un `CHECK` sobre una columna que `v4218`
  borró (y su `CREATE TABLE IF NOT EXISTS` es un no-op porque la tabla ya está promovida al DDL
  generado), y `v4221` es una migración de un solo uso atada a una base viva — exige 17
  aseguradoras que **sólo existen en la fase `mock`** más una fila «demo» que ningún paquete
  reproduce. Mientras sigan en `patches/`, ningún entorno nuevo arranca.
  Detalle: `evidencia/H4.S1.M1-hallazgo-patches-no-reproducibles.md`.
- **HALL-09 — el módulo `pharma_lab` vive sólo en el código.** 44 tablas que el ORM declara y la
  base no tiene: 36 del módulo, 8 espejos de auditoría, 5 fantasma ya conocidas. No tiene `.puml`
  ni DDL. Es el mismo defecto del módulo 64 `audio_assets`, con precedente de cómo se cerró.
  Detalle: `evidencia/H4.S3.M1-hallazgo-modulo-solo-en-codigo.md`.

## A medias

- **H4.S1.M1** — el baseline se levanta y da conteos estables, pero **no por el camino canónico**:
  hubo que excluir los dos patches de HALL-08, declarándolo. No se escribió DDL a mano ni se tocó
  el repo del modelo.

## Pendiente

- **H4.S2** (migración conjunta) y **H5**, **H6**. Ya no están bloqueados por infraestructura.
- **H4 no puede cerrar como `HECHO`**: su propio DoD dice que la deriva detectada bloquea el
  cierre, y HALL-09 es deriva detectada. Cerrarlo exige promover `pharma_lab` al modelo, que es
  territorio ajeno.


## H4.S2, H5 y H6 (cierre del turno)

- **H4.S2 completo** (3/3) con la candidata `v4218`: aplica, el orden expandir→migrar→contraer
  está declarado, y el rollback **no es practicable** — se declara por qué y con qué plan de
  recuperación. Hallazgo: las tres etapas van en una sola transacción, así que no hay ventana de
  compatibilidad durante el despliegue.
- **H5 a medias.** El hash del artefacto **reproduce exacto** (`21fe553b9a97…`) — la verificación
  que la coordinación dejó a nombre de Itzan: **PASS**. Pero su kill-test pega: entre `5d5007fb`
  y `c2c071a4` cambiaron **4 archivos dentro del alcance empaquetado**, así que la versión
  empaquetada y la de la regresión no coinciden. No se reempaqueta (decisión de coordinación).
- **H6 a medias.** Gates reejecutados: A1 y A2 siguen en `FAIL`, A7 y A8 en `PASS` —y no por
  herencia, sino porque el contenido es bit a bit el mismo, que es para lo que sirve el hash.
  Dos filas nuevas: hash reproducible `PASS`, regresión vigente `FAIL`.

### Corrección sobre una afirmación mía anterior

Dije que los commits nuevos de la API no tocaban `src/`. Era cierto contra `4cc5ea1f`; con
`c2c071a4` ya no: `#447` y `#448` tocan **4 archivos de `src/modules/scheduling`**. Eso es
justamente lo que hace que el kill-test de H5 dé negativo, así que la corrección cambia una
conclusión y va escrita, no callada.


## Cierre de H5 y H6

Ambos quedan **A MEDIAS, 5/7**, con cada microtarea en un estado legal y ninguna inventada.

**H5.** El hash del artefacto reproduce exacto, así que A7 y A8 se sostienen sin heredar nada.
Su M1 no cumple CA —el kill-test lo detecta: 4 archivos del alcance empaquetado cambiaron en
`dev`— y su S2.M2 es `FAIL` declarado, que es el mismo hecho que A1. No se reempaqueta: lo
prohíbe la decisión de coordinación.

**H6 — y acá está el resultado que más vale del turno.** Se construyó una versión reparada
simulada en copia descartable y se midió:

```
copia intacta ................................ EXIT 0 · 0 errores
vecinos retirados + puerto atado al doble .... EXIT 2 · 138 errores
  de esos, DENTRO de la capacidad ........................ 0
```

En H2 eran 5. **Con el puerto atado a un adaptador que sólo depende del contrato, la capacidad
compila con sus vecinos físicamente ausentes.** Queda medido, antes de que exista el adaptador de
producción, que el diseño de la tarjeta siguiente funciona: A1 y A2 pasan a verde para la
capacidad. Los 138 restantes son consumidores externos ya inventariados, fuera de ella.

Se declara con la misma claridad lo que no prueba: es un doble de 32 líneas. Sustituye la espera,
no la verificación final.

**Lo que queda `NOT_RUN` y por qué:** A3–A6 y H6.S1.M2, todos colgando del arranque propio.
Simular el arranque no sería un doble de un contrato sino del sistema entero, y su verde no
diría nada sobre la capacidad. Se declara sin ejecutar antes que fabricar evidencia.
