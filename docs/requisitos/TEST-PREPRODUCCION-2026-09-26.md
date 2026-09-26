# Requisito — rama `test` de preproducción, repartida en seis máquinas (2026-09-26)

> **Qué es:** el pedido del propietario, con su texto literal y las aclaraciones que dio al
> responder. **No es un plan**: acá no se decide nada, sólo queda asentado qué pidió y qué
> aclaró, para que ningún carril tenga que adivinar después.
>
> Peldaño de evidencia de este documento: **`DISCOVERED`** — es la transcripción del pedido.

## 1 · El pedido, literal

> «necesito que hagas el mejor plan posible dividiendolo en micro tareas desacopladas en
> cariles independientes de modo que podamos dividir la tarea sin bloqueantes ni
> interependencias, el objetivo es correr automatico todo lo que te pedire.
>
> Requerimientos generales:
> 1. Lleves todo los contratos de mockup a dev frontend.
> 2. Encontrar brechas en el backend que el frontend necesita pero no esta implementado y por
>    tanto es necesario realizar.
> 3. Modificar lo que necesita reforma del backend y frontend para que funcione correctamente
>    absolutamente todo.
> 4. Necesito que dejemos los seeders de arranque que son todos los directorios de datos en la
>    carpeta de markdown.
> 5. Otros requerimientos: Las variables deben ser declarativas y en ingles.
> 6. Debes recargar las skills necesarias para garantizar la maxima calidad de absolutamente
>    todo.
>
> TRAETE LA ULTIMA VERSION MOCKUP Y DEV DEL FRONT Y DEV DEL BACK
>
> NECESITO QUE ME GARANTICES CALIDAD Y QUE NECESITO CALIDAD PREPRODUCCION.
>
> Necesito que cree usuario logeables esta en ./markdown_convertidos/USUARIO_MEDICOS.md. […]
> para pacientes, inventanto lo datos que sean necesarios.
>
> Debes cargar las skills necesarias para deployar todo y entrar en /loop hasta que este
> totalmente healthy en el servidor de contabo […]
>
> DEBES CARGAR TODOS LOS DATOS DE PRUEBA, PERO EN ESPECIAL ESTE ES EL ARCHIVO PARA EL
> DIRECTORIO DE MEDICOS: […] Alianza_Medicos_Habilitados.md
>
> IGUAL TOMA LOS DATOS QUE YA ESTA CARGADOS EN EL MOCKUP. HAY DOCTORES QUE SE REPITEN MAS DE
> UNA VEZ PORQUE EXISTEN EN VARIOS LUGARES DE TRABAJO. LOS DATOS FALTANTES INVENTANTE
> INFORMACION.
>
> LAS CONTRASEÑAS SIEMPRE 12345678
>
> APARTE NECESITO QUE SE CREE UNA RAMA LLAMADA TEST DONDE SUBIRAS LA VERSION FINAL QUE LUEGO
> LA HARAS ESPEJO A DEV, PERO DEPLOYARAS TEST BACK Y FRONT DEFINITIVAMENTE. PRIMERO NECESITO
> VERIFICAR SI ENTENDISTE»

Y al recibir el primer plan, que estaba pensado para una sola máquina:

> «A ver carajo, yo entiendo esto, pero te preguntaba porque ncesito dividirlo a todos mis
> programadores que son en este caso computadoras mejor, son 1 legion, 1 mac mini la actual,
> 1 macbook, 2 Dell Inspirton, 1 Laptop Justin, 1 Acer Aspire 3. **No deben haber bloqueantes
> carajo**»

## 2 · Las cinco aclaraciones que dio, y que cierran cinco ambigüedades

Se le preguntaron seis decisiones antes de ejecutar. Respondió cinco y la sexta la delegó
(«lo mas recomendado»).

| # | Pregunta | Respuesta literal | Cómo se lee |
|---|---|---|---|
| D-1 | ¿Acceso al VPS? | «si accerso completo» | Se autoriza la llave pública de la Mac mini. La contraseña de root **no la tipea el agente**: el `ssh-copy-id` lo completa el propietario |
| D-2 | ¿Los datos personales reales del padrón, en repos públicos? | «No porque no tenemos el dato real, inventatew todo y usa los markdown para complementarlo» | **Todo dato personal se inventa** (cédula, nacimiento, celular, correo, domicilio), determinista y marcado `synthetic`. El markdown aporta nombre, matrícula, especialidad y ocupación |
| D-3 | ¿Los ~900 médicos de las aseguradoras con cuenta logueable? | «Si, pero si le falta algun dato te lo puedes inventar, (coasas que no sean nombres y que sean obligatorias claro)» | Cuenta para cada uno. Lo obligatorio que falte se inventa; **los nombres nunca** |
| D-5 | ¿Dominio del front de prueba? | «Esta bien» (a `https://test.173.249.39.237.sslip.io`) | Ése, sin DNS, igual que la maqueta |
| D-6 | ¿Paralelismo? | «Lo mas recomendado linda» | Queda a criterio técnico: sesiones por máquina, y fan-out de agentes sólo de lectura |

**D-4 y D-8 no se le preguntaron como decisión** porque el plan las resolvió: un solo camino de
seed en el VPS (la cadena de la API) y el espejo `test → dev` lo mergea él.

## 3 · Lo que el pedido NO dice, y por eso no entra

- **Pasarela de pago y delivery**: excluidos por pedido previo (informe de brechas del
  2026-09-24). Donde aparecen se anotan como excluidos.
- **Qué worktrees se borran** de la Mac mini para recuperar disco: es suyo, no del plan.
- **Las ocho decisiones de producto** del informe de brechas (D-A horario flexible, D-B aspectos
  médicos, D-C triage IA, D-D opciones de formularios, D-E liberación de informes, D-F farmacias
  de turno, D-G mostrador del médico, D-I cookie de sesión). Cada carril afectado arranca
  pidiendo la suya y la registra; **ninguno la resuelve por conveniencia**.

## 4 · Lo que el propietario va a mirar para decir que está hecho

Sale de su propio texto, no de una interpretación:

1. Una rama **`test`** en front y API, desplegada en Contabo, **sana**.
2. Que **entre** con las cuentas del padrón y con las de los médicos de Alianza y Nacional,
   clave `12345678`.
3. Que el **directorio de médicos** tenga los médicos reales, y que uno que trabaja en varios
   lugares aparezca **una vez con varias sedes**.
4. Que los **doce markdown** se siembren al arrancar, sin que nadie corra un script a mano.
5. Que el espejo a **`dev`** esté listo para que él lo mergee.
6. Que las seis máquinas puedan trabajar **sin esperarse**.
