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
| PR-01 | PASA | Ingreso por documento -> `/dashboard`, menú con «Mis citas» y «Notificaciones» | - |
| PR-02 | PASA | Clave equivocada: sigue en `/auth` y el mensaje **no delata** qué falló | - |
| PR-03 | PASA | Sin sesión, `/my-account/appointments` termina en `/auth` | - |

### B — Encontrar al médico

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-04 | PASA | La búsqueda carga y **no muestra el motivo de consulta de nadie** | - |
| PR-05 | PASA | La ficha abre en `/search?q=…` y dice dónde atiende | - |
| PR-06 | REVISAR | Buscar algo inexistente no produjo un texto de estado vacío reconocible; tampoco error | - |

### C — Reservar

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-07 | PASA **con matiz** | Reserva completa por pantalla: 11 horarios, «Retener el cupo» -> `201`, «Confirmar la reserva». **Pero no queda confirmada: queda SOLICITADA** («Turno solicitado. El profesional la confirma»). El esperado del §3 está mal escrito — ver §9 | - |
| PR-08 | PASA | Retener el mismo cupo otra vez -> `409 CONFLICT` «El slot no tiene cupos disponibles» | - |
| PR-09 | NO EJECUTADO | La retención dura 300 s; no se dejó vencer | - |
| PR-10 | FALLA (esperada) | La pantalla «Reservar un turno» no tiene ningún campo de facturación | `PRODUCT_BUG` — no implementado (cliente 3.6) |

### D — Quedar en espera

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-11 | YA ESTABA | PA1 ya estaba anotada de una corrida previa (antes=1, después=1) | `DATA` |
| PR-12 | ERROR DE ARNÉS | El botón de anotarse desaparece una vez anotada, y el arnés esperó 30 s por él | `TEST_BUG` |
| PR-13 | **FALLA** | Con el cuerpo bien armado, la espera con «hasta» **antes** del «desde» se acepta: `201`, y la fila queda `WL_ACTIVE` con `desired_from` 10-oct y `desired_to` 1-oct | `PRODUCT_BUG` — falta validar la ventana |
| PR-14 | FALLA (esperada) | No hay control para darse de baja de la espera | `PRODUCT_BUG` — `WAITLIST_CANCELLED` definido y sin usar |

### E — Alguien cancela y el cupo se libera

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-15 | PASA | La dueña cancela su propio turno (a más de 24 h) -> `200`, `capacityReleased: true` | - |
| PR-16 | PASA | Con PA2 esperando en **el mismo recurso**: «Se liberó un horario que estabas esperando» | - |
| PR-17 | PASA | El aviso dice con quién y cuándo; **no dice quién canceló ni por qué** | - |
| PR-18 | PASA | Cancelar dos veces -> `409 CONFLICT` «La cita ya está cancelada» | - |

### F — El médico avisa una demora

> Necesita sesión con rol de agenda: el dueño de org B, o el SUPERADMIN. Un paciente **no** ve esta
> pantalla, y eso es parte de lo que se prueba (PR-22).

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-19 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-20 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-21 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-22 | PASA | Paciente en `/schedule` -> expulsado a `/dashboard` | - |

### G — Los avisos llegan

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-23 | PASA | La bandeja muestra el aviso con texto legible y se puede marcar leído | - |
| PR-24 | PASA | El aviso aparece **una sola vez**, con el barrido corriendo cada 30 s | - |
| PR-25 | NO EJECUTADO | El correo no se ve desde el navegador (§4) | - |
| PR-26 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |

### H — Lo ajeno no se toca

> **Éste es el bloque que más importa y el que exige la API con el arreglo de hoy.** Contra el
> contenedor viejo de `:3000` los casos van a **fallar**, porque miden el código anterior al
> arreglo. Si fallan, confirmá primero contra qué API estás corriendo antes de abrir un defecto.

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-27 | PASA | PB1 leyendo la cita de PA1 -> **`403` sin datos** | - |
| PR-28 | PASA | PB1 cancelando la cita de PA1 -> **`403`** | - |
| PR-29 | PASA | PB1 moviendo la cita de PA1 -> **`403`** | - |
| PR-30 | PASA | PB1 anotando a PA1 en la espera -> **`403`** | - |
| PR-31 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |

**Cómo se verifica de verdad un rechazo.** Que la pantalla diga «no tenés permiso» no alcanza: la
interfaz nunca es la barrera. Con las herramientas del navegador abiertas, mirá **la respuesta de
red**: tiene que ser un rechazo del servidor y **su cuerpo no puede traer los datos**. Un rechazo
con la cita adentro es un fallo, no un permiso denegado.

### I — Estados que no corresponden

| ID | Actor | Ruta | Qué hacés | Qué tiene que pasar | Acepta |
|---|---|---|---|---|---|
| PR-32 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-33 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-34 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-35 | NO EJECUTADO | Requiere una cita ya atendida y nadie con rol para cerrarla | - |

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
| PR-01 | PASA | Ingreso por documento -> `/dashboard`, menú con «Mis citas» y «Notificaciones» | - |
| PR-02 | PASA | Clave equivocada: sigue en `/auth` y el mensaje **no delata** qué falló | - |
| PR-03 | PASA | Sin sesión, `/my-account/appointments` termina en `/auth` | - |
| PR-04 | PASA | La búsqueda carga y **no muestra el motivo de consulta de nadie** | - |
| PR-05 | PASA | La ficha abre en `/search?q=…` y dice dónde atiende | - |
| PR-06 | REVISAR | Buscar algo inexistente no produjo un texto de estado vacío reconocible; tampoco error | - |
| PR-07 | PASA **con matiz** | Reserva completa por pantalla: 11 horarios, «Retener el cupo» -> `201`, «Confirmar la reserva». **Pero no queda confirmada: queda SOLICITADA** («Turno solicitado. El profesional la confirma»). El esperado del §3 está mal escrito — ver §9 | - |
| PR-08 | PASA | Retener el mismo cupo otra vez -> `409 CONFLICT` «El slot no tiene cupos disponibles» | - |
| PR-09 | NO EJECUTADO | La retención dura 300 s; no se dejó vencer | - |
| PR-10 | FALLA (esperada) | La pantalla «Reservar un turno» no tiene ningún campo de facturación | `PRODUCT_BUG` — no implementado (cliente 3.6) |
| PR-11 | YA ESTABA | PA1 ya estaba anotada de una corrida previa (antes=1, después=1) | `DATA` |
| PR-12 | ERROR DE ARNÉS | El botón de anotarse desaparece una vez anotada, y el arnés esperó 30 s por él | `TEST_BUG` |
| PR-13 | **FALLA** | Con el cuerpo bien armado, la espera con «hasta» **antes** del «desde» se acepta: `201`, y la fila queda `WL_ACTIVE` con `desired_from` 10-oct y `desired_to` 1-oct | `PRODUCT_BUG` — falta validar la ventana |
| PR-14 | FALLA (esperada) | No hay control para darse de baja de la espera | `PRODUCT_BUG` — `WAITLIST_CANCELLED` definido y sin usar |
| PR-15 | PASA | La dueña cancela su propio turno (a más de 24 h) -> `200`, `capacityReleased: true` | - |
| PR-16 | PASA | Con PA2 esperando en **el mismo recurso**: «Se liberó un horario que estabas esperando» | - |
| PR-17 | PASA | El aviso dice con quién y cuándo; **no dice quién canceló ni por qué** | - |
| PR-18 | PASA | Cancelar dos veces -> `409 CONFLICT` «La cita ya está cancelada» | - |
| PR-19 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-20 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-21 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-22 | PASA | Paciente en `/schedule` -> expulsado a `/dashboard` | - |
| PR-23 | PASA | La bandeja muestra el aviso con texto legible y se puede marcar leído | - |
| PR-24 | PASA | El aviso aparece **una sola vez**, con el barrido corriendo cada 30 s | - |
| PR-25 | NO EJECUTADO | El correo no se ve desde el navegador (§4) | - |
| PR-26 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-27 | PASA | PB1 leyendo la cita de PA1 -> **`403` sin datos** | - |
| PR-28 | PASA | PB1 cancelando la cita de PA1 -> **`403`** | - |
| PR-29 | PASA | PB1 moviendo la cita de PA1 -> **`403`** | - |
| PR-30 | PASA | PB1 anotando a PA1 en la espera -> **`403`** | - |
| PR-31 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-32 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-33 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-34 | BLOQUEADO | Ninguna sesión con rol de agenda | `ENVIRONMENT` |
| PR-35 | NO EJECUTADO | Requiere una cita ya atendida y nadie con rol para cerrarla | - |

## §7 — Cuatro cosas que ya se esperan en rojo

No son sorpresas: están medidas y documentadas. Si salen en rojo, **el guion funcionó**; lo que
haría falta explicar es que salgan en verde.

| Caso | Qué se espera | De dónde sale |
|---|---|---|
| PR-10 | FALLA (esperada) | La pantalla «Reservar un turno» no tiene ningún campo de facturación | `PRODUCT_BUG` — no implementado (cliente 3.6) |
| PR-14 | FALLA (esperada) | No hay control para darse de baja de la espera | `PRODUCT_BUG` — `WAITLIST_CANCELLED` definido y sin usar |
| PR-25 | NO EJECUTADO | El correo no se ve desde el navegador (§4) | - |
| PR-27…PR-31 | Rojos **si corrés contra una imagen anterior al arreglo** | Verificado: con la imagen de 32 h daba `200`; reconstruida desde `dev`, `403` sin datos |

## §8 — Corrida del 2026-09-20

Chromium contra `http://localhost:4200` (`yarn start:real-api`), API en `:3000` —el contenedor
`mantra-redesa-api-1`, imagen de 32 horas— contra la base `alovida` de Neon. Sesiones reales de
PA1 y PB1, abiertas escribiendo documento y clave en la pantalla de ingreso.

### Lo que se midió

| | |
|---|---|
| Con resultado | **6** de 35 (PR-27 medido dos veces: antes y después del rebuild) |
| `PASA` | 5 — PR-01, PR-02, PR-03, PR-22 y **PR-27 en la reejecución** |
| `FALLA` | 1 — PR-27, **corregido al reconstruir la imagen** |
| `BLOQUEADO` | 4 — PR-07, PR-28, PR-29, PR-30 |
| Sin ejecutar | 25 |
| Errores de consola | 0 |
| Respuestas `4xx`/`5xx` no esperadas | 0 |

### H-1 · El IDOR de lectura existe y la prueba lo encuentra

PB1 —paciente registrado en otra organización, con la sesión de **su** organización elegida en la
pantalla de selección— pidió la cita de PA1 y recibió **`200` con el cuerpo entero**:
`patientProfileId`, `resourceId`, `bookableSlotId`, `appointmentId`, `startAt`.

Es el defecto que el arreglo de hoy corrige, y la API que respondió era la imagen **anterior** al
arreglo. O sea: el caso vale como detector.

**Reejecutado el mismo día contra la imagen reconstruida desde `dev` (commit `c2c071a4`):**

| Imagen | Respuesta a la misma petición |
|---|---|
| Anterior al arreglo | `200` · `patientProfileId`, `resourceId`, `bookableSlotId`, `startAt` |
| `c2c071a4` | **`403 FORBIDDEN`** · «No cuenta con autorización de tutoría sobre el paciente indicado» · **sin datos** |

Misma usuaria, misma sesión abierta en pantalla, mismos encabezados. **El arreglo queda verificado
de punta a punta por navegador**, no sólo por pruebas unitarias.

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

## §9 — Reejecución completa, 2026-09-21

Los 35 casos, corridos contra `:4200` con la API reconstruida desde `dev` (`c2c071a4`) y el arreglo
de agendas homónimas aplicado. Tres corridas encadenadas: el guion entero, el cierre de cancelación
con un turno a más de 24 h, y el del aviso con la espera bien apuntada.

| | |
|---|---|
| **PASA** | **18** |
| `FALLA` | 3 — dos esperadas (PR-10, PR-14) y **una nueva: PR-13** |
| `BLOQUEADO` | 8, todos por lo mismo: ninguna sesión con rol de agenda |
| `NO EJECUTADO` | 3 |
| `REVISAR` | 1 |
| Problemas del arnés | 2 |

### H-5 · La lista de espera acepta una ventana invertida (defecto nuevo)

`POST /scheduling/waitlist` con `desiredFrom` = 10 de octubre y `desiredTo` = 1 de octubre responde
**`201`** y deja la fila viva:

```
espera c5fac0e2 · estado WL_ACTIVE · desired_from 2026-10-10 · desired_to 2026-10-01
```

Nadie valida que el «hasta» sea posterior al «desde». La consecuencia no es cosmética: una espera
con la ventana al revés **no puede casar con ningún cupo**, así que la persona queda anotada para
siempre sin que nada la avise nunca.

**Ojo con cómo se descubrió**, porque es la lección del día: en la primera corrida este caso dio
`400` y lo di por bueno. El `400` era porque a **mi** petición le faltaba `tenantId` — el cuerpo
estaba mal armado y el rechazo no probaba nada sobre la ventana. Con el cuerpo completo, pasa.

### Tres esperados del §3 que estaban mal escritos

Los descubrió la corrida, y hay que corregir el guion, no el producto:

| Caso | Lo que decía | Lo que el sistema hace, y por qué |
|---|---|---|
| **PR-07** | «la cita queda **confirmada**» | Queda **solicitada**: «Turno solicitado. El profesional la confirma o te propone otro horario». Es la política de confirmación de la organización (`booking_confirmation_rules`), no un fallo |
| **PR-15** | «cancelás la cita» | Sólo **hasta 24 h antes** (`cancellationWindowMinutes: 1440`). Con un turno de mañana devuelve `422` y el mensaje lo explica. El caso tiene que reservar a más de un día |
| **PR-16** | «PA2 recibe el aviso» | Sólo si PA2 espera en **el mismo recurso** cuyo cupo se liberó. Con la espera en otro consultorio del mismo profesional no llega nada, y es correcto |

Las tres veces el primer resultado fue rojo y las tres veces el rojo era mío. Ninguna se reportó
como defecto.

### El bloque de permisos, entero en verde

Con la imagen reconstruida, PB1 —paciente de otra organización, con su sesión real y los
encabezados que manda la propia aplicación— **no puede hacer nada** con la cita de PA1:

| Caso | Intento | Respuesta |
|---|---|---|
| PR-27 | Leerla | `403`, sin datos |
| PR-28 | Cancelarla | `403` |
| PR-29 | Moverla | `403` |
| PR-30 | Anotar a PA1 en una espera | `403` |

Y la cita de PA1 siguió intacta después de los cuatro intentos.

### Por qué 8 casos quedaron bloqueados

Todos necesitan una sesión con rol de agenda (`SCHEDULING_ADMIN`, `SCHEDULING_AGENT` o
`PRACTITIONER`) para informar una demora o cerrar una cita. El administrador de arranque
`admin@alovida.com` **no entra con `S3cret-passw0rd`**, que es la clave documentada en
`credenciales-locales.md`; su clave real está en `BOOTSTRAP_ADMIN_PASSWORD` del `.env` de la API.

**Para desbloquear el bloque F y el I hace falta esa clave, o una cuenta de profesional con agenda
propia.** Es lo único que separa al guion de estar corrido entero.

### El aviso, palabra por palabra

> Se liberó un horario que estabas esperando
> Se liberó un horario con Elena Salas el lunes, 21 de septiembre, 14:30. Reservalo desde
> «Mis turnos» antes de que lo tome otra persona.

Dice con quién y cuándo. No dice quién canceló ni por qué: PR-17 en verde.

**Un matiz que corresponde declarar:** en esa última corrida las llamadas de reserva del arnés
dieron `400` (les faltaba `tenantId`), así que el aviso salió del cupo libre que ya había en ese
recurso, no de una cancelación de esa misma corrida. El mecanismo queda verificado; la cadena
«esta cancelación produjo este aviso», no.
