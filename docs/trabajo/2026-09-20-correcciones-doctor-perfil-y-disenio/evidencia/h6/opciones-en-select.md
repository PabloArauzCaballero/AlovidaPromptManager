# H6.S2 — C-21 aplicado en mis archivos, medido antes y después

> «Todo lo que sean opciones deben ser selects.» — doctor, 2026-09-20 (C-21)

La regla con la que se decidió cada caso está en `docs/adr/ADR-0013-opciones-en-select.md`
del repo del front, que es donde los otros cuatro la van a buscar.

## El comando

```text
git grep -o "<app-chip"              -- 'src/app/shared/**/*.html' 'src/app/features/account/my-profile/**/*.html'
git grep -o "<app-radio-group"       -- (idem)
git grep -o "<app-radio-otro"        -- (idem)
git grep -o "<app-segmented-control" -- (idem)
```

## Antes

```text
<app-chip                  6
<app-radio-group           5
<app-radio-otro            1
<app-segmented-control     1
                          --
                          13
```

## Después

```text
<app-chip                  6
<app-radio-group           3
<app-radio-otro            1
<app-segmented-control     1
                          --
                          11
```

**13 → 11.** Dos convertidos. Los once que quedan **no son deuda**: cada uno cae
en un caso declarado de la regla, y el motivo está escrito en el código, al lado
del control.

## Qué se convirtió, y por qué

| Archivo | Era | Es | Caso |
|---|---|---|---|
| `portability-export-dialog.html` | 3 radios: PDF · JSON · Paquete | `app-select` | 1 — tres valores del mismo campo |
| `survey-form.html` · `SINGLE_CHOICE` | radios, uno por opción | `app-select` | 1 — las opciones las escribe quien arma el cuestionario, pueden ser tres o quince |

En los dos, **las palabras de cada opción no cambiaron**: la corrección es sobre
el control, no sobre lo que dice. Y en el cuestionario el valor que se guarda
sigue siendo el texto elegido, no un código, que es lo que ya pasaba con los
radios.

## Qué NO se convirtió, y por qué

| Archivo | Cuántos | Caso | Motivo |
|---|---|---|---|
| `practitioner-profile-view.html` | 3 chips | 0 | **No son opciones**: «atendés por telemedicina» y los idiomas son datos que se muestran. No hay nada que elegir |
| `filter-bar.html` | 2 chips | 3 | Atajo de filtro sobre un conjunto corto, **pedido por el cliente** el 22/08/2026 (§A3 del plan de UX). Es opt-in explícito (`FilterDef.asChips`) y **el valor por omisión de este componente ya es el desplegable**. Lo usan dos pantallas, ninguna mía |
| `survey-form.html` · `SCALE` | 1 | 3 | Una escala no es una lista: el orden y la distancia entre los puntos **son** el dato |
| `survey-form.html` · `BOOLEAN` | 1 | 2 | Sí/no de una misma afirmación. Un desplegable de dos esconde la mitad de la respuesta. Es lo mismo que pide C-10 |
| `paginated-form.html` | 3 | — | **Lo montan 52 plantillas** y el control sale de la definición del campo, no de la plantilla: cambiarlo acá cambiaría 52 formularios de golpe, varios de otros dueños. Se publica una opción nueva, no se cambia el valor por omisión |
| `fact-section.html` | 1 chip | — | **Nadie monta este componente.** `git grep "<app-fact-section"` no devuelve una sola línea: quedó huérfano cuando `laboratory-detail` reimplementó su sección en línea —su propio comentario todavía lo nombra—. Convertir un componente que no se dibuja no se puede verificar y no le cambia nada a nadie. Registrado como HALL-I9 |

## Ninguna lista perdió una opción (H6.S2.M3)

- **Exportación de portabilidad**: la prueba afirma los tres formatos **en orden
  y con su texto completo**, y cuál viene elegido. Antes sólo comprobaba que los
  tres radios existieran —el «con PDF preseleccionado» del título no se
  verificaba en ninguna parte—, así que la prueba quedó **más fuerte** que antes
  del cambio, no más débil.
- Y se corrigió un verde falso que el cambio destapó: el ayudante elegía el
  formato escribiendo `BUNDLE` en el `value` del `<option>`, donde `app-select`
  pone el **índice**. No casaba con nada, el desplegable se quedaba como estaba,
  y la prueba pasaba igual porque las dos descargas las decide la respuesta y no
  la selección. Ahora se elige por el texto visible **y** se comprueba que el
  formulario mandó `format: 'BUNDLE'`.
- **Cuestionario**: las opciones salen del mismo `pregunta.options` que
  alimentaba los radios; no hay lista escrita a mano que se pueda desincronizar.
  Sus pruebas pasan sin tocarse, que es la señal de que prueban comportamiento y
  no implementación.
