# HALL-M1 — la sesión del paciente pierde el rol PATIENT en caliente (observado, causa no reproducida)

**Qué se observó** (2026-09-23, maqueta `b655e844` en `ng serve`, Chromium de Playwright):

| Hora (UTC) | Acción | Qué se vio |
|---|---|---|
| 04:30:23 | Login `paciente@alovida.mock` → `/dashboard` a 1440 px | Pantalla del paciente (`app-patient-home`): síntomas, próxima cita, resumen, grilla. Menú con Mis pedidos / Mis puntos / Promociones / Lugares cercanos |
| 04:31–04:33 | Capturas 1440 claro y oscuro (`01`, `02`) | Igual |
| ~04:33–04:53 | Pausa (pregunta a Pablo); **sin navegar ni recargar** | — |
| ~04:53 | `setViewportSize(768)` + captura `03` | **Panel genérico** («Tus accesos», árbol de zonas), menú **sin** Mis pedidos / Mis puntos / Promociones / Lugares cercanos, grupo «Herramientas» visible. `dashboard.html:6` decide por `esPaciente(roles)` → los roles ya no traían `PATIENT` |
| 04:54:56 | `page.goto('/dashboard')` | Redirige a `/auth`: la sesión es en memoria (ADR-0006), esperado |
| 04:55:35 | Login de nuevo a 768 px | Pantalla del paciente otra vez (captura `04`) |

**Hipótesis refutada:** refresh del token con otros roles. `mock-session.ts:199` `VIDA_TOKEN_SEGUNDOS = 8 h`;
`usuarioDeRefreshToken` devuelve el mismo `MockUser` (L225-229) y el usuario `paciente` tiene `roles: ['PATIENT']` (L104).
No hubo 401 ni refresh en la Red observada.

**Lo que no se hizo:** no se buscó más la causa (fuera de alcance del carril; regla 00 §3.2). Queda para el dueño del
simulador/auth (Ender): reproducir dejando la sesión quieta ~20 min y mirar `auth.roles()` y la Red. Impacto para
este carril: las capturas se toman **inmediatamente** después de entrar.

Clase provisional (regla 80.4): `PRODUCT_BUG` o `ENVIRONMENT` — **sin clasificar con evidencia** hasta reproducir.
