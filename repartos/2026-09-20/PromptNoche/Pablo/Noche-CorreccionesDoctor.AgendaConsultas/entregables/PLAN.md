# PLAN — Pablo · turno noche 2026-09-20 · Agenda: dos solapas, el cupo manda la hora, una sola consulta

## Corte declarado

- **Repo:** `alovida/mantra-core-health` (frontend Angular)
- **Corte leído:** `68dcb562ef3dd74de03f4887c57fd836fb21be13` — `Sun Sep 20 20:59:15 2026 -0400`
  `docs(deploy): documentar Traefik por IP en vez del dominio sslip.io de Coolify`
- **El reparto decía `68969782…` (PR #554). Avanzó.** Manda el mío: `68dcb562`.
- **Rama de trabajo:** `pablo/noche-2026-09-20-agenda-consultas`, sale de `68dcb562`.
- **Worktree:** `alovida/mch-pablo-noche-agenda`
- **Estándar instalado:** 180 skills (el encargo decía 176: el catálogo creció), 14 reglas,
  `plan_gate.py --self-test` → 11 PASS, 0 FAIL. Salida en `evidencia/antes/estandar-instalado.txt`.
  `.claude/settings.json` es un archivo **versionado del repo**: se restauró con `git checkout`
  para no ensuciar el árbol. `.claude/`, `.agents/`, `AGENTS.md`, `evidencia/`, `PLAN.md` y
  `REPORTE.md` están en `.git/info/exclude`, no se commitean.

## Archivos reservados

`src/app/features/agenda/**` · `src/app/features/my-services/**` — y nada más.

## Decisiones tomadas antes de tocar código

### D1 (H2.S1.M1) — A dónde caen `vista=table`, `vista=citas` y `vista=solicitudes`

**Los tres caen al calendario** (la solapa «Consultas» nueva), que es lo que `/schedule` a secas
abre. Implementación: `pestanaActual()` deja de tener el fallback `'consultations'` y devuelve
`'calendar'` para todo lo que no sea `SCHEDULE_VIEW`. **No se redirige la URL**: el parámetro
sobrante se ignora, igual que hoy se ignora cualquier `vista=` desconocida. Motivo: una
redirección cambia el historial del navegador y rompe el «atrás» de quien llegó por un enlace viejo.

Sigue el supuesto **Q-P1** del encargo, declarado.

### D2 (H2.S2.M1) — Qué pasa con lo que sólo vivía en «Cupos»

Ver inventario en `evidencia/antes/h1s2m3-inventario-huerfanos.txt`. Dos acciones huérfanas,
no una:

1. **Reservar un cupo** → la ruta `/schedule/book/:slotId` **no se borra**. La ofrece el
   calendario: tocar un rato libre del día abre el modal de alta (H3), que es el camino nuevo.
2. **«Mover acá» (reprogramar)** → `iniciarReprogramacion()` salta hoy a `vista=cupos`
   (`agenda.ts:1475`). Con la solapa quitada, el modo de reprogramación pasa a vivir **sobre el
   calendario**: los ratos libres del día se vuelven destinos «Mover acá» mientras dure el modo.

### D3 (H1) — `enListas()` se queda sin solapas

Al quedar dos solapas, `enListas()` (`agenda.ts:830-833`) queda siempre `false` y con él
desaparecen los filtros de ventana, canceladas y sede (`#filtrosDeListas`). **No se borran**: la
ventana y el filtro de canceladas se reubican sobre el calendario, que hoy no los ofrece.
Registrado como **HALLAZGO H1-P4**.

## Simulación de contratos ajenos (regla 65) — lo que depende de Ender

Tres microtareas dependen de manejadores simulados que son de Ender (`core/mock/**`, fuera de mi
alcance). **No se declaran `BLOQUEADO` y se paran**: se nombra el contrato, se construye el doble y
se ejercita en tres niveles —correcto, límite, inválido— dentro de mis archivos de prueba.
Los identificadores de microtarea no se repiten en esta tabla a propósito: el contador de
avance (`plan_status.py`) lee las filas por su ID, y repetirlos le hacía contar de más.

| Qué depende de Ender | Contrato que falta | Doble y sus tres niveles |
|---|---|---|
| El horario extra (hito 3) | `POST /scheduling/exceptions` con `exceptionType: 'EXTRA'` y `blocks: false` | Correcto: `EXTRA` fuera del horario → crea y devuelve `blocks:false`. Límite: `EXTRA` que toca el borde exacto del horario publicado. Inválido: `EXTRA` con `hasta <= desde` → rechazo |
| La duración de la visita (hito 5) | Campo de duración configurable de la visita de laboratorio (`durationMinutes`) | Correcto: visita con `durationMinutes: 15`. Límite: sin el campo → cae al omitido de 15. Inválido: `durationMinutes: 0`/negativo → se ignora y cae al omitido |
| El bloqueo de un servicio (hito 5) | Bloqueo de servicio con `exceptionType: 'OTHER'` + `reason: 'Otros servicios'` | Correcto: `OTHER` + texto → bloquea. Límite: `reason` vacío. Inválido: tipo inventado `OTHER_SERVICES` → rechazo del validador del contrato |

## Orden de ejecución

H1 (corte + baseline) → H2 (solapas, bloqueante) → H3 (modal, hora, toggles, slots) →
H4 (semana/mes/tarjeta) → H5 (una consulta, visitador, servicios) → H6 (acciones, regresión, visual).

---

## Estado de las 55 microtareas

El detalle con comandos y salidas está en [REPORTE.md](./REPORTE.md), que es el
documento de cierre. Esta tabla existe para que el avance lo **calcule la
herramienta** (`python .claude/hooks/plan_status.py --path PLAN.md`) y no salga
de una cuenta mía.

| ID | Microtarea | Evidencia | Estado |
|---|---|---|---|
| H1.S1.M1 | Traer `origin/mockup`, declarar el SHA y salir de ahí | `68dcb562` en PLAN.md · rama propia | HECHO |
| H1.S1.M2 | Confirmar por mi cuenta que la rama no habla con ninguna API | `evidencia/antes/h1s1m2-mockbackend.txt` · `environment.ts:62` | HECHO |
| H1.S1.M3 | Levantar la maqueta y entrar | `yarn start` en 4200 · `evidencia/antes/capturas/` | HECHO |
| H1.S2.M1 | Verificar las cuatro solapas y las constantes de `vista=` | `evidencia/antes/h1s2m1-solapas.txt` | HECHO |
| H1.S2.M2 | Registrar el destino de cada valor viejo | `evidencia/antes/h1s2m2-destinos.txt` | HECHO |
| H1.S2.M3 | Inventario de lo que sólo vive en «Cupos» y en la tabla | `evidencia/antes/h1s2m3-inventario-huerfanos.txt` | HECHO |
| H1.S3.M1 | Typecheck y lint antes de tocar nada | `evidencia/antes/gates.txt` · exit 0 y 0 | HECHO |
| H1.S3.M2 | Specs de agenda como línea de base | `evidencia/antes/h1s3m2-specs-baseline.txt` · 430 verdes | HECHO |
| H1.S3.M3 | Capturar las 4 solapas y el encabezado antes | `evidencia/antes/capturas/01..07*.png` | HECHO |
| H2.S1.M1 | Decidir y escribir a dónde caen `table`, `citas` y `solicitudes` | Decisión D1 del PLAN | HECHO |
| H2.S1.M2 | Quitar la solapa de la tabla | `evidencia/h2/gates.txt` · typecheck 0 | HECHO |
| H2.S1.M3 | Los tres valores viejos resuelven al destino declarado | `evidencia/h2/kill-test-h2.txt` · capturas 02/04/05 | HECHO |
| H2.S1.M4 | Ninguna referencia viva a `vista=table` | `evidencia/h2/h2s1m4-referencias.txt` | HECHO |
| H2.S2.M1 | Verificar qué se pierde al quitar «Cupos» | Inventario H1.S2.M3 · **dos** acciones huérfanas | HECHO |
| H2.S2.M2 | Quitar la solapa «Cupos» y su tabla | `evidencia/h2/capturas/03-vista-cupos.png` | HECHO |
| H2.S2.M3 | Recorrer la reserva completa desde el calendario | `evidencia/h3/h2s2m3-reserva.txt` · 4 libres → 3 | HECHO |
| H2.S3.M1 | Renombrar «Calendario» a «Consultas» en el MISMO commit | `git show --stat 2114318a` | HECHO |
| H2.S3.M2 | Quitar los tres `page-actions` del encabezado | `evidencia/h2/capturas/08-encabezado-limpio.png` | HECHO |
| H2.S3.M3 | Declarar dónde vive ahora cada botón quitado | Tabla en el REPORTE | HECHO |
| H3.S1.M1 | Elegir el diálogo existente que se reusa, y decir por qué | `app-content-dialog` · comentario en la plantilla | HECHO |
| H3.S1.M2 | Montar la tarjeta dentro del diálogo y sacarla del pie | `evidencia/h3/capturas/01` y `02` | HECHO |
| H3.S1.M3 | Foco: entra, atrapado, `Escape`, vuelve al disparador | `evidencia/h3/h3s1-modal-teclado.txt` · 18 tabulaciones | HECHO |
| H3.S1.M4 | No se abren dos diálogos encimados | `evidencia/h3/h3s1-modal-teclado.txt` · fondo inerte | HECHO |
| H3.S2.M1 | Quitar los campos de hora cuando el alta viene de un cupo | `evidencia/h3/capturas/02-modal-abierto.png` + 3 specs | HECHO |
| H3.S2.M2 | Radios por toggles, reusando `segmented-control` | `evidencia/h3/h3s2-toggle.txt` · cero radios | HECHO |
| H3.S2.M3 | Verificar el toggle con teclado y su anuncio | `evidencia/h3/h3s2-toggle.txt` · flechas y `aria-checked` | HECHO |
| H3.S3.M1 | Los cupos del día son los del horario publicado | `evidencia/h3/h3s3-extra.txt` · 08:00–12:00 de 30 min | HECHO |
| H3.S3.M2 | Bloqueos y descansos no disponibles, y no reservables | Estado `no-disponible` + 4 specs del bloqueo | HECHO |
| H3.S3.M3 | Horario extra al final, como excepción `EXTRA` | 3 specs con la petición literal · `evidencia/h3/h3s3-extra.txt` | HECHO |
| H3.S3.M4 | Diálogo que nombre que se sale del horario | `evidencia/h3/capturas/09-extra-confirmacion.png` | HECHO |
| H4.S1.M1 | Localizar el detalle que usa el día, para reusarlo | `detalle-de-la-cita.ts`, compartido por las dos vistas | HECHO |
| H4.S1.M2 | Cada cita de la semana se despliega con ese detalle | `evidencia/h4/h4.txt` · los cinco campos | HECHO |
| H4.S1.M3 | Teclado y movimiento reducido | `evidencia/h4/h4.txt` · 32 tabulaciones · transición 1e-05s | HECHO |
| H4.S2.M1 | Los estados salen de `booking-status.ts` | 2 specs nuevos de `month-view` | HECHO |
| H4.S2.M2 | La tarjeta del mes con sus chips | `evidencia/h4/capturas/05-mes-chips.png` | HECHO |
| H4.S2.M3 | El chip dice el estado en palabras | `evidencia/h4/capturas/06-*-escala-de-grises.png` | HECHO |
| H4.S3.M1 | La tarjeta entera cliqueable sin romper sus botones | `evidencia/h4/h4.txt` · los dos casos | HECHO |
| H4.S3.M2 | El turno y el motivo viajan al destino | `?motivo=…&cita=<appointmentId>` pegada | HECHO |
| H4.S3.M3 | Manejar `rutaAtencion === null` | 1 spec · las dos causas nombradas | HECHO |
| H5.S1.M1 | Con qué dato se sabe que hay una consulta en curso | `BOOKING_IN_PROGRESS` · 1 spec | HECHO |
| H5.S1.M2 | Impedir la segunda, decir por qué y ofrecer salida | `evidencia/h5/h5.txt` · 2 specs | HECHO |
| H5.S1.M3 | Qué hace el servidor simulado si la petición llega igual | Brecha registrada · 409 contra un doble declarado | HECHO |
| H5.S2.M1 | Leer el contrato de visitas y su límite | `pharma-lab.types.ts:9-11` citado | HECHO |
| H5.S2.M2 | Tarjeta de visitador con tono propio y su palabra | `evidencia/h5/capturas/02` y `03` · 2 specs | HECHO |
| H5.S2.M3 | Los 15 minutos, tomados de donde el contrato los declare | `durationMinutes` · 2 specs · `Q-P4` declarada | HECHO |
| H5.S3.M1 | Qué vistas del horario se reciclan | `app-schedule-grid` · 1 spec | HECHO |
| H5.S3.M2 | Programar el horario y ver el bloqueo en la agenda clínica | `evidencia/h5/capturas/05` y `06` | HECHO |
| H5.S3.M3 | El motivo viaja como `OTHER` + texto | 1 spec con el cuerpo literal | HECHO |
| H6.S1.M1 | Medir los `iconOnly` antes | `evidencia/h6/h6s1m1-iconoonly-antes.txt` · **32** | HECHO |
| H6.S1.M2 | Las celdas de acción, al desplegable del sistema | `app-menu` · 3 specs · `evidencia/h6/capturas/02-*` | HECHO |
| H6.S1.M3 | Volver a medir y justificar cada uno que queda | `evidencia/h6/h6s1m3-iconoonly-despues.txt` · **6**, con motivo | HECHO |
| H6.S2.M1 | Gates estáticos y unitarios dirigidos | `evidencia/h6/h6s2m1-gates.txt` · 0, 0 y 471/471 | HECHO |
| H6.S2.M2 | Barrido y click-sweep de la maqueta, serial | Barrido 5/5 PASS; el corte base `68dcb562` reproduce los fallos ajenos en perfil y cotizaciones | HECHO |
| H6.S3.M1 | Capturar y mirar: 3 viewports x 2 temas | `evidencia/h6/INDICE-VISUAL.md` · 36 capturas · 3 defectos hallados | HECHO |
| H6.S3.M2 | Escribir el `REPORTE.md` con el avance calculado | [REPORTE.md](./REPORTE.md) | HECHO |

**Ninguna microtarea quedó en `TODO`, `EN CURSO`, `A MEDIAS`, `BLOQUEADO` ni `DESCARTADO`.**

| Hito | HECHO / total | Estado |
|---|---|---|
| H1 — Corte, maqueta y estado de partida | 9 / 9 | **HECHO** |
| H2 — De cuatro solapas a dos | 10 / 10 | **HECHO** |
| H3 — El alta: modal, sin hora, toggles, slots | 11 / 11 | **HECHO** |
| H4 — Semana, mes y la tarjeta que atiende | 9 / 9 | **HECHO** |
| H5 — Una consulta, el visitador, los servicios | 9 / 9 | **HECHO** |
| H6 — Acciones, regresión, visual y cierre | 7 / 7 | **HECHO** |

El cierre posterior de H6.S2.M2, incluida la corrida sobre `68dcb562`, está en
`evidencia/h6/h6s2m2-click-sweep-base-68dcb562.txt` y en el REPORTE.
