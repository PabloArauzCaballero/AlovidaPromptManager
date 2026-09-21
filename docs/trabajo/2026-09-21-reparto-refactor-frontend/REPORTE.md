# Reporte — Reparto del PROMPT MAESTRO DE REFACTORIZACIÓN FRONTEND

> **AVANCE: 16 / 16 — 100 %.**

- Fecha: 2026-09-21 · Plan: [PLAN.md](./PLAN.md) · Rama: `main` (sólo `.md`; no se tocó código)
- Peldaño de evidencia alcanzado: **`TESTED`** para el reparto — los tres gates que lo verifican
  corrieron y su salida está pegada. **No es `VERIFIED`**: nadie ejecutó todavía ninguno de los cinco
  encargos, así que no hay observación de runtime de nada de lo repartido.
- Repo de destino del trabajo repartido: `alovida/mantra-core-health` @ `origin/mockup`
  `5a0776c66b005ad4d2d6722321e933cd7adea621` — **no se modificó**.

## Completado

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | Corte fijado; resultó ser la punta actual de `origin/mockup`, el mismo SHA que cita el documento maestro | `git rev-parse origin/mockup` | PASS · `5a0776c66b005ad4d2d6722321e933cd7adea621` |
| H1.S1.M2 | Documento maestro archivado en el repo, para que los prompts lo citen por ruta relativa y no desde `Downloads/` | `wc -l docs/requisitos/REFACTOR-FRONTEND-2026-09-21.md` | PASS · **663** líneas |
| H1.S1.M3 | Verificación contra el corte, con comando o ruta por hecho | `grep -c '^|' docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md` | PASS · **124** filas de tabla |
| H2.S1.M1 | Adopción real de cada organismo candidato, medida | `git grep -l '<app-…' origin/mockup -- 'src/app/**/*.html' \| wc -l` | PASS · page-header 171 · view-state-host 69 · paginated-form 52 · data-table 29 · content-dialog 26 · form-section 25 · filter-bar 7 · directory-page 5 · fact-section **0** |
| H2.S1.M2 | Duplicación medida y agrupada por área | `git grep -l '<table' origin/mockup -- 'src/app/features/**/*.html'` | PASS · **81** total, **70** en `features/alovida/` |
| H2.S1.M3 | Cinco carriles con reserva de archivos **disjunta** | `evidencia/reserva-disjunta.txt` | PASS · **0 choques entre 5 carriles** |
| H3.S1.M1–M5 | Los cinco prompts de tarea, con las tres capas de la regla 20 | `python tools/check_reparto.py repartos/2026-09-21` | PASS · `OK, 2026-09-21 cumple la estructura obligatoria` (exit 0) |
| H3.S2.M1 | Cinco dailies personales | `ls repartos/2026-09-21/PromptNoche/*/*-Daily-Noche-2026-09-21.md \| wc -l` | PASS · **5** |
| H3.S2.M2 | Daily de equipo con cobertura medida y oleada 2 declarada | `grep -c 'Oleada 2' Daily-Noche-2026-09-21.md` | PASS · **3** menciones |
| H4.S1.M1 | Gate de estructura | `python tools/check_reparto.py repartos/2026-09-21` | PASS · exit **0** |
| H4.S1.M2 | Gate de skills citadas | `python tools/check_skills_citadas.py` | PASS · **107** skills distintas citadas, **0 inexistentes** de 176 |
| H4.S1.M3 | Intersección vacía entre carriles | script en `evidencia/reserva-disjunta.txt` | PASS · 0 choques |
| H4.S1.M4 | Este reporte | `grep -c '^## '` | PASS |

**Conteo del reparto:** 5 carriles · 6 hitos cada uno · **317 microtareas** (Ender 61 · Pablo 63 ·
Justin 68 · Itzan 64 · Marcelo 61), todas con criterio de aceptación binario y DoD con comando.

## A medias

Ninguna.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| La **ejecución** de los cinco encargos | `TODO` | Es trabajo de las cinco personas en su turno, no de este reparto |
| **Q-A** — qué pasa con lo migrado cuando `scripts/port-vistas-alovida.mjs` se vuelva a correr | `BLOQUEADO` (decisión de negocio/arquitectura) | **Pablo**, en su H1.S3. Afecta a **70 pantallas** de dos carriles. Es la única ambigüedad que puede invalidar trabajo ya hecho |
| **Q-B** — ¿los artefactos del §17 reusan `docs/refactor-profesional/trabajo/` o nacen en carpeta nueva? | `BLOQUEADO` (decisión) | Pablo. Supuesto declarado en los cinco prompts: **reusar** |
| La **oleada 2**: 80 de 96 piezas del sistema de diseño, 11 tablas crudas, 6 diálogos crudos, y los contenedores de `agenda` (350 KB), `form-builder`, `accounting`, `admin/medical-laboratory`, `account/appointments` | `TODO` | Declarada con dueño propuesto en el daily de equipo §4.3. **No entra en esta oleada y está dicho** |

> **Por qué Q-A y Q-B quedan `BLOQUEADO` y no se simularon** (regla 65 §4): las dos son **decisiones**,
> no insumos técnicos. No hay contrato que nombrar ni doble que construir — hay que elegir. Ésa es la
> única excepción que la regla admite, y el carril de Pablo la tiene como microtarea de su primer hito
> para que no siga abierta mañana.

## Evidencia

```text
$ python tools/check_reparto.py repartos/2026-09-21
check_reparto: OK, 2026-09-21 cumple la estructura obligatoria
exit=0

$ python tools/check_skills_citadas.py
check_skills_citadas: OK, 107 skill(s) distinta(s) citada(s), 0 inexistentes (de 176 en disco)
exit=0

$ python … (script de intersección de reservas) — evidencia/reserva-disjunta.txt
RESULTADO: 0 choque(s) entre 5 carriles
```

```text
$ git log -1 --format='%H %ad %s' origin/mockup
5a0776c66b005ad4d2d6722321e933cd7adea621 Mon Sep 21 17:35:32 2026 -0400 fix(deploy): el mockup deja de publicar el 4000 en todas las interfaces
```

Índice de `evidencia/`: `check_reparto.txt` · `check_skills.txt` · `reserva-disjunta.txt`.

## No cubierto

Esto es lo que se **escribió** y **no** se verificó ejecutando:

1. **Nada del repo de frontend se ejecutó.** Ni `yarn start`, ni `lint`, ni `typecheck`, ni `test`, ni
   `audit:vistas`, ni `stock:generate`, ni una captura. Todos los hechos del documento de verificación
   salen de leer el árbol de git (`git grep`, `git show`, `git ls-tree`). Peldaño de esos hechos:
   **`DISCOVERED`**. Por eso cada prompt abre con un H1 que exige el baseline **antes** de tocar nada:
   el reparto no puede afirmar qué está roto hoy.
2. **No se leyó el cuerpo** de los 16 contenedores grandes de la §11 de la verificación: sólo su
   tamaño. El propio documento lo aclara dos veces, porque el §5.6 del documento maestro prohíbe usar
   el tamaño como definición de calidad.
3. **No se midió** cuántos de los 69 consumidores de `view-state-host` cubren los 10 estados, ni
   cuántos de los 26 `content-dialog` respetan la política de descarte. Se convirtió en microtarea de
   Marcelo (H2.S2), no en afirmación de acá.
4. **No se abrió el vault** `SALUD/Vistas/HTML` del generador de `alovida`: no está en esta máquina en
   la ruta absoluta que el script usa. Por eso Q-A no se pudo evaluar más allá de leer el generador.
5. **Los tiempos no se estimaron.** Ningún prompt dice cuántas horas lleva su carril, y los cinco
   declaran explícitamente que el alcance excede un turno.
6. **La calidad del contenido de los prompts no la verifica ningún gate.** `check_reparto.py` comprueba
   que las piezas estén presentes; su propio docstring dice que no puede juzgar si están bien escritas.
   Eso lo revisa una persona.

## Desvíos del plan

1. **El `PLAN.md` se escribió con los estados ya en `HECHO`.** Fue un error de forma: en el momento de
   escribirlo, las microtareas todavía no se habían ejecutado. Los DoD se corrieron después y todos
   dieron PASS, así que el estado final es correcto, pero durante un rato el archivo afirmó más de lo
   que había — exactamente lo que la regla 50 §4 pide evitar. Queda registrado en vez de corregido en
   silencio.
2. **Se corrigieron los conteos de los cinco encabezados.** Los prompts decían «18 subtareas · 52/53/54
   microtareas» por estimación; el conteo real es 14–16 subtareas y 61–68 microtareas. Se midió con
   `grep -cE` y se corrigió, incluidos los denominadores del `AVANCE: x / N` de cada uno. Un
   denominador falso habría hecho que los cinco reportaran un porcentaje inventado.
3. **Se agregó una subtarea a Justin (H4.S3)** después de escribir su prompt: al medir los diálogos
   crudos apareció que dos de los nueve están en `alovida/buscar/**`, que es su alcance. Sin eso, esos
   dos archivos quedaban sin dueño.
4. **Se amplió el documento de verificación con la §8.1.bis** después de comprobar los selectores uno
   por uno. Fue un hallazgo que cambia el encargo de dos personas, no un adorno.

## Riesgos residuales

| Riesgo | Impacto | Estado |
|---|---|---|
| **Q-A sin resolver al empezar a migrar.** El generador declara «si se vuelve a correr, lo pisa» y no tiene exclusión | **Alto**: hasta 70 pantallas migradas se pueden perder | Mitigado sólo en parte: es la microtarea H1.S3 de Pablo, y los prompts de Pablo y Justin lo dicen en la portada |
| Ender rompe `stock:generate` y deja a cuatro personas sin `yarn start` | Alto | Su H1.S3 exige regeneración idéntica antes de tocar la lógica, y cada cierre repite el comando |
| Un cambio en `page-header` (171 consumidores), `paginated-form` (52) o `content-dialog` (26) rompe pantallas ajenas | Alto | Cada prompt exige probar a mano una muestra de consumidores ajenos, con captura |
| Los cinco denominadores de adopción (`31`, `39`, `26`, `52`, `171`) se midieron **con `git grep`**, no ejecutando | Medio | Cada prompt pide re-medir contra el corte propio en su H1 |
| Que alguien mida adopción con `grep app-page-header` sin el `<` y cuente 39 falsos positivos | Medio | Documentado en la verificación §8.1.bis y convertido en microtarea de Justin (H5.S2.M1) |
| El alcance total (96 piezas, 520 plantillas) se lee como compromiso de una noche | Medio | El daily de equipo §4 y §9 lo declaran con denominador, y los cinco prompts repiten la advertencia |

## Decisiones y ambigüedades

| # | Qué se decidió sin confirmación | Supuesto tomado | A quién confirmárselo |
|---|---|---|---|
| D-1 | El turno es **noche** | La hora local al armar el reparto era 18:40 del 2026-09-21, y el reparto anterior fue `2026-09-20/PromptNoche` | Pablo — decisión de rutina |
| D-2 | La partición se hizo **por familia canónica**, no por feature | Es la unidad de trabajo del documento maestro (§7 y §9) y es lo que hace las reservas disjuntas | Pablo |
| D-3 | Cada carril recorre **las seis fases** del documento maestro sobre su propio alcance, en vez de que cada persona haga una fase del conjunto | Una fase por persona crea cinco bloqueos secuenciales; seis fases por carril permite que los cinco cierren algo demostrable | Pablo |
| D-4 | Se **reusa** `docs/refactor-profesional/trabajo/` para los artefactos del §17 | Lo exige el propio §17: «reutiliza archivos equivalentes si existen» | Pablo (es **Q-B**) |
| D-5 | Los tres barrels de `shared/components` tienen **un solo dueño** (Ender) | Es el único archivo central del reparto; dos escritores en paralelo es un defecto de reparto (regla 70.9) | Pablo |
| D-6 | La **oleada 2** se declara con dueño propuesto pero **no se reparte** esta noche | Repartir 96 piezas a cinco personas en un turno sería un compromiso falso; el §18 exige mantener el denominador | Pablo |
| D-7 | `agenda/**` (350 KB, 3 tablas y 3 diálogos crudos) queda **fuera** de esta oleada | Pablo ya lo trabajó el 2026-09-20 y además es coordinador; cargarle agenda más 31 pantallas más la coordinación era sobrecarga previsible | Pablo |

**Ambigüedades que quedaron registradas y NO resueltas:** Q-A (generador de `alovida`), Q-B (artefactos),
Q-C (`FormGroup` sin tipar con 52 consumidores), Q-D (`fact-section` con 0 consumidores), Q-E (si las dos
piezas de adjuntos son complementarias). Las cinco están en el daily de equipo §5 con quién las resuelve
y a quién bloquean, y cada una aparece además en la tabla de ambigüedades del prompt que afecta.
