# Correcciones fullstack — documento «CORRECCIONES» — 2026-10-23

> **Este archivo es fuente, no análisis.** Según la regla 00 §8, un requisito explícito del cliente
> es la evidencia de **máxima** jerarquía: gana sobre el comportamiento del código, sobre los tests
> y sobre cualquier documentación de proveedor. Cuando algo de acá choca con lo que hace el sistema,
> **el sistema está mal**, no el requisito.
>
> Dónde vive cada cosa en el código, verificado con archivo y línea:
> [`VERIFICACION-CONTRA-CODIGO-2026-10-23.md`](../verificacion/VERIFICACION-CONTRA-CODIGO-2026-10-23.md).
> El plan por carriles, con hitos, subtareas, microtareas y kill-tests:
> [`planes/06-correcciones-fullstack-2026-10-23/README.md`](../../planes/06-correcciones-fullstack-2026-10-23/README.md).

## Ficha de procedencia

| Campo | Valor |
|---|---|
| Qué es | Lista de correcciones y funcionalidades a implementar «de forma fullstack», módulo por módulo (paciente, médico, pagos, glosario, laboratorio e imagenología, farmacia) |
| Título del original | `CORRECCIONES` (título del documento de Google) |
| Quién lo entregó | El propietario (Pablo), en la sesión del **2026-10-23** |
| Cómo llegó | Enlace a Google Docs `1yNwo2vxePigQYqWoRoyo1I2IaBPAyBXf1A5NInJBO0Y`, leído con el conector de Google Drive el 2026-10-23. Junto con el pedido: «revisá absolutamente TODO los repos y hacé un plan ultra detallado y completo para corregir e implementar de forma fullstack … debe incluir pruebas con Playwright en donde se asegura que funcione, si no corrige hasta que esté bien» |
| Reparto pedido | **Por carriles y por programador**, en un segundo mensaje de la misma sesión: **1) Módulo paciente: Leo y Richard · 2) Módulo doctor: Pablo y Justin · 3) Módulo de farmacia, imagenología, laboratorio: Ender e Itzan** |
| Fecha de redacción del original | **No consta.** No se infiere |
| Versión | **No consta.** Este archivo es la primera transcripción versionada |
| Estado | `REQUIREMENT_APPROVED` en cuanto a su origen. **Ninguno de los puntos está verificado contra el código en este archivo**: eso es el otro documento |
| Sobre qué rama aplica | **No lo dice el original.** Supuesto: `origin/dev` de cada repo (rama de integración declarada en los `CLAUDE.md`), ver Q-00 |
| Predecesores | [`CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](./CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md), [`FARMACIA-ECOMMERCE-2026-09-25.md`](./FARMACIA-ECOMMERCE-2026-09-25.md), [`TEST-PREPRODUCCION-2026-09-26.md`](./TEST-PREPRODUCCION-2026-09-26.md). Varios puntos **vuelven sobre lo mismo** (QR bancario por sede, carrito, tablero de farmacia, horario) y eso se declara en la verificación, no se disimula |

### Cómo se transcribió — leer antes de usarlo

- El texto de cada punto es **palabra por palabra** el que entregó el cliente. **No se corrigió
  ortografía, tildes ni redacción** («porfavor», «FUNCONE», «pestana», «mockup», «revolcado»,
  «Rediseño integral de la view», «Está view», «imagenologia»). Las mayúsculas sostenidas se conservan:
  son énfasis del cliente.
- **La numeración del original está rota** (la exportación repite «1.» en casi todos los niveles), así que
  **el identificador no es el número del original**: se asigna **por posición y por bloque**. Los bloques
  son los encabezados en negrita del documento. Prefijos: **`PA-`** (`PACIENTE`), **`MD-`**
  (`Modulo medico`, que incluye `Módulo de pagos`, `Glosario`, `BLOQUEOS DE AGENDA` y `Reservar Cita`),
  **`LI-`** (`Modulo de laboratorio, imagenologia`) y **`FA-`** (`Módulo de farmacias`).
- Donde el original trae `[image]` había una captura de pantalla que **el conector no entrega**. Se deja
  la marca `[imagen]` en el lugar exacto y se registra como ambigüedad (Q-IMG): sin la captura, el punto
  sólo se puede interpretar por el texto que lo rodea.
- Los sub-puntos llevan letra (`PA-03.a`) cuando el original los separa en renglones propios.

### Ambigüedades registradas sobre este documento

Ninguna se resuelve por conveniencia (regla 00 §1.7). Cada una tiene el supuesto con el que se
reparte y a quién hay que confirmárselo; viaja además al prompt del carril que la tropieza.

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-00 | Sobre qué rama aplica el trabajo | `origin/dev` de cada repo; cada carril abre PR contra `dev`; el merge lo hace una persona (candado de los `CLAUDE.md`) | Pablo |
| Q-IMG | Seis `[image]` del original no llegaron (entrada principal, componentes vacíos ×2, perfil de laboratorio, importación masiva de farmacia, pestañas de farmacia) | Se interpreta por el texto y por lo que hoy pinta la ruta más probable; **antes de borrar o rediseñar un bloque se confirma con captura** | Pablo (adjuntar las seis capturas al plan) |
| Q-01 | **PA-01** «mockup server … desplegado en el backoffice»: el repo ya tiene `mock-provider-server` (identidad con veredicto diferido) y el portal de administración del front. ¿«backoffice» = el portal admin del front donde un operador acepta, o un portal propio del mock? | **El portal admin del front** (`/administration/identity-assurance/*`) es donde se acepta; el `mock-provider-server` sigue siendo la «autoridad» que responde la verificación automática. Si Pablo quería un backoffice separado, es un desarrollo nuevo y se declara | Pablo |
| Q-02 | **PA-01** liveness «cara derecha, frente e izquierda»: ¿captura real con cámara y detección de pose, o tres fotos guiadas que el operador revisa? | **Tres capturas guiadas** (cámara del navegador / del teléfono) adjuntas al caso, revisadas por el operador del backoffice; **no** se implementa detección biométrica (no hay proveedor real). Se declara como simulación (regla 65) | Pablo |
| Q-03 | **PA-02** «Las que no se obliga a pagar el monto total pero si se puede»: ¿el paciente puede pagar el 100 % y después reclamar, o la orden de aprobación bloquea el cobro hasta la respuesta? | Las dos opciones conviven: el paciente **puede** pagar el total sin esperar, **o** generar la solicitud de aprobación y pagar su parte cuando el seguro responda. La tabla muestra el estado de cada línea | Pablo + doctor |
| Q-04 | **PA-03** «la barra superior de la app»: ¿la app móvil Flutter, el panel web del paciente, o las dos? | **Las dos**, porque los cuatro elementos (Emergencia, Tutoriales, Mis facturas/Mis gastos, Promociones/Carrito) existen en las dos. El móvil va después del web en el mismo carril | Pablo |
| Q-05 | **PA-03.d** «sacar el mapa chat porque no aporta mucho»: no hay ningún componente llamado «mapa chat» | Se interpreta como **el mapa dentro de la vista de promociones/carrito** (lugares cercanos sobre mapa) — se confirma con captura antes de quitarlo | Pablo |
| Q-06 | **PA-04.4** «una vez rechazada se pierde»: ¿se pierde el comprobante (el paciente puede volver a subir otro) o se pierde la sesión (queda impaga y cerrada)? | Se pierde **el comprobante**: la sesión vuelve a «pendiente de pago» con el motivo del rechazo visible y el paciente puede subir otro o pagar en efectivo | Pablo + doctor |
| Q-07 | **PA-05** «QR escaneable … con una cámara normal te lleva a esa receta … NO ES UNA CARTA LIBRE»: ¿qué ve quien abre el enlace sin sesión? | Sin sesión: **sólo** una pantalla que pide iniciar sesión; con sesión de **paciente**, sólo si es el paciente prescrito (o su tutor); con sesión de **farmacia**, el detalle de ítems para marcar disponibilidad. El enlace lleva un token firmado con vencimiento; **nunca** datos clínicos en la URL (regla 90.2.2) | Pablo |
| Q-08 | **PA-06** «mockup server que simula una API de farmacia … estructura hexagonal»: ¿va dentro de `mock-provider-server` o es un servicio aparte? | **Dentro de `mock-provider-server`**, como quinto proveedor, con su propio módulo (puerto `PharmacySystemPort` del lado de la API, adaptador HTTP contra el mock). Un repo nuevo multiplica despliegues sin beneficio | Pablo |
| Q-09 | **PA-07** «su DURACIÓN DEBE SER FLEXIBLE Y MODIFICABLE DADO UN VALOR POR DEFECTO QUE INCLUSO ESTE MISMO PUEDE SER CONFIGURADO»: ¿quién cambia la duración de un turno ya pedido: el centro al aceptar, el paciente al pedir, o los dos? | **El centro** al aceptar o después (la duración real la sabe el laboratorio); el valor por defecto lo configura el centro por servicio | Pablo |
| Q-10 | **PA-08** «Sistema del cuerpo» y «Fase o Parte de la Historia clinica» como ejes de la tabla de permisos: hoy los permisos delegados van por **conjuntos de permisos** y por **categoría de recurso**, no por sistema corporal | Se agregan **las dos dimensiones** como metadatos del pedido de acceso (sistema corporal de un catálogo cerrado + sección de la historia clínica de un catálogo cerrado); la autorización sigue resolviéndose por recurso en la API. Si el cliente quería que el **permiso** se calcule por sistema corporal, es un cambio de modelo de autorización y se escala | Pablo + doctor |
| Q-11 | **PA-09.b** «detectar automáticamente donde se encuentra … municipio y el departamento … la zona»: «zona» no existe como nivel en el catálogo geográfico boliviano del repo (departamento → provincia → municipio) | Se usa **departamento + municipio** por geolocalización inversa y «zona» queda como **texto libre opcional** de filtro; si hay catálogo de zonas urbanas con procedencia, se incorpora después | Pablo |
| Q-12 | **PA-10 / PA-11** «basate en MARKETPLACE DE FACEBOOK» / «marketplace de amazon»: son referencias de **patrón de interfaz**, no de identidad visual | Se toma **el patrón** (rejilla de tarjetas con imagen dominante, filtros laterales/superiores, orden por relevancia/precio/distancia, ficha con galería) **dentro de la identidad ALOVIDA v1.0 y los 188 tokens**. No se copian colores ni tipografías ajenas | Pablo |
| Q-13 | **MD-01** «si el CI está ocupado o no por un mismo tipo de usuario»: la cédula boliviana lleva **departamento emisor** y dos personas pueden compartir número (vault, skill `procesos-alovida` §4.4) | La unicidad es por **(tipo de documento, número, departamento emisor, tipo de usuario)**. Un mismo número con otra terminación no es colisión. Mismo número + misma terminación + mismo tipo de usuario → rechazo con mensaje claro; con **otro** tipo de usuario (médico que también es paciente) → permitido y se vinculan a la misma persona | Pablo |
| Q-14 | **MD-05.c** «PARA CONSULTA ES OBLIGATORIA Y ES UN ESTÁNDAR DE PREGUNTAS MÍNIMAS POR DEFECTO»: el original no dice cuáles son las preguntas mínimas | Se propone un **estándar de 5 preguntas** (puntualidad, trato, claridad de la explicación, resolución del motivo de consulta, recomendación 0–10) **marcado como propuesta**; el cliente lo confirma o lo reemplaza antes de sembrarlo | Pablo + doctor |
| Q-15 | **MD-07.b** «Cada definición debe tener un estándar de más de 2000 palabras … ATLAS MÉDICO»: hay 12 000 términos; 2 000 palabras × 12 000 términos no sale de ninguna fuente con licencia, y **inventar texto médico está prohibido** (regla 97.5.4) | Se construye el atlas **por capas con procedencia**: MedlinePlus en español (dominio público) y Wikipedia en español (CC BY-SA, con atribución) para las entradas que tienen artículo; imágenes de Wikimedia Commons vía Wikidata P18 con su licencia. Las entradas sin fuente larga muestran la definición corta y lo dicen. **Ningún texto se genera con un modelo y se presenta como fuente** | Pablo |
| Q-16 | **MD-10.c** «Todo el sistema de reservar cita y todo lo demás no funciona absolutamente nada»: no dice en qué entorno ni qué paso falla | Se **mide primero** con Playwright contra la API real (kill-test del carril 2, H1) y se corrige lo que falle; no se reescribe la reserva desde cero | Pablo (entorno exacto y cuenta con la que falló) |
| Q-17 | **LI-01** estados «INICIADA, RECIBIDA, EN PROCESO, RECHAZADA, CONFIRMADO» contra los estados ya existentes de las órdenes y resultados de diagnóstico | Se **mapean** los cinco estados pedidos a la máquina existente (ver verificación §LI); se agrega lo que falte y la UI muestra **exactamente** las cinco etiquetas del cliente | Pablo |
| Q-18 | **FA-02** «ERP por pestañas ultra detallado y compacto»: «compacto» y «ultra detallado» tiran en direcciones opuestas | Una tarjeta a lo ancho con **cuatro pestañas** (Productos, Categorías, Precios, Inventario) y tablas densas con filtros arriba; se muestra el borrador antes de cerrar | Pablo |
| Q-19 | Reparto: Leo y Richard **no están** en la lista de personas del validador de repartos (`tools/check_reparto.py`) | Se los **da de alta** en el validador en este mismo trabajo, con su `--self-test` en verde | Pablo |

---

# Texto del cliente

> `1.  PACIENTE`

## PA-01

> Validación de identidad con el mockup server que se encuentra desplegado en el backoffice.

### PA-01.a
> Asegurarse que el backoffice esté levantado y desplegado en el servidor.

### PA-01.b
> Este mockup server es una instancia standalone. Es decir que es compartido por todos.

### PA-01.c
> Flujo de VERIFICACION KYC:
> - Carnet ambos lados
> - Pruebe LIVENESS (Cara derecha, frente e izquierda)

### PA-01.d
> Se envia a un backoffice o portal administrativo para que funcione el aceptar y considerar validado.

## PA-02

> Conexion paciente aseguradora
>
> Cada pago de servicio debe cobrar:
> - Cobrar en cada servicio el porcentaje que promete cubrir el seguro.
>   - Las que están en el contrato por defecto aprobadas.
>   - Las que no se obliga a pagar el monto total pero si se puede: Generar una orden de aprobación del servicio.
> - Visualizar en la tabla

## PA-03

> Modificar la barra superior de la app

### PA-03.a
> Emergencia eliminarlo

### PA-03.b
> Tutoriales llevarlo a ajustes

### PA-03.c
> Mis facturas se fusionaron con mis gastos. (Pestaña “Resumen”)

### PA-03.d
> Promociones fusionarlo con “Carrito” pero sacar el mapa chat porque no aporta mucho.

## PA-04

> Sistema de pago

### PA-04.1
> El paciente lee el QR subido para cada consultorio o espacio de trabajo del doctor.

### PA-04.2
> Luego el paciente sube el comprobante de pago o le da “pague en efectivo”.

### PA-04.3
> En base a esto calcula lo que sale en una tabla de pago al proveedor y marca cada sesión como pendiente de pago.

### PA-04.4
> Ahora el doctor le puede dar aceptar como pagada o rechazar como pagado. Finalmente, una vez aceptada le sale como aceptada, pero una vez rechazada se pierde.

### PA-04.5
> Ejemplo: 80% 100
> - 20 Bs.

## PA-05

> Conexión con farmacia
>
> Cada receta médica tiene un QR escaneable que detalle cada ítem de la receta y esto le carga automático a la farmacia. En esto el usuario por sucursal marca si tiene o no dicho producto para que el usuario pueda reservar.
> - El paciente desde la pestana Farmacia hace el pedido.
> - Lo del QR se puede enviar directo desde Whatsapp o cualquier app de mensajeria. Vos lo abris con una camara normal y automatica te lleva a esa receta. Si vos tenes una sesion iniciada como farmacia la podes abrir perfectamente bien. NO ES UNA CARTA LIBRE PARA COMPRA PARA CUALQUIERA SINO PARA LA PERSONA ESPECIFICA PRESCRITA.

## PA-06

> Es necesario levantar un mockup server que simula una API de farmacia que simule a través de una estructura hexagonal el nexo de claves foráneas entre productos y su interpretación de cada cosa de modo que la información fluya entre ambos.

## PA-07

> Conexión con Laboratorio e Imagenología
>
> Cada orden de laboratorio e imagenología tiene un QR que apunta al detalle del servicio de análisis clínico con los features específicos a incluir en dicho servicio. Esto es escaneado por el centro de análisis clínico y lee el detalle los features exactos pero el paciente se reserva cupo por el servicio en general, reduciendo la complejidad. Como cada horario es aceptado o rechazado su DURACIÓN DEBE SER FLEXIBLE Y MODIFICABLE DADO UN VALOR POR DEFECTO QUE INCLUSO ESTE MISMO PUEDE SER CONFIGURADO.

## PA-08

> Consentimiento y permiso
> - Debe aparecer una tabla con los permisos solicitados por cada doctor de qué área específica hace referencia y que categoría de la historia clínica: Análisis clínico, Enfermedades activas, Histórico de enfermedades activas, entre otros. Debe aparecer con un botón al final del mismo concedido y permiso rechazado o revolcado y el porqué.
>   - Sistema del cuerpo
>   - Fase o Parte de la Historia clinica

## PA-09

> Visuales que no sirven para nada:

### PA-09.a
> - Quitar las recomendaciones y dejar un panel de especialistas
>
> `[imagen]`

### PA-09.b
> - El mapa de BOLIVIA transversalmente hay que quitarlo del directorio de pacientes dado que no suma nada. No debería existir dado que debe detectar automáticamente donde se encuentra y mostrar el directorio por defecto de mi ubicación actual ya filtrada. El municipio y el departamento. Así como la zona.

### PA-09.c
> - Considera mejorar esta entrada principal: `[imagen]`

### PA-09.d
> - Estos componentes en general se sienten vacíos y sobran. `[imagen]` `[imagen]`

## PA-10

> Promociones:
> - Es necesario que aparezca de forma ultra estética y como un marketplace promociones de cada tipo de partner: Doctor, Centro de imagenología, laboratorio, farmacia, aseguradora.
> - Necesito que te bases en MARKETPLACE DE FACEBOOK

## PA-11

> Rediseño integral de la view de DIRECTORIOS. Está view debe basarse en el diseño de marketplace de amazon porfavor o busca en internet interfaces similares necesito algo serio, institucional y  humano como para una app de salud.

## PA-12

> Encuestas de satisfacción
> - Buzón de encuesta de satisfacción pendientes de cada tipo de partner por tipo de servicio prestado.

---

> `Modulo medico`

## MD-01

> Validar si el CI está ocupado o no por un mismo tipo de usuario durante el alta de usuario. Esto se aplica en todos los repos pero sobre todo en módulo médico, dado que constituyen entidades fundamentales.

## MD-02

> Validar la identidad y las credenciales médicas y profesionales del doctor a través del mockup server, en una estructura hexagonal y una pieza que permita simular conexión con el Colegio Médico.

## MD-03

> Bandeja de solicitudes de acceso al paciente para datos específicos de la ficha media a solicitar.

## MD-04

> Horarios de atención multi consultorio y multiservicio

### MD-04.a
> Inspirarse en MS Project

### MD-04.b
> Mejora visual y layout en la versión SEMANAL y MENSUAL

## MD-05

> Formularios

### MD-05.a
> Es necesario un botón de GUARDAR

### MD-05.b
> Agregar herramientas en el MODO marketing para preguntas de escala de LIKERT.

### MD-05.c
> Preguntas de encuestas de SATISFACCIÓN: BOTÓN TOGGLE EN PARTE SUPERIOR DERECHA: Medico – Marketing
> - Marketing son cosas que llena el paciente obligatoriamente
> - Estas encuestas son asignables por cada servicio de forma opcional.
> - PARA CONSULTA ES OBLIGATORIA Y ES UN ESTÁNDAR DE PREGUNTAS MÍNIMAS POR DEFECTO. Sin embargo, se pueden añadir preguntas personalizadas opcionales.
> - Cada encuesta automáticamente se envía al paciente después de finalizar el evento.
> - Enviar un mensaje a través de la MENSAJERÍA INTERNA dentro de la app

## MD-06

> Módulo de pagos:
>
> Sincronización con el paciente: El doctor sube en el perfil, en la parte de lugares donde trabaja. Esto le aparece al cliente a la hora de pagar un servicio. Luego el doctor puede ver en la misma pantalla del flujo de atención los comprobantes y ahí mismo cerrar la transacción. Se debe casar esto a nivel backend y para hacer un cierre del servicio. Solo se habilita facturacion cuando se haya confirmado el pago.

## MD-07

> Glosario
>
> Requiere mayor diversidad de terminología médica:

### MD-07.a
> - Cada definición debe tener un estándar de más de 2000 palabras. Debe ser una página de Wikipedia chat, osea la idea es que tengamos un ATLAS MÉDICO.

### MD-07.b
> - Cada definición debe tener imágenes

### MD-07.c
> - Filtro en la parte de arriba por favor, al buscar desaparecen las categorías. Necesito muchísimos mejores iconos.

## MD-08

> MAPEO Y RELACIONAMIENTO DE ENFERMEDADES, SINTOMAS, MEDICINAS Y ANATOMIA.

## MD-09

> BLOQUEOS DE AGENDA NO SE NOTA EN NINGUN LADO

## MD-10

> Reservar Cita

### MD-10.a
> Enviar mensaje dentro de la app al reservar, cancelarla o moverla.

### MD-10.b
> Mejorar la experiencia del usuario con las skills de marketing instaladas.

### MD-10.c
> Todo el sistema de reservar cita y todo lo demás no funciona absolutamente nada.

---

> `Modulo de laboratorio, imagenologia,`

## LI-01

> Necesitamos en la parte superior izquierda un botón de Crear instancia de servicio.

### LI-01.a
> En cada fila debe tener PACIENTE, ESTUDIO, FECHA, ESTADO Y ACCIONES

### LI-01.b
> Las acciones pueden ser
> - RECIBIR
> - RECHAZAR
> - SUBIR RESULTADOS: Abre un modal para subir N archivos, eliminar lo ya subido.
> - CONFIRMAR RESULTADOS
> - DESCARGAR RESULTADOS

### LI-01.c
> El estado puede ser:
> - INICIADA
> - RECIBIDA
> - EN PROCESO
> - RECHAZADA
> - CONFIRMADO

### LI-01.d
> Una vez se le da CONFIRMADO ya no se puede cambiar lo que se subió porque ya quedó oficial. *pasible para auditoría*

## LI-02

> CRUD de los servicios que ofrecen. Aparte del masivo que es UPSERT.

## LI-03

> El perfil está totalmente mal:
>
> `[imagen]`

---

> `Módulo de farmacias`

## FA-01

> Todos deben tener importación masiva
>
> `[imagen]`

## FA-02

> Juntar la pestaña de Producto, Categorías, Precios, Inventarios. Fíjate que sea un ERP por pestañas ultra detallado y compacto.
>
> `[imagen]`

---

## Mapa de puntos a carriles

| Carril | Programadores | Puntos del cliente que lidera | Puntos en los que participa (lado propio del flujo) |
|---|---|---|---|
| **1 · Paciente** | Leo y Richard | PA-01, PA-02, PA-03, PA-04 (lado paciente), PA-08 (lado paciente), PA-09, PA-10, PA-11, PA-12 | PA-05 (pantalla Farmacia del paciente), PA-07 (reserva de cupo del paciente), MD-10 (reserva vista por el paciente) |
| **2 · Doctor** | Pablo y Justin | MD-01, MD-02, MD-03, MD-04, MD-05, MD-06, MD-07, MD-08, MD-09, MD-10 | PA-04 (aceptar/rechazar comprobante), PA-08 (quién pide el permiso) |
| **3 · Farmacia, imagenología y laboratorio** | Ender e Itzan | PA-05 (lado farmacia), PA-06, PA-07 (lado centro), LI-01, LI-02, LI-03, FA-01, FA-02 | PA-02 (cobro con seguro en farmacia y laboratorio) |

El detalle de qué archivos y qué módulos de la API es dueño cada carril está en el plan.
