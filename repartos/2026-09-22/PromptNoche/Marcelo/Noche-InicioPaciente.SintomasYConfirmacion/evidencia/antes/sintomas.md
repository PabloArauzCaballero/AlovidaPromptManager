# El chequeo de síntomas ejercitado ANTES de tocar nada (H1.S2.M4)

Corte `b655e844`, `/dashboard` con `paciente@alovida.mock`, 1440 px, Chromium.

## Recorrido 1 — Pecho → «dolor de pecho» → alarma

1. Clic en la pastilla `zona-pecho` («Pecho y respiración») → el botón pasa a `expanded` y aparece la lista
   `zona-abierta` con 5 chips: tos · dificultad para respirar · dolor de pecho · palpitaciones · presión alta.
2. Clic en «dolor de pecho» → el chip queda `pressed`; la región viva anuncia «Reconocimos: dolor de pecho.»;
   aparece «Te entendimos» con el chip quitable y «Empezar de nuevo».
3. **Alarma**: `role="alert"` «Esto no puede esperar a un turno» — «Lo que contás —dolor de pecho— puede ser
   una urgencia. **Andá ahora a una guardia o llamá a emergencias.**» No hay recomendación de especialidad
   (a propósito: `symptom-check.ts:210-216`).

Captura: `capturas/08-sintomas-pecho-alarma.png`. Observación directa del árbol de accesibilidad (snapshot de Playwright).

## Recorrido 2 — Panza → «náuseas o vómitos» → recomendación

1. «Empezar de nuevo» limpia los chips y la alarma.
2. Clic en `zona-panza` («Panza y digestión») → `expanded`; chips: dolor de panza · diarrea · náuseas o vómitos · acidez o reflujo.
3. Clic en «náuseas o vómitos» → `pressed`; región viva «Reconocimos: náuseas o vómitos.»; «Te entendimos» con el chip.
4. **Recomendación**: «Conviene que veas a» → Gastroenterología («Por náuseas o vómitos») y Medicina general
   («Por náuseas o vómitos»), cada una con «Ver quién atiende».

Captura: `capturas/09-sintomas-panza-recomendacion.png`.

## Consola y red (H1.S2.M5)

- `consola.txt`: sólo los 2 errores de CSP sobre scripts inline del propio `ng serve` (previos, al cargar `/auth`);
  ninguno del chequeo de síntomas ni del panel.
- `red.txt`: ninguna petición no estática — `mockBackend: true` contesta dentro del interceptor sin salir a la red; los
  244 estáticos son el bundle de desarrollo.
