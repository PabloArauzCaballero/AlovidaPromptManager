# AlovidaPromptManager

Estándar de ingeniería, diseño y operación de la empresa, escrito como skills de Claude Code.

No es una colección de apuntes: es el manual de la casa. Cada skill dice **qué hacer**, **cómo
comprobarlo** y **qué evidencia hace falta** para poder afirmar que está hecho. Son reutilizables
entre proyectos, pero están escritas para el stack real que usamos.

## Empezá acá

**[`skills-router`](.claude/skills/skills-router/SKILL.md)** — el índice. Mapea la situación
concreta (arrancar una tarea, tocar un endpoint, diseñar una pantalla, desplegar, cerrar un carril)
a la skill que hay que cargar, y fija la precedencia cuando dos se contradicen.

Con 178 skills, leer el catálogo entero no sirve. El router sí.

## Cómo se usa

Copiá o enlazá `.claude/skills/` dentro del repo donde estés trabajando. Claude Code las carga
sola cuando la `description` matchea la tarea; también podés invocarlas por nombre.

Los **hechos de cada proyecto** (comandos reales, invariantes del modelo, prohibiciones, rutas)
no viven acá: viven en el `CLAUDE.md` de ese proyecto, y **mandan sobre cualquier skill**. Cómo
escribir ese archivo está en `claude-md-authoring`.

## Qué hay adentro

| Área | Cant. | Qué cubre |
|---|---|---|
| **Disciplina del agente** | 12 | Evidencia, anti-alucinación, alcance, causa raíz, cierre de turno. Los gates que mandan sobre todo lo demás. |
| **Oficio del repo** | 8 | Escribir skills, prompts, evals, subagentes, hooks, gobernanza. El manual de su propio producto. |
| **Backend** | 18 | Arquitectura, NestJS, MikroORM, PostgreSQL, concurrencia, errores, auth, multi-tenancy, colas, jobs, caché, notificaciones, archivos, búsqueda, tiempo real, mapas, moderación. |
| **Datos y modelo** | 7 | Esquema dirigido por modelo, PlantUML, seeds con procedencia, calidad, auditoría, backups, tooling Python. |
| **Frontend web** | 26 | Angular 21 + SSR, signals, formularios, componentes, CSS, diseño visual, calidad UI, accesibilidad, responsive, performance, i18n, SEO, Astro. |
| **Mobile** | 7 | Flutter: desarrollo, estado, tema, tests, offline, release. |
| **QA** | 20 | Estrategia, orquestación, unitarios, API, integridad, E2E, triage, datos sintéticos, casos límite, exploratorio, UAT, evidencia. |
| **Seguridad** | 14 | Guardrails, authn/authz, threat modeling, revisión con lente de seguridad, evaluación sobre sistemas propios, reporte y remediación. |
| **Dominio salud** | 7 | PHI, consentimiento, registro clínico, FHIR, terminología, seguridad de medicación, cumplimiento. |
| **Dominio negocio** | 6 | Partida doble, cotizaciones, agenda, seguros, feed social, directorios. |
| **Calidad de código** | 10 | Clean code, SOLID, eficiencia, gates, linting, complejidad, deuda, código muerto, auditoría, code review. |
| **Proceso y GitHub** | 21 | Carriles, requisitos, slicing, bugs, git multi-repo, PRs, issues, rulesets, releases, ADRs, dependencias, incidentes. |
| **Despliegue** | 11 | Coolify, Docker, CI/CD, release y rollback, secretos, hardening, entorno Windows. |

## Las reglas que atraviesan todo

1. **Verificar es observar el artefacto real corriendo.** Leer el código no cuenta. Compilar no
   cuenta. Toda afirmación va con la salida literal pegada, y con la sección "No cubierto".
2. **No inventar.** Antes de crear una entidad, endpoint, catálogo o API, localizar el equivalente
   existente. Las ambigüedades se registran, no se resuelven por conveniencia.
3. **Diff mínimo.** Nada de refactors, renombres ni "aprovechadas" fuera de lo pedido.
4. **Los datos de salud mandan.** Si el cambio toca datos de personas, `data-privacy-phi` aplica
   aunque nadie lo haya pedido.
5. **Datos reales con procedencia, o sintéticos declarados.** Nunca datos ficticios presentados
   como reales, ni datos de producción en entornos de prueba.

## Estado

Las skills fueron verificadas contra documentación oficial al momento de escribirlas (`angular.dev`,
`docs.nestjs.com`, MikroORM, PostgreSQL/PostGIS, Playwright, `docs.github.com`, `coolify.io/docs`,
OWASP, W3C/WCAG, `web.dev`, `hl7.org/fhir`, `docs.flutter.dev`). Donde un dato no se pudo confirmar,
la skill lo dice explícitamente en vez de afirmarlo.

Esto envejece. Antes de editar una skill, leé `prompt-governance-versioning`; antes de publicar el
cambio, `prompt-evals`.
