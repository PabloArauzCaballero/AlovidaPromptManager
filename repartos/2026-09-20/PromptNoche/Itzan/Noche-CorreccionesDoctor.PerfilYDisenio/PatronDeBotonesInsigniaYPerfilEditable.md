# El patrón de la casa: botones con texto, insignia de especialidad, y un perfil que se puede editar entero

> **Rol:** propietario del sistema de diseño compartido y del perfil médico · **Línea:** A · **Fecha:** 2026-09-20 · **Turno:** noche
> **Fuente del pedido:** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md) · **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
> **Correcciones que cubrís: C-01, C-02, C-05, C-06 (dueño del patrón), C-09, C-21 (dueño de la regla)** — 6 de 24.
> **6 hitos · 18 subtareas · 54 microtareas**, todas con criterio de aceptación y Definition of Done.

> ### 🔑 Tu lote tiene una particularidad: los otros cuatro dependen de vos
>
> **C-06 y C-21 son transversales.** Vos no las aplicás en toda la aplicación: **publicás el patrón**
> —el componente y la regla escrita— y cada uno lo aplica en sus archivos reservados. Por eso
> **H2 y H6 tienen prioridad de publicación temprana**: mientras no exista el desplegable de
> acciones, Pablo, Justin, Ender y Marcelo no pueden cerrar su parte de C-06.
>
> Publicar tarde no es un retraso tuyo: **es un bloqueo de los otros cuatro.** Avisá por el daily en
> cuanto el componente exista y compile, aunque el resto de tu lote esté a medias.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `alovida/mantra-core-health` (frontend Angular). **Nada de backend en este lote** |
| `TARGET_REF` | `origin/mockup` — corte leído **`689697821a6e6d2c8f702c7508d6728fa9a1869a`** (PR #554, 2026-09-20T12:32-04). **Reconsultalo y fijá el tuyo** |
| `RAMA DE TRABAJO` | Una tuya, saliendo de `origin/mockup`. **Nada directo sobre `mockup`, nada sin PR** |
| `ARCHIVOS RESERVADOS PARA VOS` | `src/app/shared/**` · `src/app/features/account/my-profile/**` |
| `ARCHIVOS DE OTROS — NO LOS TOQUES` | `features/agenda/**` y `my-services/**` (Pablo) · `patient-chart/medication-block/**` (Justin) · `patient-chart/free-note-block/**`, `admission-block/**`, `clinical-record/consultation/**` (Marcelo) · `core/mock/**`, `features/dashboard/**`, `core/data-access/**` (Ender) |
| `OJO CON ESTO` | `src/app/shared/**` es **el banco de componentes de toda la aplicación**. Un cambio con efecto en el resto se publica como **opción nueva**, nunca cambiando el comportamiento por omisión de un átomo que usan 34 plantillas |
| `LA MAQUETA NO TIENE BACKEND` | `mockBackend: true` fijo en `src/environments/environment.ts`. Tu DoD se demuestra contra `src/app/core/mock/` — **que es de Ender** |
| `CUENTA DE PRUEBA` | `medica@alovida.mock`. **Sintética declarada**: se puede pegar |
| `LÍMITE DE RECURSOS` | Regla 70: un `yarn start`, un build, un navegador, Playwright `--workers=1` |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Un prompt ejecutado sin
> el estándar cargado produce trabajo que después hay que rehacer, porque no va a tener plan, ni
> evidencia, ni reporte. **Si no podés completar este paso, estás `BLOQUEADO`: avisalo y no sigas.**

### 1.1 Instalar el estándar en tu checkout

```bash
# 1. Clonar el estandar al lado del repo de producto
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager

# 2. Copiarlo DENTRO de tu checkout de trabajo (Claude Code solo carga desde ./.claude/)
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./   # solo si tu herramienta no lee .claude/

# 3. Verificar que quedo instalado (pega esta salida en tu daily)
ls .claude/skills | wc -l            # -> 176
ls .claude/rules/[0-9]*.md | wc -l   # -> 14  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

**Si el `git clone` falla con 404:** el estándar todavía no está publicado. Pedíselo a Pablo por
copia directa y registralo como límite de acceso. **Un 404 no demuestra que el repositorio no exista.**

### 1.2 Qué te instala eso

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/` |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o sin sus tres secciones |
| `blocker_gate.py` | Cerrar con microtareas en `BLOQUEADO` o `EN CURSO` sin declarar la simulación de los tres niveles del contrato (regla 65) |

**En cualquier otra herramienta los candados NO corren.** El plan y el reporte siguen siendo igual de
obligatorios.

### 1.3 Skills que tenés que CARGAR para este lote

Son **25**: 11 del proceso y 14 propias del sistema de diseño y del perfil.

**Del proceso — obligatorias para todos:**

| Skill | Para qué |
|---|---|
| `skills-router` | la entrada al catalogo: mapea la situacion concreta a la skill que toca |
| `factual-discovery` | confirmar el sistema real antes de planificar |
| `milestone-planning` | descomponer en hitos, subtareas y microtareas con CA y DoD |
| `anti-hallucination-guard` | localizar lo existente antes de crear; no inventar APIs de terceros |
| `evidence-and-verification` | que podes afirmar con que evidencia |
| `scope-discipline` | no tocar nada fuera del alcance declarado |
| `rationalization-guard` | las excusas tipicas para saltear una verificacion, y su contramedida |
| `context-thrift` | leer por rangos y busqueda, no archivos enteros |
| `progress-reporting` | checkpoints visibles en cada apertura y cierre de microtarea |
| `finish-your-turn` | como se cierra un turno sin dejar nada colgado |
| `work-report-md` | como se redacta el reporte de cierre |

**De tu lote:**

| Skill | Para qué |
|---|---|
| `atomic-design-components` | **la primera de tu lote**: qué es átomo, molécula y organismo, y reusar antes de crear |
| `frontend-design-system` | tokens en vez de literales, y cómo se publica un cambio del sistema |
| `iconography-imagery` | icono con significado, tamaño y nombre accesible |
| `frontend-accessibility` | nombre accesible, foco visible, desplegable con teclado, y nada sólo por color |
| `accessibility-testing` | cómo se prueba: teclado, contraste, tamaño de objetivo, y qué NO detecta lo automático |
| `frontend-data-tables` | acciones de fila, tabla que colapsa en móvil sin perder acciones |
| `angular-forms` | reactive forms tipados, errores por campo, datos preservados ante fallo |
| `frontend-forms-ux` | cuándo validar, qué se preserva, cómo se siente el formulario |
| `angular-development` | standalone, `@if`/`@for`, `input()`, señales, OnPush |
| `component-architecture-solid` | una responsabilidad por componente; cuándo parametrizar y cuándo proyectar |
| `visual-hierarchy-composition` | que un grid de insignias se lea como un grid y no como un montón |
| `color-systems` | tono semántico, contraste y tema oscuro |
| `ui-quality-review` | la lista con la que se revisa una pantalla antes de decir que está bien |
| `visual-proof` | la captura no vale si no la mirás |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.**

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 25 skills de las dos tablas, **empezando por `atomic-design-components`**.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas, pero tampoco los creas sin abrir el archivo
>
> Todo con archivo y línea en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md).
> Lo que más te importa:
>
> - **La medición de partida de C-06: 107 apariciones de `iconOnly` en 34 plantillas** de
>   `src/app/**/*.html`, medido con
>   `git grep -o "iconOnly" origin/mockup -- 'src/app/**/*.html' | wc -l`. **Rehacela en tu corte**:
>   es el número que después dice si está hecho.
> - **El desplegable que el pedido describe ya existe**: `shared/components/molecules/menu/`
>   (`app-menu` + `app-menu-item`), y **ya se usa en la agenda** para el pago
>   (`features/agenda/agenda.html:524`). Tu trabajo es **publicar el patrón de acciones de fila
>   sobre eso**, no crear un componente nuevo desde cero.
> - **El globo existe y está bien hecho**: `shared/components/atoms/tooltip/tooltip.ts` se cuelga del
>   `<body>` con `position: fixed`, así que **no lo recorta ningún contenedor con `overflow`** —el
>   lugar donde mueren los tooltips de una tabla—, aparece con puntero tras una espera y con foco sin
>   espera, y se va con `mouseleave`, `blur` o `Escape`.
> - **C-06 revierte una decisión de propietario escrita en el código.** El comentario de
>   `agenda.html:545` dice textualmente: *«Íconos con su globo (propietario, 2026-09-13): con texto,
>   una solicitud ofrecía hasta cinco botones y la fila crecía a tres renglones»*. El pedido nuevo
>   gana (regla 00 §8), **y el desplegable es lo que resuelve las dos cosas**: devuelve el texto sin
>   que la fila crezca. Eso se registra como desvío con las dos fechas, no como descubrimiento.
> - **La especialidad se pinta hoy de tres formas distintas en un solo archivo**
>   (`account/my-profile/practitioner-profile/practitioner-profile-view/practitioner-profile-view.html`):
>   chips en una lista de datos (**165-172**), chips consolidados (**761-779**) y lista con badges en
>   la pestaña «Credenciales» (**1215-1268**). Ya existe `shared/components/atoms/specialty-icon/`
>   y `organisms/specialty-browser/`: **buscá antes de crear**.
> - **«Cómo atendés» (C-01)** arranca en el comentario de la **línea 417** del mismo archivo, con su
>   `<h3>` en la **421**, y muestra dos datos: `Telemedicina` y `Pacientes nuevos`.
> - **De los dos enlaces de C-02, en este corte queda uno**: `routerLink="/administration/my-practice"`
>   en `my-profile.html:41`. **Verificá el otro antes de «quitarlo»**: puede que ya no esté.
> - **El editor tiene 4 pestañas contra las 6 de la ficha** (`pestanas-del-perfil-medico.ts:105`,
>   `PESTANAS_DEL_EDITOR_MEDICO`), y el archivo explica por qué saltea las dos: el consultorio se
>   edita en su propia pantalla, y «Actividad» son contadores que **no se editan, se miran**.
> - **Trampa del spec**: `pestanas-del-perfil-medico.spec.ts` lee los `key:` del alta de profesional
>   y **falla si un campo del alta queda sin pestaña**. `CAMPO_DEL_ALTA_EN_PESTANA` mapea
>   `officeName`, `municipioConsultorio`, `officeAddressLines` y `gpsConsultorio` a «Dónde atiendo».
>   Vaciar esa pestaña sin tocar el mapa deja el spec verde mintiendo; quitar el mapa sin ofrecer los
>   campos en otro lado lo rompe. **Las dos cosas se deciden juntas.**
>
> ⚠️ **Lo que esa verificación NO hizo: ejecutar.** No se abrió la maqueta ni se corrió un test.
> **Que un componente exista no prueba que sirva para tu caso.** Eso es tuyo.
>
> 🔧 **Trampa de método:** los números de línea son de `origin/mockup`. Si algo no aparece, verificá
> contra qué ref buscás: `git show origin/mockup:<ruta> | grep -n '<patrón>'`.

## 2. Resultado observable

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Existen tres inventarios **medidos con un comando** —botones sólo-icono, grupos de opciones que no son `select`, y lugares donde se pinta una especialidad— y la maqueta levanta con capturas previas. Sin el número, «transversalmente en todas y cada una» no se puede verificar. |
| **H2** | `BLOQUEANTE PARA LOS OTROS CUATRO` | Hay un componente de acciones de fila publicado, con icono **y** texto por opción, recorrible con teclado, con su ejemplo de uso; y una regla escrita de cuándo un botón lleva texto. Los otros cuatro ya pueden aplicarlo. |
| **H3** | `ALTA` | La especialidad se ve igual en todos lados: una insignia con su icono, su nombre y su estado, en grid, publicada como componente y aplicada en el perfil. |
| **H4** | `ALTA` | El perfil médico ya no tiene la sección «Cómo atendés» ni los enlaces sueltos, y el consultorio propio se ve como pestaña con lo que esa pantalla ofrece, incluido su QR. |
| **H5** | `ALTA` | El editor del perfil tiene las mismas pestañas que la ficha y **todos** los campos del alta son editables, o está declarado campo por campo cuál no y por qué. |
| **H6** | `ALTA` | Está publicada la regla de «opciones = `select`», aplicada en tus archivos, con la regresión corrida y las capturas miradas en tres viewports y dos temas. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** Lo que no se cierra queda
> `A MEDIAS` con qué anda, qué no anda y qué falta exactamente (regla 20). **Pero H2 se publica
> igual**: aunque quede a medias todo lo demás, el componente que los otros cuatro esperan sale.

**Kill-test del turno completo:** pedile a cualquiera el número de botones sólo-icono que había y
cuántos quedan. Si no hay dos números, C-06 no está hecho: está opinado. Y abrí el editor del perfil:
si tiene menos pestañas que la ficha, C-05 no está hecho.

## 3. Alcance

**IN:** los tres inventarios medidos con comando · componente de acciones de fila con icono y texto,
teclado y `Escape`, publicado con ejemplo de uso · regla escrita de cuándo un botón lleva texto y
cuándo puede no llevarlo, con la excepción justificada · insignia de especialidad como componente
reusable, con grid, aplicada en el perfil · las tres formas actuales de pintar especialidad,
unificadas en tus archivos · retiro de la sección «Cómo atendés» · retiro de los enlaces sueltos del
perfil y el consultorio propio como pestaña con su QR · decisión conjunta sobre
`CAMPO_DEL_ALTA_EN_PESTANA` y su spec · editor con las mismas pestañas que la ficha · todos los
campos del alta editables o declarados campo por campo · regla de «opciones = `select`» publicada y
aplicada en tus archivos · regresión dirigida, barrido y click-sweep · capturas por viewport y tema ·
`PLAN.md`, `REPORTE.md` y `evidencia/`.

**OUT:** **cualquier archivo fuera de `src/app/shared/**` y `src/app/features/account/my-profile/**`** ·
aplicar C-06 o C-21 **en los archivos de los otros cuatro**: eso lo hacen ellos con tu patrón, y
hacerlo vos es pisarles el archivo · `features/practice/my-practice/**` — **si el consultorio pasa a
pestaña hay que decidir qué pasa con esa pantalla, y eso se acuerda**, no se mueve de prepo ·
`core/navigation/navigation.map.ts` — es navegación compartida: el cambio se **propone** ·
`core/mock/**`, `features/dashboard/**`, `features/agenda/**`, `medication-block/**`,
`free-note-block/**`, `admission-block/**`, `consultation/**` · **el repo de la API** · cambiar el
comportamiento por omisión de un átomo que usan 34 plantillas: se publica una **opción nueva** ·
hacer editables los contadores de «Actividad»: son calculados, y un contador editable **es un dato
inventado** (regla 00 §2) · debilitar `pestanas-del-perfil-medico.spec.ts` para que pase · borrar una
pestaña porque quedó vacía sin decir dónde fueron sus campos · declarar `HECHO` una microtarea cuyo
DoD no corriste.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y
`DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.**

### H1 — Corte, maqueta arriba y los tres inventarios medidos

**Prioridad:** `BLOQUEANTE`

**CA:** Dado el pedido «transversalmente en todas y cada una de las instancias», cuando alguien pregunta cuántas son, entonces hay tres números salidos de un comando, con su lista de archivos — no una impresión.

**DoD:** Las 9 microtareas en `HECHO`. Los tres inventarios en `evidencia/inventarios/` con el comando que los produjo. Gates de partida con exit code.

**Kill-test del hito:** pedí el número de botones sólo-icono. Si la respuesta es «muchos», el inventario no existe.

**Estado:** TODO

#### H1.S1 — El corte y el entorno

**CA:** Dada tu rama, cuando se la compara con `origin/mockup`, entonces sale de ese corte y el SHA está en tu `PLAN.md`.

**DoD:** Las 3 microtareas en `HECHO`, con la salida de `git log -1` pegada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Traer `origin/mockup`, declarar el SHA y salir de ahí con tu rama | El SHA está en tu `PLAN.md` | `git fetch origin && git log -1 --format='%H %ad %s' origin/mockup` → pegada | TODO |
| H1.S1.M2 | Levantar la maqueta y entrar a `/my-account` como médica | La ficha del profesional abre con sus seis pestañas | Captura de las pestañas | TODO |
| H1.S1.M3 | Capturar la ficha, el editor y la pestaña «Dónde atiendo» antes de tocar | Hay tres capturas con nombre que dice qué son | Archivos en `evidencia/antes/`. **Sin la captura previa, «ahora se ve mejor» no es evidencia** | TODO |

#### H1.S2 — Inventario de botones y de opciones

**CA:** Dados los dos inventarios, cuando se los lee, entonces cada fila tiene archivo y cantidad, y el total sale de un comando reproducible.

**DoD:** Las 3 microtareas en `HECHO`, con el comando y su salida pegados.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Medir los botones sólo-icono de toda la aplicación | Hay total y lista por archivo | `git grep -c "iconOnly" -- 'src/app/**/*.html'` y `git grep -o "iconOnly" -- 'src/app/**/*.html' \| wc -l` → pegados en `evidencia/inventarios/` | TODO |
| H1.S2.M2 | Medir los grupos de opciones que hoy no son `select` | Hay total por tipo: chips seleccionables, `radio-group`, `radio-otro`, `segmented-control` | `git grep -c "app-chip\|radio-group\|radio-otro\|segmented-control" -- 'src/app/**/*.html'` → pegado | TODO |
| H1.S2.M3 | Separar en los dos inventarios **qué es tuyo y qué es de otro** | Cada fila dice de quién es el archivo | Tabla con la columna «dueño», usando la tabla de reservas del daily. **Es lo que hace que el inventario sirva de encargo para los otros cuatro** | TODO |

#### H1.S3 — Inventario de especialidades y línea de base de gates

**CA:** Dado el inventario de especialidades, cuando se lo lee, entonces están todos los lugares donde una especialidad se muestra, con su forma actual.

**DoD:** Las 3 microtareas en `HECHO`, con la lista y los exit codes de partida.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Medir dónde se pinta una especialidad hoy y con qué forma | Hay lista con archivo, línea y forma (chip, badge, texto) | `git grep -n "especialidad\|specialty" -- 'src/app/**/*.html'` → pegado y clasificado | TODO |
| H1.S3.M2 | Registrar qué piezas existentes se pueden reusar para la insignia | Están nombradas con su ruta | Lista: `atoms/specialty-icon/`, `atoms/chip/`, `atoms/badge/`, `organisms/specialty-browser/`. **Crear una insignia nueva sin descartar estas cuatro por escrito es el defecto que la regla 95.1 nombra** | TODO |
| H1.S3.M3 | Correr typecheck, lint y los specs del perfil como baseline | Hay exit code de los tres | `yarn typecheck; yarn lint; npx ng test --include=src/app/features/account/my-profile/**/*.spec.ts --watch=false` → `evidencia/antes/gates.txt` | TODO |

### H2 — El patrón: botón con icono y texto, y acciones de fila en desplegable

**Prioridad:** `BLOQUEANTE PARA LOS OTROS CUATRO`

**CA:** Dado cualquiera de los otros cuatro lotes, cuando su dueño necesita poner las acciones de una fila en un desplegable con icono y texto, entonces tiene un componente publicado, con ejemplo de uso y con la regla escrita — sin tener que inventarlo ni copiar el tuyo a mano.

**DoD:** Las 9 microtareas en `HECHO`. El componente compila, tiene su spec, se recorre con teclado y está anunciado en el daily. La regla escrita en el repo, no en el chat.

**Kill-test del hito:** pedile a Pablo que lo use sin preguntarte nada. Si tiene que preguntarte cómo, falta el ejemplo.

**Estado:** TODO

#### H2.S1 — La regla escrita antes del componente

**CA:** Dada la regla, cuando alguien duda si un botón lleva texto, entonces la respuesta está escrita y dice también cuál es la excepción legítima y cómo se justifica.

**DoD:** Las 3 microtareas en `HECHO`. La regla en un archivo del repo. El desvío del 2026-09-13 registrado con sus dos fechas.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Escribir la regla: todo botón lleva icono **y** texto; las acciones de fila van en desplegable | La regla está en un archivo versionado del repo y dice qué hacer en cada caso | Archivo escrito (por ejemplo en `docs/` del frontend o junto al componente) + enlace en el daily | TODO |
| H2.S1.M2 | Registrar el desvío: esto revierte la decisión de propietario del 2026-09-13 | Están las dos fechas, la razón de la vieja y por qué la nueva la reemplaza | Registro escrito citando `agenda.html:545`. **Revertir una decisión sin nombrarla es cómo se pierde la razón de un cambio** | TODO |
| H2.S1.M3 | Declarar la única excepción admitida y cómo se justifica | Está escrito qué botón puede quedar sólo-icono y qué tiene que cumplir para eso | Regla con su excepción. Como mínimo: nombre accesible **y** globo, que es lo que hoy ya cumple `appTooltip` | TODO |

#### H2.S2 — El componente de acciones de fila

**CA:** Dado el componente, cuando se lo usa en una tabla, entonces abre un desplegable con las opciones, cada una con su icono y su texto, sin que la fila crezca, y funciona sólo con teclado.

**DoD:** Las 3 microtareas en `HECHO`. Reusa `app-menu`, no lo reimplementa. Spec propio en verde. Foco devuelto al disparador.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Construir el componente **sobre `app-menu`**, no desde cero | El componente lo usa y no reimplementa el posicionamiento ni el cierre | Diff + el archivo de `molecules/menu/` sin cambios de comportamiento por omisión | TODO |
| H2.S2.M2 | Verificar teclado completo: abrir, recorrer, elegir, `Escape`, foco devuelto | Los cinco comportamientos observados | Recorrido paso por paso con capturas del anillo de foco. Regla 95.4.2 y 95.4.7 | TODO |
| H2.S2.M3 | Escribir su spec: abre, lista las opciones, emite la elegida, cierra con `Escape` | El spec cubre los cuatro y pasa | `npx ng test --include=<ruta del spec> --watch=false` → salida pegada | TODO |

#### H2.S3 — Publicarlo para los otros cuatro

**CA:** Dado el componente terminado, cuando otro dueño de lote lo va a usar, entonces encuentra un ejemplo de uso en una tabla real y sabe cómo pasarle las opciones.

**DoD:** Las 3 microtareas en `HECHO`. El anuncio en el daily con la ruta y el ejemplo. Una aplicación real hecha por vos en un archivo **tuyo**, como demostración.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Aplicarlo una vez en un archivo tuyo, como ejemplo vivo | Hay un uso real funcionando en el perfil o en el banco de componentes | Captura del desplegable abierto en tu pantalla | TODO |
| H2.S3.M2 | Anunciarlo en el daily de equipo con ruta, ejemplo y la regla | El anuncio está escrito y los cuatro pueden empezar | Entrada en el daily de equipo + en tu daily personal. **Este aviso es el que los destraba: no lo dejes para el cierre** | TODO |
| H2.S3.M3 | Registrar el inventario de C-06 como encargo por dueño | Cada uno tiene su número y su lista de archivos | Tabla en el daily de equipo, sacada de H1.S2.M3 | TODO |

### H3 — La insignia de especialidad, una sola en todo el proyecto

**Prioridad:** `ALTA`

**CA:** Dada una especialidad, cuando se la muestra en cualquier pantalla, entonces se ve como la misma insignia —icono, nombre y estado—, y en el perfil del doctor las especialidades se leen como un grid de insignias, no como tres listas distintas.

**DoD:** Las 9 microtareas en `HECHO`. Un solo componente. Las tres formas actuales del perfil, unificadas. Contraste y tema oscuro verificados. Nada transmitido sólo por color.

**Kill-test del hito:** abrí el perfil y contá cuántas formas distintas de mostrar una especialidad quedan en la pantalla. Si hay más de una, C-09 no está hecho.

**Estado:** TODO

#### H3.S1 — Descartar lo existente por escrito, y recién ahí crear

**CA:** Dada la decisión de crear un componente, cuando alguien pregunta por qué no se reusó lo que había, entonces hay un descarte escrito de las cuatro piezas candidatas.

**DoD:** Las 3 microtareas en `HECHO`. El descarte escrito antes del primer archivo nuevo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Abrir las cuatro candidatas y decir, de cada una, por qué sirve o no | Las cuatro tienen veredicto con motivo | Tabla escrita. **Si alguna sirve parametrizada, se parametriza: copiar un componente cuya diferencia se resuelve con un input está prohibido** (regla 95.1.3) | TODO |
| H3.S1.M2 | Definir la anatomía de la insignia: icono, nombre, estado, principal y certificada | Están los datos que muestra y de dónde sale cada uno | Especificación + el tipo de datos real que la alimenta, con su ruta | TODO |
| H3.S1.M3 | Definir los tonos con tokens y verificar contraste en los dos temas | Ningún literal de color; contraste medido | Los tokens usados + medición de contraste en claro y oscuro. Regla 95.1.5 y 95.5.4 | TODO |

#### H3.S2 — El componente y su grid

**CA:** Dado un conjunto de especialidades, cuando se lo muestra, entonces se ve como un grid que se reordena en móvil sin romperse y sin recortar el nombre.

**DoD:** Las 3 microtareas en `HECHO`. Capturas en los tres viewports. Spec propio en verde.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Construir la insignia y su contenedor de grid | Los dos existen y compilan | `yarn typecheck` exit 0 + captura | TODO |
| H3.S2.M2 | Verificar el grid en móvil estrecho, tablet y escritorio | No hay desborde horizontal ni nombre cortado | Las tres capturas. Regla 80.6 | TODO |
| H3.S2.M3 | Escribir su spec: pinta lo que recibe, distingue principal y certificada | El spec pasa | `npx ng test --include=<ruta> --watch=false` → pegada | TODO |

#### H3.S3 — Aplicarlo en el perfil y unificar las tres formas

**CA:** Dado el perfil del doctor, cuando se recorren todas sus pestañas, entonces la especialidad se ve siempre igual, y el conteo sigue estando donde estaba.

**DoD:** Las 3 microtareas en `HECHO`. Las tres formas reemplazadas. Ninguna información perdida en el camino.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Reemplazar las tres formas del perfil por la insignia | Cero chips o badges de especialidad a mano en ese archivo | `git grep -n "especialidad" -- src/app/features/account/my-profile` revisado línea por línea | TODO |
| H3.S3.M2 | Verificar que no se perdió ningún dato: principal, certificada, fechas, estado | Todo lo que se mostraba antes se sigue mostrando | Captura antes/después lado a lado. **Unificar no es recortar**: si algo no entra en la insignia, va al lado, no se borra | TODO |
| H3.S3.M3 | Registrar los lugares fuera de tu alcance donde la especialidad sigue distinta | Hay lista con dueño | Tabla en el daily (directorio, perfil público). **Es encargo para otro turno, no trabajo tuyo de esta noche** | TODO |

### H4 — El perfil pierde «Cómo atendés» y los enlaces; el consultorio pasa a pestaña

**Prioridad:** `ALTA`

**CA:** Dada la pestaña «Dónde atiendo», cuando se la abre, entonces no está la sección «Cómo atendés»; dado el perfil, no hay enlaces sueltos a «Mi consultorio propio» ni a la organización médica; y el consultorio propio se ve como pestaña con lo que esa pantalla ofrece, incluido su QR.

**DoD:** Las 9 microtareas en `HECHO` o `BLOQUEADO` con el acuerdo pedido. Los datos que la sección mostraba, **reubicados o declarados retirados con el motivo**. El spec del mapa de campos, coherente.

**Kill-test del hito:** abrí «Dónde atiendo». Si ves «Telemedicina» o «Pacientes nuevos» en esa pestaña, C-01 no está hecho. Y buscá el QR del consultorio: si hay que salir del perfil para llegar, C-02 no está hecho.

**Estado:** TODO

#### H4.S1 — Quitar «Cómo atendés» sin perder los datos en silencio (C-01)

**CA:** Dada la sección quitada, cuando alguien pregunta dónde se ven ahora «Telemedicina» y «Pacientes nuevos», entonces hay una respuesta escrita: el lugar nuevo, o la decisión de que no se muestran.

**DoD:** Las 3 microtareas en `HECHO`. Captura de la pestaña sin la sección. Los dos datos con destino declarado.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Registrar qué muestra hoy la sección y de dónde sale cada dato | Los dos datos tienen su campo de origen | Fragmento pegado (`practitioner-profile-view.html:417-430`) + los campos del tipo que los alimenta | TODO |
| H4.S1.M2 | Quitar la sección de la pestaña | La sección no está y la pestaña sigue mostrando los consultorios | Captura + `yarn typecheck` exit 0 | TODO |
| H4.S1.M3 | Declarar el destino de los dos datos | Está escrito si se muestran en otro lado o si se retiran, y por qué | Decisión en el `REPORTE.md`. **Quitar un dato de la pantalla sin decirlo es perder información con la excusa de un rediseño** | TODO |

#### H4.S2 — Los enlaces sueltos salen, el consultorio entra como pestaña (C-02)

**CA:** Dado el perfil, cuando se lo recorre, entonces no hay enlaces sueltos a las dos pantallas, y el consultorio propio se ve adentro, con su QR y con lo que esa pantalla ofrece.

**DoD:** Las 3 microtareas en `HECHO` o `BLOQUEADO`. El QR **reusado**, no rehecho. La pantalla original y su entrada de menú, con decisión declarada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Verificar cuántos de los dos enlaces existen en tu corte y quitarlos | Los que existían no están | `git grep -n "my-practice\|medical-organization" -- src/app/features/account/my-profile` → antes y después. **Si uno ya no estaba, se declara: no se inventa que se lo quitó** | TODO |
| H4.S2.M2 | Traer el consultorio propio como pestaña, reusando el diálogo de QR que ya existe | La pestaña existe y el QR se abre desde ahí | Captura del QR abierto desde el perfil. Reusá `my-profile/work-history/site-bank-qr-dialog/` | TODO |
| H4.S2.M3 | Declarar qué pasa con `/administration/my-practice` y con su entrada de menú | Está escrito: sigue, redirige o se retira, y quién lo decide | Decisión + pedido de acuerdo en el daily. **`features/practice/**` y `navigation.map.ts` NO son tuyos: se acuerda, no se mueve** | TODO |

#### H4.S3 — El mapa de campos y su spec, decididos juntos

**CA:** Dado el mapa `CAMPO_DEL_ALTA_EN_PESTANA`, cuando se corre su spec, entonces pasa **y** dice la verdad: cada campo del alta está en la pestaña donde realmente se ve.

**DoD:** Las 3 microtareas en `HECHO`. Spec en verde sin haberlo debilitado. Ningún campo del alta huérfano.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Correr el spec del mapa antes de tocar y después | Hay las dos salidas | `npx ng test --include=src/app/features/account/my-profile/pestanas-del-perfil-medico.spec.ts --watch=false` × 2 → pegadas | TODO |
| H4.S3.M2 | Ajustar el mapa a dónde se ve cada campo de verdad | Ningún campo apunta a una pestaña donde no está | Diff del mapa + el spec en verde. **Prohibido cambiar el spec para que pase**: se cambia el mapa o se ofrece el campo (regla 80.5.4) | TODO |
| H4.S3.M3 | Verificar que los cuatro campos del consultorio siguen visibles en algún lado | Los cuatro se ven | Captura donde se ven. Si alguno dejó de verse, **eso es un campo perdido** y se declara | TODO |

### H5 — Editar muestra todos los campos, en todas las pestañas

**Prioridad:** `ALTA`

**CA:** Dado el editor del perfil, cuando se lo abre, entonces tiene las mismas pestañas que la ficha y se puede editar la información de cada una; y si algún campo no es editable, está declarado campo por campo cuál y por qué.

**DoD:** Las 9 microtareas en `HECHO` o `A MEDIAS` con la lista de campos que faltan. Cada pestaña editable probada guardando y **releyendo**. Los datos preservados ante un fallo.

**Kill-test del hito:** abrí el editor y contá las pestañas. Si son menos que las de la ficha, no está hecho. Después editá un campo de la pestaña nueva, guardá, recargá: si el cambio no está, no está hecho.

**Estado:** TODO

#### H5.S1 — Igualar las pestañas del editor a las de la ficha

**CA:** Dado el editor, cuando se lo compara con la ficha, entonces tienen las mismas pestañas en el mismo orden, y entrar y salir del modo edición no cambia de pestaña.

**DoD:** Las 3 microtareas en `HECHO`. La constante compartida sigue siendo una sola. El caso de «Actividad» resuelto explícitamente.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Igualar `PESTANAS_DEL_EDITOR_MEDICO` a las de la ficha, resolviendo las dos ausencias | Las pestañas coinciden, o la que no está tiene su motivo escrito en el archivo | Diff + captura del editor. El archivo ya documenta por qué faltaban las dos: **ese comentario se actualiza, no se borra** | TODO |
| H5.S1.M2 | Resolver «Actividad»: son contadores calculados | Está escrito que no se editan y por qué, o cuál de sus datos sí es editable | Decisión escrita + registro de `Q-I1`. **Un contador editable es un dato inventado** (regla 00 §2.1) | TODO |
| H5.S1.M3 | Verificar que el lápiz no cambia de pestaña | Se entra a editar en la misma pestaña en la que se estaba | Recorrido con captura antes y después. Es exactamente el defecto que la constante compartida evita | TODO |

#### H5.S2 — Todos los campos del alta, editables

**CA:** Dado cualquier campo que el alta de profesional pregunta, cuando se lo busca en el editor, entonces está — o está en la lista de excepciones con su motivo.

**DoD:** Las 3 microtareas en `HECHO`. La comparación campo por campo hecha con el mapa, no a ojo. Cada campo nuevo con etiqueta accesible.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Listar los campos del alta y cruzarlos con los que el editor ofrece hoy | Hay tabla con «está / no está» por campo | Tabla sacada de `CAMPO_DEL_ALTA_EN_PESTANA` y del formulario de alta. **A ojo no**: son doce pasos de alta | TODO |
| H5.S2.M2 | Agregar los campos que falten, en su pestaña | Los que faltaban están y se pueden escribir | Capturas por pestaña + `yarn typecheck` exit 0 | TODO |
| H5.S2.M3 | Verificar etiqueta accesible y foco visible en cada campo nuevo | Todos tienen etiqueta real, no placeholder | Revisión con teclado + captura del anillo de foco. Regla 95.3.5 y 95.4.7 | TODO |

#### H5.S3 — Guardar de verdad, y no perder lo escrito

**CA:** Dado un cambio en cualquier pestaña, cuando se guarda, entonces se relee del servidor con el valor nuevo; y si el guardado falla, lo escrito no se pierde y el error se muestra en su campo.

**DoD:** Las 3 microtareas en `HECHO`. Un caso de fallo ejercitado de verdad. Ningún error genérico donde hay error de campo.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Editar y guardar un campo por pestaña, recargando después | El valor nuevo sobrevive a la recarga | Capturas tras recargar. **Un valor que se ve porque lo pintamos nosotros no prueba que el servidor lo tenga** | TODO |
| H5.S3.M2 | Provocar un fallo de guardado y verificar que no se pierde lo escrito | Los datos siguen en el formulario y el error se ve | Caso ejercitado con captura. El simulador tiene fallos simulables (`core/mock/fallos-simulados.ts`): **es de Ender, se lo pedís** si no sabés cómo activarlo | TODO |
| H5.S3.M3 | Verificar que el error del servidor se muestra en su campo, no como genérico | Cada error llega a su campo | Captura del error junto al campo. Regla 95.3.2 | TODO |

### H6 — «Opciones = select», regresión, prueba visual y cierre

**Prioridad:** `ALTA`

**CA:** Dada la regla de C-21, cuando otro dueño de lote duda si algo tiene que ser un `select`, entonces la respuesta está escrita, con la tensión contra los toggles de C-10 resuelta; y en tus archivos ya está aplicada.

**DoD:** Las 9 microtareas en `HECHO`. La regla publicada en el repo y anunciada. Medición antes y después. Gates y barrido con salida pegada. `REPORTE.md` escrito.

**Kill-test del hito:** preguntale a Pablo si un toggle viola C-21. Si no puede contestar leyendo tu regla, la regla no está escrita.

**Estado:** TODO

#### H6.S1 — La regla de las opciones, y su tensión con los toggles

**CA:** Dada la regla, cuando se la lee, entonces distingue elegir un valor de una lista (un `select`) de alternar dos estados excluyentes (un toggle), y dice qué hacer con los chips de atajo.

**DoD:** Las 3 microtareas en `HECHO`. La tensión con C-10 resuelta por escrito y registrada como supuesto, no como hecho.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Escribir la regla con sus tres casos: lista, alternancia y atajo | Los tres casos tienen respuesta y ejemplo | Archivo escrito + enlace en el daily | TODO |
| H6.S1.M2 | Registrar la tensión: C-21 pide `select` y C-10 pide toggles | Está escrito que es un supuesto de lectura y a quién se confirma | Registro de `Q-D8` con dueño (doctor). **No lo presentes como lo que el doctor dijo: es tu interpretación** | TODO |
| H6.S1.M3 | Anunciar la regla y el inventario por dueño en el daily de equipo | Los cuatro tienen su número y su lista | Entrada en el daily de equipo | TODO |

#### H6.S2 — Aplicarla en tus archivos

**CA:** Dados tus archivos, cuando se los mide, entonces no queda ningún grupo de opciones que no sea un `select`, salvo los que la regla admite con su motivo.

**DoD:** Las 3 microtareas en `HECHO`. Medición antes y después. Cada excepción justificada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Medir en tus archivos antes de tocar | Hay número | `git grep -c "app-chip\|radio-group\|radio-otro" -- src/app/shared src/app/features/account/my-profile` → pegado | TODO |
| H6.S2.M2 | Convertir lo que corresponda y dejar justificado lo que no | El número bajó y las excepciones tienen motivo | Medición nueva + tabla de excepciones | TODO |
| H6.S2.M3 | Verificar que ningún `select` nuevo perdió una opción por el camino | Las opciones son las mismas que antes | Comparación antes/después de cada lista | TODO |

#### H6.S3 — Regresión, prueba visual y cierre

**CA:** Dado el turno cerrado, cuando alguien que no lo vivió lee tu reporte, entonces sabe qué quedó demostrado, qué quedó a medias con las cuatro respuestas, y qué encargo quedó para los otros cuatro.

**DoD:** Las 3 microtareas en `HECHO`. Gates en 0. Barrido y click-sweep serial. Capturas 3 viewports × 2 temas, miradas. `REPORTE.md` con sus tres secciones.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Gates estáticos y specs, con los del perfil actualizados al requisito | Exit 0 y specs en verde | `yarn typecheck; yarn lint; npx ng test --include=src/app/shared/**/*.spec.ts --include=src/app/features/account/my-profile/**/*.spec.ts --watch=false` → pegadas | TODO |
| H6.S3.M2 | Barrido y click-sweep de la maqueta, serial | Las filas de `/my-account` y del banco de componentes están limpias | Las dos salidas + rutas de artefactos, con `--workers=1`. **Tocaste `shared/**`: el barrido completo es lo único que demuestra que no rompiste otra pantalla** | TODO |
| H6.S3.M3 | Capturas 3 viewports × 2 temas de ficha, editor, insignias y desplegable, **miradas**, y `REPORTE.md` | Cada captura con su observación; el reporte abre con `AVANCE: <HECHO> / 54` | Índice de capturas + archivo en disco | TODO |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea | Supuesto con el que seguís |
|---|---|---|---|---|
| Q-D3 | C-06 revierte una decisión de propietario del 2026-09-13 escrita en el código | Doctor / propietario | Nada: gana el pedido nuevo | Se implementa el desplegable, que resuelve las dos cosas, y se registra el desvío |
| Q-D8 | C-21 pide `select` para «todo lo que sean opciones», y C-10 pide toggles | Doctor | Sólo los casos de alternancia | Lista → `select`; alternancia de dos estados excluyentes → toggle |
| Q-I1 | C-05 pide que **todas** las pestañas sean editables, y «Actividad» son contadores calculados | Doctor | Sólo esa pestaña | Los contadores **no** se editan; se declara campo por campo. Un contador editable es un dato inventado |
| Q-I2 | C-02 dice que el consultorio «se ve como pestaña», y hoy se edita en `/administration/my-practice` | Doctor / coordinación | Qué pasa con esa pantalla y con su entrada de menú | La pestaña **muestra y edita**; la pantalla original se decide aparte y no se toca esta noche |
| Q-I3 | C-01 no dice dónde se ven «Telemedicina» y «Pacientes nuevos» después de quitar la sección | Doctor | Sólo el destino de esos dos datos | Se reubican en la pestaña que corresponda; si no hay lugar, se declara que se retiran |
| Q-I4 | C-09 dice «homogénea en todo el Proyecto», y hay lugares fuera de tu alcance (directorio, perfil público) | Coordinación | Nada de esta noche | Se publica el componente y se **registra** la lista de lugares pendientes con su dueño |

<ejemplos>
Dos formas de cerrar la misma microtarea. La diferencia no es de redacción: es que una se puede
auditar y la otra no.

<ejemplo tipo="aceptable" microtarea="H2.S2.M2">
El desplegable abre con `Enter`, se recorre con flechas, elige con `Enter`, cierra con `Escape` y devuelve el foco al botón que lo abrió: los cinco pasos en `evidencia/h2/teclado.md` con captura del anillo de foco en cada uno. Su spec pasa 4/4 (`evidencia/h2/spec.txt`).

Estado: HECHO · Veredicto: PASS · Peldaño: VERIFIED
</ejemplo>

<ejemplo tipo="prohibido" microtarea="H2.S2.M2">
El desplegable funciona y es accesible.

Estado: HECHO
</ejemplo>

Por qué el segundo no vale: «accesible» sin el recorrido de teclado es una impresión. Y `app-menu` puede abrir y no devolver el foco: eso se ve probándolo, no leyéndolo.
</ejemplos>

## 6. Definition of Done del turno

- [ ] Las **54 microtareas** están en `HECHO`, en `BLOQUEADO` con su causa y el pedido escrito, o en `A MEDIAS` con qué anda, qué no anda, qué falta y dónde quedó.
- [ ] **Ninguna microtarea quedó en `EN CURSO`** al cerrar.
- [ ] Cada hito y cada subtarea tienen su Estado actualizado.
- [ ] Todo veredicto es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **Ningún `PASS` sin comando y salida pegados.**
- [ ] **Los tres inventarios existen con su comando y su número**, y con la columna de dueño.
- [ ] **El componente de acciones de fila está publicado y anunciado en el daily**, aunque el resto del lote esté a medias. Si no salió, está dicho **explícitamente** que los otros cuatro quedan bloqueados en su parte de C-06.
- [ ] El componente reusa `app-menu` y no cambió el comportamiento por omisión de ningún átomo que usen otras 34 plantillas.
- [ ] La regla de botones y la de opciones están **escritas en el repo**, no sólo en el chat.
- [ ] El desvío contra la decisión del 2026-09-13 está registrado con sus dos fechas.
- [ ] La insignia de especialidad es **una sola** y en el perfil no queda ninguna otra forma.
- [ ] Ningún dato de especialidad se perdió al unificar: la comparación antes/después está pegada.
- [ ] «Cómo atendés» no está, y los dos datos que mostraba tienen destino declarado.
- [ ] Los enlaces sueltos no están, y el QR del consultorio se abre **desde el perfil**.
- [ ] `pestanas-del-perfil-medico.spec.ts` pasa **sin haber sido debilitado**, y ningún campo del alta quedó huérfano.
- [ ] El editor tiene las mismas pestañas que la ficha, y cada campo que no es editable está declarado **uno por uno**.
- [ ] Un guardado por pestaña verificado **releyendo tras recargar**, y un fallo ejercitado sin perder lo escrito.
- [ ] Cero archivos tocados fuera de `shared/**` y `account/my-profile/**`. Lo que hizo falta en `practice/**` o en `navigation.map.ts` está **acordado y anotado en los dos dailies**.
- [ ] Ningún color literal: todo por token, verificado en claro y oscuro.
- [ ] Ninguna información transmitida sólo por color.
- [ ] Ningún spec borrado, saltado ni debilitado. Ningún timeout subido. Ningún reintento agregado.
- [ ] Capturas en 3 viewports × 2 temas, **miradas**, cada una con su observación.
- [ ] El barrido completo de la maqueta corrió: es lo único que demuestra que un cambio en `shared/**` no rompió otra pantalla.
- [ ] Ningún proceso quedó corriendo al cerrar, o está declarado cuál y por qué.
- [ ] Avance reportado como `microtareas HECHO / 54`, **no** como porcentaje a ojo.
- [ ] Ningún dato real de persona en ninguna salida pegada.

## 7. Handoff — avisá por el daily al cerrar cada hito, no al final

| Al cerrar | A quién | Qué exactamente |
|---|---|---|
| **H1** | Los cuatro | **Su número y su lista** de botones sólo-icono y de grupos de opciones: es su encargo de C-06 y C-21 |
| **H2** | Los cuatro | **La ruta del componente de acciones de fila y su ejemplo.** Este es el aviso que los destraba: mandalo en cuanto compile |
| **H2** | Marcelo | La regla escrita, para que su dictamen tenga contra qué medir |
| **H3** | Pablo, Ender | Que la insignia existe, por si su pantalla muestra especialidades |
| **H3** | Coordinación | La lista de lugares donde la especialidad sigue distinta y no era tuyo tocar |
| **H4** | Coordinación | Qué se decide sobre `/administration/my-practice` y su entrada de menú |
| **H5** | Ender | Si necesitás activar un fallo simulado para probar el error de guardado |
| **H5** | Marcelo | Qué campos quedaron no editables y por qué: entra en el dictamen |
| **H6** | Los cuatro | La regla de «opciones = `select`» y la tensión con los toggles, resuelta por escrito |

Si un bloqueo se confirma, **no iteres sobre él**: registrá la causa, escribí el pedido, y pasá a la
siguiente microtarea independiente. Antes de declarar `BLOQUEADO`, leé la **regla 65**: si el
contrato de lo que te falta se puede nombrar, se simula en sus tres niveles —correcto, límite e
inválido— y la microtarea **se cierra contra el doble**. Sólo una decisión de negocio sin tomar, o
una acción sobre algo compartido que haya que acordar, justifican dejarla abierta.
