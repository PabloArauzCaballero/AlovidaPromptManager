# H2 — Casos de aceptación, datos sintéticos y correspondencia del recorrido M-06

> **Consulta:** 2026-09-20 · **Peldaño:** `DISCOVERED` para todo el documento — es **diseño**: ningún caso de los que siguen se ejecutó en este hito (ejecutar es H3–H5). Los localizadores de código citados se leyeron en el checkout `a5753dc7` de `mantra-core-health-api` y, donde se indica, en `origin/dev` (`4cc5ea1f`) con `git show`. · **Recorrido:** M-06, elegido en H1 §5 (`RECORRIDO-PRIORITARIO-2026-09-20.md`). · **Fuente de máxima jerarquía:** `AlovidaPromptManager/docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md` (transcripción literal del cliente; las líneas citadas son de ese archivo, con su equivalente en `gdoc_procesos.txt`).

> [!warning] Antes de leer nada más: lo que se ve en el frontend puede ser una demo
> Heredado de H1 §3 y vigente para todo caso de este documento: `mantra-core-health` compila con el backend simulado **encendido** en `yarn start` y en `yarn build`, en `HEAD`, `origin/dev` y `origin/mockup` por igual. **Un caso verde observado con `mockBackend` activo no acredita el backend.** Sólo `yarn start:real-api`, `yarn recorrido:real` y la configuración `e2e-real` de Playwright hablan con la API real en `:3000`. No se afirma que todo endpoint esté simulado en toda configuración: no se comprobó.

**Veredicto de una línea:** 33 casos escritos (11 de camino feliz, 22 negativos: 8 de autorización, 9 de dato inválido, 5 de estado), **33 con oráculo declarado** — 12 salen del documento del cliente, 2 del pedido del propietario (TAREA-15), 15 de reglas de la casa externas al sistema, y **4 no tienen oráculo externo** (sus valores límite salen del código, no del cliente: se conservan rotulados `DECISION_REQUIRED` y **no cuentan como aceptación**). Ningún caso usa «lo que hace el sistema» como esperado. Grafo sintético de 2 organizaciones sin un solo dato real. 7 catálogos con procedencia relevada, de los cuales **4 sin procedencia completa** (se declara, no se completa). 8 datos que **no se pueden generar** por falta de regla. 11 pasos contrastados contra el cliente: 8 con párrafo, 3 `AGREGADO`. 9 ítems del cliente que M-06 **no cubre**.

---

## §0 — Convenciones de este documento

- **Formato:** cada caso es `DADO / CUANDO / ENTONCES (/ Y)`, observable por una persona, **sin mencionar implementación** (ni rutas, ni clases, ni tablas). La trazabilidad a código va aparte, en §11, para que el caso no dependa de cómo está construido hoy.
- **IDs:** `CA-M06-F<nn>` camino feliz · `CA-M06-N-AUTH-<nn>` autorización · `CA-M06-N-VAL-<nn>` dato inválido · `CA-M06-N-EST-<nn>` estado incorrecto.
- **Línea `Fuente:`** obligatoria en cada caso, con una de estas clases de oráculo (la tabla de §3 las consolida):
  - `CLIENTE` — párrafo de `REQUISITOS-CLIENTE-ALOVIDA.md` (línea) y su espejo en `gdoc_procesos.txt` (línea). Es la única fuente de aceptación del **cliente**.
  - `PEDIDO-INTERNO` — pedido escrito del propietario en la bitácora, normalizado en `docs/tareas/TAREA-15-notificaciones-de-agenda.md` §1. Externo al sistema, pero **no es el cliente**: el caso vale como aceptación del pedido, y en §7 figura como `AGREGADO` respecto del documento del cliente.
  - `REGLA-CASA` — regla del estándar de la empresa (`AlovidaPromptManager/.claude/rules/`), externa al sistema: 90.1.x (autorización), 96.2/96.3 (validación, concurrencia), 97.6 (datos de prueba).
  - `DECISION_REQUIRED` — **no hay fuente externa**: el valor esperado sale del código actual. El caso se conserva como *límite de la implementación vigente* para que H3 lo ejercite, pero **no es un caso de aceptación** (kill-test del hito: «si la respuesta es "de lo que hace el sistema", es una foto del bug»). Cada uno apunta a una fila `DR-M06-*` de §6.
- **Actores sintéticos** (definidos en §4): organización **A** «Clínica Sintética Norte» con la **Dra. Ñusta Condori de la Quintana** y los pacientes **PA1** y **PA2**; organización **B** «Clínica Sintética Sur» con el **Dr. José María Yáñez Peredo** y el paciente **PB1**. Nadie de estos existe.
- **Estados permitidos** de las microtareas: los seis de la regla 20. Este documento cierra H2.S1, H2.S2 y H2.S3.

---

## §1 — Camino feliz (H2.S1.M1)

Un caso por paso del recorrido de H1 §8, en el orden del recorrido. Técnicas: partición de equivalencia (una clase válida por paso) y transición de estados (el camino feliz recorre reservar → confirmar → esperar → liberar → avisar).

### CA-M06-F01 — El paciente encuentra al médico que necesita
DADO un paciente con cuenta en la organización A, y la Dra. Condori con agenda publicada para la semana próxima en la sede Norte,
CUANDO el paciente busca médicos disponibles,
ENTONCES la Dra. Condori aparece en la lista con su especialidad y el lugar donde atiende,
Y un médico de la misma organización **sin** agenda publicada no aparece como disponible.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:104,106` («revisar todos los médicos que están disponibles»; «Ingresa al medico que requieres…») · `gdoc_procesos.txt:59,61` (sub-ítems 3.1 y 3.3).

### CA-M06-F02 — El paciente ve el horario y la sede antes de reservar
DADO la Dra. Condori con dos cupos libres el martes próximo (10:00 y 10:30) en la sede Norte y un cupo ya tomado a las 11:00,
CUANDO el paciente abre su horario,
ENTONCES ve los dos cupos libres con día, hora y sede,
Y no ve como disponibles ni el cupo de las 11:00 ni cupos de días ya pasados.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:106` («revisa su horario y lugar donde atiende y se encuentra disponible») · `gdoc_procesos.txt:61` (3.3).

### CA-M06-F03 — El paciente reserva un cupo libre y la cita queda confirmada
DADO el cupo del martes 10:00 visible como libre,
CUANDO el paciente lo elige y confirma la reserva dentro del tiempo que se le da para hacerlo,
ENTONCES la cita queda confirmada a su nombre con ese día, hora y sede,
Y ese cupo deja de ofrecerse a cualquier otro paciente,
Y el paciente la encuentra en su lista de citas.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:106` («para que puedas agendar un horario de consulta») · `gdoc_procesos.txt:61` (3.3). El paso intermedio de «retener el cupo durante un tiempo» **no lo pide el cliente**: es `AGREGADO` (§7) y su duración es `DR-M06-05`.

### CA-M06-F04 — Sin cupo para el día que necesita, el paciente queda en espera
DADO que el martes próximo la Dra. Condori no tiene cupos libres,
CUANDO PA2 pide quedar a la espera de un cupo para ese día con esa médica,
ENTONCES PA2 queda registrado como «en espera» para ese día,
Y PA2 puede ver que está en espera y para qué día.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:107` («Si no encuentras cita en el día que necesitas… PUEDES RECIBIR UNA NOTIFICACION…») · `gdoc_procesos.txt:62` (3.4). **Ojo:** el cliente dice que lo reciben «los PACIENTES que estuvieron revisando horarios para ese mismo día» (`:254` / `gdoc:226`, 4.3), no «los que se anotaron». Que el paciente **tenga que anotarse** es `AGREGADO` y se registra en `DR-M06-03`; el caso describe el comportamiento pedido en la parte que sí coincide (hay un paciente esperando ese día).

### CA-M06-F05 — Un paciente cancela y el que esperaba recibe el aviso de horario disponible
DADO PA1 con cita confirmada el martes 10:00 con la Dra. Condori, y PA2 en espera para ese martes con esa médica,
CUANDO PA1 cancela su cita,
ENTONCES PA2 recibe un aviso que le informa que se liberó un horario ese día con esa médica,
Y desde el aviso PA2 puede ir a reservar ese horario,
Y la cita de PA1 figura como cancelada,
Y ningún paciente que no esperaba ese día recibe ese aviso.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:107` (3.4: «UN PACIENTE DESCONFIRMO Y EXISTE UN HORARIO DISPONIBLE») y `:254` (4.3: «la APP de manera AUTOMATICA enviara una NOTIFICACION») · `gdoc_procesos.txt:62,226`. El cliente no fija **plazo** para «automática»: el caso no asevera latencia (`DR-M06-04`).

### CA-M06-F06 — El médico avisa una demora y sus pacientes del día se enteran
DADO la Dra. Condori con dos citas confirmadas hoy (PA1 a las 10:00 y PA2 a las 10:30) y PB1 sin cita con ella,
CUANDO la Dra. Condori comunica que llegará con 20 minutos de demora a su agenda de hoy,
ENTONCES PA1 y PA2 reciben un aviso con la demora y la nueva hora estimada de su cita,
Y las dos citas siguen confirmadas (la demora no las cancela ni las mueve),
Y PB1 no recibe nada.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:108` (3.5: «SI EL MEDICO SE DEMORARÁ PUEDES RECIBIR UNA NOTIFICACION… CON LA INFORMACION DE LA DEMORA») y `:253` (4.2: «EL PACIENTE RECIBIRA UNA NOTIFICACION DEL COMUNICADO DEL MEDICO») · `gdoc_procesos.txt:63,225`.

### CA-M06-F07 — El paciente lee el aviso en su bandeja y llega a su cita
DADO PA1 con un aviso de demora recién emitido,
CUANDO PA1 abre su bandeja de avisos en la aplicación,
ENTONCES ve el aviso con la demora comunicada,
Y desde el aviso llega al detalle de su cita,
Y al abrirlo el aviso queda marcado como leído.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:108,253` («RECIBIR UNA NOTIFICACION DE LA APP») · `gdoc_procesos.txt:63,225`. Nota de H1 §8 paso 7: la campana con contador en la cabecera **no existe** (carril P1); el caso exige la bandeja, no la campana.

### CA-M06-F08 — Los cambios de estado de la cita llegan también al chat de soporte
DADO la organización A con el chat de soporte de la empresa disponible para sus usuarios,
CUANDO la cita de PA1 cambia de estado (es aceptada, movida o cancelada),
ENTONCES PA1 recibe, además del aviso en su bandeja, un mensaje en su hilo con el soporte de la empresa que se lo informa,
Y para el aviso de demora y para el de horario liberado **no** llega copia al chat.
Fuente: PEDIDO-INTERNO — `docs/tareas/TAREA-15-notificaciones-de-agenda.md` §1, puntos 1 y 3 («mensaje de `SupportAdmin`»; «notificación en chat dentro de la misma app» para movidas o canceladas). **Sin párrafo en el documento del cliente** (`AGREGADO`, §7). La última cláusula («no para demora ni cupo liberado») viene del alcance del pedido, que sólo habla de solicitudes y de sus cambios.

### CA-M06-F09 — El aviso sale también por correo, y el correo no condiciona al aviso en la app
DADO PA1 con una dirección de correo registrada y sin haber pedido no recibir correos,
CUANDO se le emite un aviso de agenda,
ENTONCES queda un correo dirigido a PA1 con el mismo contenido, pendiente de envío por el proveedor,
Y si el proveedor de correo no responde, el aviso en la bandeja de la app llega igual.
Fuente: PEDIDO-INTERNO — `TAREA-15-notificaciones-de-agenda.md` §1, puntos 2 y 3 («correo electrónico al paciente y al profesional»). **Sin párrafo en el documento del cliente**, que sólo habla de «NOTIFICACION DE LA APP» (`AGREGADO`, §7). La **entrega real** del correo es aceptación externa pendiente (Q-21): el caso sólo exige que quede el correo listo para enviar.

### CA-M06-F10 — Al reservar, el paciente deja sus datos de facturación
DADO un paciente que está confirmando una cita,
CUANDO completa la reserva,
ENTONCES puede dejar registrados el nombre o razón social y el número de NIT con los que quiere que se le facture esa consulta,
Y esos datos quedan asociados a la cita.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:109-111` (3.6: «Datos de la facturación para recibir de todas las instituciones — Nombre o Razón social — Numero de NIT») · `gdoc_procesos.txt:64-66`. **`SIN LOCALIZADOR`**: H1 §7/§8 (paso 10) no encontró facturación en el flujo de reserva; el caso se escribe igual porque el cliente lo pide, y cuando se ejecute el resultado previsible es `FAIL`/`NOT_RUN`, no `PASS`.

### CA-M06-F11 — La misma cita se ve desde el teléfono
DADO PA1 con la cita del martes 10:00 confirmada desde la web,
CUANDO PA1 abre su agenda en la aplicación móvil,
ENTONCES ve la misma cita, con el mismo día, hora, médica y sede.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:104-106` («Desde la APP…») · `gdoc_procesos.txt:59-61`. H1 §8 paso 11: el móvil declara los accesos de agenda, pero **no se localizó la pantalla que los usa** — `NO VERIFICADO`; el caso vale como criterio, no como afirmación de que exista.

---

## §2 — Casos negativos (H2.S1.M2)

Cada negativo declara el rechazo esperado **y** la ausencia de efecto (regla 30: «rechazado» sin «sin efecto persistido» no demuestra nada). Los valores límite salen de `edge-case-data-catalog` (§Números, §Fechas, §Identidad); la familia de autorización, de la tabla de decisión rol × propiedad.

### Autorización — un actor de otra organización, otro rol, o sin sesión

### CA-M06-N-AUTH-01 — Otro paciente no puede leer la cita ajena aunque conozca su identificador
DADO la cita confirmada de PA1 (organización A) y PB1 con sesión iniciada en la organización B,
CUANDO PB1 pide el detalle de esa cita usando su identificador,
ENTONCES la petición es rechazada,
Y la respuesta no trae ningún dato de la cita (ni el nombre de PA1, ni el motivo de consulta, ni el horario).
Esperado: rechazo sin datos; ningún registro de lectura a nombre de PB1 sobre esa cita.
Fuente: REGLA-CASA — `90-seguridad-y-datos-sensibles.md` §90.1.3 («Cambiar un identificador en la URL no puede devolver datos de otro») y §90.1.2 (autorización por rol **y** por propiedad). *Predicción por lectura (§11): hoy este caso falla; se ejercita en H3.S1.M1.*

### CA-M06-N-AUTH-02 — Otro paciente no puede cancelar la cita ajena
DADO la cita confirmada de PA1 y PB1 con sesión en la organización B,
CUANDO PB1 intenta cancelar esa cita,
ENTONCES la petición es rechazada,
Y la cita de PA1 sigue confirmada,
Y PA1 no recibe ningún aviso de cancelación,
Y no se libera ningún cupo ni se avisa a nadie en espera.
Esperado: rechazo; consulta posterior de PA1 muestra la cita sin cambios.
Fuente: REGLA-CASA — §90.1.2, §90.1.3.

### CA-M06-N-AUTH-03 — Otro paciente no puede mover la cita ajena
DADO la cita confirmada de PA1 y PB1 con sesión en B,
CUANDO PB1 intenta reprogramar esa cita a otro cupo,
ENTONCES la petición es rechazada,
Y la cita de PA1 conserva su día, hora y sede,
Y el cupo destino sigue libre.
Esperado: rechazo; sin efecto.
Fuente: REGLA-CASA — §90.1.2, §90.1.3.

### CA-M06-N-AUTH-04 — Un paciente no puede anotar a otro en la lista de espera
DADO PA2 (paciente de A) y PB1 con sesión en B,
CUANDO PB1 intenta anotar a PA2 en la lista de espera de la Dra. Condori,
ENTONCES la petición es rechazada,
Y PA2 no aparece en ninguna lista de espera nueva.
Esperado: rechazo; la lista de espera de la Dra. Condori no cambia.
Fuente: REGLA-CASA — §90.1.2 (propiedad del recurso: sólo el propio paciente o quien opera la agenda).

### CA-M06-N-AUTH-05 — Un paciente no puede ver la cola de espera de una agenda
DADO PA1 con sesión en A y la Dra. Condori con dos pacientes en espera,
CUANDO PA1 intenta ver quiénes esperan un cupo con la Dra. Condori,
ENTONCES la petición es rechazada,
Y no ve ningún nombre.
Esperado: rechazo (es una función de quien opera la agenda, no del paciente).
Fuente: REGLA-CASA — §90.1.4 (chequeo a nivel de función) y §90.1.8 (respuesta mínima). *Ya cubierto con dobles por Justin en `origin/dev` (§11).*

### CA-M06-N-AUTH-06 — Un médico de otra organización no ve la cola ajena ni puede avisar demora sobre ella
DADO el Dr. Yáñez con sesión en B y la Dra. Condori (A) con pacientes en espera y citas confirmadas hoy,
CUANDO el Dr. Yáñez intenta ver la cola de espera de la Dra. Condori, y luego intenta comunicar una demora sobre la agenda de ella,
ENTONCES las dos peticiones son rechazadas,
Y ningún paciente de la Dra. Condori recibe un aviso de demora,
Y el historial de las citas de la Dra. Condori no registra ninguna demora.
Esperado: dos rechazos; sin aviso; sin registro.
Fuente: REGLA-CASA — §90.1.2 (propiedad), §96.5.4 (toda consulta filtra por la organización). *La primera mitad ya está cubierta con dobles por Justin (§11).*

### CA-M06-N-AUTH-07 — Sin sesión no se lee ni se escribe nada del recorrido
DADO una persona sin sesión iniciada,
CUANDO intenta ver el horario de la Dra. Condori con los datos de sus cupos, leer una cita, reservar, anotarse en espera, cancelar o comunicar una demora,
ENTONCES cada petición es rechazada por falta de identidad,
Y ninguna deja rastro ni cambia nada.
Esperado: rechazo por autenticación en todas; sin efecto.
Fuente: REGLA-CASA — §90.1.1 («Autenticación resuelta en el servidor. Nunca inferida del cliente»).

### CA-M06-N-AUTH-08 — El paciente no puede registrar su propia llegada a la consulta
DADO PA1 con su cita confirmada hoy,
CUANDO PA1 intenta marcar por su cuenta que ya llegó a la consulta (acción de recepción),
ENTONCES la petición es rechazada,
Y la cita sigue confirmada, no «recibida».
Esperado: rechazo por función no permitida al rol.
Fuente: REGLA-CASA — §90.1.4 (BFLA). Y CLIENTE `:256-258` («Recepción del paciente» es una acción del médico o su asistente, no del paciente).

### Dato inválido — bordes de la demora, la espera y la reserva

### CA-M06-N-VAL-01 — Una demora sin minutos no se comunica
DADO la Dra. Condori con citas confirmadas hoy,
CUANDO intenta comunicar una demora sin indicar cuántos minutos,
ENTONCES la petición es rechazada,
Y ningún paciente recibe aviso.
Esperado: rechazo por dato faltante; sin aviso.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:108` (la notificación debe llevar «LA INFORMACION DE LA DEMORA»: sin minutos no hay información) · REGLA-CASA §96.2.1 (toda mutación se valida en el servidor).

### CA-M06-N-VAL-02 — Una demora de 4 minutos (límite inferior vigente menos uno)
DADO la Dra. Condori con citas confirmadas hoy,
CUANDO intenta comunicar una demora de 4 minutos,
ENTONCES hoy la petición es rechazada y no se avisa a nadie.
Esperado: rechazo (comportamiento vigente, mínimo 5).
Fuente: DECISION_REQUIRED — el cliente **no fija mínimo** para la demora; el 5 sale del código (§11). Ver `DR-M06-07`. **No cuenta como aceptación.**

### CA-M06-N-VAL-03 — Una demora de 241 minutos (límite superior vigente más uno)
DADO la Dra. Condori con citas confirmadas hoy,
CUANDO intenta comunicar una demora de 241 minutos,
ENTONCES hoy la petición es rechazada y no se avisa a nadie.
Esperado: rechazo (comportamiento vigente, máximo 240).
Fuente: DECISION_REQUIRED — el cliente **no fija máximo**; el 240 sale del código. Ver `DR-M06-07`. **No cuenta como aceptación.**

### CA-M06-N-VAL-04 — Un mensaje de demora de 301 caracteres
DADO la Dra. Condori comunicando una demora de 20 minutos,
CUANDO acompaña la demora con un texto de 301 caracteres,
ENTONCES hoy la petición es rechazada.
Esperado: rechazo (comportamiento vigente, tope 300).
Fuente: DECISION_REQUIRED — el cliente no fija largo de mensaje; el 300 sale del código. Ver `DR-M06-07`. **No cuenta como aceptación.**

### CA-M06-N-VAL-05 — Una demora con ventana invertida
DADO la Dra. Condori comunicando una demora para un rango de su agenda,
CUANDO el «hasta» del rango es anterior al «desde»,
ENTONCES la petición es rechazada,
Y ninguna cita queda marcada con demora.
Esperado: rechazo por rango inválido; sin efecto.
Fuente: REGLA-CASA — §96.2.1 y `edge-case-data-catalog` §Fechas («fecha anterior a otra que debería ser posterior»).

### CA-M06-N-VAL-06 — Una espera con el «hasta» antes del «desde»
DADO PA2 anotándose en la lista de espera de la Dra. Condori,
CUANDO indica que desea un cupo entre una fecha y otra anterior,
ENTONCES la petición es rechazada,
Y PA2 no queda en espera.
Esperado: rechazo por rango inválido; sin entrada en la lista.
Fuente: REGLA-CASA — §96.2.1, `edge-case-data-catalog` §Fechas.

### CA-M06-N-VAL-07 — Dos pacientes toman el mismo cupo al mismo tiempo
DADO el último cupo libre del martes 10:00 con la Dra. Condori, y PA1 y PA2 intentando tomarlo en el mismo instante,
CUANDO ambas peticiones llegan,
ENTONCES exactamente una de las dos retiene el cupo,
Y la otra recibe que el cupo ya no está disponible,
Y nunca quedan dos citas confirmadas sobre ese mismo cupo.
Esperado: una sola reserva; la otra rechazada por cupo no disponible.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:106` (sólo se agenda lo que «se encuentra disponible») · REGLA-CASA §96.3.1 («Toda transición de estado con riesgo de concurrencia es atómica»). *Hallazgo H-1 del `CLAUDE.md` de la raíz: la base no impide la doble reserva por sí sola; el caso es el que lo demuestra o lo desmiente.*

### CA-M06-N-VAL-08 — Confirmar un cupo cuya retención ya venció
DADO PA1 que retuvo el cupo del martes 10:00 y dejó pasar el tiempo de retención sin confirmar,
CUANDO PA1 intenta confirmar esa retención,
ENTONCES hoy la petición es rechazada,
Y el cupo vuelve a ofrecerse como libre.
Esperado: rechazo (retención vencida); cupo libre.
Fuente: DECISION_REQUIRED — la retención y su duración **no las define el cliente** (`AGREGADO`, §7); el vencimiento es una regla interna. Ver `DR-M06-05`. **No cuenta como aceptación.**

### CA-M06-N-VAL-09 — Anotarse dos veces en la misma espera deja una sola entrada
DADO PA2 ya en espera para el martes con la Dra. Condori,
CUANDO PA2 vuelve a pedir quedar en espera para el mismo día con la misma médica,
ENTONCES sigue habiendo una sola entrada de PA2 en esa espera,
Y cuando se libere un cupo PA2 recibe **un** aviso, no dos.
Esperado: sin duplicado; un solo aviso.
Fuente: REGLA-CASA — §96.3.3 («Toda operación que el cliente puede reintentar es idempotente») y `edge-case-data-catalog` §Identidad («duplicado exacto»). Y CLIENTE `:107`: el cliente pide **una** notificación por horario liberado.

### Estado incorrecto — transiciones que el sistema debe rechazar en el servidor

### CA-M06-N-EST-01 — Cerrar como atendida una cita que nunca se inició
DADO la cita confirmada de PA1 para hoy, sin que la consulta haya empezado,
CUANDO alguien que opera la agenda intenta marcarla como atendida,
ENTONCES la petición es rechazada,
Y la cita sigue confirmada.
Esperado: rechazo por transición no permitida; sin cambio de estado.
Fuente: REGLA-CASA — §90.1.9 («Transiciones de estado validadas en el backend, con la precondición en la escritura»). La lista de transiciones legales es **interna** (H3.S2.M1): lo que la regla externa exige es que el rechazo lo dé el servidor, no un botón oculto.

### CA-M06-N-EST-02 — Iniciar la consulta de una cita cancelada
DADO la cita de PA1 ya cancelada,
CUANDO alguien que opera la agenda intenta iniciar la consulta sobre esa cita,
ENTONCES la petición es rechazada,
Y la cita sigue cancelada.
Esperado: rechazo; sin cambio.
Fuente: REGLA-CASA — §90.1.9.

### CA-M06-N-EST-03 — Cancelar dos veces la misma cita
DADO la cita de PA1 ya cancelada, con PA2 ya avisado del cupo liberado,
CUANDO PA1 (o quien opera la agenda) vuelve a cancelarla,
ENTONCES la segunda petición es rechazada,
Y PA2 **no** recibe un segundo aviso de cupo liberado.
Esperado: rechazo; un solo aviso en total.
Fuente: REGLA-CASA — §90.1.9 y §96.3.3 (idempotencia) · CLIENTE `:107,254` (un desmarque → una notificación).

### CA-M06-N-EST-04 — La demora no se comunica a quien ya no tiene cita
DADO la Dra. Condori con la cita de PA1 cancelada y la de PA2 confirmada, ambas para hoy,
CUANDO la Dra. Condori comunica una demora para su agenda de hoy,
ENTONCES PA2 recibe el aviso,
Y PA1 **no** lo recibe.
Esperado: aviso sólo a citas vigentes.
Fuente: CLIENTE — `REQUISITOS-CLIENTE-ALOVIDA.md:253` («informar al paciente o los pacientes que se va demorar en el horario de cita agendado»: quien no tiene cita agendada no está incluido) · `gdoc_procesos.txt:225`.

### CA-M06-N-EST-05 — Mover una cita que ya fue atendida
DADO la cita de PA1 ya atendida y cerrada,
CUANDO PA1 intenta reprogramarla a otro cupo,
ENTONCES la petición es rechazada,
Y la cita sigue cerrada como atendida, y el cupo destino sigue libre.
Esperado: rechazo; sin efecto.
Fuente: REGLA-CASA — §90.1.9.

---

## §3 — Oráculo de cada caso (H2.S1.M3)

**Kill-test del hito, respondido:** para ninguno de los 33 casos el esperado sale «de lo que hace el sistema». En los 5 marcados `DECISION_REQUIRED` el valor límite **sí** sale del código — por eso no cuentan como aceptación y están señalados; se conservan porque H3 los tiene que ejercitar igual (regla 80.2: los bordes se prueban) y porque son el insumo para que negocio decida (`DR-M06-05`, `DR-M06-07`).

| Caso | Clase de oráculo | Cita exacta del esperado | ¿Cuenta como aceptación? |
|---|---|---|---|
| CA-M06-F01 | CLIENTE | `REQUISITOS-CLIENTE-ALOVIDA.md:104,106` · `gdoc:59,61` | Sí |
| CA-M06-F02 | CLIENTE | `:106` · `gdoc:61` | Sí |
| CA-M06-F03 | CLIENTE | `:106` · `gdoc:61` (retención = `AGREGADO`) | Sí |
| CA-M06-F04 | CLIENTE | `:107` · `gdoc:62` (anotarse = `AGREGADO`, `DR-M06-03`) | Sí, parcial |
| CA-M06-F05 | CLIENTE | `:107,254` · `gdoc:62,226` | Sí |
| CA-M06-F06 | CLIENTE | `:108,253` · `gdoc:63,225` | Sí |
| CA-M06-F07 | CLIENTE | `:108,253` · `gdoc:63,225` | Sí |
| CA-M06-F08 | PEDIDO-INTERNO | `TAREA-15-notificaciones-de-agenda.md` §1 puntos 1 y 3 | Sí, del pedido del propietario; `AGREGADO` para el cliente |
| CA-M06-F09 | PEDIDO-INTERNO | `TAREA-15…` §1 puntos 2 y 3 | Sí, del pedido; entrega real = externa pendiente (Q-21) |
| CA-M06-F10 | CLIENTE | `:109-111` · `gdoc:64-66` | Sí (`SIN LOCALIZADOR`) |
| CA-M06-F11 | CLIENTE | `:104-106` · `gdoc:59-61` | Sí (`NO VERIFICADO` en móvil) |
| CA-M06-N-AUTH-01 | REGLA-CASA | regla 90 §90.1.2, §90.1.3 | Sí |
| CA-M06-N-AUTH-02 | REGLA-CASA | §90.1.2, §90.1.3 | Sí |
| CA-M06-N-AUTH-03 | REGLA-CASA | §90.1.2, §90.1.3 | Sí |
| CA-M06-N-AUTH-04 | REGLA-CASA | §90.1.2 | Sí |
| CA-M06-N-AUTH-05 | REGLA-CASA | §90.1.4, §90.1.8 | Sí |
| CA-M06-N-AUTH-06 | REGLA-CASA | §90.1.2, regla 96 §96.5.4 | Sí |
| CA-M06-N-AUTH-07 | REGLA-CASA | §90.1.1 | Sí |
| CA-M06-N-AUTH-08 | REGLA-CASA + CLIENTE | §90.1.4 · `:256-258` | Sí |
| CA-M06-N-VAL-01 | CLIENTE + REGLA-CASA | `:108` · §96.2.1 | Sí |
| CA-M06-N-VAL-02 | DECISION_REQUIRED | `DR-M06-07` (mínimo 5 = código) | **No** |
| CA-M06-N-VAL-03 | DECISION_REQUIRED | `DR-M06-07` (máximo 240 = código) | **No** |
| CA-M06-N-VAL-04 | DECISION_REQUIRED | `DR-M06-07` (tope 300 = código) | **No** |
| CA-M06-N-VAL-05 | REGLA-CASA | §96.2.1 · catálogo de bordes §Fechas | Sí |
| CA-M06-N-VAL-06 | REGLA-CASA | §96.2.1 · catálogo de bordes §Fechas | Sí |
| CA-M06-N-VAL-07 | CLIENTE + REGLA-CASA | `:106` · §96.3.1 | Sí |
| CA-M06-N-VAL-08 | DECISION_REQUIRED | `DR-M06-05` (retención = interna) | **No** |
| CA-M06-N-VAL-09 | REGLA-CASA + CLIENTE | §96.3.3 · `:107` | Sí |
| CA-M06-N-EST-01 | REGLA-CASA | §90.1.9 (legalidad de la transición: interna, H3.S2.M1) | Sí |
| CA-M06-N-EST-02 | REGLA-CASA | §90.1.9 | Sí |
| CA-M06-N-EST-03 | REGLA-CASA + CLIENTE | §90.1.9, §96.3.3 · `:107,254` | Sí |
| CA-M06-N-EST-04 | CLIENTE | `:253` · `gdoc:225` | Sí |
| CA-M06-N-EST-05 | REGLA-CASA | §90.1.9 | Sí |

**Totales:** 33 casos · CLIENTE 12 (contando los mixtos por su fuente principal) · PEDIDO-INTERNO 2 · REGLA-CASA 15 · DECISION_REQUIRED 4. Casos que cuentan como aceptación: **29**.

---

## §4 — Datos sintéticos (H2.S2.M1)

**Regla dura (97.6):** nadie de esta sección existe. Nombres, documentos, correos y direcciones son inventados; los correos van al dominio reservado `example.test`; los documentos llevan el prefijo `SINT-` para que cualquier lector sepa que no son cédulas. **`SEED = 20260920`**: quien genere estos datos con un generador determinista tiene que obtener el mismo grafo; el sufijo de corrida `U` son los 9 últimos dígitos del instante de la corrida, igual que en los arneses vigentes (`seed-dev-data.mjs`, `p8-avisos-agenda.mjs`), para que dos corridas no choquen por clave natural.

**Reusa la forma de los datos que el laboratorio ya crea** (H1 §8): organización con sedes, un recurso de agenda por profesional con plantilla `Mañanas L-V` de 30 minutos y cupos generados, pacientes registrados por el alta pública. Las contraseñas son las de prueba que esos arneses ya publican en el repo (`D3mo-passw0rd!` para profesionales, `P8-passw0rd!` para pacientes, `S3cret-passw0rd` para el administrador de arranque); no son secretos.

### 4.1 Organizaciones y sedes

| Clave | Organización | Sede | Departamento (`vs_administrative_area`) | Quién la administra |
|---|---|---|---|---|
| A | Clínica Sintética Norte — corrida `<U>` | `SEDE-<U>-N1` «Consultorio Norte» | `sc` | `admin.norte.corrida-<U>@example.test` (rol ADMIN de A) |
| B | Clínica Sintética Sur — corrida `<U>` | `SEDE-<U>-S1` «Consultorio Sur» | `lp` | `admin.sur.corrida-<U>@example.test` (rol ADMIN de B) |

### 4.2 Profesionales

| Clave | Nombre (sintético) | Organización | Especialidad (`vs_medical_specialty`) | Correo | Agenda |
|---|---|---|---|---|---|
| DRA-A | Ñusta Condori de la Quintana | A | `medicina_general` | `dra.norte.corrida-<U>@example.test` | Plantilla `Mañanas L-V`, 30 min, cupos del martes próximo 10:00 · 10:30 · 11:00 |
| DR-B | José María Yáñez Peredo | B | `medicina_general` | `dr.sur.corrida-<U>@example.test` | Plantilla `Mañanas L-V`, 30 min, cupos del martes próximo 10:00 · 10:30 |

Los dos nombres llevan tilde, `ñ` y apellido compuesto a propósito (`synthetic-test-data-generation` §3: un dataset sin acentos esconde bugs de codificación).

### 4.3 Pacientes

| Clave | Nombre (sintético) | Documento | Correo | Organización donde se registró | Rol en el recorrido |
|---|---|---|---|---|---|
| PA1 | Aymará Choque Villarroel | `SINT-000000101` | `pa1.corrida-<U>@example.test` | A | Reserva el martes 10:00 con DRA-A y luego cancela (F03, F05) |
| PA2 | Rubén Darío Mamani Ticona | `SINT-000000102` | `pa2.corrida-<U>@example.test` | A | Queda en espera para el martes con DRA-A; recibe el aviso (F04, F05); tiene cita 10:30 en F06 |
| PB1 | María José Suárez de Peña | `SINT-000000201` | `pb1.corrida-<U>@example.test` | B | Actor de **otra** organización en los negativos de autorización |

Sin fecha de nacimiento, sin dirección, sin teléfono: M-06 no los necesita y minimizar es la regla (`data-privacy-phi` §2). Si un arnés los exige, se generan sintéticos con el mismo `SEED`.

### 4.4 Estado inicial de los cupos (martes próximo, sede Norte, DRA-A)

| Cupo | Estado inicial | Para qué caso |
|---|---|---|
| 10:00 | libre → lo toma PA1 en F03 | F02, F03, F05, N-VAL-07 |
| 10:30 | libre → lo toma PA2 antes de F06 | F02, F06 |
| 11:00 | **ya tomado** por un cuarto paciente sintético `PA9` (`SINT-000000109`, `pa9.corrida-<U>@example.test`) | F02 (que no aparezca como libre) |
| — | ningún cupo libre en el día que PA2 «necesita» (se usa el martes con los tres cupos ocupados) | F04 |

### 4.5 Ownership — quién puede ver y hacer qué (tabla de decisión, base de la matriz de H3.S1.M3)

| Actor | Ver cupos de DRA-A | Ver cita de PA1 | Cancelar/mover cita de PA1 | Anotar a PA2 en espera | Ver cola de DRA-A | Avisar demora de DRA-A | Recepcionar a PA1 |
|---|---|---|---|---|---|---|---|
| PA1 | sí | **sí** (es suya) | **sí** (es suya) | no | no | no | no |
| PA2 | sí | no | no | **sí** (a sí mismo) | no | no | no |
| PB1 (org B) | sí | **no** | **no** | **no** | no | no | no |
| DRA-A | sí | sí (es su agenda) | sí | sí | **sí** | **sí** | sí (con su asistente) |
| DR-B (org B) | sí | **no** | **no** | no | **no** | **no** | no |
| ADMIN de A | sí | sí | sí | sí | sí | sí | sí |
| ADMIN de B | sí | **no** | **no** | no | no | no | no |
| Sin sesión | **no** (los cupos con datos exigen identidad) | no | no | no | no | no | no |

Las celdas en negrita son las que ejercitan los `CA-M06-N-AUTH-*`. «Ver cupos» para actores de otra organización está en `sí` sólo porque el cliente pide que **cualquier** paciente pueda revisar médicos y horarios (`:104-106`); qué muestra ese horario a quien no es de la organización (¿nombres de otros pacientes? no) es parte de N-AUTH-01 y de la respuesta mínima (§90.1.8).

---

## §5 — Procedencia de los catálogos que M-06 toca (H2.S2.M2)

Manifiesto por catálogo según `seed-data-catalogs` §2. **Donde la fuente no declara algo, la celda dice `SIN PROCEDENCIA REGISTRADA`: no se completa.** Clase: `OFICIAL` (organismo o estándar), `INTERNO` (decisión de la casa), `STAKEHOLDER` (planilla entregada por el negocio: no es catálogo oficial hasta que se cite su origen).

| Catálogo | Clase | Dónde está declarado | Fuente (`source_name`) | URL | Fecha de obtención | Licencia / condición | Observación |
|---|---|---|---|---|---|---|---|
| Especialidades (`vs_medical_specialty`, 63 conceptos) | OFICIAL (parcial) | `Mantra Core Health Vault/SALUD/Patch v4.0.11/Value sets/vs_medical_specialty.md` | Los 18 del SNRM: Ministerio de Salud y Deportes (CNIDAIIC), «Plazas de Residencia Médica, Gestión 2022». Las 9 odontológicas: `RealDataSeeds/LISTA DE ESPECIALIDADES ODONTOLOGICAS.md` (stakeholder). **Los 36 originales de v4.0.11: `SIN PROCEDENCIA REGISTRADA`** (la nota dice «reales del país», sin citar de dónde) | `SIN PROCEDENCIA REGISTRADA` (la nota no trae URL) | 2026-08-28 (ampliación); 36 originales: sin fecha | `SIN PROCEDENCIA REGISTRADA` | El orden de la lista es identidad (ordinal); no se reordena |
| Departamentos (`vs_administrative_area`, 9) | OFICIAL | `…/Patch v4.1.4/Value sets/vs_administrative_area.md` | Siglas oficiales de expedición del carnet (SEGIP), según la nota | `SIN PROCEDENCIA REGISTRADA` | 2026-08-20 | `SIN PROCEDENCIA REGISTRADA` | 9 valores, cerrados; bajo riesgo |
| Establecimientos de salud (642 códigos) | STAKEHOLDER | `mantra-core-health-api/src/common/seed/data/bolivia/health-facilities.dataset.json` (`_nota`) | Tres planillas entregadas por el negocio: `RealDataSeeds/LISTA DE CLINICAS PRIVADAS.md`, `LISTA DE HOSPITAL DE TERCER, SEGUNDO NIVEL Y CAJAS.md`, `LISTA DE HOSPITAL DE PRIMER NIVEL SANTA CRUZ.md`; más consultorios de las redes de Alianza y Nacional que «el padrón oficial no lista» | `SIN PROCEDENCIA REGISTRADA` | `SIN PROCEDENCIA REGISTRADA` | `SIN PROCEDENCIA REGISTRADA` | La `_nota` habla de «padrón oficial» pero no lo nombra ni lo enlaza; sólo Santa Cruz. M-06 lo usa para «lugar donde atiende» |
| Aseguradoras (17 tenants `PAYER`) | OFICIAL (parcial) / STAKEHOLDER | `mantra-core-health-model/salud-db/gen_seeds.py:2049-2270` (`ASEGURADORAS_BOLIVIA`) y `RealDataSeeds/LISTA DE ASEGURADORAS.md` | Sitio oficial de cada compañía para nombre, NIT y canales | **7 con `source_url`** (BISA, Fortaleza, Crediseguro, La Boliviana Ciacruz, La Vitalicia, UNIVIDA, Santa Cruz Vida y Salud); **10 con `source_url=None`** (`SIN URL`) | 7 con `obtenido=2026-09-13`; 10 sin fecha | `SIN PROCEDENCIA REGISTRADA` | El registro del regulador (APS) **no está cargado**: `regulator_identifier` guarda el NIT, no el registro APS (comentario en `:2434-2437`). En M-06 sólo se muestra «Particular» o el nombre de la aseguradora (ALV-021) |
| Estados de la cita, del cupo y de la espera | INTERNO | `src/modules/scheduling/scheduling.concepts.ts` · `src/common/constants/concepts.ts:1231-1366` | Decisión de la casa | — | — | — | Catálogo interno: no exige procedencia externa, sí revisión en PR |
| Tipos de aviso (4 kinds) | INTERNO | `src/modules/scheduling/ports/agenda-notice.port.ts:33-41` | Decisión de la casa | — | — | — | Ídem |
| Roles (`PATIENT`, `PRACTITIONER`, `ADMIN`, `AGENT`, `SUPERADMIN`, `SYSTEM*`) | INTERNO | `src/common/auth/role-mapping.ts` | Decisión de la casa | — | — | — | Ídem |
| Ocupaciones (SEGIP, «896 opciones») | OFICIAL | **No aplica a M-06** (es del registro, M-01) | `NO APLICA` | — | — | — | Q-R7 sigue abierta: ni 896 ni 64 verificados |

**Lo que este relevamiento deja claro para Pablo (handoff):** los cuatro catálogos que M-06 muestra al paciente (especialidad, departamento, establecimiento, aseguradora) tienen procedencia **incompleta** (sin URL ni licencia en tres, y con 10 aseguradoras sin fuente). No bloquea el diseño de casos —se citan por código de concepto—, pero sí bloquea llamarlos «catálogo oficial» en un dictamen (regla 97.4).

---

## §6 — Datos que NO se pueden generar por falta de regla (H2.S2.M3)

Ninguna de estas filas se completa por criterio propio. Quien decida, decide; hasta entonces, el caso que dependa de ella queda `DECISION_REQUIRED`.

| ID | Dato que falta | Qué caso lo necesita | Quién define | Referencia |
|---|---|---|---|---|
| DR-M06-01 | **Tarifa por cancelación** y **tarifa por inasistencia** (si existen), su **moneda** y su **redondeo**. El modelo tiene lugar para ambas, el cliente no las nombra en M-06 | Ninguno de los 33 las usa; H3.S3 las inspecciona | Negocio / cliente | Q-10 · `booking_cancellations.fee_amount`, `booking_policies.no_show_fee_amount` (§11) |
| DR-M06-02 | **Datos de facturación de la consulta (3.6):** dónde se capturan, si se reutilizan entre consultas, si el NIT se valida | CA-M06-F10 | Negocio / cliente | `:109-111`; `SIN LOCALIZADOR` |
| DR-M06-03 | **Quiénes reciben el aviso de horario liberado:** el cliente dice «los que estuvieron revisando horarios para ese mismo día»; el sistema exige anotarse. ¿Hay que registrar a quien *miró* sin anotarse? | CA-M06-F04, F05 | Negocio / cliente | `:254` (4.3) |
| DR-M06-04 | **Plazo de «automática»:** cuánto puede tardar el aviso de cupo liberado (hoy sale por barrido periódico, no al cancelar) | CA-M06-F05 | Negocio · Ender (contrato) | `:254`; Q-06 |
| DR-M06-05 | **Retención del cupo:** si existe para el cliente, cuánto dura, qué pasa al vencer | CA-M06-F03, N-VAL-08 | Negocio | `AGREGADO` (§7) |
| DR-M06-06 | **Qué canal cuenta como «RECIBIRÁ»:** el cliente dice «NOTIFICACION DE LA APP»; el propietario suma correo y chat; ¿push? ¿SMS? ¿Basta la bandeja? | CA-M06-F07, F08, F09 | Negocio · Ender | `:108,253` · TAREA-15 · Q-21 |
| DR-M06-07 | **Mínimo y máximo de la demora** en minutos y **largo del mensaje**. Hoy 5 / 240 / 300, del código | CA-M06-N-VAL-02, 03, 04 | Negocio | `:108,253` |
| DR-M06-08 | **Garantía de entrega del aviso:** el sistema descarta el aviso que falla y no reintenta; el cliente asume que el paciente «RECIBIRÁ» | CA-M06-F05, F06, F09 | **Negocio — es Q-06, la decide Ender con negocio, no este documento** | `agenda-notice.port.ts:19-23` · `:253` |

---

## §7 — Correspondencia paso ↔ documento del cliente (H2.S3.M1)

Los 11 pasos son los de H1 §8. `AGREGADO` = el sistema lo hace y el cliente no lo pidió en su documento.

| # | Paso del recorrido | Párrafo del cliente (`REQUISITOS-CLIENTE-ALOVIDA.md`) | `gdoc_procesos.txt` | Casos |
|---|---|---|---|---|
| 1 | Buscar médico disponible | `:104` «revisar todos los médicos que están disponibles con seguro y sin seguro» · `:106` | `:59,61` | F01 |
| 2 | Ver horario y sede | `:106` «revisa su horario y lugar donde atiende» · `:248` (el médico registra horarios en clínicas privadas «para que los pacientes puedan revisar sus horarios y agendar») | `:61,222` | F02 |
| 3 | Reservar (retener → confirmar) | `:106` «agendar un horario de consulta». **La retención previa es `AGREGADO`** | `:61` | F03, N-VAL-07, N-VAL-08 |
| 4 | Sin cupo → lista de espera | `:107` (3.4) — **anotarse es `AGREGADO`**: el cliente habla de quienes «estuvieron revisando» | `:62` | F04, N-VAL-06, N-VAL-09 |
| 5 | Cupo liberado → aviso | `:107` (3.4) · `:254` (4.3) | `:62,226` | F05, N-EST-03 |
| 6 | Demora del médico → aviso | `:108` (3.5) · `:253` (4.2) | `:63,225` | F06, N-VAL-01…05, N-EST-04 |
| 7 | Paciente ve el aviso (bandeja) | `:108,253` «NOTIFICACION DE LA APP» | `:63,225` | F07 |
| 8 | Copia al chat de soporte | **`AGREGADO`** — pedido del propietario (TAREA-15 §1, puntos 1 y 3), sin párrafo del cliente | — | F08 |
| 9 | Correo | **`AGREGADO`** — pedido del propietario (TAREA-15 §1, puntos 2 y 3), sin párrafo del cliente | — | F09 |
| 10 | Datos de facturación | `:109-111` (3.6) | `:64-66` | F10 |
| 11 | Consumo desde el móvil | `:104-106` «Desde la APP…» (el cliente no distingue web de móvil) | `:59-61` | F11 |

**8 pasos con párrafo del cliente, 3 `AGREGADO` (retención dentro del paso 3, chat, correo).** Ningún paso queda sin clasificar.

---

## §8 — Ítems del cliente en estas secciones que M-06 NO cubre (H2.S3.M2)

Insumo de la conversación de alcance: **que nadie lea el piloto de agenda como «Agendar Hora» completo.** Las marcas entre paréntesis son las del documento del cliente, **citadas, no adoptadas como estado del sistema** (Q-R4).

| # | Ítem del cliente | Línea | Por qué queda fuera de M-06 |
|---|---|---|---|
| 1 | Ver médicos disponibles «con seguro y sin seguro» (filtro por cobertura) | `:104` | El recorrido muestra «Particular / aseguradora» en la lista de consultas del médico (ALV-021), no un filtro del buscador |
| 2 | Ver «cuales son los médicos que trabajan con cada aseguradora» | `:105` | Depende de la relación médico ↔ aseguradora (`Alianza_Medicos_Habilitados`, `Nacional_Seguros_Red_Medica` en `RealDataSeeds/`), fuera del piloto |
| 3 | Datos de facturación para la consulta (razón social + NIT) | `:109-111` | `SIN LOCALIZADOR` en el flujo de reserva (H1 §7); F10 lo cubre como caso, pero no hay dónde ejecutarlo |
| 4 | Horarios en **hospitales públicos** «de turno», enlazados al calendario de TRABAJO (INCOMPLETO según el cliente) | `:247` | El recorrido usa la agenda publicada en la sede de la organización; no distingue hospital público ni «turno» |
| 5 | «Cuadro en el calendario» para que el médico detalle sus horarios (grilla) | `:247` | Publicación de agenda: carril MAC-2…MAC-6, no M-06 |
| 6 | Calendario del médico **semanal** con nombre del paciente (INCOMPLETO: falta la semanal) | `:252` | Vista del médico; M-06 la usa sólo para el paso 6 |
| 7 | Aviso a «los PACIENTES que estuvieron revisando horarios para ese mismo día» **sin haberse anotado** (INCOMPLETO según el cliente) | `:254` | El sistema exige anotarse y dispara por barrido: `DR-M06-03`, `DR-M06-04` |
| 8 | Aviso «AUTOMATICA» **al desmarcarse** (inmediato) | `:254` | Hoy es por barrido periódico; el plazo es `DR-M06-04` |
| 9 | Push / SMS como canal del aviso (el cliente marca «Solo aviso dentro de la app, sin push ni SMS») | `:253` | Canal push sin cliente verificado; SMS `NOT_FOUND` en agenda (H1 §6) — aceptación externa pendiente, Q-21 |

---

## §9 — Kill-test del hito, respondido

*«Tomá un caso y preguntá de dónde sale el resultado esperado.»* — Tomado al azar el `CA-M06-F05`: el esperado («PA2 recibe un aviso de que se liberó un horario ese día con esa médica») sale de `REQUISITOS-CLIENTE-ALOVIDA.md:107` y `:254`, no del sistema. Tomado el peor: `CA-M06-N-VAL-03` (241 minutos) — el esperado **sí** sale del código, y por eso está rotulado `DECISION_REQUIRED` y excluido del conteo de aceptación (§3). No hay un tercer tipo.

---

## §10 — Handoffs de H2

**A Justin:** los 8 negativos de autorización (`CA-M06-N-AUTH-01…08`) van a tu matriz. Tres ya los cubrís con dobles en `origin/dev` (`test/integration/waitlist-cupo-liberado.int-spec.ts`: `:382` otro profesional no ve la cola ajena → N-AUTH-06 primera mitad; `:389` un paciente no llega a la cola → N-AUTH-05; `:414` otro paciente no lee la espera ajena cambiando el uuid → primo de N-AUTH-01). Los otros cinco —**y sobre todo N-AUTH-01 sobre la cita** — hoy no tienen doble ni integración; N-AUTH-01 tiene predicción de rojo por lectura (§11). Casos que ya podés ejercitar con dobles: todos los `N-AUTH-*` y `N-EST-*`; los que esperan participantes reales: F08 (chat), F09 (correo real), F11 (móvil).

**A Ender:** reglas del recorrido que el contrato del aviso **no expresa** hoy: (1) garantía de entrega —el puerto descarta el aviso fallido y el cliente asume que «RECIBIRÁ» (`DR-M06-08`, Q-06)—; (2) plazo máximo entre la cancelación y el aviso de cupo liberado (`DR-M06-04`); (3) ventana de la clave de rebote (`debounceKey` sin TTL — de tu verificación §2.1); (4) «exactamente uno» de `recipient`, que es comentario y no tipo; (5) que el chat sólo aplica a cambios de estado y no a demora ni cupo liberado (F08, última cláusula) — si el pedido del propietario quiere chat para todo, el contrato cambia.

**A Pablo:** el grafo de §4 es lo que el laboratorio necesita para estos casos: 2 organizaciones, 2 profesionales con agenda del martes próximo (3 cupos y 2 cupos), 4 pacientes (`PA1`, `PA2`, `PA9`, `PB1`), `SEED = 20260920`, sufijo `<U>` por corrida. Y la tabla de §5: cuatro catálogos que M-06 muestra tienen procedencia incompleta (sin URL/licencia; 10 aseguradoras sin fuente) — no bloquea el laboratorio, bloquea llamarlos oficiales en el dictamen.

---

## §11 — Trazabilidad a código (fuera de los casos, a propósito)

Los casos no mencionan implementación; esta tabla sí, para que H3 sepa dónde ejercitarlos y para dejar escritas las predicciones **por lectura** (peldaño `DISCOVERED`, no verificadas):

| Caso(s) | Localizador principal (checkout `a5753dc7`) | Predicción por lectura | Cobertura existente (`origin/dev`) |
|---|---|---|---|
| F01, F02 | `src/modules/scheduling/controllers/scheduling-agenda.controller.ts:33,46` (`GET /scheduling/resources`, `GET /scheduling/slots`) | `GET /scheduling/slots` no recibe actor ni tenant (`services/scheduling-agenda.service.ts:147-177`) | `cypress/e2e/real/03-medico.cy.ts`, `05-portal-turnos.cy.ts` |
| F03, N-VAL-07, N-VAL-08 | `controllers/scheduling.controller.ts:590,607` (`POST slots/:id/holds`, `POST holds/:token/confirm`); 409 en `services/scheduling-bookings.service.ts:457,732,740` | Hold vencido → 409; doble reserva: H-1, sin `CHECK`/exclusión en `SQL/41_scheduling/04_indexes.sql` (raíz `CLAUDE.md`) | `fx9-carreras-de-la-agenda.int-spec.ts` (local) |
| F04, N-VAL-06, N-VAL-09, N-AUTH-04, N-AUTH-05 | `controllers/scheduling.controller.ts:648,665,696` · `services/scheduling-waitlist.service.ts:87-122,139,175` (`assertPuedeVerAlPaciente :233-249`, `assertOperaLaAgenda :258-276`) | Sin baja voluntaria (`WAITLIST_CANCELLED` no usado); duplicado: no se vio guarda de unicidad → N-VAL-09 puede fallar | `waitlist-cupo-liberado.int-spec.ts:389,404,414` |
| F05, N-EST-03 | `services/scheduling-waitlist.service.ts:285-348` (promoción) · `src/worker/jobs/scheduling/promote-waitlist.job.ts:37` (`@Interval(30_000)`) · `services/scheduling-agenda-notices.service.ts:57-96` | El aviso sale por barrido, hasta 30 s después; la promoción no reserva la cita (`:280-283`) | `waitlist-cupo-liberado.int-spec.ts:277,320` |
| F06, N-VAL-01…05, N-EST-04, N-AUTH-06 (2.ª mitad) | `controllers/scheduling-bookings.controller.ts:362` y `scheduling.controller.ts:723` · `services/scheduling-delay.service.ts:90-189` (`assertMinutos :246-253` → 422 `DELAY_TOO_LONG`; `assertOperaLaAgenda :262-284` → 403; `ESTADOS_ALCANZABLES :31-34`) · `dto/scheduling-bookings.dto.ts:699-791` (`@Min(5)`, sin `@Max`) | 4 min → 400 (validación); 241 → 422; 301 chars → 400; ventana invertida → 422 (`:151-156`) | unitarios `scheduling-delay.service.spec.ts` |
| F07 | Front `src/app/features/notifications/{notification-center,aviso-de-hueco-libre}.ts`; API `src/modules/messaging/services/notifications.service.ts` | Sin campana (P1) | `playwright/carril-p8-avisos-agenda.spec.ts` |
| F08 | `src/modules/scheduling/adapters/support-admin-notice.adapter.ts:43` · `KINDS_CON_CHAT` en `adapters/messaging-agenda-notice.adapter.ts:119-120` | Chat sólo para `BOOKING_STATE_CHANGED`; `SupportAdmin` como cuenta `NO LOCALIZADO` (TAREA-15 §2.2) | `agenda-mensajeria-relacion.int-spec.ts:329,515` (con dobles) |
| F09 | `adapters/messaging-agenda-notice.adapter.ts:342` (`encolarCorreo`) · `docker-compose.yml:563` (`mock-provider-server`) | Correo encolado, nunca entregado a un SMTP real | `agenda-mensajeria-persistencia.int-spec.ts:279` |
| F10 | `NOT_FOUND` (H1 §7: `grep -rn "billing\|invoice\|factura"` en controllers/DTO de `scheduling`) | `FAIL`/`NOT_RUN` | — |
| F11 | `mantra_core_health_mobile/lib/core/constants/api_endpoints.dart:31-40` | Pantalla consumidora no localizada | — |
| N-AUTH-01 | `controllers/scheduling-bookings.controller.ts:128` → `services/scheduling-bookings.service.ts:2823-2834` → `repositories/scheduling-bookings.repository.ts:378-383` (`findOne({ id })`) | **Rojo previsto:** sin `tenantId` ni `assert*`; con `RLS_ENFORCE=false` (`.env:61`) no hay barrera. Contraste: `findTenantAgenda` sí filtra (`:517-541`) | ninguna |
| N-AUTH-02, N-AUTH-03, N-EST-01, 02, 05 | `controllers/scheduling-bookings.controller.ts:311,327,276,295` · `cargarParaOperar` `services/scheduling-bookings.service.ts:2409-2443` (403 `:2438`) · `state/booking-state-machine.ts:33-61` · 422 `INVALID_STATE_TRANSITION` `:2355-2366` | Cancelar/mover ajeno → 403 por `cargarParaOperar` (rol PATIENT sin `practitionerProfileId` → `:2429-2440`); transiciones ilegales → 422 | unitarios de `scheduling-bookings.service.spec.ts` |
| N-AUTH-07 | `JwtAuthGuard` global | 401 | smoke |
| N-AUTH-08 | `controllers/scheduling-bookings.controller.ts:344` (`@Roles('ADMIN','AGENT')`) | 403 por `RolesGuard` | — |

**Dos hallazgos laterales, fuera de los casos:** (a) `POST /scheduling/bookings/:id/reminders` (`:379`) llama a `scheduleReminders` (`services/scheduling-waitlist.service.ts:372-424`) **sin ningún `assert*`** — no está en M-06 como paso, pero es un negativo de autorización que Justin debería sumar; (b) ninguna lectura de `scheduling` deja rastro en `audit.data_access_log` (`NOT_FOUND` en `src/modules/scheduling/`), pese a devolver nombre y motivo de consulta — es dato para H4.S3.M1 y para Pablo.
