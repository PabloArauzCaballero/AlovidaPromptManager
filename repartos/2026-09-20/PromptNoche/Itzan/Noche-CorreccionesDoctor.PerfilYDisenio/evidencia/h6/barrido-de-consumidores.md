# H6.S3.M2 — barrido de los recorridos que consumen lo que toqué

Todos serial (`--workers=1`), uno por vez.

## Qué se barrió y por qué

El diff toca dos superficies con consumidores propios: el diálogo de
exportación de portabilidad y el cuestionario (las dos conversiones C-21), y
la pantalla «Mi cuenta» del médico (H4 y H5).

| Recorrido | Qué cubre de lo mío | Veredicto |
|---|---|---|
| `carril-insurance-portability.spec.ts` | el desplegable de formato, extremo a extremo: elegir, generar, descargar y verificar el sello | **8/8 PASS** |
| `patient-coverage-copays.spec.ts` | «Mi cuenta» del paciente, la pantalla donde vive la tarjeta de portabilidad | **6/6 PASS** |
| `premium-visual.spec.ts` | acabado visual de las pantallas de la maqueta, «Mi cuenta» incluida | *(al cierre)* |
| `carril-27-editor-encuestas.spec.ts` | el cuestionario | **BLOQUEADO** |
| `alv-perfil-medico.spec.ts` | «Dónde atiendo» del médico | **OMITIDO por el propio recorrido** |
| `carril-05-perfil-doctor.spec.ts` | la ficha del médico | **OMITIDO por el propio recorrido** |

Lo que la maqueta sí dibuja quedó cubierto además por las dos sondas propias
de H4 y H5 (19/19 y 22/22), que son las que miran la ficha y el editor del
médico en tres anchos y dos temas.

## El barrido encontró algo, que es para lo que existe

`carril-insurance-portability.spec.ts` **se rompió con mi cambio** y así lo
dijo:

```text
Error: expect(locator).toBeChecked() failed
Locator: getByTestId('radio-format-pdf').locator('input[type="radio"]')
Expected: checked
Error: element(s) not found
```

Las pruebas unitarias del diálogo las había actualizado; el recorrido
completo, no. Buscaba los tres radios por `data-testid` en tres lugares:
la preselección de PDF, los objetivos táctiles y la elección de JSON.

Corregido **sin bajar lo que afirma**:

- La preselección se lee ahora en la **opción marcada y por su texto**
  (`option:checked` → «PDF oficial certificado con código QR»), no por el
  `value`: `app-select` guarda ahí el índice de la opción, y un número no
  dice nada de lo que la persona ve. Es el mismo verde falso que había
  encontrado en la prueba unitaria, evitado de entrada.
- La elección de JSON pasa por `selectOption({ label })` y después se
  confirma la opción marcada — antes hacía click en la etiqueta del radio.
- El objetivo táctil se mide sobre el desplegable. El umbral no cambió
  (44 px en móvil, 40 px desde 780 px) porque el select declara exactamente
  los mismos altos que el radio en el mismo punto de corte
  (`atoms/select/select.css:15` y `:26-28`).

Tras la corrección: **8/8**.

## El del cuestionario está bloqueado, y no por mí

`carril-27-editor-encuestas.spec.ts` para en su primera línea:

```text
Error: La API no responde en http://localhost:3005.
```

No es una elección del recorrido: el cuestionario **no existe en la maqueta**.
`SurveyForm` lo montan `QuestionnaireAnswer` y `SurveyDetailScreen`, y las dos
leen de `SurveysClient` (`/surveys/*`). El simulador no contesta esas rutas —
`grep -rc survey src/app/core/mock/*.ts` no devuelve un solo archivo con
coincidencias—, así que en la maqueta esa pantalla no tiene de dónde sacar una
pregunta que dibujar.

Los otros dos recorridos que la montan (`alv-025-controles-navegacion`,
`nova-patient-experience`) dependen de lo mismo.

**Lo que sí hay para esa conversión**, y se declara como lo que es:

- Las pruebas del `survey-form` pasan **sin tocarse**. Que sigan verdes
  después de cambiar el control es la señal de que prueban el comportamiento
  —qué se elige y qué se guarda— y no el radio.
- `typecheck` y `lint` en 0.
- Las opciones salen del mismo `pregunta.options` que alimentaba los radios:
  no hay lista escrita a mano que pueda quedar desincronizada.

**Lo que NO hay**: la pantalla mirada. Eso es un peldaño `TESTED`, no
`VERIFIED`, y así queda anotado.

## Los dos del perfil médico se omiten solos

```text
playwright/alv-perfil-medico.spec.ts:76
  test.skip(!viva, 'La API no responde: no hay dónde registrar la sede.');
playwright/carril-05-perfil-doctor.spec.ts:52
  test.skip(!viva, 'La API no responde: el perfil no tiene de dónde salir.');
```

Los dos preguntan primero y se apartan si el servicio no está: no son un rojo
ni un verde, son una omisión declarada por el propio recorrido. La ficha y el
editor del médico quedan cubiertos por las sondas de H4 y H5, que corren
contra la maqueta.
