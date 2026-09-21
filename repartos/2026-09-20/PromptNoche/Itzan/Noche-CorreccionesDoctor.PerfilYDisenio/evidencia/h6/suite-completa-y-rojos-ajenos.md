# H6.S3.M1 — gates estáticos y suite completa

## Gates estáticos

```text
== typecheck ==
exit=0
== lint ==
exit=0
```

## Suite completa

```text
 Test Files  3 failed | 553 passed (556)
      Tests  7 failed | 6896 passed (6903)
   Duration  319.37s
```

**Los 7 rojos son ajenos: ninguno toca mi radio y los 2 que son reales ya
estaban en el corte base.** El resto no son fallos, son esperas vencidas.

## Los siete, uno por uno

| Archivo | Prueba | Duración | Qué es |
|---|---|---|---|
| `src/app/app.routes.spec.ts` | una sección disponible NO cae en el placeholder | 30 070 ms | espera vencida |
| `src/app/app.routes.spec.ts` | `/search` resuelve | 5 199 ms | espera vencida |
| `src/app/app.routes.spec.ts` | `/search/medications` resuelve | 5 100 ms | espera vencida |
| `…/auth/register-practitioner/register-practitioner.spec.ts` | el botón «Quitar» de la fila problemática… | 8 628 ms | espera vencida |
| `…/auth/register-practitioner/register-practitioner.spec.ts` | las casillas acotan lo que el contrato acota… | 8 688 ms | espera vencida |
| `…/auth/register-practitioner/register-practitioner.spec.ts` | resuelve los cinco tipos canónicos de credencial… | 5 014 ms | **fallo real, preexistente** |
| `…/accounting/resumen/resumen.spec.ts` | pide el estado de resultados SEIS veces… | 26 ms | **fallo real, preexistente, sólo los lunes** |

### Las cinco esperas vencidas

Las cinco mueren con `Test timed out in 5000ms` y **ninguna vuelve a morir
cuando su archivo corre solo**:

```text
# los tres archivos juntos
 Test Files  2 failed | 1 passed (3)
      Tests  3 failed | 153 passed (156)

# register-practitioner.spec.ts solo
 Test Files  1 failed (1)
      Tests  1 failed | 96 passed (97)
```

`app.routes.spec.ts` pasa entero, y de los tres rojos de
`register-practitioner` sobrevive uno. Las pruebas que se caen **cambian de
una corrida a otra**: el reloj de 5 s se agota por competencia de recursos,
no porque la aserción sea falsa.

### Los dos fallos reales — comprobados contra el corte base

Se restauró `src/` al corte `68dcb562` y se corrieron los dos archivos ahí.
El único delta contra el corte eran 15 archivos **nuevos** (1 159 líneas,
0 borradas) que ninguno de los dos importa.

```text
# register-practitioner.spec.ts, con src/ en 68dcb562
 Tests  1 failed | 96 passed (97)      ← el mismo, «cinco tipos canónicos»

# resumen.spec.ts, con src/ en 68dcb562
 Tests  1 failed | 11 passed (12)      ← el mismo, «SEIS veces»
```

Los dos fallan idéntico antes de mi primer commit. `src/` se devolvió a
`HEAD` y el árbol quedó limpio.

## El de contabilidad es un defecto que sólo aparece los lunes — HALL-I10

`features/accounting/` es territorio ajeno; se documenta, no se toca.

`resumen.spec.ts:150` exige que las seis lecturas del estado de resultados
lleven **seis ventanas distintas**. Hoy devuelve cinco:

```text
hoy = 2026-09-21 (lunes)
dia.actual      2026-09-21 -> 2026-09-21
dia.previa      2026-09-20 -> 2026-09-20
semana.actual   2026-09-21 -> 2026-09-21   ← idéntica a dia.actual
semana.previa   2026-09-14 -> 2026-09-14
mes.actual      2026-09-01 -> 2026-09-21
mes.previa      2026-08-01 -> 2026-08-21
distintas = 5 de 6
```

`ventanasDeLaSemana` (`src/app/features/accounting/resumen/ventanas.ts:66`)
arranca la semana el lunes, así que **el lunes «lo que va de la semana» es
exactamente hoy**. Barriendo los siete días, sólo el lunes da 5:

```text
2026-09-21 lunes       distintas = 5
2026-09-22 martes      distintas = 6
2026-09-23 miércoles   distintas = 6
2026-09-24 jueves      distintas = 6
2026-09-25 viernes     distintas = 6
2026-09-26 sábado      distintas = 6
2026-09-27 domingo     distintas = 6
```

Dos cosas separadas, y conviene no confundirlas:

1. **La prueba.** `ventanas.ts:17` deja escrito que `hoy` entra por parámetro
   «así las pruebas fijan el día y no dependen de cuándo se corren», pero
   `resumen.spec.ts` monta el componente sin fijar la fecha, y el componente
   sí lee el reloj. La prueba depende del día de la semana: un rojo de
   calendario, garantizado un día de cada siete.
2. **La pantalla.** Los lunes el resumen pide **dos veces la misma ventana**
   al servidor. No muestra nada mal —las dos respuestas son iguales— pero es
   una lectura de más, todos los lunes, para cada médico que abre el tablero.

Quien lleve contabilidad decide si la comparación del lunes debe ser otra
(«la semana pasada completa», por ejemplo) o si alcanza con fijar la fecha en
la prueba. Las dos salidas son legítimas y no son mías.

## El de registro de médicos — HALL-I11

`features/auth/` es territorio ajeno; se documenta, no se toca.

`register-practitioner.spec.ts:2001` abre un `describe` cuyo primer acto es
`TestBed.resetTestingModule()` **dentro de la prueba** (línea 2003), y hay
otro igual más arriba: la prueba se queda esperando al backend simulado y
vence a los 5 s.

Esa llamada es el mismo patrón que destapé esta noche en mi propio archivo:
reiniciar el `TestBed` dentro de un test le tira el módulo a los archivos que
corren después en el mismo hilo. Acá además explica por qué las otras dos
pruebas del archivo caen **sólo cuando hay compañía**.
