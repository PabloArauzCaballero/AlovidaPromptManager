# Doble revisión — silueta v2 (H2.S3)

Render con Playwright/Chromium de la geometría real (`body-zones.geometry.ts`), claro, pecho elegido,
oscuro, escala de grises (01) y detalle ampliado de cabeza, mano y pies (02).

## Iteraciones
- **v1** (la publicada antes): RECHAZADA por Pablo — maniquí de bloques.
- **v2**: RECHAZADA en mi pasada 2 — proporciones de muñeco (piernas 30 % del alto), ojos en «∞».
- **v3**: RECHAZADA en mi pasada 2 — brazos-tubo pegados al tronco, manos-pelota, pies-campana,
  hombro en percha.
- **v4** (esta): pasadas 1 y 2 abajo.

## Pasada 1
- 01 — OK: se lee un cuerpo humano de frente, 7 zonas, elegida con relleno + trazo, se distingue en grises.
- 02 — OK: cabeza con mandíbula y orejas, mano más angosta que el antebrazo, pies hacia afuera.

## Pasada 2 (adversarial)
1. Lo primero que se ve mal: la banda de los ojos se lee como antifaz. `MENOR` (es un objetivo ≥ 24 px).
2. Texto cortado: no hay texto en la figura. N/A.
3. ¿Terminado o prototipo? Figura esquemática plana, estilo mapa corporal de apps de salud. Aceptable.
4. Coherencia: usa los tokens del sistema (CSS sin cambios). OK.
5. Oscuro: nada desaparece. OK.
6. Estados: sin zonas no dibuja (spec). OK.
7. Jerarquía: la figura no compite con las pastillas. OK.
8. Datos: ninguno. OK.
9. Requisito P-01: silueta cliqueable por zona. OK.
10. Por qué lo rechazaría: manos y pies siguen siendo esquemáticos, sin dedos. `MENOR`.

## Nota: ACEPTABLE CON RESERVAS
Reservas: antifaz de ojos y manos/pies sin detalle — decisión: a 196 px más detalle no se ve y achica objetivos.

## No cubierto
Captura dentro de la app en 375/768/1440 (el CSS y el componente no cambiaron, sólo el `d`).
