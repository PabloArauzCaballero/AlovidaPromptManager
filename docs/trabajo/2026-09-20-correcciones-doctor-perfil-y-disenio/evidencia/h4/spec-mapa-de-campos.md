# H4.S3.M1 — el spec del mapa de campos, antes y después

El spec que hace cumplir el contrato «todo campo del alta de médico tiene una pestaña donde se
lee». Se corre dos veces porque H4 mueve de lugar el bloque del consultorio, y la pregunta que
hay que poder responder es si el mapa seguía diciendo la verdad después de moverlo.

Comando, el mismo en las dos corridas:

```text
corepack yarn test --watch=false --include="src/app/features/account/my-profile/pestanas-del-perfil-medico.spec.ts"
```

## Antes

Corrido con el módulo del mapa en el estado del corte. El spec no se tocó en ningún momento del
hito, así que la comparación es entre dos corridas del mismo archivo de prueba.

```text
 RUN  v4.1.10 …/mantra-core-health

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  08:26:43
   Duration  2.82s (transform 105ms, setup 609ms, import 49ms, tests 25ms, environment 1.76s)
```

## Después

Con el hito completo aplicado.

```text
 RUN  v4.1.10 …/mantra-core-health

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  08:23:35
   Duration  23.46s (transform 124ms, setup 1.62s, import 50ms, tests 46ms, environment 20.91s)
```

## Qué demuestra, y qué no

Demuestra que las ocho pruebas del contrato siguen pasando con el bloque del consultorio montado
en la ficha, **sin haber tocado el spec ni debilitado una aserción**: es el mismo archivo de
prueba y el mismo conteo.

No demuestra que el mapa sea correcto — eso lo decide H4.S3.M2, y ahí la conclusión fue que
los cuatro campos del consultorio ya apuntaban a la pestaña correcta y ahora apuntan con más
verdad que antes: esa pestaña montaba sólo el mapa de sedes, que enseña el nombre, la dirección
y el pin pero no el municipio suelto, y ahora monta además el bloque donde los cuatro se ven y
se corrigen con su propio control. Por eso el módulo sólo ganó la prosa que lo explica, y ningún
valor cambió.

La diferencia de duración entre las dos corridas es del arranque del entorno de pruebas, no del
código bajo prueba: el tiempo de las pruebas en sí es 25 ms contra 46 ms.
