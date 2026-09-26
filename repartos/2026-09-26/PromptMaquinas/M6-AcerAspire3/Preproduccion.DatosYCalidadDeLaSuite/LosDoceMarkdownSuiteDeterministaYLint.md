# M6 · Acer Aspire 3 — encargo de preproducción (2026-09-26)

> **Estado:** `TODO` · **Eje:** datos y calidad de la suite · **Carriles:** 4
> **Peldaño al repartir:** `DISCOVERED`. Nada de este encargo se ejecutó todavía.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M6**. Nada de tu cola pide RAM ni base de datos: son datos, generadores y
la calidad de la suite. Trabajás en `mantra-core-health-api` (Python, un carril),
`mantra-core-health` (tres carriles) y leés `mantra-core-health-model`.

Rama base: **`test`** en los dos repos (front `ec7037f7`, API `016caaa1`). Un worktree por
carril desde `origin/test`, un PR por carril contra `test`. M1 mergea.

**Tus carriles 2 y 3 destraban a las otras cinco máquinas:** hoy ni la suite del front ni su
lint sirven como compuerta, y eso le pega a todos.

## Tu cola, en orden

### 1 · C6 — el pipeline de los 12 markdown, automático
**Repo:** `mantra-core-health-api`. **Archivo que posés:**
`tools/bolivia-datasets/extract_datasets.py` y los JSON que emite en
`src/common/seed/data/bolivia/`.

Los 12 `.md` viven en `mantra-core-health-model/markdown_convertidos/` y **sólo 5 llegan
hoy** a la API por ese script: aseguradoras, sus canales de contacto, establecimientos
(642, sólo Santa Cruz), arancel médico y especialidades observadas. Faltan:

| Archivo | Filas | A dónde va |
|---|---|---|
| `LISTA_DE_CLINICAS_PRIVADAS_1.md` | 30 | `directory.tenants` + ficha pública + NIT |
| `LISTA_DE_HOSPITAL_DE_TERCER_SEGUNDO_NIVEL_Y_CAJAS_1.md` | 35 | idem |
| `LISTA_DE_HOSPITAL_DE_PRIMER_NIVEL_SANTA_CRUZ_1.md` | 470 | idem |
| `LISTA_DE_FARMACIAS__LABORATORIOS_Y_ANALISIS_MEDICOS.md` | 34 | farmacias + laboratorios |
| `LISTADO_ARANCEL_ODONTOLOGICO_2026_1.md` | 186 | catálogo de servicios (en dólares) |
| `LISTA_DE_ESPECIALIDADES_ODONTOLOGICAS.md` | 14 | value set nuevo |
| `Alianza_…` y `Nacional_…` | 672 + 747 | los usa M2 (C2); vos emitís su dataset |

Dos referencias que ya resolvieron parte de esto y de las que **se copia el mapeo, no se
reinventa**: `mantra-core-health-model/salud-db/gen_seeds.py` (tiene `build_real_pharmacies`
y `build_real_labs_and_clinics`, con las direcciones ya corregidas del UTF-16 roto) y
`mantra-core-health/data/markdown-institutions/` del front, que **ya tiene coordenadas**
sacadas de Nominatim con su `precision` por punto — eso destraba «Cómo llegar» y «los más
cercanos», que hoy no tienen destino.

Tres cosas que **no** hacés:
- **No corregís el OCR.** El arancel médico viene de un PDF escaneado y su propia hoja lo
  advierte («Anestesiblogos», «Térax», «cardiol6gico»). La fila viaja marcada
  `ocr_sospechoso: true`. Inventar la corrección es peor que el texto crudo.
- **No inventás códigos** ICD-10/SNOMED/LOINC/RxNorm/ATC ni coordenadas que el corpus no
  trae.
- **No metés datos personales** en el JSON: las personas las siembra M2 leyendo el markdown
  en el momento.

Toda fila lleva procedencia: `source_name`, `source_file`, `source_row`, `imported_at`.

**Terminado cuando** `yarn seed:datasets` regenera los JSON y `git diff --exit-code` pasa
—o sea, es determinista y está al día— y hay un `seed:datasets:check` que CI puede correr.

### 2 · F3 — que la suite del front sea determinista
**Repo:** `mantra-core-health`. **Archivos que posés:** `src/test-setup.ts`,
`vitest.config.ts`.

Medido: dos corridas del mismo commit dieron **17 y 11 suites rojas, con conjuntos
distintos**, y `insurance-portability.handlers.spec.ts` falla en la corrida completa y
**pasa aislada**. Los síntomas dominantes son 12 × `Cannot configure the test module when
the test module has already been instantiated` y 6 × `Cannot read properties of undefined
(reading 'verify')`.

**La causa está escrita en el propio `src/test-setup.ts`**, que ya arregló una instancia de
este patrón: un throw en un hook marca fallada cada prueba del archivo **y deja el `TestBed`
instanciado**, así que los archivos que siguen en el mismo worker caen con un error que no
tiene nada que ver con lo que probaban. Queda al menos una causa más.

Cómo encararlo, y es lo que va a costar: **buscá el primer error de cada worker**, que es la
causa; todo lo demás es cascada. Candidato concreto que vi:
`TypeError: this.auth.userId is not a function`. No subas timeouts ni marques `skip`:
demostralo con la salida y arreglá la causa.

**Terminado cuando** dos corridas completas seguidas del mismo commit dan el mismo
resultado, y el conjunto rojo restante está explicado archivo por archivo.

### 3 · F2 — `yarn lint` del front en verde
**Repo:** `mantra-core-health`. **Archivos que posés:** los 201 de `features/alovida/**`.

263 errores, y están medidos: **201 archivos byte a byte idénticos a `origin/mockup`**, o
sea que el lint ya estaba rojo ahí. El reparto por regla:

| Regla | Errores |
|---|---|
| `@angular-eslint/prefer-on-push-component-change-detection` | 244 |
| `@typescript-eslint/no-unused-vars` | 4 |
| `@typescript-eslint/no-empty-function` | 2 |
| `@typescript-eslint/array-type` | 2 |

Los 244 son mecánicos (`changeDetection: ChangeDetectionStrategy.OnPush`), pero **no es un
sed a ciegas**: `OnPush` cambia cuándo se redibuja un componente. Esas 201 pantallas son
**generadas** por `scripts/port-vistas-alovida.mjs` desde las maquetas y son cascarón sin
lógica propia, así que el riesgo es bajo — pero si alguna tiene estado mutable sin señales,
se rompe en silencio. Cambiá por tandas, y por cada tanda dejá foto de una pantalla de la
tanda en `docs/progress/evidence/lane-F2/`.

Si el generador es el dueño de esos archivos, **arreglá el generador y regenerá**, no los
archivos: es la regla del proyecto.

**Terminado cuando** `yarn lint` sale exit 0 y ninguna pantalla portada cambió lo que
muestra.

### 4 · F1 — inglés en identificadores, verificado
**Repo:** los dos. **Archivo que creás:** `scripts/check-identifiers-english.mjs`.

La regla 29 no es tarea de una persona: es criterio de aceptación de los 36 carriles. Toda
ruta, identificador, variable, columna, endpoint, clase y archivo **nuevo o tocado** va en
inglés; la prosa visible sigue en castellano.

Hacelo sobre **el diff del PR**, no sobre el árbol entero (el repo tiene años de
identificadores en castellano y no es este carril el que los migra). Lista negra de palabras
castellanas frecuentes en identificadores, con excepciones declaradas: `MantraRadius.firma`
y `MantraTypography.cifrasTabulares` nombran conceptos del manual REDSAT y **se quedan**.

Ojo con las rutas: `proxy.conf.json` compara prefijos **por inicio de ruta** y
`scripts/check-route-prefixes.mjs` lo verifica en CI. Ya mordió una vez: `/admin` se comió
`/administracion/pacientes`. Antes de proponer un renombre de ruta, comprobá que ningún
prefijo del proxy la absorbe.

**Terminado cuando** el verificador falla ante un identificador nuevo en castellano y pasa
sobre el `test` actual.

## Reglas que no se negocian
- `corepack yarn`, nunca `npm`. Python 3.11 para el carril 1.
- Los generadores se validan **regenerando y diffeando**, nunca leyendo su código.
- **No debilites pruebas**: nunca `skip`, nunca borrar aserciones, nunca subir un timeout
  sin demostrar por qué no llegó la condición.
- Identificadores nuevos en inglés; prosa de pantalla en castellano.
- Nada se declara hecho por debajo de `REGRESSION_VERIFIED`, con evidencia en
  `docs/progress/evidence/lane-<id>/REPORT.md`.
