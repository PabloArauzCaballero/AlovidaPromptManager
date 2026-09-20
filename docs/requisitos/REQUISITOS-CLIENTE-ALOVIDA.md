# Requisitos mínimos del cliente — AloVida

> **Este archivo es fuente, no análisis.** Según la regla 00 §8, un requisito explícito del cliente
> es la evidencia de **máxima** jerarquía: gana sobre el comportamiento del código, sobre los tests
> y sobre cualquier documentación de proveedor. Cuando algo de acá choca con lo que hace el sistema,
> **el sistema está mal**, no el requisito.

## Ficha de procedencia

| Campo | Valor |
|---|---|
| Qué es | Los requerimientos mínimos del proyecto, según el cliente |
| Quién lo entregó | El cliente, vía Pablo |
| Cómo llegó | Pegado en la sesión de trabajo del **2026-09-19** |
| Fecha de redacción del original | **No consta.** No se infiere |
| Versión | **No consta.** Este archivo es la primera transcripción versionada |
| Estado | `REQUIREMENT_APPROVED` en cuanto a su origen; **no** verificado contra el código |
| Documento original | **No identificado como archivo.** Ver Q-R3 abajo |

### Cómo se transcribió — leer antes de usarlo

- El texto es **palabra por palabra** el que entregó el cliente. **No se corrigió ortografía, ni
  tildes, ni redacción, ni se completaron frases cortadas.**
- Lo único agregado son los encabezados Markdown para poder citar por sección, y la lista para
  preservar la jerarquía original de indentación.
- **Las marcas `(COMPLETO)`, `(INCOMPLETO - …)` y `(FALTA …)` vienen en el documento del cliente.**
  Su origen, su autor y su fecha **no constan**, y **nadie de este equipo las verificó contra el
  código**. Se transcriben porque son parte del documento, no porque estén confirmadas.
  Tratarlas como estado real del sistema sería exactamente lo que la regla 30 prohíbe.
- El original trae algunos artefactos visibles de copiado (una palabra partida en
  «registr/ado», y una línea de guiones dentro de una frase del módulo médico). **Se conservan
  tal cual**: corregirlos sería editar la fuente.

### Ambigüedades registradas sobre este documento

| ID | Ambigüedad | Supuesto | A quién confirmar |
|---|---|---|---|
| Q-R3 | Este documento **coincide punto por punto** con los escenarios `M-01`…`M-19` que `PERFIL_MANTRA_DEV.md` §5 resume, y que `FUENTES_Y_LIMITES.md` declara **no identificados** (ambigüedad `Q-04` del reparto). Ver la tabla de coincidencias al final | Es **hipótesis fuerte**, no hecho: que el contenido coincida no prueba que sea el mismo archivo aprobado. `Q-04` **no se cierra** por esta transcripción | Quien encargó el paquete |
| Q-R4 | El origen y la fecha de las marcas de estado no constan | Se atribuyen al documento y se declaran no verificadas | Cliente / quien hizo el relevamiento |
| Q-R5 | El alcance del plazo de 6 días contra los 8 módulos de este documento no cierra a ojo | No se recorta nada en silencio; la tabla demanda-contra-capacidad es microtarea de Marcelo | Coordinación |
| Q-R6 | El documento usa «TOUS» repetidamente para lo que parece ser una notificación push o un aviso in-app. El término no está definido en ninguna fuente disponible | **No se traduce ni se interpreta.** Se conserva la palabra del cliente | Cliente |
| Q-R7 | «las 896 opciones que definió el SEGIP» aparece como dato del cliente, y en el módulo médico se anota que el catálogo actual sería de 64 | No se adopta ninguno de los dos números como verificado. Un catálogo oficial exige procedencia (regla 97.4) | Cliente / SEGIP como fuente |

---

# Texto del cliente

## MODULO PACIENTE

### Registro en la App (si es que inicia el por su propia cuenta)

- Detalla su nombre completo (COMPLETO)
  - Tiene que existir 3 espacios para guardar nombres y otros que indique Apellido paterno y apellido materno (esto para tener los datos correctos)
  - Los nombres deben ser lo primero en aparecer.
  - tiene que estar los 3 campos si o si para cada nombre, algunos pueden llegar a tener cuatro nombres, el tercer campo podria almacenar mas de un nombre.
  - Importante no confundir nombres con apellidos.
- Detalla su CI como exigencia (COMPLETO)
  - la app tiene que tener como opciones para que el paciente elija la terminación del CI, como SC, LP, CB, etc., colocando con esto solo el número de su cedula el paciente al registrarse, con esto evitamos duplicidad o error del Departamento de la emisión de la cedula
  - Verificar si muestra el diferenciador de departamento en el perfil.
- Detalla su fecha de nacimiento (COMPLETO)
- Detalla su ocupación (falta base de datos del SEGIP, buscador y opción de texto libre)(COMPLETO)
  - Bajar la base de datos del SEGIP y dejar uno al final libre para que él pueda detallar la ocupación que no encontró si no está en ese detalle.
  - Tiene que existir al inicio una lupa de buscar para que pueda escribir su profesión u ocupación y ayude a buscar las 896 opciones que definió el SEGIP las ocupaciones en Bolivia. (CHARLAR CON EL TIO)
  - Falta dejar uno libre para colocar profesión personalizada
- Edad (la app tiene que arrojar de manera automática la edad del paciente con la fecha de nacimiento ingresada) (COMPLETO)
- Numero celular usuario (COMPLETO)
- Numero celular persona tutor o autorizada (siempre y cuando este enlazado con el menor de edad (hijo) o persona mayor a su cargo (padres o abuelos). (INCOMPLETO - falta sincronización para relacionar usuarios)
  - Se debe hacer la sincronización con los demás usuarios para poder relacionarlo. (DETALLAR)
- Dirección de domicilio (INCOMPLETO - falta selector interactivo de mapa)
- Ubicación GPS Domicilio (INCOMPLETO - falta persistencia y captura explícita)
  - Como pedidos ya poder guardar esa ubicación como domicilio
- Dirección de trabajo (INCOMPLETO - falta selector interactivo de mapa)
  - Mejorar el tema del mapa y que pueda marcarlo
- Ubicación GPS Trabajo (INCOMPLETO - falta persistencia y captura explícita)
  - Como pedidos ya poder guardar esa ubicación como domicilio
  - Agregar opcion si el trabajo es fuera de Bolivia
- Correo electrónico
  - Que se muestre en el perfil
- Cuenta con seguro salud privada
  - Si es si, Detalla la compañía de seguro (aquí tienen que estar registrado en nuestra base de datos todas las compañías de seguro que ofrecen seguro de salud, Alianza, Nacional, Bisa, Fortaleza, etc.)
- cuenta con seguro salud publico
  - si es si, detalla el seguro de salud publico que cuentas (aquí tienen que estar registrado en nuestra base de datos todos los seguros de salud públicos, CNS, CPS, SUS, Bancaria, etc.)
- Datos de la facturación para recibir de todas las instituciones (COMPLETO)
  - Nombre o Razón social
  - Número de NIT

### Registro en la App (con el link que envié el medico) (FORMALIZAR Y ACABAR)

- Abre el link que recibió por WhatsApp o SMS
- El link lo lleva a descargar la APP y lo descarga
- App descargada, procede a registrar su contraseña con el usuario que es el Numero de cedula de Identidad (CI)
- Termina de registrar los datos que no registro el medico que son:
  - Ocupación
  - Numero celular usuario
  - Numero celular persona tutor o autorizada (siempre y cuando este enlazado con el menor de edad (hijo) o persona mayo a su cargo (padres o abuelos).
  - Dirección de domicilio
  - Ubicación GPS Domicilio
  - Dirección de trabajo
  - Ubicación GPS Trabajo
  - Correo electrónico

### Agendar Hora para Consultas Medicas (I

- Desde la APP puede revisar todos los médicos que están disponibles con seguro y sin seguro
- Desde la APP pueden revisar cuales son los médicos que trabajan con cada aseguradora
- Ingresa al medico que requieres y revisa su horario y lugar donde atiende y se encuentra disponible para que puedas agendar un horario de consulta
- Si no encuentras cita en el día que necesitas y confirmas para otra fecha PUEDES RECIBIR UNA NOTIFICACION DE LA APP DONDE TE INFORME QUE UN PACIENTE DESCONFIRMO Y EXISTE UN HORARIO DISPONIBLE (ayudando con esto al paciente a poder tener una opción rápida y directa)
- SI EL MEDICO SE DEMORARÁ PUEDES RECIBIR UNA NOTIFICACION DE LA APP CON LA INFORMACION DE LA DEMORA DEL MEDICO
- Datos de la facturación para recibir de todas las instituciones
  - Nombre o Razón social
  - Numero de NIT

### Agendar Hora para Laboratorios, Análisis clínicos (INCOMPLETO)

- Desde la APP puedes revisar los horarios de todos los laboratorios y empresas de análisis clínicos para poder reservar hora
- Al confirmar la HORA recibirás UNA NOTIFICACION donde recibirás todo el detalle informativo de como tienes ir para tus análisis requeridos (esto tiene que registrar las empresas de Laboratorios y análisis clínicos)

### Recepción del link de Requerimientos del médico después de la consulta medica

#### SIMULACION CON UN PACIENTE QUE NO CUENTA CON SEGURO MEDICO

Abre el link y podrá verificar lo siguiente:

- Receta medica
  - La APP le dará la opción en un mapa de Google cuales son las Farmacias que cuentan con sus medicamentos de manera completa
  - Cual es la Farmacia mas cerca de su ubicación georreferenciada
  - Cual es el costo de los medicamentos de la receta solicitada
  - Si quiere que los medicamentos se envíen por delivery a la ubicación DOMICILIO o TRABAJO
- Orden para Laboratorio de Análisis de Sangre
  - La APP le dará la opción en un mapa de Google cuales son las empresas de Laboratorios que realizan esos estudios de manera completa
  - Cual es la empresa de Laboratorios mas cercana de su ubicación georreferenciada.
  - Cuales son los horarios permitidos que aceptan la toma de sangre que requirió el medico
  - Especificaciones técnicas de cuantas horas mínima tiene que estar en ayunas, etc. (este detalle nos los dará la empresa para cada análisis y se registrará en la APP para que cuando soliciten ese estudio arroje de manera automática los datos del estudio requerido)
  - Cuál es el costo de los análisis de sangre del requerimiento médico
- Orden para análisis clínicos (Rayos X, Resonancia, ecografía)
  - La APP le dará la opción en un mapa de Google cuales son las empresas de análisis clínicos que realizan esos estudios de manera completa
  - Cuál es la empresa de análisis clínicos más cercana de su ubicación georreferenciada.
  - Cuáles son los horarios permitidos que aceptan la toma de análisis clínicos que requirió el médico
  - Especificaciones técnicas de cuantas horas mínima tiene que estar en ayunas, etc. (este detalle nos los dará la empresa para cada análisis y se registrará en la APP para que cuando soliciten ese estudio arroje de manera automática los datos del estudio requerido)
  - Cuál es el costo de los análisis clínicos del requerimiento médico

#### SIMULACION CON UN PACIENTE SI CUENTA CON SEGURO MEDICO

Abre el link y podrá verificar lo siguiente:

- Receta medica
  - La App al recibir el requerimiento de medicamentos por parte del médico, envía de manera automática la solicitud de Aprobación a la compañía de seguro.
  - la App minutos después recibe la respuesta por parte del seguro de la siguiente manera:
  - **APROBACION PARCIAL**
    - De los 5 medicamentos aprueban 3 y 2 No son Aprobados
    - Los 2 medicamentos no aprobados se tienen que detallar el motivo porque NO fueron aprobados según póliza (este detalle envía el seguro)
    - La APP le dará la opción en un mapa de Google cuales son las Farmacias que cuentan con sus medicamentos de manera completa
    - Cuál es la Farmacia más cerca de su ubicación georreferenciada
    - Cuál es el costo del deducible de los medicamentos de la receta aprobada y cuál es el costo del medicamento que no fue aprobado.
    - Si quiere que los medicamentos se envíen por delivery a la ubicación DOMICILIO o TRABAJO
  - **APROBACION COMPLETA**
    - La APP le dará la opción en un mapa de Google cuales son las Farmacias que cuentan con sus medicamentos de manera completa
    - Cuál es la Farmacia más cerca de su ubicación georreferenciada
    - Cuál es el costo de los medicamentos de la receta aprobada y cual es el costo del deducible que tiene que asumir el paciente
    - Si quiere que los medicamentos se envíen por delivery a la ubicación DOMICILIO o TRABAJO
- Orden para Laboratorio de Análisis de Sangre
  - La App al recibir el requerimiento de Laboratorios por parte del médico, envía de manera automática la solicitud de Aprobación a la compañía de seguro.
  - la App minutos después recibe la respuesta por parte del seguro de la siguiente manera:
  - **APROBACION PARCIAL**
    - De los 8 laboratorios aprueban 5 y 3 No son Aprobados
    - Los 3 laboratorios no aprobados se tienen que detallar el motivo porque NO fueron aprobados según póliza (este detalle envía el seguro)
    - La APP le dará la opción en un mapa de Google cuales son los laboratorios que cuentan con su requerimiento de manera completa
    - Cuál es el Laboratorio más cerca de su ubicación georreferenciada
    - Cuál es el costo del deducible de los laboratorios aprobados y cuál es el costo de los Laboratorios que no fueron aprobados.
  - **APROBACION COMPLETA**
    - La APP le dará la opción en un mapa de Google cuales son los Laboratorios que cuentan con su requerimiento de manera completa
    - Cuál es el Laboratorio más cerca de su ubicación georreferenciada
    - Cuál es el costo de los Laboratorio de la receta aprobada y cuál es el costo del deducible que tiene que asumir el paciente
- Orden para análisis clínicos (Rayos X, Resonancia, ecografía)
  - La App al recibir el requerimiento de Análisis Clínicos por parte del médico, envía de manera automática la solicitud de Aprobación a la compañía de seguro.
  - la App minutos después recibe la respuesta por parte del seguro de la siguiente manera:
  - **APROBACION PARCIAL**
    - De los 3 análisis clínico aprueban 2 y 1 No es Aprobado
    - El 1 análisis clínico no aprobado se tiene que detallar el motivo porque NO fue aprobado según póliza (este detalle envía el seguro)
    - La APP le dará la opción en un mapa de Google cuales son las empresas de análisis clínicos que cuentan con su requerimiento de manera completa
    - Cuál es el análisis clínico más cerca de su ubicación georreferenciada
    - Cuál es el costo del deducible de los análisis clínicos aprobados y cuál es el costo de los análisis clínicos que no fueron aprobados.
  - **APROBACION COMPLETA**
    - La APP le dará la opción en un mapa de Google cuales son las empresas de análisis clínicos que cuentan con su requerimiento de manera completa
    - Cuál es la empresa de análisis clínicos más cerca de su ubicación georreferenciada
    - Cuál es el costo de los análisis clínicos aprobados y cuál es el costo del deducible que tiene que asumir el paciente

---

## MODULO MEDICO

### Registro en la App (Medico nuevo)

- Detalla su nombre completo (INCOMPLETO - falta tercera casilla para nombres)
  - Tiene que existir 3 espacios para guardar nombres y otros que indique Apellido paterno y apellido materno (esto para tener los datos correctos) (INCOMPLETO: hay 2 casillas de nombre, falta la tercera — misma deriva que el paciente)
- Detalla su CI como exigencia (INCOMPLETO - el CI es opcional para el profesional)
  - la app tiene que tener como opciones para que el paciente elija la terminación del CI, como SC, LP, CB, etc., colocando con esto solo el número de su cedula el paciente al registrarse, con esto evitamos duplicidad o error del Departamento de la emisión de la cedula (COMPLETO)
- Detalla su fecha de nacimiento (COMPLETO)
- Detalla su ocupación (INCOMPLETO - falta campo de ocupación, catálogo normado y automatización)
  - Bajar la base de datos del SEGIP y dejar uno al final libre para que él pueda detallar la ocupación que no encontró si no está en ese detalle. (FALTA: sin campo; y el catálogo es de 64, no las 896 del SEGIP)
  - Tiene que tener 3 espacios adicionales a la profesión para colocar las especialidades del medico (hay muchos que tiene 2 y 3 especialidades) (COMPLETO: 3 casillas; la lista de especialidades no se filtra por profesión)
  - Tiene que existir al inicio una lupa de buscar para que pueda escribir su profesión u ocupación y ayude a buscar las 896 opciones que definió el SEGIP las ocupaciones en Bolivia. (FALTA: sin campo de ocupación no hay buscador) (CHARLAR)
  - Al seleccionar la profesión del Doctor tiene que de manera automática cambiar abajo en MATRICULA QUE SEA ODONTOLOGO y lo mismo para el REGISTRO DEL COLEGIO MEDICO O COLEGIO DE ODONTOLOGO de forma automática, para que con esto nosotros conozcamos el numero de MATRICULA de que profesión de manera exacta. (INCOMPLETO: cambia el colegio preseleccionado, no el rótulo; la API guarda el colegio como texto libre) (CHARLAR)
- Edad (la app tiene que arrojar de manera automática la edad del paciente con la fecha de nacimiento ingresada) (COMPLETO)
- Numero celular personal o privado (INCOMPLETO - se mezcla con el de trabajo)
- Correo electrónico personal o privado (INCOMPLETO - es el mismo de acceso)
- Dirección de domicilio (INCOMPLETO - no distingue domicilio de trabajo)
- Ubicación GPS Domicilio (INCOMPLETO - no se captura)
- Numero celular trabajo (INCOMPLETO - no hay segundo teléfono)
- Numero fijo trabajo (INCOMPLETO - faltante)
- Dirección de trabajo (INCOMPLETO - una sola dirección)
- Ubicación GPS Trabajo (INCOMPLETO - faltante)
- Correo electrónico trabajo (INCOMPLETO - un único correo)
- Título Profesional Universitario (INCOMPLETO - falta pantalla para institución y carga de PDF)
  - Tiene que tener opción para 2 títulos de carrera diferentes (yo conozco médicos con 2 carreras profesionales) (INCOMPLETO: API lista; falta la pantalla)
- Matricula del Ministerio de Salud Nacional (COMPLETO)
- Título de Diplomado (INCOMPLETO - falta pantalla de carga)
  - Tienen que tener espacio para poder subir varios diplomados (INCOMPLETO: idem)
- Título de Maestría (INCOMPLETO - falta pantalla de carga)
  - Tienen que tener espacio para poder subir varios maestría (INCOMPLETO: idem)
- Título de Doctorado (INCOMPLETO - falta pantalla de carga)
  - Tienen que tener espacio para poder subir varios doctorados (INCOMPLETO: idem)
- Título de Especialidad (COMPLETO)
  - Tienen que tener espacio para poder subir varias especialidades (COMPLETO
- Registro de Colegio Medico y Colegio Odontólogos (INCOMPLETO - se guarda como texto libre, falta catálogo)
  - Tiene que cambiar de manera AUTOMATICA el nombre del COLEGIO al seleccionar arriba la profesión del doctor. (COMPLETO: solo en el alta; en la edición del perfil es texto libre)
- Ubicación GPS de cada consultorio de atención en el Google Maps de AloVida (INCOMPLETO - el médico no puede dar de alta múltiples consultorios)

### Registro de sus datos de Facturación

- Registrar el nombre o razón social de la empresa (INCOMPLETO: falta tabla de perfil fiscal del médico en la interfaz)
  - Aquí nuestra APP tiene que tener este detalle en la base de datos para que puedan SOLO SELECCIONAR AL REGISTRAR, UNIPERSONAL, SRL, LTDA, S.A., SOCIEDAD COLECTIVA, SOCIEDAD EN COMANDITA SIMPLE, SOCIEDAD EN COMANDITA POR ACCIONES, SUCURSAL DE SOCIEDAD EXTRANJERA)     Esto con la finalidad de poder tener DATA de cuantos proveedores tenemos con SRL, UNIPERSONAL y S.A. (INCOMPLETO: el catálogo de los 8 tipos existe en la API; ninguna pantalla lo ofrece)
- Adjuntar Constitución de la empresa en PDF (FALTA: solo existe la tabla)
- Registrar el número de NIT (FALTA para el médico; el NIT existe para paciente y aseguradora)
- Adjuntar el NIT en PDF (FALTA)
- Adjuntar el SEPREC en PDF (FALTA)
- Adjuntar la licencia de funcionamiento en PDF (INCOMPLETO: la API acepta acreditaciones con archivo; no hay pantalla de carga ni tipo «licencia de funcionamiento»)
- Adjuntar certificado del SEDES en PDF (FALTA)
- Dirección legal de la dirección registrada (FALTA para el médico)
- Ubicación GPS de la dirección registrada (FALTA para el médico; GPS solo en sucursales)
- Nombre Representante Legal (FALTA: solo existe la tabla)
- Adjuntar Poder del representante legal en PDF (FALTA)
- Correo electrónico del representante legal (FALTA)

### Detalle de sus horarios disponibles para consultas medica

- Aquí el medico registra sus horarios en los hospitales públicos que esta de turno y al registrar estos datos se enlaza de manera AUTOMATICA a su calendario de TRABAJO y ATENCIONES MEDICAS (LA APP TIENE QUE TENER UN CUADRO EN EL CALENDARIO QUE LE PERMITA AL MEDICO DETALLAR SUS HORARIOS) (INCOMPLETO: la plantilla publicada ya es el calendario; la sede no se elige al crear —sale de la asignación del profesional a una sede—; no se distingue hospital público y no hay cuadro semanal en grilla)
- También registra los horarios de atención medica en las diferentes clínicas privadas o centros que atiende al público, para que los pacientes puedan revisar sus horarios y agendar según a disponibilidades (COMPLETO por código; no probado en la app: requiere una agenda publicada)

### Revisión de su Calendario de Citas para consultas Medicas

- El medico puede revisar de manera online su Calendario de Citas con horarios, nombre completo del paciente de forma diaria, semanal y mensual (INCOMPLETO: hay vista diaria y mensual con el nombre; falta la semanal; el listado de `/schedule` no muestra el nombre)
- Mediante la APP el medico puede informar al paciente o los pacientes que se va demorar en el horario de cita agendado para no perjudicarlos (EL PACIENTE RECIBIRA UNA NOTIFICACION DEL COMUNICADO DEL MEDICO) (COMPLETO por código; no probado en la app: el botón aparece solo con agenda propia. Solo aviso dentro d—--------------------------------------------*e la app, sin push ni SMS)
- Si el medico tiene un paciente que se le desmarca en el horario ya confirmado, la APP de manera AUTOMATICA enviara una NOTIFICACION a los PACIENTES que estuvieron revisando horarios para ese mismo día y no consiguieron horario (ayudando con esto al medico a que no pierda el paciente y También al PACIENTE a poder contar con la cita que requería). (INCOMPLETO: hay lista de espera con aviso, pero el paciente debe anotarse y el aviso sale por barrido del worker, no al desmarcar; no es «quienes buscaron ese día»; sin UI del médico)

### Recepción del paciente

Si el paciente es nuevo y no cuenta con USUARIO YA CREADO en la APP

- Detalla su nombre completo (INCOMPLETO: el nombre queda en la cuenta, no en una persona/paciente)
  - Tiene que existir 3 espacios para guardar nombres y otros que indique Apellido paterno y apellido materno (esto para tener los datos correctos) (INCOMPLETO: falta la tercera casilla)
- Detalla su CI como exigencia (FALTA)
  - la app tiene que tener como opciones para que el médico o secretaria elija la terminación del CI, como SC, LP, CB, etc., colocando con esto solo el número de su cedula el paciente al registrarse, con esto evitamos duplicidad o error del Departamento de la emisión de la cedula (FALTA)
- Fecha de nacimiento (FALTA)
- Ingresa su ocupación (FALTA)
  - Bajar la base de datos del SEGIP y dejar uno al final libre para que él pueda detallar la ocupación que no encontró si no está en ese detalle. (FALTA)
  - Tiene que existir al inicio una lupa de buscar para que pueda escribir su profesión u ocupación y ayude a buscar las 896 opciones que definió el SEGIP las ocupaciones en Bolivia. (FALTA)
- Edad (la app tiene que arrojar de manera automática la edad del paciente con la fecha de nacimiento ingresada) (FALTA)
- Numero celular usuario (FALTA: solo pide correo)
- Numero celular persona tutor o autorizada (si no está registr
ado el paciente y tampoco el TUTOR la asistente registra de esa manera y guarda así el registro, posteriormente al recibir el link la persona confirma los datos y enlaza al DEPENDIENTE y al TUTOR con el numero de celular del paciente y el TUTOR) (INCOMPLETO: hay código/link de activación; falta el celular del tutor, la confirmación de datos y el enlace dependiente↔tutor desde esta pantalla)

### Consulta, elaboración de la ficha medica

#### SIMULACION CON UN PACIENTE QUE NO CUENTA CON SEGURO MEDICO

- El medico realiza su Diagnóstico y crea su ficha medica del paciente en la APP quedando guardada y el paciente recibirá un TOUS donde recibirá el aviso de la recepción de su ficha medica creada por el médico. (INCOMPLETO: la ficha y el diagnóstico existen; el aviso al paciente llega recién al cerrar la consulta, no al crear la ficha)
- El medico envía un link al paciente junto con todos los análisis que requiere por separado (Receta medicamentos, Laboratorios, Análisis clínicos, etc.) (INCOMPLETO: receta y pedidos existen y la receta avisa in-app; no hay «link» y la orden de laboratorio no avisa al paciente — TODO en la API)
- El medico recepción los resultados de todo el análisis requerido al paciente para poder evaluar el respectivo diagnostico (INCOMPLETO: los resultados se ven al abrir el expediente; no hay aviso al médico cuando llegan)
- Espera la Re consulta con el paciente para informar el diagnostico final (COMPLETO por código; no probado en la app: es una consulta nueva del mismo episodio)
- Opción de TELECONSULTA (INCOMPLETO: existe API de encuentros virtuales pero faltan brechas de sala de video e interfaz de teleconsulta)
- Emite un nuevo link al paciente con la nueva receta posterior de ver los análisis recibidos (INCOMPLETO: se puede emitir otra receta con aviso in-app; sin link; reemplazar/renovar solo en la API)S
- En la receta emitida detalla todas las indicaciones a tomar sus medicamentos y de forma AUTOMATICA LA APP crea un cronograma de los medicamentos a tomar y LO ENLAZA CON EL CALENDARIO y con ALARMAS de 15min. Y a la hora de cada TOMA, esto mismo se repite para cada medicamento (FALTA: sin cronograma de tomas, calendario ni alarmas en ninguna capa)
- Completa la ficha medica abierta anterior y CIERRA EN LA APP la consulta (COMPLETO por código; no probado en la app: requiere una consulta en curso)

### Facturación y/o pago por la consulta medica

#### SIMULANDO QUE NO TIENE SEGURO

- El medico emite un qr por el monto total de la consulta a pagar (FALTA: no hay cobro de consulta ni QR; los intents de pago son genéricos y sin rol médico)
- Se le consulta si quiere factura y si no quiere se le envía solo un comprobante de pago a su APP de manera directa (un TOUS le informara del pago realizado total) (INCOMPLETO: la API emite factura desde el encuentro pero solo con rol de administrador; sin pregunta, sin comprobante ni aviso; el médico no puede)
- Si el paciente quiere factura se le solicita lo siguiente
  - NIT a nombre de quien se emitirá la factura (INCOMPLETO: el NIT del paciente se guarda en el alta pero no llega a la factura)
  - Nombre o razón social que requiere el paciente (FALTA)
  - La APP tiene que ir guardando los datos de la facturación de cada paciente para que en la próxima se digite solo el NIT la APP rellene de manera directa la razón social y emita la factura de manera directa y envié por un TOUS (ahorrándonos costo de envió por whatsapp) (FALTA)
  - Si ya esta registrado los datos de la facturación del paciente en la APP el medico factura al NIT guardado. (FALTA)

#### SIMULANDO QUE TIENE SEGURO

- El medico emite un qr por el monto del coaseguro de la consulta a pagar (FALTA: hay datos de copago en el catálogo de planes, pero no se calcula ni se cobra nada)
- Se le consulta si quiere factura y si no quiere se le envía solo un comprobante de pago a su APP de manera directa (un TOUS le informara del pago realizado del coaseguro) (INCOMPLETO: ídem M7.1.2)
- Si el paciente quiere factura se le solicita lo siguiente
  - NIT a nombre de quien se emitirá la factura (INCOMPLETO: solo el NIT existe en el perfil; razón social, datos guardados y factura al NIT guardado: nada)
  - Nombre o razón social que requiere el paciente (INCOMPLETO: solo el NIT existe en el perfil; razón social, datos guardados y factura al NIT guardado: nada)
  - La APP tiene que ir guardando los datos de la facturación de cada paciente para que en la próxima se digite solo el NIT la APP rellene de manera directa la razón social y emita la factura de manera directa y envié por un TOUS (ahorrándonos costo de envió por whatsapp) (INCOMPLETO: solo el NIT existe en el perfil; razón social, datos guardados y factura al NIT guardado: nada)
  - Si ya está registrado los datos de la facturación del paciente en la APP el medico factura al NIT guardado. (INCOMPLETO: solo el NIT existe en el perfil; razón social, datos guardados y factura al NIT guardado: nada)
- El monto restante de la consulta que es la parte de la aseguradora de salud se le emite a la compañía de manera directa con el detalle del nombre del paciente para llevar un mejor control (INCOMPLETO: la API tiene reclamos a la aseguradora sin enlace con la consulta/factura; sin pantalla)
- La facturación a la compañía de seguro se puede configurar o programar semanalmente, quincenal o mensualmente (dentro de los plazos que maneja el seguro de recepción de factura) (FALTA: los reclamos se envían de a uno por la API; no hay programación semanal/quincenal/mensual —solo lotes de conciliación manuales de administrador—; sin pantalla)
- El medico puede sacar un informe de cuanto es lo que facturo para el seguro y lo que factura con el deducible incluido, como también lo que facturo a los pacientes sin seguro (INCOMPLETO: Contabilidad muestra el total de consultas pagadas por mes de la práctica; no separa seguro / sin seguro ni deducible)

---

## MODULO FARMACIA

### Registro en la App Datos Legales de la empresa

- Registrar el nombre o razón social de la empresa
  - Aquí nuestra APP tiene que tener este detalle en la base de datos para que puedan SOLO SELECCIONAR AL REGISTRAR, UNIPERSONAL, SRL, LTDA, S.A., SOCIEDAD COLECTIVA, SOCIEDAD EN COMANDITA SIMPLE, SOCIEDAD EN COMANDITA POR ACCIONES, SUCURSAL DE SOCIEDAD EXTRANJERA)     Esto con la finalidad de poder tener DATA de cuantos proveedores tenemos con SRL, UNIPERSONAL y S.A.
- Adjuntar Constitución de la empresa en PDF
- Registrar el número de NIT
- Adjuntar el NIT en PDF
- Adjuntar el SEPREC en PDF
- Adjuntar la licencia de funcionamiento en PDF
- Adjuntar certificado del SEDES en PDF
- Dirección legal de la central
- Ubicación GPS de la dirección central
- Nombre Representante Legal
- Adjuntar Poder del representante legal en PDF
- Correo electrónico del representante legal
- Nombre del Gerente General
- Numero de celular del Gerente General
- Correo electrónico del Gerente General
- Nombre del Gerente Comercial
- Numero de celular del Gerente Comercial
- Correo electrónico del Gerente Comercial
- Nombre del Gerente Marketing
- Numero de celular del Gerente Marketing
- Correo electrónico del Gerente Marketing
- Ubicación GPS de cada sucursal en el Google Maps de AloVida

### Recepción de la Orden de medicamentos

#### Simulando la Orden SIN SEGURO

- Recepciona el pedido por un link y tiene que tener alguna alarma o sonido al llegar el pedido, muy similar a PEDIDOS YA cuando reciben un pedido confirmado y pagado donde verán porque medio se entrega.
- La APP tiene que estar enlazado o sincronizado con el sistema de la empresa de Farmacia donde tenga acceso a los precios e inventario
- El paciente podrá verificar los precios y cantidades solicitada por la ORDEN MEDICA y poder decidir la compra
- También la APP le mostrara las opciones de que Farmacia puede realizar la compra y en que Farmacia esta la RECETA COMPLETA
- El paciente podrá realizar la búsqueda de un medicamento alternativo a la marca que le solicito el medico por un tema de economía (esto mediante el mismo SISTEMA DE LA FARMACIA)
- El paciente decide la opción de compra RECOJO o DELIVERY
  - Si es recojo paga por QR o tarjeta de débito o crédito
  - Si es delivery se envía al lugar que este registrado en su APP.
- La APP intercede en todo el proceso desde la búsqueda del medicamento, el mejor precio, compra y entrega o envió.
- Las Farmacias realizaran un descuento a todos los clientes y usuarios de ALOVIDA por ser parte de la RED (tanto en farmacias como en Super)
- Las comisiones de ventas pactadas para ALOVIDA con las Farmacias se recibirán de forma semanal, la APP le enviara de manera automática un correo y notificación mediante la misma APP un detalle semanal de todas las transacciones realizadas con los montos de venta y la sumatoria total, también enviara el % de comisión y el monto que le corresponde pagar a la APP por sus comisiones
- Factura de manera normal y se envía a través de la APP (factura de manera directa la Farmacia)

#### Simulando la Orden CON SEGURO

- Recepciona el pedido por un link por parte del seguro, donde detalla lo APROBADO Y NO APROBADO
- Lo APROBADO el paciente podrá verificar en que sucursales cuenta con el pedido y ver el precio de los medicamentos
- También podrá saber el monto a pagar por el COASEGURO y poder decidir si RECOGE o envió por DELIVERY
- Los medicamentos NO APROBADOS podrán también ver el precio de los medicamentos y podrá tener la opción de buscar las marcas alternativas más económicas para confirmar su compra
- Puede consolidar el mismo pedido para decidir si RECOGE O se envía por DELIVERY

### COMPRAS DE SUPERMERCADOS

- La APP tendrá una opción de poder ingresar a comprar todo lo disponible en el SUPERMERCADO con descuento especial por ser cliente de ALOVIDA
- Al realizar la compra, tendrá la opción de envió por DELIVERY
- La factura se envía de manera directa al cliente mediante la APP, al igual que la Farmacia
- Los pagos serán mediante QR o Tarjetas de débito o crédito

### MODULO DE PUNTOS

- Este módulo tendrá la opción de poder crear puntos o monedas (el nombre lo decidiremos juntos después) para que esos puntos se puedan canjear con las compras en el SUPERMERCADO
- El monto o % de los puntos por cada compra en la FARMACIA se decidirá cuando se cierre la negociación con la empresa que decidamos (pero el modulo tiene que estar disponible)
- Los puntos o monedas que gane el paciente se informara mediante un TOUS para que no sea molesto para el paciente en la pantalla de su celular
- El paciente podrá decidir cuando canjear sus puntos y de manera sencilla a través de un código o QR que DESARROLLE nuestra APP mostrando en el SUPERMERCADO
- Pueden DUPLICAR o TRIPLICAR los puntos o monedas con las CAMPAÑAS O PROMOCIONES     que se realicen a través de nuestra APP, fomentando con esto mas compras en los SUPERMERCADOS de nuestro socio aliado

### MODULO DE PROMOCIONES

- La APP le permitirá realizar campañas de medicamentos para pacientes que padecen una enfermedad exclusiva o puntual (ejemplo para los diabéticos)
- La APP le permitirá realizar campañas exclusivas para los medicamentos con fecha de caducidad y les llegara de manera puntual a los que padecen de esa enfermedad o compran esos medicamentos de manera continua, evitando con esto que la Farmacias se queden con el inventario y pierdan dinero

---

## MODULO LABORATORIO DE SANGRE

### Registro en la App Datos Legales de la empresa

- Registrar el nombre o razón social de la empresa
  - Aquí nuestra APP tiene que tener este detalle en la base de datos para que puedan SOLO SELECCIONAR AL REGISTRAR, UNIPERSONAL, SRL, LTDA, S.A., SOCIEDAD COLECTIVA, SOCIEDAD EN COMANDITA SIMPLE, SOCIEDAD EN COMANDITA POR ACCIONES, SUCURSAL DE SOCIEDAD EXTRANJERA)           Esto con la finalidad de poder tener DATA de cuantos proveedores tenemos con SRL, UNIPERSONAL y S.A.
- Adjuntar Constitución de la empresa en PDF
- Registrar el número de NIT
- Adjuntar el NIT en PDF
- Adjuntar el SEPREC en PDF
- Adjuntar la licencia de funcionamiento en PDF
- Adjuntar certificado del SEDES en PDF
- Dirección legal de la central
- Ubicación GPS de la dirección central
- Nombre Representante Legal
- Adjuntar Poder del representante legal en PDF
- Correo electrónico del representante legal
- Nombre del Gerente General
- Numero de celular del Gerente General
- Correo electrónico del Gerente General
- Nombre del Gerente Comercial
- Numero de celular del Gerente Comercial
- Correo electrónico del Gerente Comercial
- Nombre del Gerente Marketing
- Numero de celular del Gerente Marketing
- Correo electrónico del Gerente Marketing
- Ubicación GPS de cada sucursal en el Google Maps de AloVida

### Recepción de la Orden de Laboratorio

#### Simulando la Orden SIN SEGURO

- Recepciona el pedido por un link y tiene que tener alguna alarma o sonido al llegar el pedido, muy similar a PEDIDOS YA cuando reciben un pedido confirmado y pagado donde verán porque medio se entrega.
- El laboratorio tendrá la orden médica, donde vera el requerimiento y que medico realizo la solicitud
- La APP tiene que estar enlazado o sincronizado con el sistema de la empresa de Laboratorio donde tenga acceso a los precios de todos los servicios que la empresa realice
- El paciente podrá verificar los precios de solo los ítems solicitados por la ORDEN MEDICA y poder decidir la compra
- También la APP le mostrara las opciones de todos los Laboratorios que pueden realizar los estudios y cuáles están más cerca de su ubicación de su GPS
- Los Laboratorios realizaran un descuento a todos los clientes y usuarios de ALOVIDA por ser parte de la RED
- Las comisiones de ventas pactadas para ALOVIDA con los Laboratorios se recibirán de forma semanal, la APP le enviara de manera automática un correo y notificación mediante la misma APP un detalle semanal de todas las transacciones realizadas con los montos de venta y la sumatoria total, también enviara el % de comisión y el monto que le corresponde pagar a la APP por sus comisiones
- Factura de manera normal y se envía a través de la APP (factura de manera directa el Laboratorio)
- Una vez concluido los estudios el Laboratorio enviara una notificación y correo electrónico al médico y al paciente para que puedan analizar sus estudios

#### Simulando la Orden CON SEGURO

- Recepciona el pedido por un link por parte del seguro, donde detalla lo APROBADO Y NO APROBADO
- Lo APROBADO el paciente podrá verificar en que Laboratorios puede realizarse los estudios aprobados
- También podrá saber el monto a pagar por el COASEGURO y poder decidir
- Los estudios NO APROBADOS podrán también ver el precio con el descuento que tiene la APP para sus clientes
- Puede consolidar el mismo pedido de la orden médica para confirmar los análisis

### MODULO DE PUNTOS

- Este módulo tendrá la opción de poder crear puntos o monedas (el nombre lo decidiremos juntos después) para que esos puntos se puedan canjear con estudios futuros
- El monto o % de los puntos por cada compra en la empresa de Laboratorio se decidirá cuando se cierre la negociación con la empresa que decidamos (pero el módulo tiene que estar disponible)
- Los puntos o monedas que gane el paciente se informara mediante un TOUS para que no sea molesto para el paciente en la pantalla de su celular
- El paciente podrá decidir cuándo canjear sus puntos y de manera sencilla a través de un código o QR que DESARROLLE nuestra APP mostrando en la empresa
- Pueden DUPLICAR o TRIPLICAR los puntos o monedas con las CAMPAÑAS O PROMOCIONES     que se realicen a través de nuestra APP, fomentando con esto más estudios de sus amigos, parientes, etc. En las instalaciones de nuestro socio aliado

### MODULO DE PROMOCIONES

- La APP le permitirá realizar campañas de estudios para pacientes dirigidos que padecen una enfermedad exclusiva o puntual (ejemplo para los diabéticos)
- La APP le permitirá realizar campañas para diferentes estudios con fecha de inicio y fin (solo por 24 horas quien pague tiene reservado los estudios con ese descuento) y les llegara a todos los usuarios que usan la APP, ayudando con esto a facturar mas a nuestros socios aliados y beneficiado aún más a nuestros USUARIOS
- La APP sacara campañas en coordinación con nuestros socios aliados para beneficiar a todos los USUARIOS y convenios con industrias de medicamentos

---

## MODULO ANALISIS MEDICOS (RAYOS X, RESONANCIA, ETC.)

### Registro en la App Datos Legales de la empresa

- Registrar el nombre o razón social de la empresa
  - Aquí nuestra APP tiene que tener este detalle en la base de datos para que puedan SOLO SELECCIONAR AL REGISTRAR, UNIPERSONAL, SRL, LTDA, S.A., SOCIEDAD COLECTIVA, SOCIEDAD EN COMANDITA SIMPLE, SOCIEDAD EN COMANDITA POR ACCIONES, SUCURSAL DE SOCIEDAD EXTRANJERA)      Esto con la finalidad de poder tener DATA de cuantos proveedores tenemos con SRL, UNIPERSONAL y S.A.
- Adjuntar Constitución de la empresa en PDF
- Registrar el número de NIT
- Adjuntar el NIT en PDF
- Adjuntar el SEPREC en PDF
- Adjuntar la licencia de funcionamiento en PDF
- Adjuntar certificado del SEDES en PDF
- Dirección legal de la central
- Ubicación GPS de la dirección central
- Nombre Representante Legal
- Adjuntar Poder del representante legal en PDF
- Correo electrónico del representante legal
- Nombre del Gerente General
- Numero de celular del Gerente General
- Correo electrónico del Gerente General
- Nombre del Gerente Comercial
- Numero de celular del Gerente Comercial
- Correo electrónico del Gerente Comercial
- Nombre del Gerente Marketing
- Numero de celular del Gerente Marketing
- Correo electrónico del Gerente Marketing
- Ubicación GPS de cada sucursal en el Google Maps de AloVida

### Recepción del Ordenes de medicamentos

#### Simulando la Orden SIN SEGURO

- Recepciona el pedido por un link y tiene que tener alguna alarma o sonido al llegar el pedido, muy similar a PEDIDOS YA cuando reciben un pedido confirmado y pagado donde verán porque medio se entrega.
- La empresa de estudios clínicos tendrá la orden médica, donde vera el requerimiento y que medico realizo la solicitud
- La APP tiene que estar enlazado o sincronizado con el sistema de la empresa de análisis clínicos donde tenga acceso a los precios de todos los servicios que la empresa realice
- El paciente podrá verificar los precios de solo los ítems solicitados por la ORDEN MEDICA y poder decidir la compra
- También la APP le mostrara las opciones de todas las empresas de análisis clínicos que pueden realizar los estudios y cuáles están mas cerca de su ubicación de su GPS
- Las empresas de análisis clínicos realizaran un descuento a todos los clientes y usuarios de ALOVIDA por ser parte de la RED
- Las comisiones de ventas pactadas para ALOVIDA con las empresas de análisis clínicos se recibirán de forma semanal, la APP le enviara de manera automática un correo y notificación mediante la misma APP un detalle semanal de todas las transacciones realizadas con los montos de venta y la sumatoria total, también enviara el % de comisión y el monto que le corresponde pagar a la APP por sus comisiones
- Factura de manera normal y se envía a través de la APP (factura de manera directa la empresa de análisis clínicos)
- Una vez concluido los estudios clínicos se enviará una notificación y correo electrónico al médico y al paciente para que puedan analizar sus estudios

#### Simulando la Orden CON SEGURO

- Recepciona el pedido por un link por parte del seguro, donde detalla lo APROBADO Y NO APROBADO
- Lo APROBADO el paciente podrá verificar en que Laboratorios puede realizarse los estudios aprobados
- También podrá saber el monto a pagar por el COASEGURO y poder decidir
- Los estudios NO APROBADOS podrán también ver el precio con el descuento que tiene la APP para sus clientes Puede consolidar el mismo pedido de la orden médica para confirmar los análisis
- Puede consolidar el mismo pedido de la orden medica para confirmar los análisis

### MODULO DE PUNTOS

- Este módulo tendrá la opción de poder crear puntos o monedas (el nombre lo decidiremos juntos después) para que esos puntos se puedan canjear con estudios futuros
- El monto o % de los puntos por cada compra en las empresas de análisis médicos se decidirá cuando se cierre la negociación con la empresa que decidamos (pero el módulo tiene que estar disponible)
- Los puntos o monedas que gane el paciente se informara mediante un TOUS para que no sea molesto para el paciente en la pantalla de su celular
- El paciente podrá decidir cuándo canjear sus puntos y de manera sencilla a través de un código o QR que DESARROLLE nuestra APP mostrando en la empresa
- Pueden DUPLICAR o TRIPLICAR los puntos o monedas con las CAMPAÑAS O PROMOCIONES     que se realicen a través de nuestra APP, fomentando con esto más estudios de sus amigos, parientes, etc. En las instalaciones de nuestro socio aliado

### MODULO DE PROMOCIONES

- La APP le permitirá realizar campañas de estudios para pacientes dirigidos que padecen una enfermedad exclusiva o puntual (ejemplo para los diabéticos)
- La APP le permitirá realizar campañas para diferentes estudios con fecha de inicio y fin (solo por 24 horas quien pague tiene reservado los estudios con ese descuento) y les llegara a todos los usuarios que usan la APP, ayudando con esto a facturar mas a nuestros socios aliados y beneficiado aún más a nuestros USUARIOS
- La APP sacara campañas en coordinación con nuestros socios aliados para beneficiar a todos los USUARIOS y convenios con industrias de medicamentos

---

## MODULO ASEGURADORA DE SALUD

### Registro en la App Datos Legales de la empresa

- Registrar el nombre o razón social de la empresa
  - Aquí nuestra APP tiene que tener este detalle en la base de datos para que puedan SOLO SELECCIONAR AL REGISTRAR, UNIPERSONAL, SRL, LTDA, S.A., SOCIEDAD COLECTIVA, SOCIEDAD EN COMANDITA SIMPLE, SOCIEDAD EN COMANDITA POR ACCIONES, SUCURSAL DE SOCIEDAD EXTRANJERA)      Esto con la finalidad de poder tener DATA de cuantos proveedores tenemos con SRL, UNIPERSONAL y S.A.
- Adjuntar Constitución de la empresa en PDF
- Registrar el número de NIT
- Adjuntar el NIT en PDF
- Adjuntar el SEPREC en PDF
- Adjuntar la licencia de funcionamiento en PDF
- Adjuntar certificado del SEDES en PDF
- Dirección legal de la central
- Ubicación GPS de la dirección central
- Nombre Representante Legal
- Adjuntar Poder del representante legal en PDF
- Correo electrónico del representante legal
- Nombre del Gerente General
- Numero de celular del Gerente General
- Correo electrónico del Gerente General
- Nombre del Gerente Comercial
- Numero de celular del Gerente Comercial
- Correo electrónico del Gerente Comercial
- Nombre del Gerente Marketing
- Numero de celular del Gerente Marketing
- Correo electrónico del Gerente Marketing

### Recepción de solicitudes de ordenes de Aprobación

- Nuestra APP tiene que estar configurada con el sistema de las aseguradoras, donde solo nos configuren lo que el seguro APRUEBA y NO APRUEBA.
- A la APP no le interesa las condiciones tiene el Seguro con sus Clientes, lo único que nos interesa es lo que APRUEBA y NO APRUEBA.
- Cuando se recepcione una solicitud de APOBACION necesitamos que de manera AUTOMATICA la APP responda con APROBADO y NO APROBADO indicando por qué no está APROBADO según la clausula del contrato y porque tiene excepción de alguna enfermedad según su contrato o póliza.
- La APP solo necesita que su usuario o paciente este informado porque no SE APROBO, que después vaya a reclamar a la compañía es otro problema.
- Quiero que en el modulo de seguros tengamos una opción para poder llamar mediante Whatsapp directo a la compañía de seguro (la misma compañía nos dará el numero de llamada o call center) y el usuario llamara desde su mismo numero de whatsapp (igual que los links de ventas en las redes que te lleva directo, pero con tu misma línea)

### MODULO DE PROMOCIONES

- En alianza con las empresas importadoras de medicamentos y fabricantes de medicamentos se realizarán campañas de la mano del seguro, el objetivo es la prevención de las enfermedades, AYUDANDO CON ESTO a que no suban las PRIMAS y el seguro NO EROGUE DINERO en la gestión por estas enfermedades.
- Se realizarán campañas de la mano de las empresas de Laboratorios para prevenir enfermedades, ayudando con esto las enfermedades y erogar dinero por estas enfermedades.

---

## MODULO DE REPORTES Y DATA DE TODA LA APP

- La app contara con información de siniestralidad de todos nuestros usuarios
- Contará con datos de gastos por persona de forma mensual, anual, que estudios se realiza frecuentemente, las frecuencia de los estudios, frecuencias de visita a cada médico, que enfermedad cuenta, cuantas veces se enfermo en el año, que medicamentos consume seguido, cuanto dinero gasta en medicamento, cuantos pacientes padecen por tipo de enfermedad, cuantos pacientes son vacunados, cuantos pacientes sufren de algún síndrome, etc.
- Con estos datos que la APP tendrá se pueden hacer campañas obligatorias de prevención (vacunación, etc.) AHORRANDO CON ESTO CANTIDADES GRANDES DE DINERO EN TODA LA GESTION
- La compañía de seguro ya no pagar de forma repetidas los tradicionales ESTUDIOS DE LABORATORIOS que pide cada medico en corto tiempo, ya que mostrara el realizado desde la misma APP, ahorrando con esto CANTIDADES GRANDES DE DINERO EN TODA LA GESTION
- Para el cambio de una compañía a otra, nuestra APP contara con todos los datos de siniestralidad ayudando con esto a tener a un clic la información requerida por las aseguradoras
- Nuestra APP se convertiría como un gurú de información de salud de todos los bolivianos de manera activa y actualizada
- Nuestra APP contará con una POLIZA DE SEGURO EXCLUSIVA PARA ALOVIDA donde el costo será bajo, llegando a miles de personas y ampliando el universo de asegurados en toda Bolivia
- Los % de comisiones se conversaran directo con la compañía de seguros para configurar en nuestra APP

---

## MODULO PASARELA DE PAGOS

- Registro en la App de todas las empresas que trabajaran con nuestra pasarela de pagos
- Contrato legal con todas las empresas con las que se trabajaran
- Acuerdo de los % de comisiones que se cobrara por hacer uso de nuestra pasarela de pagos
- Toda transacción de compra y venta se realizarán mediante nuestra pasarela de pagos
- Nuestra propia pasarela realiza la emisión de pagos por QR para el paciente o usuario
- Mediante nuestra pasarela de pagos brindamos seguridad a nuestros propios socios aliados de ALOVIDA
- Todo medico podrá programar los pagos a sus obligaciones mensuales, como alquiler, secretarias, servicios básicos sin tener que preocuparse por eso mes a mes
- Todos nuestros proveedores podrán programar los pagos de comisiones a ALOVIDA según los acuerdos comerciales que se pacten
- Se ofrecerá una comisión menor a todos los socios comerciales para que trabajen de manera directa con nuestra pasarela de pagos propia, ayudando a disminuir el costo mensual a nuestros socios comerciales

---

# Anexos del equipo — esto ya NO es del cliente

> Todo lo que sigue lo escribió el equipo. Está separado a propósito: mezclarlo con el texto de
> arriba haría imposible distinguir el requisito de la interpretación.

## A. Correspondencia con los escenarios `M-01`…`M-19` del paquete

`PERFIL_MANTRA_DEV.md` §5 lista 19 escenarios con IDs auxiliares, y aclara que **no son IDs
oficiales**. Esta tabla muestra a qué sección de arriba corresponde cada uno.

| ID auxiliar | Escenario, según el paquete | Sección de este documento |
|---|---|---|
| M-01 | Registro con tres nombres, apellidos, CI/departamento y edad derivada | Paciente → Registro por su cuenta (nombre completo, CI, fecha de nacimiento, edad) |
| M-02 | Tutor/dependiente e invitación que recupera la misma ficha | Paciente → celular de tutor · Médico → Recepción del paciente (enlace dependiente↔tutor) |
| M-03 | Datos fiscales y sedes múltiples | Paciente → Datos de facturación · Médico → Registro de datos de Facturación |
| M-04 | Ocupaciones requeridas por el registro | Paciente → ocupación (SEGIP, lupa, campo libre) |
| M-05 | Médicos: especialidades, títulos, matrículas y documentos | Médico → Registro (títulos, diplomados, maestrías, doctorados, especialidades, colegios) |
| M-06 | Agenda entre sedes, reserva concurrente, cancelación, espera y demora | Paciente → Agendar Hora · Médico → Horarios y Calendario de Citas |
| M-07 | Preparación de estudios | Paciente → Orden de Laboratorio (especificaciones técnicas, horas de ayuno) |
| M-08 | Receta de 5 medicamentos: 3 aprobados y 2 rechazados | Paciente → CON SEGURO → Receta médica → **APROBACION PARCIAL** |
| M-09 | Orden de 8 estudios: 5 aprobados y 3 rechazados | Paciente → CON SEGURO → Laboratorio → **APROBACION PARCIAL** |
| M-10 | Imagen: 3 estudios, 2 aprobados y 1 rechazado | Paciente → CON SEGURO → Análisis clínicos → **APROBACION PARCIAL** |
| M-11 | Atención de orden completa por farmacia/centro | Farmacia → Recepción de la Orden (receta completa, sucursales, inventario) |
| M-12 | Domicilio, trabajo o retiro; entrega y factura | Farmacia → RECOJO o DELIVERY · factura por la APP |
| M-13 | Resultados, correo y notificación al médico y paciente | Laboratorio → notificación al concluir · Análisis médicos → ídem |
| M-14 | Cronograma de medicamentos y avisos 15 minutos antes y a la hora | Médico → Consulta → cronograma con ALARMAS de 15min **(el cliente lo marca `FALTA` en todas las capas)** |
| M-15 | Puntos, saldo, canje comercial de un uso, vencimiento y cancelación | MODULO DE PUNTOS (Farmacia, Laboratorio, Análisis) |
| M-16 | Multiplicadores configurados | MODULO DE PUNTOS → DUPLICAR o TRIPLICAR con campañas |
| M-17 | Supermercado, promociones, lotes por caducar y campañas | Farmacia → COMPRAS DE SUPERMERCADOS · MODULO DE PROMOCIONES (medicamentos por caducar) |
| M-18 | Facturas, comisiones y reportes monetarios | Médico → Facturación · comisiones semanales en Farmacia/Laboratorio/Análisis · MODULO PASARELA DE PAGOS |
| M-19 | Integraciones de precios, inventario y aseguradoras | Sincronización con sistemas de Farmacia y Laboratorio · MODULO ASEGURADORA |

**Los 19 tienen correspondencia. Ninguno queda `SIN CORRESPONDENCIA`.**

### Qué significa eso, y qué no

**Lo que se puede afirmar:** los 19 escenarios que el paquete resume están todos contenidos en
este documento, y varios coinciden en los **números exactos** (5 medicamentos → 3 y 2; 8
laboratorios → 5 y 3; 3 imágenes → 2 y 1; las 896 ocupaciones del SEGIP; los avisos de 15 minutos).

**Lo que NO se puede afirmar:** que este sea el archivo aprobado que `FUENTES_Y_LIMITES.md` declara
no identificado. Coincidir en contenido no prueba identidad de documento: puede ser el original,
una copia, una versión posterior o una anterior. **La ambigüedad `Q-04` del reparto sigue abierta**
y la cierra quien tenga el documento aprobado, no esta transcripción.

**Lo que sí cambia:** Marcelo (Día 1, microtarea M1) buscaba este registro sin tener nada. Ahora
tiene un candidato concreto que contrastar. Eso es un avance real en su lote, no un cierre.

## B. Índice de brechas, con las marcas que declara el cliente

**Estas marcas son del documento del cliente. Nadie de este equipo las verificó contra el código.**
Se cuentan para dimensionar, no para reportar estado (regla 30: leer no es verificar).

| Módulo | Ítems | `COMPLETO` | `INCOMPLETO` | `FALTA` | **Sin marca** |
|---|---:|---:|---:|---:|---:|
| Paciente | 114 | 7 | 6 | 0 | **101** |
| Médico | 88 | 12 | 47 | 27 | 2 |
| Farmacia | 51 | 0 | 0 | 0 | **51** |
| Laboratorio de sangre | 45 | 0 | 0 | 0 | **45** |
| Análisis médicos | 45 | 0 | 0 | 0 | **45** |
| Aseguradora de salud | 29 | 0 | 0 | 0 | **29** |
| Reportes y data | 8 | 0 | 0 | 0 | **8** |
| Pasarela de pagos | 9 | 0 | 0 | 0 | **9** |
| **TOTAL** | **389** | **19** | **53** | **27** | **290** |

Contado con `grep` sobre el cuerpo del documento, no estimado. «Ítems» son las líneas de lista;
«sin marca» es la resta. El conteo del módulo Médico se corrigió: la primera versión de esta tabla
decía 9/28/16 **de memoria** y el conteo real dio 12/47/27.

**El dato más importante de esta tabla es la columna de la derecha.** Seis de los ocho módulos
**no tienen ninguna marca de estado**. Eso puede significar que están sin empezar, o que nadie los
relevó. **No se sabe, y no se va a suponer.** El relevamiento existente cubre Paciente y Médico.

## C. Cómo se usa este documento en el trabajo

1. **Es la fuente de máxima jerarquía** (regla 00 §8). Si el código hace otra cosa, el código está mal.
2. **Ninguna cifra de acá se copia a un seed sin procedencia.** Las 896 ocupaciones del SEGIP, las
   compañías de seguro y los seguros públicos son **catálogos oficiales**: exigen fuente, fecha y
   licencia antes de entrar a la base (regla 97.4). Escribirlos a mano está prohibido.
3. **Nada clínico se infiere.** Dosis, contraindicaciones, interacciones y las «especificaciones
   técnicas de cuantas horas mínima tiene que estar en ayunas» salen de la empresa que las provee,
   como dice el propio documento — no del criterio de quien programa (regla 97.5.4).
4. **Todo lo que este documento pide que la app muestre sobre una persona es PHI.** Nada de eso va
   a logs, a URLs, a capturas ni a un reporte de trabajo (regla 90.2).
5. **El cobro está excluido del alcance del paquete**, pero facturas, NIT, copagos, deducibles,
   comisiones, delivery, puntos, QR de canje, inventario, reportes y promociones **están incluidos**.
   No se elimina una dependencia por su nombre: se determina qué capacidad concreta queda fuera.
