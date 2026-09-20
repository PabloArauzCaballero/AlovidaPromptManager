# Action log — carril de Pablo, 2026-09-19/20

Registro de acciones tomadas fuera del plan original del prompt (`CorteLaboratorioYRegresion.md`),
con su causa, su efecto y el plan de acción para lo que quedó abierto. El detalle completo de cada
hito está en [`CORTE-2026-09-19.md`](./CORTE-2026-09-19.md) y en el
[daily](../Pablo-Daily-Noche-2026-09-19.md); esto es el resumen ejecutable para quien retome.

## 1. Qué se hizo que no estaba en el prompt original

| Acción | Por qué | Resultado |
|---|---|---|
| Actualizar `dev` local a `origin/dev` en `mantra-core-health-api` | Pedido explícito del usuario a mitad de turno | `98e7fb5a` → `5d5007fb`, fast-forward limpio |
| Instalar el estándar (`.claude/`, `AGENTS.md`, `.agents/`) en el checkout de trabajo | Sección 1 del prompt lo exige antes de cualquier otra cosa | Instalado; el candado (`plan_gate`/`report_gate`) no quedó registrado en `settings.json` por un límite de la sesión de Claude Code (self-modification) |
| Relanzar Docker Desktop y levantar Postgres real | H2-H6 lo exigen y estaba caído; se intentó destrabar antes de declarar bloqueado (regla 65) | Postgres arriba en `127.0.0.1:5434`, sano |
| Reparar `postgres-init` (copiar `NoSQL/`+`SQL/patches` al repo hermano, agregar un guard al patch `v4.2.8`) | `postgres-init` abortaba antes de completar el esquema | `postgres-init` terminó en verde — **pero ver §3: el fix no se sube, `dev` ya lo tiene resuelto distinto** |
| Construir el laboratorio de H2 (`AgendaNoticeCapabilityLab`) | Hito H2 del prompt | 7/9 microtareas `HECHO`, PR abierto (ver §2) |
| Elegir la segunda capacidad (H3) por evidencia de código | Hito H3 del prompt | `AffiliationNoticePort` elegido, 8/8 `HECHO` |
| Simular la prueba de ausencia de Itzan (quitar `MessagingModule`, observar, revertir) | H4 sin insumo real; aplicación de la regla 65 (aislar y simular en vez de esperar) | Hallazgo: los unitarios de `scheduling` no detectan una ruptura de composición de módulos — no ejercitan el grafo de NestJS |
| Aislar `ChatAutoReplies` y luego `CommentMedia` con un doble mínimo (regla 65) | H5/H6: destrabar la integración full-app | Reveló que el bug es sistémico (§3), no puntual — se detuvo la búsqueda ahí, como la propia regla 65 exige |
| Escribir la regla 65 (`aislar-y-simular-para-no-bloquearse.md`) | Pedido explícito del usuario, para que la técnica quede obligatoria | Agregada al estándar, sincronizada, sin deriva |

## 2. Qué se sube y a dónde

| Repo | Rama | Qué | Estado |
|---|---|---|---|
| `mantra-core-health-api` | `pablo/h2-lab-avisos-agenda` → PR contra `dev` | `test/lab/agenda-notice-capability.lab.ts` + su `int-spec.ts` | PR #444 abierto (`dev` es rama protegida: push directo rechazado, `GH006`) |
| `AlovidaPromptManager` | `dev` | `CORTE-2026-09-19.md`, `ACTIONLOG.md`, daily de Pablo actualizado, regla `65-aislar-y-simular-para-no-bloquearse.md`, índice y `AGENTS.md` actualizados | Ver commit de este mismo turno |

**No se sube el fix del patch `v4.2.8`** (`database/SQL/patches/2026-09-08_v428_billing_quotations.sql`,
con un guard `\if`/`\gset`): al comparar contra `origin/dev` real se descubrió que **`dev` ya tiene
este mismo problema resuelto**, con un mecanismo distinto y más preciso (columna `n_columna` que
condiciona cuántos `CHECK` se exigen, en vez de saltar el patch entero). Subir el mío generaría un
fix duplicado y en conflicto. Queda como evidencia diagnóstica local únicamente — la causa real
(patch `v4.2.8` superado por `v4.2.18`, ambos ya en `dev`) está documentada en `CORTE-2026-09-19.md`
§7, con la corrección de este hallazgo también anotada ahí.

## 3. El hallazgo que no se cerró — plan de acción

**Qué es:** `bootstrapTestApp()` (el harness de integración que usan `fx1`–`fx9` y cualquier otro
`*.int-spec.ts` que arranque el `AppModule` completo) falla con
`MetadataError: Metadata for entity X not found`. Apareció primero con `ChatAutoReplies`; al
aislarla con un doble (regla 65), apareció con `CommentMedia`. **Los 1258 archivos de entidad del
repo usan el mismo import de decoradores** (`@mikro-orm/decorators/legacy`), así que no es una
entidad puntual rota ni un flavor de decorador incompatible — ambas hipótesis se probaron y se
descartaron con evidencia (ver `CORTE-2026-09-19.md` §13).

**Por qué no se siguió:** aislar entidad por entidad no converge — cada una revela otra detrás.
Seguir por ese camino deja de ser "aislar" y pasa a ser un intento disperso de arreglar un módulo
ajeno (`community`), que la regla 65 prohíbe explícitamente en su §4.4.

**Impacto real:** bloquea **cualquier** test de integración que arranque el `AppModule` completo,
no sólo los de agenda. Es plausible que explique fallos intermitentes de integración que el equipo
venía atribuyendo a otra causa (memoria, timeouts, `host.docker.internal`).

**Plan de acción propuesto, en orden:**

1. **Reproducir con el caso mínimo** (regla `root-cause-debugging`): un test que sólo compile
   `CommunityModule` solo (no el `AppModule` entero) y llame `orm.em.getRepository(ChatAutoReplies)`.
   Si reproduce ahí, el problema está acotado a ese módulo o a la interacción
   `TsMorphMetadataProvider` + `MikroOrmModule.forFeature`.
2. **Medir el orden de discovery real**: instrumentar (log temporal) `MetadataDiscovery.discover()`
   de MikroORM para ver en qué orden entra cada archivo `.entity.ts` y si `community`'s entidades
   quedan al final de una cola async que no se espera antes de que Nest instancie providers.
3. **Probar con `warmup` explícito**: llamar `await orm.discoverEntities()` (o el método equivalente
   de la versión instalada) **antes** de `moduleRef.compile()`, en vez de dejar que el discovery
   ocurra implícito dentro del factory de cada `forFeature()`.
4. **Si el punto 3 lo resuelve**, el fix es agregar ese `warmup` a `bootstrapTestApp()` — pequeño,
   acotado a `test/integration/harness.ts`, sin tocar `src/`.
5. **Si no lo resuelve**, escalar a quien mantenga la versión de `@mikro-orm/core` instalada
   (`7.1.7`): puede ser un bug conocido de esa versión con proyectos de más de mil entidades.

**A quién le toca:** dueño de `community`/`accounting`, o quien tenga tiempo de depurar MikroORM a
fondo — no es de P8 ni de este carril. Está entregado a Justin y Marcelo por el daily (H6).

## 4. Lo que queda genuinamente pendiente, sin insumo

| Qué | Por qué no se cerró | Quién lo destraba |
|---|---|---|
| H2.S3 (checks `L1`-`L7` del generador) | El catálogo no está en ningún documento accesible desde esta máquina; se buscó en todo el reparto y en las skills instaladas | Quien tenga `METAPROMPT_PARA_ASTRA(1).md` |
| H4 (dependencia residual real, nivel compilación) | Bloqueado por el mismo `MetadataError` sistémico de §3 — no se puede compilar el `AppModule` real ni con `MessagingModule` puesto | Depende de que se resuelva §3 primero |
| Decisión de corte (Q-15): `feat/admin-portal-catalog` 110-112 commits detrás de `dev`/`TARGET_REF` | Es una decisión de coordinación, no técnica | Pablo / quien tenga asignado ese checkout |
