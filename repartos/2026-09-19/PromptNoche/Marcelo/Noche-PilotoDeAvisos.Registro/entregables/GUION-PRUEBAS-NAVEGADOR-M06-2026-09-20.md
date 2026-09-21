# Guion de pruebas por navegador — recorrido M-06 completo

> **Qué es esto.** El recorrido entero del área de Marcelo —*Recorrido del registro: selección,
> casos y aceptación*— como **una sola secuencia ejecutable en el navegador**, no partida por
> hitos. Se corre contra `http://localhost:4200` con la aplicación real hablando con la API real.
>
> **Qué NO es.** No reemplaza a [`CASOS-ACEPTACION-M06-2026-09-20.md`](CASOS-ACEPTACION-M06-2026-09-20.md):
> aquel dice **qué hay que aceptar** y de dónde sale cada esperado; éste dice **cómo se ejercita
> con las manos**. Cada caso de acá apunta al caso de aceptación que verifica.
>
> **Fecha:** 2026-09-20 · **Corrido parcialmente el mismo día**: 6 casos con resultado observado en
> navegador, 1 en rojo, el resto bloqueado o sin ejecutar. Los resultados están en el §6 y la
> corrida, con sus hallazgos, en el §8.

## §0 — Lo que tenés que saber antes de abrir el navegador

Cinco cosas que hacen fallar la corrida entera si no se saben. Las cinco están verificadas hoy.

| # | Trampa | Por qué importa |
|---|---|---|
| 1 | **`yarn start` NO sirve** | El entorno por defecto tiene `mockBackend: true` (`src/environments/environment.development.ts:60`): un interceptor responde de mentira y la pantalla da verde sin que la API exista. Se arranca con **`yarn start:real-api`** (`mockBackend: false`) |
| 2 | **El paciente entra con documento, no con correo** | La pantalla de ingreso resuelve correo o documento por la ausencia de la arroba. Los pacientes sintéticos del laboratorio sólo tienen camino por documento |
| 3 | **La ruta de ingreso es `/auth`, no `/auth/login`** | `/auth/login` no existe y deja la pantalla en blanco |
| 4 | **`/iam/auth/*` limita a 10 peticiones por minuto** | Seis ingresos seguidos y el séptimo da `429`, que se lee como «contraseña mal». Si vas a encadenar casos, levantá la API con `RATE_LIMIT_DISABLED=true` |
| 5 | **Lo que hoy escucha en `:3000` es un contenedor de hace 32 horas** | `com.docker.backend` publica `mantra-redesa-api-1`. **No tiene el arreglo de autorización de hoy**, así que el bloque H mide el código de anteayer. Para medir el arreglo hay que reconstruir la imagen o levantar la API desde el checkout |

## §1 — Preparación, con los comandos exactos

```bash
# 1. La API. Si ya hay algo en :3000, comprobá QUÉ es antes de confiar:
netstat -ano | findstr :3000          # y mirá de quién es el PID
curl http://localhost:3000/health     # -> {"status":"ok"}

# 1-bis. Para ejercitar el bloque H (permisos) hace falta la API con el arreglo de hoy.
#        El contenedor viejo no lo tiene. Desde el checkout:
cd mantra-core-health-api
yarn build
RATE_LIMIT_DISABLED=true PORT=3000 node dist/src/main.js

# 2. El front, contra la API real (NO `yarn start`):
cd mantra-core-health
yarn start:real-api                   # sirve en http://localhost:4200
```

El front proxya `/iam`, `/scheduling`, `/notifications`, `/profiles` y compañía a
`http://localhost:3000` (`proxy.conf.json`). Por eso se prueba contra `ng serve` y nunca contra el
artefacto compilado: servido de otra forma, la aplicación habla con el simulador y **da verde sin
significar nada** — ya pasó una vez, documentado en `scripts/run-recorrido-real.mjs`.

## §2 — Con quién entrar

Verificado contra la base `alovida` de Neon el 2026-09-20: son cuentas con hash `$argon2id`, o sea
que **pueden autenticar de verdad**. Otras 16 filas de `iam.authentication_credentials` parecen
credenciales y no lo son — su hash es un SHA-256 del nombre de la columna, así que no hay texto que
lo produzca.

| Actor | Papel en el recorrido | Entra con | Clave |
|---|---|---|---|
| **PA1** | El paciente que reserva | documento `SINT9300815761` | `P8-passw0rd!` |
| **PA2** | El paciente que espera un cupo | documento `SINT9300815762` | `P8-passw0rd!` |
| **PB1** | El intruso: paciente de **otra** organización | documento `SINT9300815763` | `P8-passw0rd!` |
| **Dueño de org B** | Opera una agenda ajena a PA1 | `admin.sur.corrida-930081576@example.test` | `S3cret-passw0rd` |
| **SUPERADMIN** | Ve todo; sirve para contrastar | `admin@alovida.com` | está en `BOOTSTRAP_ADMIN_PASSWORD` del `.env` de la API |

> **Los pacientes son sintéticos y están rotulados a propósito.** Documento con prefijo `SINT`,
> correo `@example.test`. Ninguna persona real: la regla 97.6 prohíbe usar datos de gente de verdad
> como datos de prueba. Si necesitás más, que los cree el laboratorio; no los inventes a mano.
>
> Hay una segunda tanda equivalente (`SINT9371048891`…`93`) de una corrida posterior, por si la
> primera quedó con estado sucio.

## §3 — El recorrido, de punta a punta

Nueve bloques, en el orden en que los vive una persona. Cada caso dice **quién**, **dónde**, **qué
hace** y **qué tiene que pasar**. La columna «Acepta» apunta al caso de aceptación que queda
demostrado.

### A — Entrar

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-01 | PA1 | `/auth` | Ingresás con el **documento** `SINT9300815761` y su clave | Entra. Se ve la sesión iniciada y el menú muestra «Mis citas» y «Notificaciones» | — |
| PR-02 | PA1 | `/auth` | Documento correcto, clave equivocada | Rechaza. **El mensaje no distingue** si falló el documento o la clave | CA-M06-N-AUTH-07 |
| PR-03 | — | `/my-account/appointments` | Pegás la ruta **sin haber entrado** | No se ve ninguna cita: te manda a ingresar | CA-M06-N-AUTH-07 |

### B — Encontrar al médico

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-04 | PA1 | `/search/practitioners` | Buscás por especialidad | Salen profesionales con su especialidad y su sede. **Ninguna ficha muestra el motivo de consulta de nadie** | CA-M06-F01 |
| PR-05 | PA1 | ficha del profesional | Abrís uno de los resultados | Se ve el horario y **en qué sede** atiende, antes de reservar nada | CA-M06-F02 |
| PR-06 | PA1 | `/search/practitioners` | Filtrás por una especialidad que nadie ejerce | Estado vacío con texto que explica; **no** una tabla en blanco ni un error | — |

### C — Reservar

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-07 | PA1 | ficha del profesional | Elegís un cupo libre y confirmás | La cita queda **confirmada** y aparece en «Mis citas» con fecha, hora y sede | CA-M06-F03 |
| PR-08 | PA1 | — | Repetís PR-07 sobre **el mismo cupo** desde otra pestaña | El segundo intento no entra: el cupo ya está tomado. **No quedan dos citas sobre el mismo hueco** | CA-M06-N-VAL-07 |
| PR-09 | PA1 | ficha del profesional | Tomás un cupo y **esperás** a que venza la retención antes de confirmar | Confirmar ya no funciona y el cupo vuelve a estar libre para otro | CA-M06-N-VAL-08 |
| PR-10 | PA1 | flujo de reserva | Llegás al paso de **datos de facturación** | **Se espera que no exista.** El cliente lo pide (3.6) y el recorrido no lo tiene: si no aparece, es `FALLA — no implementado`, no un error tuyo | CA-M06-F10 |

### D — Quedar en espera

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-11 | PA2 | ficha del profesional | Pedís un día **sin cupos** y te anotás en la espera | Queda anotado y se ve en su cuenta que está esperando | CA-M06-F04 |
| PR-12 | PA2 | ficha del profesional | Te anotás **otra vez** en la misma espera | Sigue habiendo **una sola** entrada, no dos | CA-M06-N-VAL-09 |
| PR-13 | PA2 | ficha del profesional | Pedís una ventana con el «hasta» **antes** del «desde» | Rechazo con el error **pegado al campo**, no un cartel suelto arriba | CA-M06-N-VAL-06 |
| PR-14 | PA2 | — | Buscás cómo **darte de baja** de la espera | **Se espera que no exista.** El estado «espera cancelada» está definido en el código y nadie lo usa: hueco conocido, no fallo de la corrida | — |

### E — Alguien cancela y el cupo se libera

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-15 | PA1 | `/my-account/appointments` | Cancelás la cita de PR-07 | La cita queda cancelada y desaparece de las próximas | CA-M06-F05 |
| PR-16 | PA2 | `/notification-center` | Esperás hasta **un minuto** y recargás | Llega el aviso de que se liberó un horario. **El barrido corre cada 30 segundos**: si no está al instante, esperá dos vueltas antes de declarar nada | CA-M06-F05 |
| PR-17 | PA2 | `/notification-center` | Leés el aviso completo | Dice **que hay un cupo**; **no** dice quién canceló ni por qué | CA-M06-F05 · regla 90 |
| PR-18 | PA1 | `/my-account/appointments` | Cancelás **otra vez** la misma cita | Rechazo. La cita sigue cancelada, no cambia de estado | CA-M06-N-EST-03 |

### F — El médico avisa una demora

> Necesita sesión con rol de agenda: el dueño de org B, o el SUPERADMIN. Un paciente **no** ve esta
> pantalla, y eso es parte de lo que se prueba (PR-22).

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-19 | Dueño org B | `/schedule` | Avisás una demora de 15 minutos sobre **tu propia** agenda | Se acepta y queda anotada en la agenda del día | CA-M06-F06 |
| PR-20 | Dueño org B | `/schedule` | Avisás una demora **sin minutos** | Rechazo con el error en el campo | CA-M06-N-VAL-01 |
| PR-21 | Dueño org B | `/schedule` | Probás **4** minutos y después **241** | Los dos rechazados. Son los límites que impone el código —5 y 240—, **no una regla del cliente**: el cliente nunca los definió | CA-M06-N-VAL-02/03 |
| PR-22 | PA1 | `/schedule` | Pegás la ruta como paciente | No entra. La sección no está en su menú **y** la ruta directa tampoco abre | CA-M06-N-AUTH-08 |

### G — Los avisos llegan

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-23 | PA1 | `/notification-center` | Mirás la bandeja después de la demora | Está el aviso, con la hora nueva, y se puede marcar leído | CA-M06-F07 |
| PR-24 | PA1 | `/notification-center` | Mirás si el mismo aviso **se duplicó** | Aparece **una vez**, aunque el barrido haya corrido varias veces | CA-M06-F07 |
| PR-25 | — | correo | Mirás si salió el correo | **Se espera que NO llegue.** Medido en el recorrido multimódulo: 16 avisos en «enviado» y **ninguno** con fecha de entrega. El aviso en la aplicación **sí** tiene que estar: el correo no lo condiciona | CA-M06-F09 |
| PR-26 | Dueño org B | chat de soporte | Buscás la copia del aviso | Sólo para **cambios de estado** de la cita. La demora no genera copia, y eso es el diseño, no un fallo | CA-M06-F08 |

### H — Lo ajeno no se toca

> **Éste es el bloque que más importa y el que exige la API con el arreglo de hoy.** Contra el
> contenedor viejo de `:3000` los casos van a **fallar**, porque miden el código anterior al
> arreglo. Si fallan, confirmá primero contra qué API estás corriendo antes de abrir un defecto.

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-27 | PB1 | `/my-account/appointments` | Entrás como paciente de **otra** organización y pegás la URL de la cita de PA1 | No se ve nada de esa cita. **Ni el motivo de consulta, ni el nombre, ni la sede** | CA-M06-N-AUTH-01 |
| PR-28 | PB1 | misma URL | Intentás **cancelarla** | Rechazo. Después entrás como PA1: **la cita sigue confirmada** | CA-M06-N-AUTH-02 |
| PR-29 | PB1 | misma URL | Intentás **moverla** de horario | Rechazo. Como PA1, la cita sigue en su hora original | CA-M06-N-AUTH-03 |
| PR-30 | PB1 | lista de espera | Intentás anotar a **PA2** en una espera | Rechazo, y a PA2 no le aparece ninguna entrada nueva | CA-M06-N-AUTH-04 |
| PR-31 | Dueño org B | `/schedule` | Intentás avisar demora sobre la agenda **de otra organización** | Rechazo, y los pacientes de esa agenda **no reciben nada** | CA-M06-N-AUTH-06 |

**Cómo se verifica de verdad un rechazo.** Que la pantalla diga «no tenés permiso» no alcanza: la
interfaz nunca es la barrera. Con las herramientas del navegador abiertas, mirá **la respuesta de
red**: tiene que ser un rechazo del servidor y **su cuerpo no puede traer los datos**. Un rechazo
con la cita adentro es un fallo, no un permiso denegado.

### I — Estados que no corresponden

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-32 | Dueño org B | `/schedule` | Cerrás como atendida una cita que **nunca se inició** | Rechazo. La cita queda como estaba | CA-M06-N-EST-01 |
| PR-33 | Dueño org B | `/schedule` | Iniciás la consulta de una cita **cancelada** | Rechazo | CA-M06-N-EST-02 |
| PR-34 | Dueño org B | `/schedule` | Avisás demora sobre una cita **cancelada** | El paciente de esa cita **no** recibe el aviso | CA-M06-N-EST-04 |
| PR-35 | PA1 | `/my-account/appointments` | Movés de horario una cita **ya atendida** | Rechazo | CA-M06-N-EST-05 |

## §4 — Lo que este guion NO puede probar, y por qué

Decirlo es parte del entregable: un guion que promete más de lo que alcanza es peor que uno corto.

| Qué | Por qué no entra por el navegador | Dónde se prueba |
|---|---|---|
| Atomicidad de la doble reserva | PR-08 con dos pestañas **no garantiza simultaneidad real**; da indicio, no prueba | Arnés con dos conexiones a la vez (ADV-08, ya ejercitado) |
| Tipo de dato del dinero | `numeric` en la base no se ve desde ninguna pantalla | Consulta a `information_schema` |
| Que las lecturas queden auditadas | No hay pantalla que lo muestre. **Ya está medido: `audit.data_access_log` no registra ninguna lectura** | Consulta a la base |
| PHI en los registros del servidor | El navegador no ve los logs de la API | Revisión de la salida del proceso |
| El aviso por teléfono | La aplicación móvil no está conectada a la API | `NO VERIFICADO`, declarado |

## §5 — Qué mirar además de la pantalla

En cada caso, y no sólo cuando algo se ve mal:

1. **La consola del navegador.** Un error de JavaScript con la pantalla «bien» sigue siendo un fallo.
2. **La pestaña de red.** Códigos inesperados que nadie muestra, y sobre todo **qué trae el cuerpo**
   de los rechazos del bloque H.
3. **La persistencia.** Después de cada caso que escribe, **recargá**. Lo que desaparece al recargar
   no se guardó: se vio.
4. **Las tres anchuras.** Teléfono angosto, tableta y escritorio. Cada una en su propia ventana:
   redimensionar una ya cargada no reproduce el arranque en esa anchura.
5. **El teclado.** Todo lo que se hace con el ratón tiene que poder hacerse con `Tab` y `Enter`, y
   el foco tiene que verse.

## §6 — Planilla de resultados

Se llena al correr. **Un caso sin observación no es un `PASA`.** Si algo falla, clasificalo antes de
arreglarlo: `PRODUCT_BUG` · `TEST_BUG` · `ENVIRONMENT` · `DATA` · `EXTERNAL`.

| ID | Resultado | Qué se observó | Clasificación si falla |
|---|---|---|---|
| PR-01 | PASA | Ingreso por documento -> `/dashboard`; menu con «Mis citas» y «Notificaciones» | - |
| PR-02 | PASA | Clave equivocada: sigue en `/auth` y el mensaje **no distingue** que fallo | - |
| PR-03 | PASA | Sin sesion, `/my-account/appointments` termina en `/auth` | - |
| PR-04 | OBSERVADO | La pantalla carga (2 277 caracteres); no se aserto el contenido de los resultados | - |
| PR-05 | NO EJECUTADO |  | - |
| PR-06 | NO EJECUTADO |  | - |
| PR-07 | BLOQUEADO | El buscador ofrece **un solo** profesional y no tiene ningun cupo; ver hallazgo H-2 | `DATA` + `PRODUCT_BUG` (H-2) |
| PR-08 | NO EJECUTADO | Depende de PR-07 | - |
| PR-09 | NO EJECUTADO | Depende de PR-07 | - |
| PR-10 | NO EJECUTADO | Depende de PR-07 | - |
| PR-11 | NO EJECUTADO | La pantalla **si** ofrece «Anotarme en la lista de espera» con su explicacion | - |
| PR-12 | NO EJECUTADO |  | - |
| PR-13 | NO EJECUTADO |  | - |
| PR-14 | NO EJECUTADO |  | - |
| PR-15 | NO EJECUTADO | Depende de PR-07 | - |
| PR-16 | NO EJECUTADO | Depende de PR-15 | - |
| PR-17 | NO EJECUTADO | Depende de PR-16 | - |
| PR-18 | NO EJECUTADO | Depende de PR-15 | - |
| PR-19 | NO EJECUTADO |  | - |
| PR-20 | NO EJECUTADO |  | - |
| PR-21 | NO EJECUTADO |  | - |
| PR-22 | PASA | Paciente en `/schedule` -> expulsado a `/dashboard` | - |
| PR-23 | NO EJECUTADO |  | - |
| PR-24 | NO EJECUTADO |  | - |
| PR-25 | NO EJECUTADO |  | - |
| PR-26 | NO EJECUTADO |  | - |
| PR-27 | **FALLA** | PB1, paciente de **otra organizacion**, lee la cita de PA1: **`200` con el cuerpo completo** (`patientProfileId`, `resourceId`, `bookableSlotId`, `startAt`) | `PRODUCT_BUG` — ver nota de version |
| PR-28 | BLOQUEADO | Necesita una cita **confirmada**; las dos de PA1 estan canceladas y el rechazo seria por estado, no por permisos | - |
| PR-29 | BLOQUEADO | Igual que PR-28 | - |
| PR-30 | BLOQUEADO | Primer intento dio `400` por payload mal armado mio, no por permisos | - |
| PR-31 | NO EJECUTADO |  | - |
| PR-32 | NO EJECUTADO |  | - |
| PR-33 | NO EJECUTADO |  | - |
| PR-34 | NO EJECUTADO |  | - |
| PR-35 | NO EJECUTADO |  | - |

## §7 — Cuatro cosas que ya se esperan en rojo

No son sorpresas: están medidas y documentadas. Si salen en rojo, **el guion funcionó**; lo que
haría falta explicar es que salgan en verde.

| Caso | Qué se espera | De dónde sale |
|---|---|---|
| PR-10 | No hay paso de facturación | El cliente lo pide en 3.6 y no está implementado |
| PR-14 | No se puede salir de la espera | El estado existe en el código y nadie lo usa |
| PR-25 | El correo no llega | 16 avisos enviados, 0 entregados, medido |
| PR-27…PR-31 | Rojos **si corrés contra el contenedor viejo** | La imagen es anterior al arreglo de autorización |

## §8 — Corrida del 2026-09-20

Chromium contra `http://localhost:4200` (`yarn start:real-api`), API en `:3000` —el contenedor
`mantra-redesa-api-1`, imagen de 32 horas— contra la base `alovida` de Neon. Sesiones reales de
PA1 y PB1, abiertas escribiendo documento y clave en la pantalla de ingreso.

### Lo que se midió

| | |
|---|---|
| Con resultado | **6** de 35 |
| `PASA` | 4 — PR-01, PR-02, PR-03, PR-22 |
| `FALLA` | **1 — PR-27** |
| `BLOQUEADO` | 4 — PR-07, PR-28, PR-29, PR-30 |
| Sin ejecutar | 25 |
| Errores de consola | 0 |
| Respuestas `4xx`/`5xx` no esperadas | 0 |

### H-1 · El IDOR de lectura existe y la prueba lo encuentra

PB1 —paciente registrado en otra organización, con la sesión de **su** organización elegida en la
pantalla de selección— pidió la cita de PA1 y recibió **`200` con el cuerpo entero**:
`patientProfileId`, `resourceId`, `bookableSlotId`, `appointmentId`, `startAt`.

Es el defecto que el arreglo de hoy corrige, y la API que respondió es la imagen **anterior** al
arreglo. O sea: **el caso vale como detector**. Queda pendiente reconstruir la imagen y volver a
correr PR-27; ahí tiene que dar rechazo.

### H-2 · Al paciente no se le ofrece ningún profesional con cupos

Éste apareció solo, y es el que no estaba en ningún documento previo.

El buscador de «Agendar una cita → Con un profesional» ofrece **una única** opción, y esa opción
tiene **cero** cupos libres. En la misma organización de la paciente hay **dos recursos de agenda
con 18 y 16 cupos libres**, de tipo `health_practitioner_profiles` —profesionales, no salas—, y el
buscador **no los ofrece**.

Consecuencia directa: **PR-07 no se puede completar por la interfaz**, y con él caen PR-08, PR-09,
PR-10, PR-15 a PR-18 y la parte de escritura del bloque H. No es que la reserva falle: es que no
hay a quién reservarle.

No está diagnosticada la causa. Antes de abrir el defecto hay que distinguir si el buscador filtra
por perfil publicado, por verificación o por especialidad, y si esos dos profesionales no cumplen
alguna de esas condiciones. **Eso es discovery, no una corrección.**

### H-3 · Dos formas de que un rechazo parezca un permiso denegado

Las dos aparecieron en esta corrida y las dos habrían producido un `PASA` falso. Van acá porque
cualquiera que corra el bloque H se las va a encontrar:

| Lo que se vio | Por qué NO prueba nada |
|---|---|
| `401 UNAUTHENTICATED` | El token de acceso **no está en `localStorage`** —ahí sólo vive `mantra.refresh-token`—, así que una petición armada a mano sale sin credencial. Un `401` dice «no te identificaste», no «no podés» |
| `403 FORBIDDEN · "El actor pertenece a varios tenants: indique cuál en X-Tenant-Id"` | Falta un **encabezado** que la aplicación sí manda. Es un rechazo por petición mal formada, no por autorización |

La forma correcta: tomar `Authorization` **y** `X-Tenant-Id` de una petición que la propia
aplicación haya hecho, y repetirlos. Recién ahí el código de respuesta significa algo.

### H-4 · El alta pública deja al paciente en dos organizaciones

PB1 se registró contra la organización B y quedó también en «Mantra Core Default Tenant». Por eso
al ingresar cae en una pantalla de elección que PA1 no ve. Para el bloque H hay que elegir **la
organización ajena**; si se elige el tenant por defecto, el caso deja de ser entre organizaciones y
pasa a ser entre pacientes de la misma. Los dos son válidos, pero **no son el mismo caso**.

### Por qué quedaron 25 sin ejecutar

Casi todos cuelgan de PR-07: sin una cita confirmada no hay qué cancelar, qué mover, ni sobre qué
avisar una demora. Desbloquear H-2 —o sembrar cupos para el profesional que el buscador sí
ofrece— habilita de un tirón los bloques C, E y la escritura del H.
