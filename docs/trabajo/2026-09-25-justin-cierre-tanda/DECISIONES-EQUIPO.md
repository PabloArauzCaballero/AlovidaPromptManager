# Decisiones que necesita el equipo — cierre de la tanda del 2026-09-25

- Fecha: 2026-09-25 · Autor: Justin · Estado: **esperando decisión**
- De dónde sale: la corrida de cierre de los cinco carriles de esa noche.
  Evidencia completa en **[PR #687](https://github.com/mdavila-2001/mantra-core-health/pull/687)** del
  front y **[PR #51](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/51)** de prompts.
- Cómo usarlo: cada decisión trae **qué pasa hoy**, **las opciones**, **una recomendación** y **a
  quién le toca**. Contestá en la fila de la tabla de arriba o directamente bajo cada sección.

> [!important] Por qué aparecen ahora
> Los cinco carriles se mergearon con **todo lo visual sin mirar** — esa noche había cuatro agentes
> en la misma máquina y no se podía levantar un servidor. Nada de lo que sigue es un descubrimiento
> tardío: es lo que la verificación que faltaba encontró apenas se hizo. Cuatro defectos, y **dos
> aparecieron en una captura antes que en un número**.

## Resumen

| # | Decisión | Dueño propuesto | Qué bloquea | Urgencia |
|---|---|---|---|---|
| **D-1** | El carrito queda vacío al agregar una receta | **Pablo** | El camino de compra desde la receta, de punta a punta | **Alta — rompe un recorrido de demo** |
| **D-2** | Las reconsultas se siembran en cada lectura | Dueño de `core/mock/` | La credibilidad de «Mis citas» | Alta |
| **D-3** | Quién hace la segunda pasada crítica de las 26 capturas | Cualquiera que no sea Justin | La última microtarea de C4 y C8 | Media |
| **D-4** | Qué se hace con C1, que nunca se entregó | **Marcelo / el propietario** | 3 casos de C4 y el alta de reconsulta desde la consulta | Media |
| **D-5** | El motor de carga masiva contra la API real | **Itzan** | Que la pantalla deje de vivir contra un doble | **Alta — no hay PR abierto** |
| **D-6** | La suite está en rojo con 53 fallos ajenos | **Marcelo / Pablo** | Que el rojo propio se pueda ver | Alta |
| **D-7** | El armazón desborda a 375 px | Dueño de `shell-layout` | El móvil de toda la aplicación | Media |
| **D-8** | `--text-muted` no llega a AA en texto chico | **El diseñador** | 96 archivos usan ese token | Baja, pero es transversal |

---

## D-1 · «Agregar la receta al carrito» no agrega nada

**Qué pasa hoy.** En `/my-account/medical-record/where-to-buy/:id`, el botón «Agregar la receta al
carrito» está habilitado, se hace clic y **no pasa nada observable**: no abre el diálogo de
conflicto de sede, no deja aviso, no aparece insignia en la cabecera, y `/my-account/pharmacy/cart`
dice **«Tu carrito está vacío»**.

```text
botón: «Agregar la receta al carrito» · aria-disabled=false
¿diálogo de conflicto de sede? false
aviso tras agregar: (ninguno)
insignia de la cabecera: (no existe en el DOM)
líneas en el carrito tras agregar: 0
```

**Por qué no se vio antes.** Los 46 unitarios de `where-to-buy.spec.ts` están en verde y lo van a
seguir estando: **miran el `store`** (`unitCount` sube). El navegador mira la pantalla. El propio
reporte del carril lo declaró sin cubrir con todas las letras — «ese componente es de Pablo y no se
montó» — y esta corrida lo montó.

**Opciones.**
1. **Pablo lo corrige** en la Ola 0 (carrito + cabecera) y se re-corre el recorrido. *Recomendada.*
2. Justin lo corrige entrando en archivos de la Ola 0 — **rompe la regla 00 §3.2** y pisa trabajo ajeno.
3. Se declara fuera de alcance de la maqueta y se documenta como pendiente de integración.

**Recomendación: opción 1.** Es el camino de compra desde la receta, que es una de las dos vías de
entrada que el plan de Farmacia definió. Si hay demo, esto se ve.

**Decisión:** ___________  **Responsable:** ___________  **Para cuándo:** ___________

---

## D-2 · Los sellos de reconsulta suben solos

**Qué pasa hoy.** Contando los sellos de reconsulta en «Mis citas» en cuatro cargas seguidas de la
misma sesión, sin que nadie agende nada:

```text
sellos de reconsulta en 4 cargas seguidas de «Mis citas»: 2, 3, 4, 5
¿crece en cada carga, sin que nadie agende? true
```

La captura a 375 px muestra **dos tarjetas idénticas** — mismo día, misma profesional, mismo motivo.
El sembrado vive en `core/mock/` y parece ocurrir **por lectura** de la agenda.

**Por qué importa más allá de la maqueta.** La reconsulta de C4 es una **cita real**, ése era el
punto del carril. Si se siembra por lectura, el paciente ve citas que nadie agendó y el recuento de
«Mis citas» deja de significar nada. En una demo, además, el número cambia solo mientras se navega.

**Opciones.**
1. **El dueño de `core/mock/` lo corrige**: sembrar una vez, no por lectura. *Recomendada.*
2. Se acepta como artefacto de la maqueta y se documenta, con el riesgo de que alguien lo lea como dato.

**Recomendación: opción 1.** Queda fijado por una prueba (`playwright/justin-cierre-tanda.spec.ts`,
«los sellos de reconsulta suben solos al recargar»), así que se va a notar cuando se arregle.

**Decisión:** ___________  **Responsable:** ___________  **Para cuándo:** ___________

---

## D-3 · La segunda pasada crítica de las 26 capturas

**Qué pasa hoy.** La regla 35.1 exige **dos** pasadas sobre toda captura de Playwright, y la
35.1.6 prohíbe que la segunda la haga quien implementó. La primera pasada está hecha y escrita
(`evidencia/doble-revision.md`), con nota por pantalla: **3 `RECHAZADA`** (las del carrito),
**9 `ACEPTABLE CON RESERVAS`** y el resto `APROBADA`. **La segunda no puede ser mía.**

**Qué bloquea.** Es lo único que separa a **C4** y **C8** de su última microtarea. Sin ella, el
peldaño visual máximo declarable es `VERIFIED_FUNCTIONAL_ONLY`.

**Opciones.**
1. **Una persona del equipo** hace la pasada adversarial sobre las 26 capturas del PR #687. *Recomendada.*
2. Se declara permanentemente `A MEDIAS` y se cierra la tanda sin ese peldaño.

**Recomendación: opción 1.** Son 26 imágenes y las diez preguntas de `critical-double-review`;
es media hora, y cierra dos carriles.

**Decisión:** ___________  **Responsable:** ___________  **Para cuándo:** ___________

---

## D-4 · C1 nunca se entregó, y bloquea a C4

**Qué pasa hoy.** `FollowUpBlock` —el bloque que da de alta la reconsulta desde la consulta— **está
escrito, probado (14 pruebas) y mergeado**, y **ninguna plantilla lo monta**. Se verificó: cero
referencias a `app-follow-up-block` en todo `src/app/**/*.html`. Montarlo era de **C1**, que no tiene
rama, ni PR, ni una línea en el árbol.

Consecuencia medida: al ejecutar `clinica-c4-reconsulta.spec.ts` por primera vez, **6 de 10 pasan**;
los 3 que arrancan en `consulta-casilla-reconsulta` fallan por esto.

**Un cuarto fallo, aparte y real:** el sello de reconsulta **no aparece en «Consultas médicas»**, la
agenda de la médica, aunque **sí** aparece en «Mis citas» del paciente. Ese es de C4 y no depende
de C1.

**Opciones.**
1. **Alguien toma C1** —o sólo el cableado: el `@case ('reconsulta')` con
   `<app-follow-up-block>`— y los 3 casos pasan. *Recomendada si la reconsulta entra en la demo.*
2. Se declara C4 cerrado en 11/12 y el alta de reconsulta desde la consulta queda fuera del alcance.
3. Justin monta la casilla — **entra en `consultation/**`, que es carril de otro.**

**Recomendación: opción 1 si la reconsulta se va a mostrar; opción 2 si no.** Lo que no conviene es
dejarlo sin decidir: hoy hay un componente terminado que nadie puede usar.

**Decisión:** ___________  **Responsable:** ___________  **Para cuándo:** ___________

---

## D-5 · El motor de carga masiva contra la API real

**Qué pasa hoy — y acá hay una corrección importante.** Se creía que el PR de Itzan ya estaba
mergeado. **No lo está, y no existe ningún PR de esa rama.** Lo que sí se mergeó en `dev` es el
**PR #462 de Marcelo** («soporte XLSX, fixtures y parseador de importación», 2026-09-25 17:16 UTC).

Estado verificado, contando archivos con cada símbolo:

| | `origin/dev` | `origin/itzan/carga-masiva-motor-2026-09-25` |
|---|---|---|
| `POST :versionId/import-file` | **existe** | existe |
| `dryRun` | **0 archivos** | **5 archivos** |
| `import-template` | **0 archivos** | **6 archivos** |
| PR abierto | — | **ninguno** |

**Por qué importa.** `dryRun` es **«Validar sin guardar»**, que es el paso central de la pantalla:
el candado del contrato dice que no se importa sin validar antes. Con lo que hay en `dev` hoy, ese
botón no tiene servidor detrás. Y `GET /terminology/import-template` es el botón «Bajá la
plantilla».

**Opciones.**
1. **Itzan abre el PR de su rama contra `dev` y se mergea.** *Recomendada.*
2. Marcelo absorbe `dryRun` e `import-template` en su línea de trabajo — **duplica** lo que Itzan ya escribió.
3. La pantalla se queda contra el doble del simulador indefinidamente y se documenta.

**Recomendación: opción 1, y con prioridad.** La rama existe y tiene pruebas
(`concept-file-import.service.spec.ts`, `terminology-import-template.controller.spec.ts`). Lo único
que falta es abrir el PR. Mientras tanto, la pantalla está verificada **contra un doble**, no contra
la API, y eso está declarado.

**Decisión:** ___________  **Responsable:** ___________  **Para cuándo:** ___________

---

## D-6 · La suite completa está en rojo, con 53 fallos ajenos

**Qué pasa hoy.** `corepack yarn test` sobre `mockup`: **53 fallos de 7 950**. Ninguno es de los
carriles de esta tanda, y está demostrado por bisección corriendo **el mismo subconjunto** en siete
cortes:

```text
bf2c3545 (#660, base)                    103 passed    ← verde
746142c6 (#662)                          103 passed    ← verde
8262b798 (#669)                          103 passed    ← verde
836e0f34 (#670 sintomas-silueta-y-sexo)   10 failed    ← rompe patient-home
ed6fa8cf (#671 Ola 0 farmacia)            48 failed    ← suma pharmacy-inbox + inbox-order
origin/mockup                             48 failed
```

| Archivo | Fallos | Causa | Dueño |
|---|---|---|---|
| `inbox-order.spec.ts` | 23 | PR **#671** (Ola 0) | Pablo |
| `pharmacy-inbox.spec.ts` | 15 | PR **#671** | Pablo |
| `patient-home.spec.ts` | 10 | PR **#670** | Quien hizo síntomas/silueta |
| `access-tree.spec.ts` | 1 | commit `8c7d7721`: «Evoluciones» → «Notas médicas» (C7) no actualizó el spec | Pablo (C7) |
| `shell-layout.spec.ts` | 1 | **ya fallaba en el corte base** | Preexistente |
| `checkout`, `measurement-grid`, `paginated-form` | 3 | **pasan aislados** — contaminación entre archivos de vitest | — |

38 de los 53 son el mismo error de arranque de `TestBed`: los casos **ni siquiera llegan a ejercitar
la pantalla**.

Además: **`lint` pasó de 6 a 19 errores** durante la noche, en 5 archivos ajenos a esta tanda; y los
**6 `check-*.mjs` en rojo ya fallaban en el corte base**.

**La decisión no es sólo quién arregla qué.** Es de política: **¿se sigue mergeando con la suite en
rojo?** Con 53 fallos ajenos, el rojo propio de cualquiera se vuelve invisible — que es exactamente
lo que permitió que estos 53 se acumularan sin que nadie los viera.

**Opciones.**
1. Cada dueño arregla lo suyo esta semana y se vuelve a exigir suite verde para mergear. *Recomendada.*
2. Se congela la lista actual como línea base conocida y sólo se bloquea por fallos **nuevos**.
3. Se sigue como está.

**Recomendación: opción 1, y si no da el tiempo, la 2 — nunca la 3.** La 2 exige un archivo con la
lista y su dueño, o en un mes vuelve a pasar lo mismo.

**Decisión:** ___________  **Responsable:** ___________  **Para cuándo:** ___________

---

## D-7 · El armazón desborda a 375 px

**Qué pasa hoy.** Cuatro pantallas de tres carriles distintos medían `scrollWidth = 403` contra
`innerWidth = 375` — siempre el mismo número. Parecía un defecto de cada pantalla. Lo es del
armazón:

```text
control · panel     375  375  false  (ningún elemento sin recortar)
A · mis recetas     403  375   true  div.app-header__derecha ← header.app-header
A · tienda          403  375   true  div.app-header__derecha ← header.app-header
C6 · mi historia    403  375   true  div.app-header__derecha ← header.app-header
C4 · mis citas      403  375   true  div.app-header__derecha ← header.app-header
```

`/dashboard`, que ningún carril de la tanda tocó, **no desborda**. La herramienta que lo localiza
—descartando los elementos que un ancestro recorta— queda en `scripts/sonda-desborde-375.mjs`.

**Opciones.**
1. **El dueño de `shell-layout` corrige la cabecera** y el desborde desaparece de todas las
   pantallas a la vez. *Recomendada.*
2. Cada carril lo mitiga en su CSS — **parche por pantalla sobre un defecto compartido.**

**Recomendación: opción 1.** Son 28 px en la cabecera y afecta el móvil de toda la aplicación.

**Decisión:** ___________  **Responsable:** ___________  **Para cuándo:** ___________

---

## D-8 · `--text-muted` no llega a AA en texto chico

**Qué pasa hoy.** `axe` marcó una violación `color-contrast` de impacto **serious** en la pantalla
de carga masiva: **4,27:1** con `#787b7b` sobre blanco a 12 px, contra el mínimo AA de **4,5:1**.

El número **no es un descuido**: `styles.css:204` lo declara como la **excepción E1**
(«3,86–4,27: excepción E1 — solo terciario»), aceptada en `identidad-visual.md` §8.2 porque el hex
lo fija el diseñador. Pero la misma línea pone la condición: **solo terciario**.

**Qué se hizo, y por qué no alcanza.** En esa pantalla las notas dicen cómo armar el archivo y cuál
es el tope de tamaño: son la **instrucción del paso**, no adorno. Se pasaron a `--text-secondary`
(7,24 AAA) y `axe` quedó en verde. **No se tocó el token compartido**, que vive en **96 archivos**.

**La pregunta abierta es del diseñador**: ¿cuántos de esos 96 usos son realmente terciarios? Cada
uno que no lo sea es la misma violación, sin detectar.

**Opciones.**
1. **Auditar los 96 usos** y mover a `--text-secondary` los que no sean terciarios. *Recomendada.*
2. Subir el valor de `--text-muted` hasta 4,5:1 — **cambia la identidad visual y hay que consultarlo.**
3. Dejarlo y aceptar la excepción tal cual, con la deuda declarada.

**Recomendación: preguntarle al diseñador primero (bloquea 1 y 2).** Las cuatro excepciones E1–E4
ya estaban pendientes de avisarle desde julio; ésta es la ocasión.

**Decisión:** ___________  **Responsable:** ___________  **Para cuándo:** ___________

---

## Apéndice · Qué quedó cerrado, para no reabrirlo

La corrida de cierre subió la tanda de **116/140 a 133/140 — 95,0 %**. Ya no hace falta decidir
nada sobre esto:

| Carril | Antes | Ahora |
|---|---|---|
| A · Farmacia | 33/41 | **39/41** |
| B · Carga masiva | 60/68 | **66/68** |
| C4 · Reconsulta | 10/12 | **11/12** |
| C6 · Historia | 6/9 | **8/9** |
| C8 · Integración | 7/10 | **9/10** |

Medido, no afirmado: contraste del tema oscuro **13,69 / 14,33 / 13,3 : 1** · Regla 8 en «Mi
historia» **0 px de diferencia entre holguras y 93,3 % del área**, en los dos temas · el NDJSON **sí**
se admite y produce informe · «Importar» con `aria-disabled=true` **recibe foco** · el PDF de la
historia baja de verdad (149 577 bytes, cabecera `%PDF-`) · `build` y `typecheck` en **exit 0**.

**Una limitación que no es una decisión pero conviene saber:** `clinica-c6-historia-paciente.spec.ts`
**salta sus 6 casos** porque su `beforeAll` exige una **API viva** — no es el `pw-guard` que se
creía. Correrlo exige levantar el stack del backend, no sólo el front.
