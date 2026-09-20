# H3 — Rutas de configuración verificadas en documentación oficial

Consulta hecha el 2026-09-19. **Esto verifica dónde dice cada documentación que van sus archivos.
No verifica que la herramienta los cargue en la práctica**: eso requiere abrir el repo con cada una.

## H3.S1.M1 — Las tres que el equipo nombró

| Herramienta | Ruta de reglas de proyecto, según su documentación | ¿Lee `AGENTS.md`? | Fuente consultada | Acción |
|---|---|---|---|---|
| **Windsurf** | `.devin/rules/*.md` (preferida) · `.windsurf/rules/*.md` (legado) · `.windsurfrules` en la raíz (legado, single-file) | **Sí.** Las reglas *"can also be inferred from AGENTS.md files"*, procesadas por el mismo motor: raíz = always-on | `https://docs.windsurf.com/windsurf/cascade/memories` → redirige 307 a `https://docs.devin.ai/desktop/cascade/memories` | **No se escribe archivo nuevo.** Ya cubierta por `AGENTS.md` |
| **Cline** | `.clinerules/` o `.cline/rules/` en la raíz (ambos son carpetas, no archivos) | **Sí.** Lista `AGENTS.md` en la raíz y `~/.agents/AGENTS.md` como *"standard format for cross-tool compatibility"* | `https://docs.cline.bot/features/cline-rules` | **No se escribe archivo nuevo.** Ya cubierta por `AGENTS.md` |
| **Continue** | `.continue/rules/` en la raíz, archivos `.md`, cargados en orden lexicográfico (de ahí el prefijo `00-`) | **No.** Su documentación no menciona `AGENTS.md` en ningún lado | `https://docs.continue.dev/customize/deep-dives/rules` | **Se escribe** `.continue/rules/00-estandar-de-la-casa.md` |

**Criterio aplicado:** no se crea un archivo cuando ya existe el equivalente que la herramienta lee.
Una copia más del estándar es una copia más que puede quedar desincronizada — que es exactamente el
problema que `tools/sync_agents.py` existe para evitar. Solo Continue quedaba sin cubrir.

## H3.S1.M3 — Las que se supone que ya estaban cubiertas

| Herramienta | Estado | Fuente |
|---|---|---|
| Codex (OpenAI) | Cubierta por `AGENTS.md` | `https://agents.md/` |
| Gemini CLI (Google) | Cubierta por `AGENTS.md` | `https://agents.md/` |
| Aider | Cubierta por `AGENTS.md` | `https://agents.md/` |
| Cursor | Cubierta por `AGENTS.md` **y** por `.cursor/rules/estandar-de-la-casa.mdc` (ya existía) | `https://agents.md/` |
| GitHub Copilot | Cubierta por `AGENTS.md` **y** por `.github/copilot-instructions.md` (ya existía) | `https://agents.md/` |

**Límite de esta verificación, declarado:** la lista de herramientas compatibles sale del sitio del
propio estándar `agents.md`, **no de la documentación de cada proveedor**. Para Windsurf, Cline y
Continue sí se consultó la documentación del proveedor, que es la fuente de mayor jerarquía
(regla 00, §8). Para Codex, Gemini CLI y Aider la afirmación descansa en una sola fuente secundaria.

### Cita literal de la lista de `agents.md`

> "Codex from OpenAI, Jules from Google, Factory, Aider, goose, opencode, Zed, Warp, VS Code, Devin
> from Cognition, Autopilot & Coded Agents from UiPath, Junie from JetBrains, Amp, Cursor, RooCode,
> Gemini CLI from Google, Kilo Code, Phoenix, Semgrep, Coding agent from GitHub Copilot, Ona,
> Windsurf from Cognition, Augment Code"

Continue **no aparece** en esa lista, lo que coincide con lo que dice su propia documentación.

## Lo que esta verificación NO demuestra

- Que alguna de estas herramientas **cargue efectivamente** el archivo al abrir este repo.
  Ninguna se ejecutó. Eso sigue en "No cubierto" desde el trabajo anterior.
- Que la documentación consultada esté al día respecto de la versión que use el equipo.
- El comportamiento de `.windsurfrules` o de la ruta `.devin/rules/`: se leyeron, no se probaron.
