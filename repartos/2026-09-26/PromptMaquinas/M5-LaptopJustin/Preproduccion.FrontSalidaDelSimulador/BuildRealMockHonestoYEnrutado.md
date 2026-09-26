# M5 · Laptop Justin — encargo de preproducción (2026-09-26)

> **Estado del encargo:** `A MEDIAS` (14/15 microtareas) · **Eje:** front: la salida del simulador · **Hitos:** 3
> **Peldaño alcanzado:** `VERIFIED` (H1, H2) · `TESTED` (H3). PR [#711](https://github.com/mdavila-2001/mantra-core-health/pull/711).
> Detalle: `mantra-core-health/docs/progress/evidence/lane-m5-build-real/REPORTE.md`.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Tu daily: [`M5-LaptopJustin-Daily-Maquinas-2026-09-26.md`](../M5-LaptopJustin-Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M5**. Trabajás en `mantra-core-health` (Angular 21 + SSR, señales). **No
necesitás backend**: la rama trae su simulador en memoria y `yarn start` sola no molesta a nadie.

**Tu H1 es el carril más importante de los 36: sin él no hay preproducción, sólo maqueta.**

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

El estándar de la casa vive en `AlovidaPromptManager`. Instalalo en el repo donde vayas a
trabajar y **pegá la salida de los tres comandos** en tu daily. Un turno que arranca sin esto
arranca en `BLOQUEADO`, porque produce trabajo sin plan, sin evidencia y sin reporte — que
después hay que rehacer.

```bash
ls .claude/skills | wc -l
ls .claude/rules/[0-9]*.md | wc -l
python .claude/hooks/plan_gate.py --self-test
```

Entrá por **`skills-router`**, que es el índice: mapea la situación concreta a la skill que hay
que cargar y fija la precedencia cuando dos se contradicen. Con 178 skills, leer el catálogo
entero no sirve; el router sí.

**Las skills de este encargo:** `angular-development`, `angular-ssr-hydration`, `angular-signals-state`, `dockerfile-production`, `frontend-error-monitoring`, `e2e-playwright`, `visual-proof`, `evidence-and-verification`, `security-guardrails`, `scope-discipline`.

Los **hechos de cada proyecto** (comandos reales, invariantes del modelo, prohibiciones, rutas)
no viven en las skills: viven en el `CLAUDE.md` de ese repositorio, y **mandan sobre cualquier
skill**.

## 2. Resultado observable

Existe un artefacto de producción que **habla con la API real**, con SSR encendido, las demos
apagadas, sin el cartel de cuentas demo y sin dominios de túneles horneados. El simulador deja de
inventar éxitos, y los tres prefijos que faltan dejan de contestar HTML con 200.

**Kill-test:** levantar el artefacto real y mirar la pestaña de red del navegador. Si la petición la
contesta el interceptor en vez de salir a la red, no está hecho — y el build en verde no alcanza
para decir lo contrario.

## 3. Alcance

**IN:** `src/environments/**`, `angular.json`, `app.html`, `app.ts`, `app.config.ts`,
`src/server.ts`, `Dockerfile`, `deploy/`, `src/app/core/mock/**`, `proxy.conf*` y los
`scripts/check-*.mjs`.

**OUT:** **no** tocás pantallas ni contratos de dominio, y **la maqueta tiene que seguir
existiendo como despliegue aparte** con `mockBackend: true` en su propia configuración: el
cliente la usa. **No** arregles el lint del front ni la suite: son de M6.

## 4. Contexto que no se deduce leyendo el repo

**Dos compuertas están rotas de antes y no son tu culpa.**

1. **La suite del front no es determinista.** Dos corridas del mismo commit dieron **17 y 11**
   suites rojas, con conjuntos distintos, y una que falla completa **pasa aislada**. La causa está
   escrita en `src/test-setup.ts`: un throw en un hook deja el `TestBed` instanciado y envenena
   los archivos que sigan **en el mismo worker**. **Hasta que M6 cierre su H2, corré specs
   dirigidos** (`yarn test --watch=false --include=<ruta>`) y **no uses el total como compuerta**.
2. **`yarn lint` tiene 263 errores en 201 archivos idénticos a `mockup`.** Es línea base; lo
   cierra M6.

**Dos cuidados de SSR.** Las 11 rutas `RenderMode.Server` van a pedir datos a la API **desde el
servidor**: decidí y documentá si por la red interna (`http://api:3000`) o por el dominio público,
y pasá el estado por `TransferState` para no pedir dos veces. Y las rutas `Prerender` **no pueden**
depender de la API en tiempo de build — `bo-departments.service.ts` documenta que un prerender
contra la API **ya colgó el `yarn build`**.

## 5. Plan

### H1 — Existe un artefacto de producción que habla con la API real

**CA:** Dado el artefacto construido con la configuración real, cuando se levanta y se abre una pantalla, entonces las peticiones salen a la API y **no** al simulador.
**DoD:** Las microtareas de H1 en `HECHO`, con el build en verde y una captura de la red mostrando la petición real.
**Estado:** HECHO

#### H1.S1 — La configuración de build que hoy no existe

**CA:** Dado `yarn build --configuration=production-api`, cuando se corre, entonces sale verde con SSR y con el simulador apagado.
**DoD:** Las cuatro microtareas en `HECHO` con la salida del build pegada.
**Estado:** HECHO

El hecho central, medido: **`mockBackend: true` está fijo en `production` y también en
`origin/dev`**, y la única configuración sin simulador (`real-api`/`e2e-real`) **apaga el SSR**.
El `Dockerfile` hace `yarn build` sin `--configuration`, así que el contenedor sale con el
simulador encendido. **Hoy no existe ningún artefacto que hable con la API.**

Los respaldos de las demos dicen `?? true` aunque cada comentario diga «apagada por defecto».

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Crear `environment.production-api.ts` con todo apagado | `mockBackend` y las cuatro demos en `false` | archivo y build pegados | HECHO |
| H1.S1.M2 | Agregar la configuración `production-api` con SSR | el build sale verde | salida pegada | HECHO |
| H1.S1.M3 | Sacar los dominios de túneles de `allowedHosts` de producción | no quedan `.devtunnels.ms` ni similares | diff pegado | HECHO |
| H1.S1.M4 | Pasar la configuración al `Dockerfile` por `ARG` | la imagen se construye con ella | build pegado | HECHO |

#### H1.S2 — Que el simulador no viaje en el paquete real

**CA:** Dado el artefacto real, cuando se inspecciona, entonces no registra el interceptor del simulador ni pinta el cartel de cuentas demo.
**DoD:** Las tres microtareas en `HECHO` con la evidencia de red y la foto pegadas.
**Estado:** HECHO

`app-mock-banner` se pinta **sin condición** y lista las cinco cuentas demo. El interceptor va
en la cadena de producción. Y `server.ts` redirige `/public/media/:id` a un SVG de maqueta,
también en producción.

`environment.real-api.spec.ts` fija **como contrato** que «producción sigue con la maqueta
encendida». **Se reescribe el contrato, no se borra la prueba.**

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Montar el cartel sólo con el simulador encendido | no aparece en el artefacto real | foto pegada | HECHO |
| H1.S2.M2 | No registrar el interceptor con la configuración real | la petición sale a la red | captura de red pegada | HECHO |
| H1.S2.M3 | Reescribir el contrato de la prueba y endurecer el verificador | `check-real-api-config` falla si algo queda en `true` | salida pegada | HECHO |

### H2 — El simulador deja de esconder las brechas

**CA:** Dada una ruta que la API no tiene, cuando el simulador la recibe, entonces devuelve **501** en vez de inventar un éxito.
**DoD:** Las microtareas de H2 en `HECHO`, con el inventario mock↔API publicado y su comprobación en CI.
**Estado:** HECHO

#### H2.S1 — Volverlo honesto antes de apagarlo

**CA:** Dado un error, cuando el simulador lo devuelve, entonces usa la **misma forma** que la API (422 y `details.violations`), no 412 ni `issues`.
**DoD:** Las cuatro microtareas en `HECHO` con las unitarias pegadas.
**Estado:** HECHO

Tres mecanismos esconden las brechas: `respuestaGenerica` **inventa un éxito** para cualquier
ruta sin manejador; no aplica `forbidNonWhitelisted` ni controla roles; y responde errores con
otra forma que la API. **Todo recorrido en `mockup` sale verde aunque la API lo rechace.**

Y **N-12**: la médica demo tiene roles que la API no le da
(`['PRACTITIONER','CLINICIAN','SCHEDULING_ADMIN']` contra sólo `PRACTITIONER`), y su token dura
8 h contra los 15 min de la API.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Convertir `respuestaGenerica` en 501 | una ruta desconocida da 501 | unitaria pegada | HECHO |
| H2.S1.M2 | Alinear la forma de los errores con la API | 422 y `details.violations` | unitaria pegada | HECHO |
| H2.S1.M3 | Darle a la médica demo los roles que la API sí da | coincide con el token real | diff pegado | HECHO |
| H2.S1.M4 | Publicar el inventario mock↔API como comprobación de CI | falla si aparece una ruta sin par | salida pegada | HECHO |

### H3 — El enrutado de producción no miente con 200

**CA:** Dado `/loyalty`, `/patients/me/reviews` o `/ai`, cuando se piden en producción, entonces llegan a la API en vez de recibir HTML del SSR con 200.
**DoD:** Las microtareas de H3 en `HECHO`, con `check-api-prefixes` en verde y la respuesta de cada prefijo pegada.
**Estado:** A MEDIAS

#### H3.S1 — Los tres prefijos que faltan

**CA:** Dados los tres prefijos, cuando se agregan a las tres configuraciones, entonces `check-api-prefixes` y `check-client-prefixes` pasan.
**DoD:** Las dos microtareas en `HECHO` con la salida pegada.
**Estado:** A MEDIAS

Faltan en `proxy.conf.json`, `proxy.conf.docker.json` y `deploy/api-locations.conf`. Que el SSR
conteste **HTML con 200** es peor que un 404: el cliente cree que funcionó.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Agregar los tres prefijos en las tres configuraciones | los verificadores pasan | salida pegada | HECHO |
| H3.S1.M2 | Comprobar cada prefijo contra el artefacto levantado | devuelve JSON, no HTML | respuesta pegada | A MEDIAS |

#### H3.S2 — El triage por IA, que hoy es un problema de datos

**CA:** Dada la decisión D-C, cuando se toma, entonces queda registrada y el servicio deja de recibir texto clínico sin autenticar.
**DoD:** Las dos microtareas en `HECHO` con la decisión registrada.
**Estado:** HECHO

Hoy **manda texto clínico sin autenticar a una IP pública escrita en el repo**, y el dictado va
a Google. **D-C es del propietario:** qué servicio lo atiende, con qué base legal y dónde corre.
**Pará y preguntá antes de cablearlo.**

Y **Google Maps choca con la CSP a propósito**: `security-headers.ts` fija
`img-src 'self' data: https://tile.openstreetmap.org` y `connect-src 'self'`, con prueba que lo
verifica. El proyecto usa Leaflet + OpenStreetMap sin clave. Traerlo es **cambiar la CSP**:
decisión de arquitectura, no un import.

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Registrar D-C con la pregunta concreta | queda en `DECISIONS.md` | enlace pegado | HECHO |
| H3.S2.M2 | Sacar la IP del repositorio | no queda ninguna IP escrita | `grep` pegado | HECHO |


## 6. Ambigüedades registradas

Se **registran**, no se resuelven por conveniencia. Si una bloquea, se declara `BLOQUEADO` con
la evidencia y se sigue con lo que no dependa de ella.

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | D-C: qué servicio atiende el triage por IA, con qué base legal y dónde corre | el propietario | H3.S2 |
| Q-02 | Con qué origen habla el SSR con la API: red interna o dominio público | el propietario / M1 | H1.S1, si el despliegue los separa |
| Q-03 | D-I: ¿se enciende la cookie httpOnly del refresh? Encenderla sin tocar el front pierde la sesión al recargar | el propietario | nada hoy: se registra |

## 7. Definition of Done del encargo

Los tres hitos en `HECHO`. El artefacto real levantado y **observado en el navegador** pidiendo a
la API —captura de red pegada, no sólo el build en verde—, fotos en 375, 768 y 1440 en claro y
oscuro, `check-real-api-config` fallando cuando algo queda en `true`, y el inventario mock↔API
publicado. Todo en `docs/progress/evidence/`.

## 8. Reglas que no se negocian

- `corepack yarn`, nunca `npm`.
- **Nada se declara hecho por debajo de `REGRESSION_VERIFIED`.** La evidencia va a
  `docs/progress/evidence/lane-<id>/REPORT.md` con los comandos y su **salida literal pegada**.
  Compilar no es verificar; «debería funcionar» es FAIL.
- **No inventar.** Antes de crear una entidad, tabla, endpoint o componente, localizá el
  equivalente **por código**. «Seguramente ya hay algo así» no es evidencia.
- **Diff mínimo.** Nada de refactors ni renombres fuera de lo pedido.
- Identificadores nuevos en **inglés**; prosa de pantalla en **castellano rioplatense**.
- Si tocás datos de personas, `data-privacy-phi` aplica aunque nadie lo haya pedido.
- **Ninguna afirmación visual sin foto**: navegador con `--workers=1`, en 375/768/1440, claro y
  oscuro. Un build verde no prueba que la app hable con la API.
- **No debilites pruebas.** Si una fija el comportamiento viejo, se **reescribe su contrato** y se
  explica en el PR. Nunca `skip`, nunca borrar aserciones.
- Reusá los organismos del sistema (`app-page-header`, `app-card`, `app-tabs`, `app-data-table`,
  `app-empty-state`, `app-badge`, `app-file-input`) antes de crear UI.
- Cada estado asíncrono: **cargando, con datos, vacío y error**. Los cuatro.
- **Nada de secretos en el front**: todo lo que entra por `environment` termina legible en el
  paquete. `scripts/generate-env.mjs` los rechaza; no lo esquives.
