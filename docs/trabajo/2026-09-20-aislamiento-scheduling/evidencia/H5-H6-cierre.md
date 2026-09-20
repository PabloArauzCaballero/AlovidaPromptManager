# H5 y H6 — cierre

**Fecha:** 2026-09-20 · **Artefacto:** `scheduling-module-v0.1.0-transitional` · corte `5d5007fb`

## H5 — el candidato

| ID | Microtarea | Estado |
|---|---|---|
| H5.S1.M1 | Artefacto de la versión que la regresión respalda | **A MEDIAS** — CA no cumplida |
| H5.S1.M2 | Manifiesto con versiones, hashes, resolución y conexiones | **HECHO** |
| H5.S1.M3 | Evidencias de los gates A ejecutados | **HECHO** |
| H5.S2.M1 | Ausencia de secretos y de datos reales | **HECHO** — A7 y A8 en `PASS` |
| H5.S2.M2 | El artefacto no arrastra fuentes del proveedor retirado | **FAIL declarado** |
| H5.S3.M1 | Declarar el estado de entrega del candidato | **HECHO** — `TRANSITIONAL_ISOLATION` |
| H5.S3.M2 | Registrar qué gates quedaron `NOT_RUN` | **HECHO** — A3–A6 |

**M1 — por qué no cumple.** Su kill-test es el que la detecta: entre el corte del artefacto y
`dev` cambiaron 4 archivos dentro del alcance empaquetado. No se reempaqueta, porque la decisión
de coordinación lo prohíbe; se declara el desfase.

**S2.M2 — FAIL, y es el mismo hecho que A1.** El artefacto empaqueta el código real, que sí
conserva los imports a los dos vecinos. Empaquetar la versión sin ellos habría sido empaquetar
código que no compila. Se declara, no se disfraza.

**S2.M1 — PASS que no es heredado.** A7 y A8 se sostienen porque el contenido es bit a bit el
mismo que cuando se corrieron: el hash de contenido reproduce exacto (`21fe553b9a97…`). Esa es la
diferencia entre reutilizar evidencia y probar que sigue valiendo.

## H6 — los gates sobre la versión reparada

El artefacto entregado **no está reparado**, así que H6 se ejecutó contra una **versión reparada
simulada**, construida en una copia descartable según la regla 65 y declarada como tal.

| ID | Microtarea | Estado |
|---|---|---|
| H6.S1.M1 | Typecheck y build delimitados sobre la versión reparada | **HECHO** (simulado) — **0 errores en la capacidad** |
| H6.S1.M2 | Arranque propio y aceptación local | **NOT_RUN** |
| H6.S1.M3 | Reejecutar la verificación de deriva | **HECHO** |
| H6.S2.M1 | Artefacto final con nuevo hash y manifiesto | **DESCARTADO** — por decisión de coordinación |
| H6.S2.M2 | Enlazar cada gate con la evidencia de esta versión | **HECHO** |
| H6.S3.M1 | Declarar el estado de entrega del artefacto final | **HECHO** |
| H6.S3.M2 | Gates `NOT_RUN` en la versión final | **HECHO** |

### M1 — la medición que vale, y es la respuesta a H2

Control y prueba sobre la misma copia, al mismo corte:

```
copia intacta ................................ EXIT 0 · 0 errores
vecinos retirados + puerto atado al doble .... EXIT 2 · 138 errores
  de esos, DENTRO de src/modules/scheduling/ .............. 0
```

En H2, con los vecinos retirados y **sin** el binding port-only, eran **5** —los dos adapters y
las dos líneas de `scheduling.module.ts`—. Con el puerto atado a un adaptador que sólo depende
del contrato, la capacidad compila **con sus vecinos físicamente ausentes**.

Los 138 restantes caen todos **fuera** de la capacidad (`common/storage` 24, `diagnostic_units`
14, `common/seed` 14, `iam` 6…): son los consumidores externos de `messaging`/`community` que H2
ya había inventariado como infraestructura transversal. Desaparecen solos cuando los vecinos
vuelven: **el retiro físico es el método de medición, no el estado propuesto.**

**Qué queda probado:** `AGENDA_NOTICE_PORT` atado a un adaptador port-only pone **A1 y A2 en
verde para la capacidad**. El diseño de la tarjeta siguiente funciona, y está medido antes de que
exista el adaptador de producción.

**Qué NO queda probado, y hay que decirlo:** esto se hizo contra un **doble** —el que está en
`H6-doble-port-only-agenda-notice.adapter.ts.txt`, 32 líneas que devuelven
`{ delivered: false, skippedReason }`—. Un doble sustituye la espera, no la verificación final.
El adaptador real tiene que emitir de verdad, y eso se verifica contra el proveedor real cuando
exista.

### M2 — por qué `NOT_RUN` y no simulado

El arranque propio levanta la aplicación entera y su aceptación local exige los almacenes del
laboratorio. Simular eso no sería un doble de un contrato: sería un doble del sistema, y su
resultado no diría nada sobre la capacidad. Se declara sin ejecutar antes que fabricar un verde.

### M3 — la deriva no cambia con la reparación

La reparación toca la composición del módulo y sus adapters; **no toca ninguna entidad**. El
resultado de la verificación de deriva es por tanto el mismo que el medido en H4.S3.M1: 44 tablas
que el ORM declara y la base no tiene, 36 de ellas del módulo `pharma_lab`. La deriva sigue
bloqueando el cierre, y no la resuelve esta tarjeta.

### M2 de S2 — DESCARTADO con razón

Generar el artefacto final con nuevo hash exige reempaquetar, y la decisión de coordinación dice
explícitamente que el artefacto queda como está. `DESCARTADO` es aquí el estado honesto: no es que
no se pudiera, es que no corresponde hacerlo desde este turno.

## Estado de entrega final (H6.S3.M1)

`TRANSITIONAL_ISOLATION` para el artefacto entregado, con el camino a `MODULE_VERIFIED` medido y
documentado. Gates `NOT_RUN` en la versión final: **A3, A4, A5 y A6** — todos por depender del
arranque propio, que es H6.S1.M2.
