# M5 · Laptop Justin — encargo de preproducción (2026-09-26)

> **Estado:** `TODO` · **Eje:** front: la salida del simulador · **Carriles:** 3
> **Peldaño al repartir:** `DISCOVERED`. Nada de este encargo se ejecutó todavía.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Pedido del propietario: [`TEST-PREPRODUCCION-2026-09-26.md`](../../../../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1` · modelo `origin/dev` @ `13dd040`

Sos la máquina **M5**. Trabajás en `mantra-core-health` (Angular 21 + SSR, señales).
No necesitás backend: la rama trae su simulador en memoria y `yarn start` sola no molesta
a nadie.

Rama base: **`test`** (`ec7037f7`; `typecheck` 0 y `build` exit 0, medidos). Un worktree por
carril desde `origin/test`, un PR por carril contra `test`. M1 mergea.

**Tu carril 1 es el más importante de los 36: sin él no hay preproducción, sólo maqueta.**

## Dos cosas que tenés que saber antes de tocar nada

1. **La suite del front no es determinista.** Dos corridas del mismo commit dieron 17 y 11
   suites rojas, con conjuntos distintos, y una que falla en la corrida completa pasa
   aislada. La causa está escrita en `src/test-setup.ts`: un throw en un hook deja el
   `TestBed` instanciado y envenena los archivos que sigan **en el mismo worker**. Viene de
   `mockup`, no del merge. **Mientras M6 no cierre su carril F3, corré specs dirigidos**
   (`yarn test --watch=false --include=<ruta>`), no la suite completa, y no uses el total
   como compuerta.
2. **`yarn lint` está rojo con 263 errores en 201 archivos**, todos idénticos a `mockup`.
   También es línea base, y lo cierra M6 (F2). No lo arregles vos ni lo tomes como tu culpa.

## Tu cola, en orden

### 1 · A2 — build de producción contra la API real
Especificación completa: `docs/brechas-front-back-2026-09-24/prompts/BR-01-build-produccion-api-real.md`.
Cierra TX-01, 02, 03, 04, 21, 22 y CV-04, CV-24.

El hecho central: **`mockBackend: true` está fijo en `production` y también en `dev`**, y la
única configuración sin simulador es `real-api`/`e2e-real`, que **apaga el SSR**. El
`Dockerfile` hace `yarn build` sin `--configuration`, así que el contenedor sale con el
simulador encendido. Hoy no existe ningún artefacto que hable con la API.

Lo que hay que dejar hecho:
- `src/environments/environment.production-api.ts` nuevo: `mockBackend: false`, las cuatro
  demos en `false`, `apiBaseUrl` desde `envFromProcess`.
- En `angular.json`, configuración de build **`production-api`** con optimización, SSR y
  `outputMode: server`; y `security.allowedHosts` de producción **sin** los dominios de
  túneles (`.devtunnels.ms`, `.trycloudflare.com`, `.ngrok-free.app`, `.loca.lt`), que hoy
  se hornean en el artefacto.
- Los respaldos de las demos en `environment.ts` pasan a `false`: hoy dicen `?? true`
  aunque cada comentario diga «apagada por defecto».
- `app-mock-banner` sólo con `environment.mockBackend`, y fuera del paquete inicial.
- Con la configuración real, `mockBackendInterceptor` **no se registra**.
- La redirección de `/public/media/:id` al SVG de maqueta en `server.ts` sólo con simulador.
- `Dockerfile`: `ARG BUILD_CONFIGURATION=production-api` y las `PUBLIC_*` por `ARG`.
- `scripts/check-real-api-config.mjs` tiene que **fallar** si `production-api` deja el
  simulador o una demo en `true`, o si `allowedHosts` de producción trae túneles.
- `src/environments/environment.real-api.spec.ts` fija hoy como contrato que «producción
  sigue con la maqueta encendida»: **se reescribe el contrato, no se borra la prueba**.

Dos cuidados de SSR: las 11 rutas `RenderMode.Server` van a pedir datos a la API desde el
servidor (decidí y documentá si por la red interna `http://api:3000` o por el dominio
público, y pasá el estado por `TransferState` para no pedir dos veces), y las rutas
`Prerender` **no pueden** depender de la API en tiempo de build —
`bo-departments.service.ts` documenta que un prerender contra la API ya colgó el `yarn build`.

**La maqueta tiene que seguir existiendo como despliegue aparte**, con su propia
configuración y `mockBackend: true`: el cliente la usa.

**Terminado cuando** `yarn build --configuration=production-api` sale verde y el artefacto
levantado pide a la API real, sin cabecera de simulador y sin el cartel de cuentas demo.

### 2 · A3 — mock honesto
`BR-02-mock-honesto-e-inventario.md`. El simulador esconde las brechas por tres mecanismos,
y hay que volverlo honesto **antes** de apagarlo:
- `respuestaGenerica` inventa un éxito para cualquier ruta sin manejador → tiene que ser 501.
- No aplica `forbidNonWhitelisted` ni controla roles.
- Responde errores con otra forma que la API: 412 donde la API da 422, `issues` donde la API
  da `details.violations`.

Y **N-12**: la médica demo del simulador tiene roles que la API no le da
(`['PRACTITIONER','CLINICIAN','SCHEDULING_ADMIN']` contra sólo `PRACTITIONER`), y su token
dura 8 h contra los 15 min de la API.

Dejá además el inventario mock↔API como comprobación de CI: hay **21 operaciones que el
front llama y la API no tiene**, y 12 rutas que sólo existen en el simulador y nadie llama.
La lista está en el anexo D, y los scripts para regenerarla en
`docs/brechas-front-back-2026-09-24/inventarios/`.

### 3 · A4 — enrutado de producción y triage IA
`BR-03-enrutado-produccion-y-triage-ia.md`.
- Faltan en el nginx de producción `/loyalty`, `/patients/me/reviews` y `/ai`: el SSR
  contesta HTML con 200 en vez de fallar, que es peor.
- **Triage IA:** hoy manda **texto clínico sin autenticar** a una IP pública escrita en el
  repo, y el dictado va a Google. Es la decisión **D-C** (qué servicio lo atiende, con qué
  base legal y dónde corre) y hay que pedirla antes de cablearlo.
- **Google Maps choca con la CSP a propósito**: `security-headers.ts` fija
  `img-src 'self' data: https://tile.openstreetmap.org` y `connect-src 'self'`, con prueba
  que lo verifica. El proyecto usa Leaflet + OpenStreetMap sin clave. Traer Google Maps es
  **cambiar la CSP**: pará y preguntá.

## Reglas que no se negocian
- `corepack yarn`, nunca `npm`.
- Reusá los organismos del sistema (`app-page-header`, `app-card`, `app-tabs`,
  `app-data-table`, `app-empty-state`, `app-badge`, `app-file-input`) antes de crear UI.
  Toda vista: fondo blanco, centrada, a lo ancho del área (≥ 85 %, holgura ≤ 2 px).
- Cada estado asíncrono: cargando, con datos, vacío y error. Los cuatro.
- Ninguna afirmación visual sin foto: navegador con `--workers=1`, en 375/768/1440, claro y
  oscuro. Un build verde no prueba que la app hable con la API.
- **No debilites pruebas**: si una fija el comportamiento viejo, se reescribe su contrato y
  se explica en el PR. Nunca `skip`, nunca borrar aserciones.
- Nada de secretos en el front: todo lo que entra por `environment` termina legible en el
  paquete. `scripts/generate-env.mjs` los rechaza; no lo esquives.
- Identificadores nuevos en inglés; prosa de pantalla en castellano rioplatense.
