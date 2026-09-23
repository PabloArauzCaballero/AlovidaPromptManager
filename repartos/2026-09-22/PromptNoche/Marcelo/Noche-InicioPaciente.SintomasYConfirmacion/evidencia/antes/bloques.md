# Los cuatro bloques de la pantalla de inicio del paciente (H1.S2.M2)

Corte `b655e844`, `paciente@alovida.mock`, `/dashboard`, leído del árbol de accesibilidad (snapshot de Playwright)
y de `patient-home.html`. De arriba a abajo:

| # | Bloque | Cómo se llama en el código | Qué muestra hoy |
|---|---|---|---|
| 1 | «¿Cómo te sentís?» | `app-card[data-testid="mi-salud-sintomas"]` → `<app-symptom-check>` (`patient-home.html:20-36`) | 10 pastillas de zonas, un `<details>` plegado «O escribilo con tus palabras» con el `app-textarea` adentro, y el descargo |
| 2 | «Tu próxima cita» | `section.proxima-cita[data-testid="mi-salud-proxima-cita"]` (L69-176) | miércoles 23 de septiembre, 09:30–10:00, profesional, sede, motivo, «Ver o reprogramar» |
| 3 | Tira de resumen | `ul.mi-salud__resumen` (L182-224) | «Tu última receta» (3 de septiembre, 2026 · Ver y descargar) · «Tu última atención» (21 de septiembre, 2026 · Ver mi historia) |
| 4 | **«Ir a lo tuyo»** (grilla de accesos) | `nav.mi-salud__accesos[aria-label="Ir a lo tuyo"]`, enlaces `data-testid="mi-salud-acceso"` (L231-258; `accesos()` en `patient-home.ts:152-185`) | 6 tarjetas: Mis citas · Mi historia · Chats · Directorio de médicos · Directorio de laboratorios · Mis datos — **todas repiten destinos que ya están en el menú lateral** (Mis citas, Chats, Directorios, Mi historia clínica, Mi perfil) |

Supuesto Q-13: «el panel de abajo que no sirve para nada» = el bloque 4. Se le pregunta a Pablo con la captura
`capturas/01-dashboard-1440-claro.png` antes de retirar nada.

**Respuesta (2026-09-23, Pablo en la sesión, con la captura `01-dashboard-1440-claro.png` a la vista): el panel de
abajo es la grilla «Ir a lo tuyo» (bloque 4).** Q-13 cerrada; H3.S3 la retira.
