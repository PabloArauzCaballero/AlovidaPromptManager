# Itzan — daily de la noche del 2026-09-25

> **AVANCE COMBINADO: 41 / 154 — 26,6 %.** Sale de `microtareas HECHO / total`, sumando los dos carriles de
> abajo. `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Daily de equipo: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md) — **dos paquetes esta noche**, uno por sección de este documento.

---

## Carril A — Farmacia: la página de cada farmacia y los tres recorridos de punta a punta

> **AVANCE: 0 / 45 — 0,0 %.**

- Carril: [`Noche-Farmacia.PaginaDeFarmaciaYQA`](Noche-Farmacia.PaginaDeFarmaciaYQA/CatalogoConPrecioRealYRecorridosDePuntaAPunta.md) (carriles 44 y 48 del plan)
- Corte: `origin/mockup` @ `bf2c3545…` → **el tuyo (después de la Ola 0):** `________`
- Ramas: `itzan/farmacia-pagina-de-tienda-2026-09-25` (H2–H4) · `itzan/farmacia-qa-e2e-2026-09-25` (H5–H6) · Peldaño alcanzado (regla 30): `UNKNOWN`

### 0. Dos mitades separadas por el reloj

Primera mitad (H2–H4): la página de farmacia, reciclando `pharmacy-hub/pharmacy-shop/` **sin borrarlo**. Arrancás
cuando la Ola 0 esté **PUBLICADO** (§4-bis del Paquete 1 del daily de equipo); si a la hora no llegó,
`HttpTestingController` con las formas del plan §4.4 y lo declarás. **Publicá H4 apenas esté**: Pablo borra el hub con eso.

Segunda mitad (H5–H6): recién cuando Pablo, Justin y Marcelo estén mergeados. Hasta entonces H5 y H6 son `TODO`
con la precondición escrita — nunca `BLOQUEADO` — y preparás los specs contra los testids congelados (§4.5).

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 179>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 15>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 24 skills de mi lote, empezando por `frontend-ux-states`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

### 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `corepack yarn lint` | | | |
| `corepack yarn typecheck` | | | |
| `corepack yarn test --watch=false` | | | |
| e2e existentes de farmacia (3 specs, `--workers=1`) | | | |

### 3. El precio de la tienda es el de la sede (H3.S1)

| Producto | `curl …/pharmacy/sites/<siteId>/prices` | En pantalla | Igual |
|---|---|---|---|
| | | | |

### 4. Los tres recorridos (H5) — resultado y clasificación de cada fallo

| Spec | Verde / rojo | Fallo (si hay) | Clase | Dueño |
|---|---|---|---|---|
| `pharmacy-store.spec.ts` | | | | |
| `pharmacy-cart.spec.ts` | | | | |
| `pharmacy-prescription-to-cart.spec.ts` | | | | |

### 5. Regla visual (H6.S1) — números, no impresiones

| Ruta | Viewport | Fondo | Centrado (px) | Ancho (%) | Scroll X | Consola | PASS |
|---|---|---|---|---|---|---|---|
| `/my-account/pharmacy` | 375 / 768 / 1440 / 1440 oscuro | | | | | | |
| `/my-account/pharmacy/stores/<id>` | idem | | | | | | |
| `/my-account/pharmacy/cart` | idem | | | | | | |
| `/my-account/pharmacy/prescriptions` | idem | | | | | | |

### 6. Checkpoints del turno

```text
AVANCE — página de farmacia y QA — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

### 7. Cierre — y el veredicto del producto entero (H6.S2.M4)

| Hito | Microtareas HECHO / total | Estado | Peldaño |
|---|---|---|---|
| H1 | / 4 | | |
| H2 | / 4 | | |
| H3 | / 13 | | |
| H4 | / 3 | | |
| H5 | / 12 | | |
| H6 | / 9 | | |
| **Total** | **/ 45** | | |

| Requisito | Hecho / a medias / no hecho | Evidencia |
|---|---|---|
| R1 tienda sin pestañas | | |
| R2 ícono del carrito | | |
| R3 carrito por farmacia con conflicto | | |
| R4 buscador precio + distancia, dos modos | | |
| R5 Lugares cercanos fuera; Cotizaciones intacta | | |
| R6 receta completa al carrito | | |
| R7 botón de receta junto al buscador | | |

- PRs: `________`
- Qué quedó `A MEDIAS` (con las cuatro respuestas): `________`
- Qué quedó corriendo y se cerró (el `yarn start` de los e2e incluido): `________`

---

## Carril B — Carga masiva: motor + parseo (contrato, detector, CSV, perfiles)

> **AVANCE: 41 / 110 — 37,3 %.** (110 y no 109: el plan partió en dos una microtarea de validación.)

- Carril: [`Noche-CargaMasiva.MotorDryRunIdempotencia`](Noche-CargaMasiva.MotorDryRunIdempotencia/ServicioEnsanchadoDryRunTodoONadaIdempotenciaAutorizacionYPlantilla.md)
- Contrato: [`CONTRATO-CARGA-MASIVA.md`](../CONTRATO-CARGA-MASIVA.md) §1 (copiás los tipos), §2 (lo implementás)
- Repo: `alovida/mantra-core-health-api` · Ref: `origin/dev` (**otro repo, otro checkout** que el Carril A) · Corte: `343795cc2d08745692f491c50e81427215043315` · Rama: `itzan/carga-masiva-motor-2026-09-25`
- Peldaño alcanzado (regla 30): `WRITTEN` para el carril, que es el más bajo de sus áreas. Toda la lectura
  por formato y la validación por fila están en **`TESTED`** (21 suites, 224 pruebas, lint y tipos en 0); los
  tres códigos de error quedan en `WRITTEN` porque todavía no los usa nadie: los consume el servicio en H3.

### 0. Lo que otros leen de tu daily

| Qué avisás | Para quién | Cuándo | Estado |
|---|---|---|---|
| `row-contract.ts` pusheado (SHA + hora) | Marcelo (parseador XLSX), Pablo | **hora 1** | ✅ 03:45 |
| `index.ts` con `[ndjson, csv]`, detector y perfiles | Pablo (cablea XLSX) | al cerrar H2 | ✅ 10:09 |
| Qué devuelve `skipped` hoy y si hoy inserta las válidas con errores parciales | Pablo (Q-2, Q-7) | al cerrar H1 | ✅ abajo |
| Q-9, el segundo perfil | Justin (su selector), Marcelo (es suya), Pablo | no llegó a la hora 1 | ✅ resuelta acá |
| HTTP del dry-run: 200 o 201 (H3.S3.M3) | Justin (su cliente acepta ambos, pero lo necesita saber) | al cerrar H3.S3 | ✅ abajo: **200** |
| Rama pusheada y arrancable | Justin (H6.S1), Marcelo (H5.S2, H6.S1), Pablo | apenas H3 esté verde | pendiente |

> **PUBLICADO — `row-contract.ts`, 2026-09-25 03:45.**
> Rama `itzan/carga-masiva-motor-2026-09-25`, commit `e57c012665ba3a43da05450d6eb6d1fe51c43734`.
> Trae los tipos de §1 del contrato **literales**, más `FormatoNoAdmitidoError` implementada, y el barrel
> `import/index.ts` que los reexporta. Ya se puede escribir el parseador XLSX contra ese archivo.
>
> **Una diferencia con el contrato, decidida y avisada:** el contrato escribe `detectarFormato` como una
> declaración sin cuerpo. Tal cual, quien la importara en ejecución no encontraría nada. Así que
> `row-contract.ts` publica el **tipo** de esa firma (`DetectorDeFormato`) y la implementación vive en
> `format-detector.ts`, que se exporta desde el barrel — que es, además, lo que el propio contrato dice en su
> sección de exportación. Para el parseador XLSX no cambia nada: los tipos que necesita están todos.

**Q-2 y Q-7 respondidas leyendo el código, sin esperar a tener la base arriba:**

| Pregunta | Respuesta, contra el corte `343795cc` |
|---|---|
| ¿Qué hace hoy con errores parciales? | **Inserta las filas buenas igual.** `concept-file-import.service.ts:130-160`, y su propio spec lo fija así. O sea que el «todo o nada» del contrato **cambia el comportamiento actual**: queda declarado, con su porqué, en `docs/trabajo/2026-09-25-itzan-motor/decision-todo-o-nada.md` |
| ¿Qué cuenta `skipped` hoy? | Las filas cuyo código ya existía en la versión, que se omiten sin actualizarse — igual que pide Q-7 |
| ¿Dry-run en 200 o 201? | **200.** El repo ya usa respuesta con control explícito del estado en tres controladores, así que no hace falta desviarse del contrato |
| Archivo vacío | Hoy ya responde **422**; lo que cambia es el código, que pasa a `IMPORT_EMPTY_FILE`. (Corrijo un aviso anterior mío que decía 412: era falso.) |

> ### ⚠️ Un error del contrato compartido, para Justin y Pablo
>
> El contrato §2 declara **412** para «falta el archivo» y «la versión no está en borrador». Esta API responde
> **422** en los dos casos: su excepción de precondición está construida sobre 422, no sobre 412
> (`src/common/errors/domain.exception.ts:106-124`), y eso es anterior a este trabajo.
>
> No lo cambio: manda el repo. Pero si la pantalla ramifica por 412 siguiendo el contrato, esa rama no se va a
> ejecutar nunca. Conviene corregir el contrato, que es donde vive la verdad compartida.
> **PUBLICADO — la carpeta `import/` completa, 2026-09-25 10:09.**
> Rama `itzan/carga-masiva-motor-2026-09-25`, commits `bb1f6ce3` (la lectura) y `3f71eaae` (las pruebas del
> registro). Ya está en el remoto todo lo que el contrato promete para leer un archivo:
>
> | Qué | Dónde | Para qué sirve |
> |---|---|---|
> | `detectarFormato(buffer)` | `import/format-detector.ts` | Decide `xlsx`, `ndjson` o `csv` **por contenido**: la firma del archivo y la primera línea, nunca la extensión ni el tipo que declara la subida |
> | `CsvParser` | `import/csv-parser.ts` | RFC 4180 escrito a mano, sin dependencia nueva: separador entre coma y punto y coma, comillas, saltos dentro de celda y marca de orden de bytes |
> | `NdjsonParser` | `import/ndjson-parser.ts` | Lo que el servicio ya hacía, ahora detrás del mismo contrato |
> | `PERFILES_DE_IMPORTACION` | `import/import-profiles.ts` | Qué columnas se esperan, con sus alias en castellano |
> | `PARSEADORES_DE_IMPORTACION` | `import/index.ts` | La lista `[ndjson, csv]` |
> | `validarFilas` | `services/row-validator.ts` | Las reglas del catálogo en un solo lugar, para que los tres formatos den exactamente los mismos errores |
>
> Medido al cerrar: lint 0 · tipos 0 · **21 suites y 224 pruebas** del módulo en verde.
>
> **Para Marcelo:** el parseador de planilla se escribe contra `ParseadorDeArchivo` de `row-contract.ts` y se
> suma a la lista de `index.ts`. Eso es todo el cableado: ni el detector ni el servicio se tocan. El detector
> ya devuelve `xlsx`, así que hoy, sin parseador registrado, ese formato responde «no admitido» con motivo
> legible — que es el comportamiento correcto hasta que se integre.

> ### Q-9 respondida acá, porque no llegó a la hora 1
>
> **Las tres piezas existen**, así que la respuesta literal es sí: entidad
> (`concept_designations.entity.ts:18-47`), DTO (`create-designation.dto.ts:49-79`) y repositorio
> (`concepts.service.ts:120-196`, con `addDesignation`).
>
> **Pero la respuesta útil es que no alcanza**, y conviene saberlo antes de dibujar el selector:
>
> - **Las columnas del contrato no son las de la base.** De las cuatro (`code`, `language`, `use`, `value`),
>   tres son **referencias a conceptos**: la designación cuelga de un concepto por su identificador, y el
>   idioma y el tipo son ellos mismos conceptos del catálogo. Un archivo que traiga códigos necesita un paso
>   de resolución que hoy no existe en ningún punto del importador.
> - **El alta es otro camino de escritura.** Para sostener que sólo una designación sea la preferida por
>   idioma, toma un bloqueo sobre las hermanas del mismo idioma (`concepts.service.ts:149`). Es una segunda
>   transacción con su propia regla, no un perfil más.
>
> **Decisión de este carril:** `designaciones` queda DESCARTADO acá. El motor entregado lo admite sin tocarse
> el día que ese camino exista: sumar un perfil es agregar una entrada a `PERFILES_DE_IMPORTACION`.
>
> **Para Justin:** por ahora, una sola opción en el selector.

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
179

$ ls .claude/rules/[0-9]*.md | wc -l
15

$ .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL

$ git status --porcelain
(vacío: el estándar quedó instalado sin ensuciar el checkout)
```

- [x] Leí `skills-router` y las skills del lote.
- [x] Creé el `PLAN.md` antes del primer `Edit`/`Write` de código.

El `.claude/` que versiona este repo **no se pisó**: sólo se agregaron `rules/`, `hooks/` y las skills que
faltaban, y los candados quedaron en un archivo de ajustes local que el repo ignora. Su `AGENTS.md` tampoco
se tocó, porque acá lo versiona el equipo.

### 2. Avance por hito (se llena al cerrar)

| Hito | Micro | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO | Nota |
|---|---|---|---|---|---|---|
| H1 Corte, baseline, API viva, import de hoy | 14 | 5 | 0 | 0 | 0 | Corte y línea base cerrados. Las respuestas «de antes» del endpoint esperan a tener la aplicación arriba |
| H2 Contrato, detector, CSV, perfiles, provider | 33 | 30 | 1 | 0 | 2 | Cerrado. A medias sólo el registro dentro del módulo, que se observa al arrancar en H3.S3 |
| H3 Servicio ensanchado | 23 | 6 | 0 | 0 | 0 | La validación por fila ya está; falta el servicio |
| H4 Idempotencia y autorización | 15 | | | | | |
| H5 Plantilla | 8 | | | | | |
| H6 OpenAPI y códigos | 4 | | | | | |
| H7 Regresión, PR, cierre | 12 | | | | | |

### 3. Qué se cerró contra el doble (regla 65)

<no aplica: los parseadores NDJSON y CSV son reales. XLSX queda «pendiente de integrar» (rama de Marcelo)>

### 4. Procesos que quedaron corriendo

<lista o «ninguno»>

---

## Cómo repartís tu noche entre los dos carriles

**No hay orden impuesto entre paquetes** (decisión del propietario: ambos se hacen). Sugerencia, no mandato:
arrancá el Carril B (Carga Masiva) primero porque **publicás `row-contract.ts` en tu hora 1** y eso destraba a
Marcelo y a Pablo; en paralelo o después, el Carril A (Farmacia) espera tu Ola 0 propia (Pablo/Marcelo) así que
tampoco perdés nada si entrás un poco más tarde. Si el tiempo aprieta, **decilo en este daily** con qué carril
priorizaste y por qué — es una decisión de coordinación, se registra, no se esconde.

---

## Carril C — Encuentro clínico (Paquete 3, agregado por el propietario): C1, C2

> **AVANCE DEL CARRIL C: 0 / 22.** Sale de `microtareas HECHO / total`. `A MEDIAS` cuenta como no hecha. Se suma a tus carriles A y B, no los reemplaza.

- Plan maestro del paquete: [`PLAN-MAESTRO.md`](../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) · Daily de equipo, sección «Paquete 3»: [`Daily-Noche-2026-09-25.md`](../Daily-Noche-2026-09-25.md)
- Repo: `mantra-core-health` · Ref: `origin/mockup` · Corte de referencia `bf2c3545` → **el tuyo:** (reconsultalo y anotalo por carril)
- Instalación del estándar: la misma de arriba (no la repitas; si abriste un worktree nuevo, fusioná `.claude/` sin pisar y pegá los tres números).
- Cómo entra en tu noche: C1 y después C2 (o en paralelo si tu máquina aguanta: nunca más de dos sesiones ni dos builds a la vez). Mientras C0 no está en `origin/mockup`, adelantá lo de §4.5 del plan.

| Carril | Prompt | Corte propio | Rama | HECHO/total | Peldaño (regla 30) | PR | Push a `mockup` | Bloqueos / avisos |
|---|---|---|---|---|---|---|---|---|
| C1 · Nota médica clave/valor | [prompt](Noche-EncuentroClinico.C1-NotasMedicas/NotaMedicaClaveValor.md) | | `claude/clinica-c1-notas-medicas` | 0/11 | | | | |
| C2 · Orden de análisis desde la consulta | [prompt](Noche-EncuentroClinico.C2-OrdenesDeAnalisis/OrdenDeAnalisisDesdeLaConsulta.md) | | `claude/clinica-c2-ordenes-analisis` | 0/11 | | | | |

### Lo que publicás para otros (con SHA + hora)

(ver «Lo que destraba a otros» en la sección Paquete 3 del daily de equipo)

### Baseline del worktree de este carril

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | | | |
| `yarn typecheck` | | | |
| `yarn test --watch=false --include=<mis carpetas>` | | | |

### Doble revisión crítica de las capturas (regla 35)

(una entrada por captura Playwright: primera mirada · segunda mirada adversarial · qué se corrigió)

### Cierre

- PR: · Push a `mockup` verificado: · `REPORTE.md`: · Pendiente de backend redactado: · `// TODO C8` dejados:
