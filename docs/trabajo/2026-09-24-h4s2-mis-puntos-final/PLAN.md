# Plan — Cierre de H4.S2 de Ender: «Mis puntos» con el contrato final de Itzan

- Fecha: 2026-09-24 · Repos afectados: `mantra-core-health` (rama follow-up a `mockup`), `AlovidaPromptManager`
  (este PR) · Carril: `Noche-SimuladorYCabecera.MockNavegacion` del reparto 2026-09-22.
- Predecesores: PR #604 de producto (MERGED, `923397c4`) y PR #37 de PromptManager (MERGED por squash, `2a8ebfac`).

## Provenance del handoff

| Campo | Valor |
|---|---|
| Archivo | `D:\Universidad_2026\PEDIDO-A-ENDER-mis-puntos.md` (Itzan, 2026-09-23, actualizado 2026-09-24) |
| SHA-256 | `8339abc0aea6b5b02c4104b11ec23d41ef7a8b8dfbec6fa1690772aed0b90675` · 5287 bytes |
| Rama de Itzan | `origin/itzan/perfil-medico-configurar-tu-perfil` @ `7bb08ca96e2a982df721c489bfa275ece028d6d5` |
| En `mockup` | **Sí, por squash**: PR #606 → `de4f6d41` (2026-09-24 04:56Z). La punta de la rama no es ancestro de `mockup` (squash), pero el contenido sí está |
| `origin/mockup` al trabajar | `e7437a5eb33556067c0ff77bde9c24d19b792ae0` (el orquestador había visto `d6becdd0`; entró #654 encima) |
| Contraste con el código | Coincide en lo que pide: destino `?pestana=puntos`, `indiceDePestana`, comentarios de `app.routes.ts`/`navigation.map.ts`/`shell-layout.spec.ts`, `redirectTo` sin guard. Su tabla de claves dice «Seguros y tutores»: #654 (Justin) la separó y `PESTANA.puntos` pasó de 4 a 5, y la clave `puntos` sigue valiendo |
| Diferencia con el pedido del orquestador | El handoff dice que el query de la ruta vieja «no hace falta» conservarlo; Ender pidió conservarlo. No se contradicen: se conserva |

## Resultado

**Actor:** paciente con un enlace guardado a `/my-account/loyalty`; profesional con el mismo enlace.
**Dónde:** `app.routes.ts` (`SECCIONES_REDIRIGIDAS`), `core/navigation/**`, specs de rutas y menú.
**Estado inicial:** `/my-account/loyalty` → `/my-account` (fallback regla 65, abre «Datos personales»).
**Observable:** `/my-account/loyalty[?q]` termina en `/my-account?pestana=puntos[&q]` con «Mis puntos» seleccionada.
**Fuera:** `features/account/my-profile/**` (Itzan), la molécula `tabs` (no se desplaza hasta la pestaña que llega
preseleccionada), conflictos ajenos del daily de equipo y merges.
**Kill-test:** el query previo se pierde, la médica cae en una pantalla rota o «Mis puntos» vuelve al menú.

## H4.S2 — Los renglones a pedido (cierre)

| ID | Microtarea | CA | DoD | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Renglón «Cotizaciones» | Visible para el paciente | captura | HECHO (sin cambios) |
| H4.S2.M2 | Redirect `/my-account/loyalty` a la pestaña | La URL vieja llega a la pestaña, con el query | captura + recorrido | HECHO |
| H4.S2.M3 | Specs con el contrato final | Verde, aserción específica | comando de spec | HECHO |
| H4.S2.M4 | Regla 65: declaración propia actualizada | Dailies propios sin «esperando a Itzan» | este PR | HECHO |
