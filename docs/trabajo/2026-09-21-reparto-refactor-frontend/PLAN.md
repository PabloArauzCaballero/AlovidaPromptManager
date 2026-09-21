# Plan — Reparto del PROMPT MAESTRO DE REFACTORIZACIÓN FRONTEND

- Fecha: 2026-09-21 · Repos afectados: `PabloArauzCaballero/AlovidaPromptManager` (este; sólo `.md`) ·
  Repo de destino del trabajo repartido: `alovida/mantra-core-health` (**no se toca desde acá**) ·
  Predecesor: `repartos/2026-09-20/PromptNoche` (24 correcciones del doctor)
- Resultado observable: cinco personas (Ender, Itzan, Pablo, Marcelo, Justin) abren
  `repartos/2026-09-21/PromptNoche/<Persona>/` y encuentran un encargo ejecutable que cubre **las seis
  fases** del documento maestro sobre un conjunto de archivos **disjunto** del de los otros cuatro,
  anclado al corte real de `origin/mockup` y con cada hecho citado con ruta.
- Kill-test: `python tools/check_reparto.py repartos/2026-09-21` sale distinto de 0, o el conteo de
  prompts con la sección de instalación es menor que 5, o dos prompts se reservan el mismo archivo.
  Cualquiera de las tres demuestra que el reparto NO está hecho.

## Alcance

- IN: documento de origen archivado en `docs/requisitos/` · verificación contra el corte en
  `docs/verificacion/` · cinco prompts de tarea con las tres capas de la regla 20 · cinco dailies
  personales · un daily de equipo · partición de archivos disjunta y declarada · cobertura medida
  (qué entra en esta oleada y qué queda para la siguiente, con números) · `REPORTE.md`.
- OUT: **escribir una línea de código en `mantra-core-health`** — este trabajo reparte, no ejecuta ·
  crear ramas o PRs en el repo de producto · correr la suite del frontend · decidir por el equipo la
  ambigüedad del generador de `features/alovida/**` (se registra y se eleva) · tocar
  `.claude/rules/**` o `.claude/skills/**` · reasignar lo que ya estaba repartido el 2026-09-20.
- Ambigüedades registradas:

  | # | Pregunta abierta | Supuesto tomado | A quién confirmar |
  |---|---|---|---|
  | Q-A | ¿Las 161 pantallas de `features/alovida/**` se migran a componentes canónicos, o el generador `port-vistas-alovida.mjs` aprende a emitirlos? | Piloto a mano + exclusión declarada de la regeneración; la decisión de fondo se eleva | Pablo (coordinación) |
  | Q-B | ¿Los artefactos del documento maestro §17 reusan `docs/refactor-profesional/trabajo/` o nacen en carpeta nueva? | Reusar: el propio documento exige "reutiliza archivos equivalentes si existen" | Pablo |
  | Q-C | ¿El turno es día o noche? | Noche: la hora local al armar el reparto es 18:40 del 2026-09-21 | — (decisión de rutina) |

## H1 — Base factual del reparto

**CA:** Dado el documento maestro, cuando alguien pregunta contra qué versión del código se repartió
y de dónde sale cada afirmación, entonces hay un SHA declarado y un documento de verificación con
ruta y número por cada hecho — no un recuerdo de la sesión.
**DoD:** `docs/requisitos/` y `docs/verificacion/` tienen el archivo del día, y cada fila del segundo
es reproducible con el comando que trae al lado.
**Estado:** HECHO

### H1.S1 — Corte y archivo del pedido

**CA:** Dado el pedido, cuando el reparto lo cita, entonces lo cita desde el repo y no desde una ruta
de la máquina de Pablo.
**DoD:** el archivo existe bajo `docs/requisitos/` y los cinco prompts lo enlazan con ruta relativa.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar el corte de `origin/mockup` | Hay un SHA completo declarado | `git rev-parse origin/mockup` → `5a0776c6…` | HECHO |
| H1.S1.M2 | Archivar el documento maestro en `docs/requisitos/` | El archivo existe y no está vacío | `wc -l docs/requisitos/REFACTOR-FRONTEND-2026-09-21.md` → > 600 | HECHO |
| H1.S1.M3 | Escribir la verificación contra el corte | Cada hecho trae comando o ruta | `grep -c '^|' docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md` → > 30 | HECHO |

## H2 — Partición del trabajo en cinco carriles disjuntos

**CA:** Dado el reparto, cuando dos personas trabajan a la vez, entonces ninguna escribe un archivo
reservado por otra, y cada una sabe a quién pedirle lo que le falta.
**DoD:** la tabla de reserva de archivos no tiene intersección, y cada prompt nombra a los dueños de
lo que NO puede tocar.
**Estado:** HECHO

### H2.S1 — Familias y dueños

**CA:** Dado el catálogo de organismos existente, cuando se asigna una familia, entonces se asigna la
pieza canónica **que ya existe**, no una inventada.
**DoD:** cada familia del reparto apunta a una carpeta real de `shared/components/organisms/`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Medir la adopción real de cada organismo candidato | Hay un número por organismo | `git grep -l '<app-data-table' origin/mockup -- 'src/app/**/*.html' \| wc -l` → 29 | HECHO |
| H2.S1.M2 | Medir la duplicación por área | Hay un número por área | `git grep -l '<table' origin/mockup -- 'src/app/features/**/*.html'` agrupado → 81, de los cuales 70 en `alovida` | HECHO |
| H2.S1.M3 | Asignar cinco carriles sin intersección de archivos | Ningún path aparece en dos carriles | revisión de la tabla de reserva del daily de equipo | HECHO |

## H3 — Cinco prompts ejecutables

**CA:** Dado su prompt, cuando una persona lo abre, entonces puede instalar el estándar, planificar,
ejecutar, verificar y cerrar **las seis fases del documento maestro** sin volver a preguntar qué
hacer, y sabe qué queda fuera.
**DoD:** `python tools/check_reparto.py repartos/2026-09-21` sale 0 y
`python tools/check_skills_citadas.py repartos/2026-09-21` sale 0.
**Estado:** HECHO

### H3.S1 — Los cinco encargos

**CA:** Dado cualquiera de los cinco, cuando se cuenta su plan, entonces tiene hito, subtarea y
microtarea con CA y DoD en cada capa.
**DoD:** el checker de estructura pasa sobre los cinco.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Prompt de Ender — catálogo, scanner y factories | Existe y pasa el checker | `python tools/check_reparto.py repartos/2026-09-21` → OK | HECHO |
| H3.S1.M2 | Prompt de Pablo — tabla canónica + accesos y personas | idem | idem | HECHO |
| H3.S1.M3 | Prompt de Justin — directorio, terminología y datos compartidos | idem | idem | HECHO |
| H3.S1.M4 | Prompt de Itzan — formularios de registro y perfil | idem | idem | HECHO |
| H3.S1.M5 | Prompt de Marcelo — expediente, diálogos y adjuntos | idem | idem | HECHO |

### H3.S2 — Dailies y cobertura medida

**CA:** Dado el daily de equipo, cuando alguien pregunta cuánto del frontend cubre esta oleada,
entonces hay un número con su denominador, no un adjetivo.
**DoD:** el daily de equipo trae la tabla de cobertura con totales, y los seis dailies existen.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Cinco dailies personales | Los cinco archivos existen | `ls repartos/2026-09-21/PromptNoche/*/*-Daily-Noche-2026-09-21.md \| wc -l` → 5 | HECHO |
| H3.S2.M2 | Daily de equipo con cobertura medida | Trae la tabla con denominador y la oleada 2 | `grep -c 'Oleada 2' Daily-Noche-2026-09-21.md` → ≥ 1 | HECHO |

## H4 — Cierre verificado

**CA:** Dado el cierre, cuando alguien que no vio la sesión lee el reporte, entonces sabe qué quedó
repartido, qué se midió, qué quedó fuera y qué ambigüedad hay que resolver.
**DoD:** los dos checkers en verde con salida pegada, y `REPORTE.md` con sus tres secciones.
**Estado:** HECHO

### H4.S1 — Gates del reparto

**CA:** Dado el reparto terminado, cuando se corren los checkers, entonces salen 0 y su salida queda
pegada en `evidencia/`.
**DoD:** `check_reparto.py` y `check_skills_citadas.py` en 0, salida en `evidencia/`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Correr el checker de estructura | Sale 0 | `python tools/check_reparto.py repartos/2026-09-21` | HECHO |
| H4.S1.M2 | Correr el checker de skills citadas | Sale 0 | `python tools/check_skills_citadas.py repartos/2026-09-21` | HECHO |
| H4.S1.M3 | Verificar que ningún archivo esté reservado dos veces | Intersección vacía | `evidencia/reserva-disjunta.txt` | HECHO |
| H4.S1.M4 | Escribir `REPORTE.md` | Trae las tres secciones | `grep -c '^## ' REPORTE.md` → ≥ 3 | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El trabajo repartido choca con la regeneración de `features/alovida/**` | Alto: se pierde lo migrado | Q-A registrada; el piloto exige declarar la exclusión **antes** de migrar |
| Dos carriles necesitan el mismo barrel (`organisms/index.ts`) | Medio | El barrel es de escritura coordinada: se pide a Ender, no se edita en paralelo |
| El alcance es mucho mayor que un turno | Alto si se lee como compromiso | Cada prompt lo dice: lo que no cierra queda `A MEDIAS` con las cuatro respuestas |
| Repartir hechos del working copy en vez de `origin/mockup` | Alto | Todos los hechos se midieron con `git grep <ref>`; el corte va en cada prompt |
