# PROMPT MAESTRO DE REFACTORIZACIÓN FRONTEND

## Código limpio y declarativo · Smart / Presentational · Atomic Design · Reutilización semántica · Catálogo real de `mockup`

**Uso:** entrega este archivo completo a Codex o Claude Code dentro del repositorio frontend. Es una instrucción de implementación por incrementos; no pide generar otro metaprompt. Si solicitas únicamente diagnóstico o planificación al entregarlo, ese alcance prevalece.

**Proyecto de referencia:** `mdavila-2001/mantra-core-health`. **Rama de referencia:** `mockup`.

**Procedencia:** elaborado a partir de `01_METAPROMPT_MAESTRO(1).md`, proporcionado por el usuario. Las rutas, versiones, nombres y hallazgos heredados son antecedentes que el ejecutor debe verificar. Este documento no certifica una auditoría nueva del repositorio ni pruebas ejecutadas sobre la aplicación.

**Autonomía del documento:** contiene las reglas necesarias para comenzar; no depende de que el ejecutor disponga del archivo anterior.

---

## 1. Misión: transforma el código y demuestra el resultado

Actúa como arquitecto principal y responsable de implementación frontend, especializado en Angular, interfaces tipadas, composición de componentes, accesibilidad y regresión. Trabaja con la disciplina de quien debe mantener el sistema durante años.

Refactoriza el alcance acordado para que cada pieza tenga una responsabilidad comprensible, las reglas comunes tengan una implementación canónica y las pantallas se construyan mediante composición declarativa. Conserva el comportamiento y la apariencia de referencia salvo correcciones expresamente justificadas dentro del alcance.

Tu trabajo debe producir estos resultados observables:

1. Contenedores **smart** que conectan casos de uso, navegación, estado de aplicación y efectos.
2. Componentes **presentational/dumb** con entradas explícitas, salidas tipadas y comportamiento de interfaz independiente del backend.
3. Átomos, moléculas y organismos clasificados por su función compositiva, no por tamaño ni carpeta.
4. Reutilización de **reglas, anatomía, contratos e interacción**, incluso cuando los consumidores tienen CSS diferente.
5. Consumidores reales migrados a la implementación canónica; las piezas anteriores se retiran cuando su uso está resuelto.
6. Un catálogo que monta las mismas implementaciones que usa `mockup`, con contratos válidos, hijos reales y eventos comprobables.
7. Evidencia que permite distinguir qué se inspeccionó, qué se cambió, qué se ejecutó y qué sigue pendiente.

**Definición operativa de código limpio:** una persona puede localizar una regla, comprender su dueño, seguir el flujo de un evento y cambiar una conducta sin recorrer capas innecesarias ni sincronizar copias del mismo conocimiento.

**Definición operativa de código declarativo:** la vista expresa qué renderizar a partir de un estado explícito; los valores derivados expresan relaciones; las intenciones activan operaciones nombradas; los efectos se concentran en lugares identificables. La mecánica imperativa necesaria para DOM, red o integraciones permanece encapsulada.

No declares perfección. Demuestra claridad, adopción y ausencia de regresiones dentro del alcance realmente verificado.

## 2. Inicio, autorización y fuente de verdad

### 2.1 Verifica el entorno antes de decidir

Lee `AGENTS.md`, instrucciones locales, manifiestos, configuración, scripts, lockfile y convenciones. Registra remoto, rama, SHA, estado del árbol de trabajo, versiones resueltas y comandos disponibles. Identifica cambios ajenos y archivos generados.

La base funcional y visual es `mockup`, no `dev` ni la rama por defecto. Trabaja en un checkout o worktree de trabajo derivado de la referencia acordada, siguiendo las reglas del entorno. No reviertas cambios ajenos ni uses limpieza destructiva para obtener una base cómoda.

El documento original registró el SHA `5a0776c66b005ad4d2d6722321e933cd7adea621`. Es una referencia histórica: no es una orden de resetear el repositorio. El análisis actual debe anclarse en el SHA efectivamente inspeccionado.

El manifiesto descrito en el antecedente declaraba Angular `^21.2.0`, herramientas Angular `^21.2.11`, TypeScript `~5.9.2`, Yarn `4.18.0`, Vitest, Playwright y Cypress. Confirma lo instalado y resuelto. No copies APIs de una versión posterior, no actualices dependencias para facilitar la refactorización y no mezcles gestores de paquetes.

### 2.2 Ejecuta dentro del alcance solicitado

Cuando este prompt sea el encargo de implementación, inspecciona, propone el incremento concreto, implementa y verifica conforme a las autorizaciones y reglas del entorno. No conviertas cada decisión reversible en una nueva pregunta. Una decisión arquitectónica mayor o un cambio de comportamiento fuera del alcance debe quedar explícito antes de ejecutarse.

No publiques, despliegues, hagas merge ni modifiques contratos del backend por el hecho de recibir este prompt. No instales herramientas o dependencias nuevas cuando las existentes permitan resolver el trabajo. Documenta necesidad y compatibilidad de cualquier incorporación imprescindible.

Si no tienes acceso al repositorio, no inventes rutas, contratos, consumidores ni resultados. Entrega las decisiones generales aplicables, identifica la dependencia faltante y marca la parte específica como pendiente. No presentes una arquitectura hipotética como refactorización completada.

### 2.3 Conserva las decisiones del producto

Preserva navegación, responsive, temas, tokens, formularios, estados y semántica accesible. En los flujos donde existan, conserva edición en modales, consulta como formulario no editable, ubicaciones multivalor y contexto de diagnóstico/encuentro en registros o adjuntos. Verifica la implementación antes de modificarla.

No agregues campos, restricciones de formato, categorías ni reglas clínicas por intuición. La autorización efectiva sigue en el backend; el frontend recibe y representa capacidades sin sustituir esa validación.

Usa datos sintéticos coherentes para fixtures y evidencias. No reproduzcas datos clínicos, credenciales ni tokens reales.

## 3. Tres ejes independientes para clasificar cada componente

Clasifica cada componente con una terna: **responsabilidad × composición × ámbito**. Registra la apariencia como una dimensión adicional de variación, no como identidad del componente.

### 3.1 Responsabilidad: quién decide

| Pieza | Responsabilidad propia | Señales de una responsabilidad incorrecta |
|---|---|---|
| Contenedor smart | Conectar ruta, capacidades, caso de uso y modelo de vista; traducir intenciones | Renderizar todas las celdas, repetir validadores, acumular toda la lógica de la funcionalidad |
| Aplicación / fachada cohesiva | Coordinar operaciones, estado remoto, concurrencia y resultados | Convertirse en un almacén de utilidades, plantilla disfrazada o fachada de múltiples dominios |
| Regla pura de dominio | Evaluar una política con entradas y salida explícitas | Consultar DOM, inyectar sesión o realizar HTTP |
| Adaptador | Traducir un contrato externo y realizar I/O | Determinar cómo se compone una pantalla |
| Presentación | Renderizar contrato, gestionar interacción local y emitir intención | Elegir endpoints, buscar al paciente activo en sesión, persistir datos de negocio |
| Comportamiento de UI compartido | Encapsular una interacción repetida: foco, selección o teclado | Incorporar políticas clínicas o necesitar conocer una página concreta |

Un presentational puede usar inyección de infraestructura UI, traducción, signals, directivas, accesibilidad y estado local. No lo clasifiques como smart por tener `inject`, un método o una suscripción. Inspecciona la dependencia real y sus dependencias transitivas.

Un organismo de dominio puede conocer tipos puros de su dominio. Eso no obliga a volverlo genérico ni le permite ejecutar persistencia.

### 3.2 Composición: qué unidad representa

| Nivel | Criterio | Ejemplos candidatos, sujetos al código existente |
|---|---|---|
| Átomo | Unidad mínima con contrato y propósito propio | Botón, indicador de estado, control de entrada existente |
| Molécula | Interacción pequeña y coherente | Campo con etiqueta/error, búsqueda, fila de contacto |
| Organismo | Sección funcional reconocible con anatomía y contrato | Tabla de resultados, diálogo de contenido, sección de adjuntos |
| Template/layout | Distribución de regiones y contenido | Estructura de directorio o detalle |
| Página | Entrada de navegación que conecta casos de uso y composición | Pantalla de una funcionalidad |

No extraigas cada `div`, icono interno o etiqueta. No impongas un nivel intermedio vacío para completar la taxonomía. Un organismo puede componer otros organismos cohesivos; los ciclos y el conocimiento indebido entre funcionalidades están prohibidos.

### 3.3 Ámbito: quién puede reutilizarlo

- **Privado:** implementación de un componente o una pantalla.
- **Funcionalidad:** compartido dentro de una capacidad del producto.
- **Dominio:** compartido por usos con la misma semántica de negocio.
- **UI genérica:** independiente de entidades, sesión y políticas del producto.

Promueve al ámbito más estrecho que satisfaga los consumidores verificados. No conviertas todo en `shared` ni dupliques una pieza madura para ajustarla a nombres de carpetas.

## 4. Reglas de arquitectura y propiedad del estado

Mantén la organización por funcionalidad y las bibliotecas existentes que ya funcionan. Adapta estas relaciones al repositorio sin imponer nuevas capas por ceremonia:

| Origen | Dependencias legítimas | Dependencias rechazadas |
|---|---|---|
| Página / contenedor | Aplicación, contrato de vista, organismos | Detalles de renderizado duplicados de los organismos |
| Aplicación | Reglas puras, contratos, clientes o puertos justificados | Componentes visuales, fixtures del catálogo |
| Adaptador | Contrato externo, cliente y mapping externo | Organismos, decisiones visuales |
| Presentación genérica | Tipos de UI, comportamiento UI, piezas inferiores | Features, sesión, persistencia, clientes de negocio |
| Presentación de dominio | Tipos puros del dominio y UI compartida | Clientes remotos y estado global implícito |
| Átomos | Utilidades UI y contratos mínimos | Moléculas, organismos, páginas |
| Moléculas | Átomos y otras piezas cohesivas sin ciclos | Organismos y páginas |
| Catálogo | Componentes canónicos, hosts y adaptadores de prueba | Implementaciones visuales clonadas |
| Producto | Sus dependencias de producción | Infraestructura exclusiva del catálogo |

No prohíbas `core/**` de forma ciega: un tipo puro y un cliente clínico no son equivalentes. Comprueba también imports transitivos, barrels y aliases.

Para cada estado mutable responde por escrito: **quién lo crea, quién puede cambiarlo, quién lo lee, qué lo invalida y cuándo se destruye**.

| Estado | Dueño esperado | Regla de sincronización |
|---|---|---|
| Entidad remota / estado de petición | Aplicación o mecanismo existente de datos | Una fuente canónica; resultados obsoletos no reemplazan los vigentes |
| Parámetros navegables | Ruta o estado sincronizado con ella | Dirección y política de sincronización explícitas |
| Datos derivados | Derivación pura | No mantener otra copia mutable |
| Foco, expansión, resaltado | Presentación o comportamiento UI | Estado local salvo necesidad de control externo |
| Selección | Padre o UI, según contrato | Un solo dueño; identidad estable y reglas entre páginas |
| Borrador | Formulario o contenedor, según flujo | Política explícita ante cambios externos y cierre |
| Guardado y error remoto | Aplicación | La UI no inventa éxito al emitir una intención |

No introduzcas fachada, repositorio, puerto y adaptador para cada componente. Una extracción debe eliminar complejidad repetida o encapsular una variación real. Si una capa solo reenvía todos los métodos y obliga a conocer lo mismo, simplifica.

## 5. Estándar exigible de código limpio y declarativo

### 5.1 Una sola representación de cada hecho

Deriva contadores, visibilidad, selección visible, etiquetas calculadas y capacidades de presentación desde sus fuentes. No mantengas copias que deban actualizarse en varios handlers.

En Angular, utiliza `computed` para derivaciones síncronas sobre signals cuando sea compatible con el proyecto. En flujos RxJS, usa composición de streams y selectores apropiados. No migres todo un subsistema entre paradigmas por estética. Evita conversiones repetidas que creen múltiples suscripciones o fuentes de verdad.

No uses `effect` para copiar rutinariamente un estado a otro que puede derivarse. Reserva los efectos para sincronización necesaria con APIs imperativas; documenta sus entradas, recursos y limpieza. `readonly` y signals de solo lectura no garantizan inmutabilidad profunda: no mutar objetos recibidos sigue siendo una obligación.

### 5.2 Plantillas que describen la interfaz

Una plantilla debe permitir leer regiones, estados y acciones sin ejecutar mentalmente un algoritmo de negocio.

- Usa bindings, bloques de estado y composición con nombres del problema.
- Mueve cálculos de dominio, parsing de respuestas y normalizaciones repetidas a funciones o mappers adecuados.
- Los eventos llaman una operación con intención clara; evita cadenas de asignaciones, varios efectos y navegación en la misma expresión.
- Usa identidad estable para colecciones. No uses el índice cuando los elementos cambian de posición y su identidad importa.
- No construyas arreglos u objetos grandes en cada evaluación ni llames cálculos costosos desde la plantilla.
- No prohíbas todo método o getter: una lectura pura, trivial y estable puede ser más clara que una abstracción adicional.
- Nombra derivaciones cuando mejoran comprensión; no crees una función por cada booleano evidente.

No cambies a `innerHTML` dinámico ni manipulación manual del DOM para reducir líneas. Usa controles nativos y primitivas accesibles existentes cuando expresen la interacción.

### 5.3 Estados posibles y transiciones explícitas

Reutiliza el contrato de estado existente. Evita combinaciones de booleanos que permitan estar cargando, vacío y exitoso simultáneamente si el flujo los considera excluyentes.

Un discriminante es válido cuando representa un conjunto cerrado y real de estados. No lo conviertas en un selector de veinte dominios para justificar un componente universal.

Cada transición relevante tiene evento, precondición, resultado y efecto asociado. Usa una tabla de transiciones cuando haya interacción compleja; una máquina de estados nueva solo se justifica si reduce complejidad comprobable.

### 5.4 Nombres y contratos que eliminan adivinanzas

Prefiere nombres que distingan intención, hecho y resultado. Una salida de UI puede significar `guardarSolicitado`; no debe significar `guardadoExitoso` antes de existir persistencia. Conserva el idioma y las convenciones del repositorio; estos nombres son ejemplos semánticos, no renombrados obligatorios.

No uses `any`, dobles casts, aserciones no nulas sistemáticas ni `unknown as X` para forzar contratos. Valida `unknown` en entradas externas y conserva errores de forma explícita. No confundas una comprobación de TypeScript con validación de JSON recibido en runtime.

Evita bolsas genéricas de configuración y callbacks de negocio disfrazados de props. Las funciones puras tipadas, como identidad de fila o acceso a una celda, sí pueden formar parte de un contrato presentacional.

### 5.5 Efectos y concurrencia correctos

Cada operación asíncrona debe declarar la semántica que necesita: reemplazar una búsqueda anterior, serializar operaciones, permitir concurrencia o impedir envíos simultáneos. Elige mecanismos del stack que cumplan esa semántica.

No apliques cancelación de lectura indiscriminadamente a escrituras: cancelar la suscripción no garantiza cancelar la operación en el servidor. Evita doble envío y conserva las garantías existentes sin modificar el backend.

Limpia suscripciones, listeners, observers, temporizadores y recursos creados por la UI. No uses retardos arbitrarios para ocultar problemas de ciclo de vida o detección de cambios.

### 5.6 SOLID y simplicidad aplicados

- **Responsabilidad única:** una pieza tiene un motivo coherente de cambio; no significa un archivo por línea.
- **Extensión:** permite variaciones reales mediante composición y contratos pequeños; no agregues una bandera por pantalla.
- **Sustitución:** una variante respeta los mismos eventos, estados e invariantes del contrato.
- **Interfaces específicas:** cada consumidor aprende lo necesario para su uso; evita contratos que exigen datos irrelevantes.
- **Dependencias explícitas:** el dominio no conoce UI ni transporte; la presentación no resuelve I/O de negocio.

Prefiere composición a herencia de componentes. Evita bases universales, repositorios genéricos innecesarios y servicios gigantes. No uses límites arbitrarios de líneas como definición de calidad; revisa cohesión, motivos de cambio, dependencias y facilidad de prueba.

**Prueba de valor de una abstracción:** si se eliminara, ¿reaparecería una misma regla en varios consumidores o se descubriría complejidad que estaba bien encapsulada? Si solo desaparece un intermediario que reenviaba todo, probablemente sobra.

## 6. Inventario verificable y mapa de usos reales

Antes de extraer, delimita rutas y funcionalidades. Si no se indicó subconjunto, inventaría los componentes del frontend y migra por oleadas verificables; no confundas completar un piloto con completar todo el alcance.

Para cada componente registra:

- ID estable formado por ruta y símbolo; selector y ubicación de definición.
- Commit analizado, plantilla, estilos y fuente de metadatos.
- Responsabilidad, nivel atómico, ámbito actual y propuesto.
- Inputs, aliases, defaults, transformaciones, outputs, `model`, genéricos y contratos.
- Dependencias directas y transitivas relevantes, formularios, efectos y estado.
- Hijos, directivas, regiones proyectadas y carga dinámica.
- Consumidores directos de producto, usos transitivos, catálogo y pruebas por separado.
- Escenarios existentes, incertidumbres y cobertura de análisis.

Usa `rg` para localizar candidatos. Un análisis de decisiones estructurales debe resolver TypeScript y plantillas con herramientas compatibles con el repositorio; no certifiques composición solo con regex.

No desarrolles un compilador completo antes del primer incremento. Aprovecha lo existente, prioriza el alcance y deja dependencias no resueltas claramente identificadas.

El grafo debe distinguir al menos:

| Relación | Qué demuestra |
|---|---|
| `imports-available` | La pieza está disponible, no necesariamente instanciada |
| `template-instantiates` | Una plantilla utiliza el componente |
| `directive-applied` | Una directiva aporta comportamiento a un nodo |
| `projection-composes` | Un consumidor aporta contenido a una región |
| `dynamic-loads` | Existe una carga dinámica identificada |
| `route-loads` | Una ruta carga una pieza |
| `type-only` | Dependencia de tipos, no uso visual |
| `runtime-observed` | Uso observado en una ejecución identificada |

Resuelve aliases, barrels, reexportaciones, selectores de atributo, plantillas inline, archivos externos y componentes homónimos. Un import no usado, un selector en un comentario o un test no cuentan como consumidor de producto.

Cada uso debe tener archivo, ubicación, tipo de relación y condición de renderizado. Añade ruta de aplicación cuando se pueda verificar. No inventes URLs ni conviertas `unresolved` en ausencia de dependencia.

## 7. Detección de repetición semántica independiente del CSS

### 7.1 Investiga familias, no solo copias de texto

Compara cinco dimensiones:

1. **Propósito:** qué interacción o sección resuelve.
2. **Anatomía:** regiones, orden, hijos obligatorios, slots y semántica DOM.
3. **Contrato:** datos requeridos, intenciones, estados y restricciones.
4. **Comportamiento:** foco, selección, descarte, validación, navegación y transiciones.
5. **Apariencia:** tokens, densidad, color, bordes, disposición y tema.

Las coincidencias textuales y fingerprints normalizados producen candidatos; no deciden equivalencia. Conserva roles, relaciones accesibles, validaciones, eventos, claves de identidad, hooks de comportamiento y diferencias estructurales al normalizar.

Una clase CSS puede ser decorativa, estructural o usada por JavaScript. Identifica su función antes de ignorarla.

### 7.2 Decide qué compartir

| Evidencia | Decisión preferida |
|---|---|
| Mismo contrato, anatomía e interacción; cambia decoración | Una implementación y variantes visuales limitadas |
| Misma interacción, DOM legítimamente distinto | Compartir comportamiento o directiva; conservar composiciones |
| Misma anatomía, políticas de dominio distintas | Compartir estructura UI; conservar reglas fuera |
| Misma política pura, vistas distintas | Compartir función de dominio; no fabricar un organismo |
| Mismo fragmento decorativo, semántica distinta | Compartir tokens o una pieza mínima si aporta valor |
| Una implementación existente ya resuelve el patrón | Adoptarla o extenderla con compatibilidad |
| Diferencias necesitan banderas por funcionalidad | Separar composiciones o rechazar la abstracción |
| Un solo uso complejo necesita separación | Extraer por responsabilidad; no afirmar reutilización |

Tres repeticiones son una señal de investigación, no una cuota. Dos consumidores con reglas estables pueden justificar una extracción. La semejanza de dos formularios no basta para fusionar sus políticas.

### 7.3 Ficha obligatoria de decisión

Cada familia debe declarar miembros y ubicaciones, invariantes de comportamiento/composición, diferencias visuales, diferencias de dominio, pieza canónica existente o nueva, alternativas descartadas, consumidores a migrar, pruebas de equivalencia y riesgo.

Incluye un **contraejemplo**: un caso cercano que la abstracción no debe absorber. Explica qué cambio concreto se haría una sola vez después de extraer y dónde se duplicaba antes.

Prioriza con criterios legibles: repetición de reglas, adopción real, estabilidad del contrato, impacto del cambio y facilidad de validación. No produzcas un porcentaje de similitud que se presente como verdad arquitectónica.

**Estados de la familia:** detectada, analizada, decisión tomada, extracción en curso, consumidores migrados, verificada, retirada o descartada. Mantén pendientes y exclusiones visibles.

## 8. Contrato de composición: reutilizar las reglas de los hijos

El organismo comparte una gramática de composición, no una captura visual. Antes de implementarlo, documenta:

| Elemento | Pregunta que debe quedar respondida |
|---|---|
| Propósito | ¿Qué unidad de interfaz ofrece y qué queda fuera? |
| Partes obligatorias | ¿Qué regiones necesita para ser un uso válido? |
| Partes opcionales | ¿Qué puede omitirse sin romper semántica ni interacción? |
| Cardinalidad | ¿Cuántos encabezados, regiones de contenido o grupos de acciones admite? |
| Orden | ¿Qué orden visual y accesible debe preservar? |
| Propiedad | ¿Qué hijos crea el organismo y qué aporta el consumidor? |
| Extensión | ¿Tokens, variante, contenido proyectado o plantilla tipada? |
| Eventos | ¿Qué intención sale de cada región y quién la procesa? |
| Invariantes | ¿Qué combinaciones de partes o estados son inválidas? |
| Verificación | ¿Qué detecta compilación, fixture, prueba o validación runtime? |

Selecciona el mecanismo más pequeño que mantenga el contrato:

1. Tokens y estilos encapsulados para decoración.
2. Variantes semánticas acotadas para diferencias repetidas y compatibles.
3. Proyección para contenido que pertenece al consumidor.
4. Plantillas con contexto tipado para contenido dependiente de fila, elemento o estado.
5. Una directiva o comportamiento compartido si la estructura debe variar.
6. Composiciones separadas cuando las invariantes son incompatibles.

No expongas todos los nodos internos como slots. No prometas validación estática de cardinalidad o contenido arbitrario cuando el mecanismo del framework no la ofrece: combina diseño, convenciones y pruebas verificables.

En Angular, no trates `ng-content` como una fábrica que decide cuándo crear contenido. La proyección y las plantillas diferidas tienen semánticas distintas; compruébalas en la versión del proyecto. Usa un host tipado cuando la composición necesite referencias de plantilla, formularios o proyección compleja.

## 9. Organismos y composiciones que debes evaluar primero

Esta es una **lista inicial de candidatos**, no un inventario confirmado ni una orden de crear todos. Reutiliza nombres y piezas del repositorio cuando existan. El nivel final depende de la responsabilidad observada; una cabecera puede ser molécula y un directorio puede ser template.

| Familia candidata | Anatomía y reglas compartibles | Lo que debe permanecer fuera | Evidencia necesaria para priorizar |
|---|---|---|---|
| Tabla de datos / `DataTable<Row>` | Columnas, filas, identidad, estados, orden, selección y representación móvil | Endpoints, consulta clínica, política de acceso | Listados con contrato compatible y usos de tabla existentes |
| Directorio / `DirectoryPage` | Cabecera, filtros, resultados, estados y navegación de resultados | Obtención de datos, criterios de dominio y mapeo | Directorios que repiten composición y no solo colores |
| Diálogo / `ContentDialog` | Apertura/cierre, título, contenido, acciones, foco y solicitud de descarte | Guardado remoto y reglas del formulario de dominio | Modales con semántica equivalente y proyección real |
| Host de estados / `ViewStateHost` | Renderizado del contrato de estado y acciones asociadas | Causa remota, autorización y traducción de errores de transporte | Ramas repetidas de estados con el mismo contrato |
| Búsqueda y filtros / `FilterBar` | Campo de búsqueda, controles, filtros activos y restablecer | Construcción del endpoint y algoritmo de dominio | Filtros repetidos con dueños de estado compatibles |
| Cabecera / `PageHeader` | Título, contexto, acciones y comportamiento responsive | Carga de entidades y decisión efectiva de permisos | Cabeceras reales con regiones comunes |
| Sección editable de datos | Etiqueta, contenido en modo consulta, acción de edición y estado visible | Persistencia y reglas específicas de cada dato | Secciones que comparten consulta y edición modal |
| Editor modal de formulario | Contenedor, validez visible, acciones y protección del borrador | Un motor universal de formularios y validación clínica | Flujos con guardado/cancelación compatibles |
| Adjuntos | Selección, lista, metadatos visuales, progreso recibido y acciones | Subida remota, diagnóstico/encuentro y políticas de archivo | Contratos de uploader/dialog y sus consumidores |
| Ubicaciones y contactos | Lista multivalor, elementos de contacto y regiones de ubicación | Decisiones del proveedor de mapas y persistencia | Interacción y estructura repetidas, sin colapsar multivalor |
| Grupos de preguntas | Etiqueta, ayuda, control, opciones, error y agrupación | Reglas médicas específicas y otro motor paralelo | Componentes existentes de formularios de Doctor y consumidores compatibles |
| Detalle con actividad | Cabecera de entidad, secciones y lista temporal si existe | Obtención de eventos y semántica clínica | Repetición demostrada de estructura y navegación |

No consolides `attachment-dialog` y `attachment-uploader` solo por referirse a adjuntos: pueden tener responsabilidades complementarias. No reescribas `DirectoryPage` si ya separa bien presentación y datos.

Cada candidato aprobado debe indicar: prioridad justificada, fuente, nivel/ámbito, contrato, hijos, slots, variantes, consumidores actuales, consumidores objetivo, contraejemplo, pruebas y criterio de adopción. Los no aprobados también llevan motivo.

Las moléculas y átomos necesarios se descubren desde esos usos: campos, búsqueda, acciones, paginación, mensajes o filas. No construyas primero una biblioteca de componentes especulativos para después buscar pantallas que la utilicen.

## 10. Contrato completo de cada pieza extraída o modificada

No se inicia la migración de una familia con entradas y eventos ambiguos. Usa contratos existentes siempre que sean suficientes.

| Área | Contenido obligatorio |
|---|---|
| Identidad | Ruta, símbolo, selector, responsabilidad, nivel, ámbito y versión de contrato cuando corresponda |
| Entradas | Nombre público/alias, tipo, obligatoriedad, nulabilidad, default, transformación y validación |
| Salidas | Nombre, payload, intención, cuándo se emite, cuándo no y consumidor responsable |
| Funciones de entrada | Firma, pureza, estabilidad y significado; no callbacks de persistencia encubiertos |
| Composición | Hijos, cardinalidad, slots, contexto de plantilla y semántica accesible |
| Estado | Dueño, transiciones, derivaciones, actualizaciones externas y limpieza |
| Apariencia | Tokens, variantes permitidas, responsive y responsabilidades del contenedor |
| Errores | Diferencia entre contrato inválido, error de entrada y resultado remoto |
| Compatibilidad | Firmas afectadas, consumidores, adaptador temporal y retirada |
| Evidencia | Escenarios tipados, pruebas de interacción y uso real integrado |

Los objetos de entrada no se mutan. Los identificadores son estables. Los eventos no requieren que el padre inspeccione DOM interno. Los consumidores no tienen que conocer clases CSS privadas ni el orden de llamadas internas.

Un adaptador temporal debe tener consumidores identificados y condición de eliminación. No debe convertirse en una tercera API permanente.

### 10.1 Contrato de formulario

Elige y documenta quién posee el formulario: el contenedor pasa controles tipados, o la vista mantiene un borrador mediante un contrato explícito. No mantengas simultáneamente un borrador autoritativo en ambos lados.

Preserva valores iniciales, `dirty`, `touched`, validación, envío, doble clic, error remoto, cancelar, restablecer y reapertura. Si la entidad cambia mientras se edita, especifica cómo se evita perder un borrador o guardar contra la entidad incorrecta. No elijas silenciosamente una nueva política de negocio.

Con `ControlValueAccessor`, verifica que escritura externa no reemita un cambio de usuario, que el toque se notifique de forma correcta y que se propague el estado deshabilitado. No impongas esa interfaz a componentes que no sean controles.

### 10.2 Contrato de selección y paginación

Especifica identidad, selección por página o global, significado de seleccionar todo, elementos deshabilitados, pérdida de un elemento, cambio de filtro y respuesta atrasada. Conserva paginación por cursor si existe; no la conviertas en paginación por índice para simplificar la demo.

### 10.3 Contrato de guardado y cierre

Guardar es una intención hasta obtener resultado. Un error conserva el borrador según el flujo existente. Cerrar por botón, Escape o fondo respeta la misma política de descarte. Un diálogo no puede eludirla llamando por una ruta interna diferente.

## 11. CSS y variantes: independencia sin pérdida visual

Interpreta «abstraer de su CSS» como separar identidad funcional de decoración. No significa borrar estilos, producir componentes sin apariencia utilizable ni imponer que todas las pantallas se vean iguales.

Clasifica las reglas en:

- **Estructura:** layout, scroll, apilamiento, visibilidad accesible, foco y responsive.
- **Semántica visual:** estado de error, selección, deshabilitado o jerarquía de acciones.
- **Decoración:** color, borde, superficie y detalles configurables por tokens.
- **Contexto:** tema, fuentes, ancho, estilos heredados, portal y contenedor.

Conserva la estructura necesaria en la pieza que la controla. Reutiliza tokens existentes y variantes con significado, como densidad o disposición. No uses nombres de pantallas como variantes de un componente global.

Dos presentaciones distintas pueden compartir núcleo de interacción. Dos colores distintos no justifican duplicar organismo. Dos semánticas DOM incompatibles no deben forzarse en una plantilla única.

Evita nuevas dependencias de selectores privados de hijos, `::ng-deep`, cascadas globales y `!important` como solución por defecto. Las excepciones indispensables deben quedar localizadas y explicadas.

Comprueba estilos de `html/body`, overlays, assets, fuentes, dirección de texto y media/container queries que afecten los escenarios. Un componente correcto aislado puede romperse dentro de su pantalla; valida ambos contextos.

## 12. Catálogo fiel a los componentes reales de `mockup`

### 12.1 Cuatro pruebas independientes de fidelidad

1. **Fuente:** importa la implementación canónica usada por el producto en ese build.
2. **Composición:** monta sus hijos, directivas, slots y providers necesarios.
3. **Interacción:** recibe contratos válidos y sus acciones producen salidas observables.
4. **Apariencia:** reproduce tema, fuentes, viewport y contexto declarado.

No copies HTML, TS o CSS a una demo ni reemplaces una ficha rota con una reconstrucción parecida. «Componente real con datos sintéticos» es correcto; no acredita una integración con API real.

La ficha debe mostrar fuente/commit, responsabilidad, nivel, composición, contratos, variantes, usos directos y transitivos, escenarios y estado de verificación. Desde una familia repetida se debe poder llegar a sus consumidores y a la implementación canónica.

### 12.2 Escenarios explícitos, no props adivinadas

El scanner descubre; una factory y un host tipados explican cómo montar. Faker solo completa datos dentro de invariantes conocidas. No uses `''` para un obligatorio desconocido ni `[]` como prueba suficiente de toda colección compleja.

Funciones, proyección, referencias de plantilla, formularios y referencias de componente se construyen en TypeScript/Angular. El manifiesto JSON guarda referencias a esas factories y hosts, no funciones serializadas.

Valida la edición de inputs. Si un cambio es inválido, muestra el error y conserva el último escenario válido; no marques montaje exitoso tras silenciar `setInput`.

### 12.3 Pilotos indicados por el antecedente

Verifica primero estos casos o justifica pilotos equivalentes mejores:

- **`DataTable<Row>`:** filas coherentes, `ViewState<readonly Row[]>`, columnas compatibles, identidad como función válida, selección/orden/cursor si están en su contrato y outputs conectados.
- **`ContentDialog`:** contenido y acciones proyectadas, apertura, cierre, foco, descarte y limpieza. Un contenedor vacío no acredita el organismo.

El antecedente describe diez variantes de `ViewState<T>`: `route-auth-pending`, `loading`, `empty`, `ready`, `validation`, `forbidden`, `not-found`, `stale`, `offline` y `error`. Relee el tipo actual y conserva sus payloads; no lo sustituyas por `loading/error/success`.

Cuando lo exija el contrato, prueba la acción de siguiente paso del vacío, `asOf` en datos obsoletos y `requestId` en error. No impongas todos esos estados a un átomo que no los necesita.

### 12.4 Aislamiento real

Un nodo dentro de un iframe no implica aislamiento si usa inyectores o servicios del padre. Evalúa una entrada de preview en documento propio, con bootstrap y providers específicos, que importe los mismos componentes canónicos.

Verifica `DOCUMENT`, `window`, overlays, router, temas, estilos, fuentes, almacenamiento y destrucción. El mismo origen puede seguir compartiendo cookies o almacenamiento: usa adaptadores de memoria o un ámbito explícito de preview para las operaciones necesarias.

Las cuentas sintéticas no deben cambiar la sesión anfitriona. Bloquea peticiones de negocio inesperadas y evita mutaciones reales. Cualquier comprobación contra staging se trata como escenario separado y requiere autorización aplicable.

Si hay `postMessage`, valida origen, ventana emisora, tipo, payload e identidad de ejecución. No transportes tokens ni datos clínicos en mensajes o URLs.

Estrechar un `div` o usar zoom no reproduce un viewport. Prueba media queries en un contexto de navegador con el tamaño declarado.

### 12.5 Ciclo de vida y acreditación

Mantén una sola ejecución vigente. Un montaje demorado no puede reemplazar la selección actual. Prueba A→B→A con cargas demoradas y limpia componentes, listeners, observers y timers también cuando el montaje falla.

Distingue: descubierto, escenario disponible, montaje válido, interacción verificada, paridad visual verificada y bloqueado. No reduzcas todas las dimensiones a un check verde.

Cada organismo migrado necesita escenario aislado y verificación en al menos una pantalla real. Si hay dos consumidores comprometidos para demostrar reutilización, verifica ambos. Cuenta catálogo, pruebas y producto por separado.

## 13. Aplicación de los antecedentes técnicos

El archivo de origen describía estos puntos. Son hipótesis de trabajo por releer en el commit actual, no fallos reproducidos en esta entrega:

| Fuente mencionada | Qué verificar | Resultado que debes conseguir si el riesgo sigue presente |
|---|---|---|
| `scripts/generate-component-index.mjs` | Uso de regex, clasificación por ruta y relaciones por imports | Inventario con procedencia, composición diferenciada e incertidumbres visibles |
| `src/app/features/component-stock/component-stock.ts` | Carga dinámica, iframe, estilos e inyectores compartidos; mezcla de responsabilidades | Runtime con responsabilidades claras, errores visibles y ejecución aislada |
| `src/app/core/mock/faker/props.ts` | Heurísticas por nombre/tipo y valores inválidos para contratos complejos | Factories válidas por escenario y fallback marcado como no verificado |
| `DataTable`, `DirectoryPage`, `ContentDialog` | Contratos, proyección, estado y consumidores actuales | Conservar lo útil, corregir contratos y probar adopción |
| `core/view-state/view-state.types.ts` | Variantes y payloads actuales | Una representación consistente del contrato, sin pérdida de estados |

No conviertas mejorar el scanner o el catálogo en una condición para paralizar toda separación de responsabilidades. Desarrolla un incremento vertical de producto y su evidencia con las herramientas fiables disponibles; amplía el automatismo donde aporte cobertura real.

## 14. Método de implementación por incrementos verticales

### Fase 0 — Baseline y selección

Verifica entorno y fuente; identifica consumidores, reglas y estado; ejecuta checks existentes pertinentes y registra fallos previos. Captura las rutas y escenarios que afectará el primer incremento antes de modificarlos.

**Salida:** alcance explícito, inventario suficiente, familia candidata, baseline y riesgos conocidos. No exige resolver todo el frontend antes de comenzar, pero sí conocer los consumidores del contrato que se va a cambiar.

### Fase 1 — Contrato mínimo y evidencia fiable

Especifica entradas, salidas, composición y propiedad del estado. Define fixtures y hosts válidos. Corrige el mecanismo de preview necesario para acreditar los pilotos; conserva bloqueos separados de la integración real.

**Salida:** contrato implementable, escenarios reproducibles y pruebas que detectarían una ruptura.

### Fase 2 — Primera extracción con adopción

Selecciona una familia con reglas compartidas demostradas. Conserva la pieza canónica adecuada o extrae la mínima necesaria. Separa aplicación, reglas y vista. Migra dos consumidores reales si existen. Mantén sus diferencias legítimas de presentación.

**Salida:** misma interacción funcionando en consumidores concretos, una regla común implementada una vez, catálogo real y evidencia de paridad.

### Fase 3 — Oleadas por familia y funcionalidad

Repite el ciclo con prioridades verificadas. Cada oleada incluye contrato, implementación, adopción, prueba y limpieza. Ajusta el diseño a lo aprendido sin crear familias especulativas.

**Salida:** avance medido sobre el alcance original y pendientes identificados.

### Fase 4 — Retirada y prevención

Elimina duplicados cuando todos sus consumidores estén migrados o excluidos justificadamente. Revisa usos estáticos, dinámicos y rutas. Actualiza índices desde su generador. Añade reglas preventivas concretas para los problemas descubiertos.

**Salida:** código anterior retirado sin referencias activas inesperadas, imports válidos, documentación mínima vigente.

### Fase 5 — Cierre del alcance

Ejecuta la matriz pertinente, revisa interacciones de pantallas, contratos, accesibilidad y paridad visual. Comprueba que la distribución de producto no incluye accidentalmente fixtures, credenciales de prueba o infraestructura exclusiva del catálogo.

**Salida:** resultado respaldado por comandos y artefactos; integración y bloqueos separados.

### Ciclo de cada microtarea

1. Identificar regla, dueño y consumidores afectados.
2. Capturar o añadir la prueba de comportamiento pertinente cuando el cambio lo requiera.
3. Definir contrato y elegir reutilización, extensión o extracción.
4. Implementar el mínimo cambio coherente.
5. Migrar consumidores comprometidos.
6. Ejecutar contrato, interacción y comprobaciones pertinentes.
7. Revisar diff, retirar residuos seguros y registrar evidencia.
8. Continuar con la siguiente tarea habilitada.

No migres todos los átomos antes de comprobar una sola pantalla. No declares fin de fase solo porque compila. No inventes pruebas triviales para aumentar conteos; cada prueba debe proteger una conducta o un riesgo real.

## 15. Microtareas y trabajo independiente sin bloquear todo por integración

Cada microtarea debe tener: ID, objetivo observable, prioridad, dueño, fuente, archivos permitidos, nuevos archivos identificados como nuevos, contrato, consumidores, precondiciones, cambio autorizado, pruebas, evidencia, rechazo, dependencias y reversión.

Usa roles separados cuando el entorno y las instrucciones permitan agentes: análisis, contratos, implementación, catálogo, pruebas e integración/revisión. Si trabajas sin agentes, conserva las responsabilidades como pasos secuenciales. No afirmes revisión independiente si fue una segunda pasada del mismo ejecutor.

No asignes escrituras simultáneas sobre un archivo central. Los artefactos generados se regeneran desde sus fuentes. Cada entrega identifica el contrato consumido y la evidencia disponible.

Un contrato mínimo estable permite trabajar con fixtures conformes mientras avanza la integración. Versiona cambios incompatibles y prueba los consumidores afectados. No congeles permanentemente un contrato equivocado.

Clasifica bloqueos: contrato, acceso, entorno, decisión o implementación. Continúa tareas independientes. Una prueba con fixture acredita comportamiento aislado; una integración pendiente conserva su estado pendiente.

## 16. Verificación proporcional, observable y difícil de falsear

### 16.1 Arquitectura y tipos

Comprueba imports prohibidos directos/transitivos, ciclos, contratos de entradas/salidas, fixtures y relación entre índice generado y fuentes. Verifica que producto no importe catálogo ni UI genérica dependa de servicios de negocio.

Si cambias el scanner, verifica los casos que podrían falsear el mapa: alias, barrel, import no usado, selector de atributo, tipo genérico, proyección y carga dinámica identificada. No uses la existencia de `.spec.ts` como prueba ejecutada.

### 16.2 Comportamiento por contrato

Prueba entradas, cambios externos, eventos, cardinalidad relevante, estado local, selección, borradores, errores y limpieza según corresponda. Comprueba que inputs no se mutan y que una intención de usuario no se emite como consecuencia espuria de cargar datos.

Las pruebas atraviesan la interfaz usada por consumidores. No acoples las pruebas a nombres privados, cantidad de métodos o llamadas internas sin razón. No mantengas dos suites duplicadas solo para acreditar una extracción.

### 16.3 Pantallas reales y navegador

Ejecuta escenarios aislados y rutas consumidoras con datos controlados. Valida acciones esenciales: guardar/cancelar, ordenar, filtrar, paginar, seleccionar, reintentar o cerrar solo donde sean parte del contrato.

Revisa errores de consola y solicitudes inesperadas con mecanismos adecuados al entorno. Un `PerformanceObserver` no demuestra por sí solo ausencia de red ni de efectos; considera canales y adaptadores utilizados.

### 16.4 Visual y accesibilidad

Compara baseline y resultado con navegador, sistema, viewport, escala, fuente, tema, locale, reloj y datos equivalentes. Espera assets y fuentes. Controla animaciones para capturas deterministas y conserva pruebas de su comportamiento relevante.

Incluye pantallas pequeñas/escritorio y breakpoints realmente afectados, textos largos, contenido vacío y contenido representativo. No actualices snapshots ni amplíes tolerancias para ocultar regresiones. No enmascares la región modificada.

Comprueba nombre accesible, etiqueta/error, orden de foco, teclado, cierre, restauración de foco y estado deshabilitado según el componente. Combina herramientas automáticas con interacción; no proclames accesibilidad completa por un informe sin infracciones.

### 16.5 Rendimiento cuando exista riesgo

Si cambias colecciones, carga dinámica, dependencias o reactividad, compara bundle, peticiones duplicadas, rerenderizado o interacción frente al baseline pertinente. Mantén lazy loading cuando exista. No impongas porcentajes ni presupuestos universales sin datos.

### 16.6 Comandos y resultados

El antecedente mencionaba `stock:generate`, `audit:vistas`, `lint`, `typecheck`, `build`, `test`, `test:coverage` y `pw`. Verifica scripts, opciones, builders y efectos antes de usarlos. Distingue comandos existentes de scripts que acabas de implementar.

Registra comando exacto, directorio, SHA, fecha, código de salida, resultado y artefactos. Usa estados `passed`, `failed`, `not-run` y `blocked`. Una prueba omitida permanece visible; un fallo previo no se presenta como regresión nueva ni se elimina del informe.

No repitas suites costosas sin un riesgo concreto o un gate pendiente. Al terminar verificación suficiente, continúa con entrega e integración permitida.

## 17. Artefactos mínimos y trazabilidad

Mantén un punto de entrada y evidencia estructurada dentro de la ubicación documental del repositorio. Reutiliza archivos equivalentes si existen. No multipliques documentos que repiten lo mismo.

| Artefacto | Contenido que debe permitir comprobar |
|---|---|
| `REFACTOR_FRONTEND.md` | Alcance, baseline, decisiones, oleadas, estado y cómo reproducir |
| Inventario de componentes | Identidad, responsabilidad, nivel, contratos, dependencias y cobertura |
| Grafo de usos | Relaciones diferenciadas y ubicaciones verificadas |
| Matriz de familias | Reglas repetidas, diferencias, decisión y pieza canónica |
| Contratos de componentes | Entradas, salidas, composición, estado y compatibilidad |
| Matriz de migración | Consumidor previo, implementación destino, pruebas y estado |
| Registro de escenarios | Factory/host, datos, contexto y resultados esperados |
| Registro de ejecución | Comandos, commit, resultados y artefactos reales |

Los nombres de archivos adicionales se adaptan al repositorio. Si generas JSON, define y valida su esquema; no rellenes datos desconocidos con hechos ficticios. Las ubicaciones de evidencia deben existir cuando se marquen como ejecutadas.

Campos mínimos recomendados:

- **Componente:** `schemaVersion`, `componentId`, `sourcePath`, `exportedSymbol`, `selector`, `sourceCommit`, `atomicLevel`, `responsibility`, `scope`, `contracts`, `dependencies`, `scanStatus`, `unresolvedEvidence`.
- **Uso:** `consumerId`, `componentId`, `relation`, `sourceLocation`, `renderCondition`, `productOrSupport`, `verificationStatus`.
- **Familia:** `clusterId`, `members`, `invariantBehavior`, `invariantComposition`, `visualDifferences`, `domainDifferences`, `canonicalComponent`, `decision`, `counterexample`, `migration`, `tests`, `status`.
- **Escenario:** `scenarioId`, `componentId`, `sourceCommit`, `hostSourcePath`, `fixtureFactory`, `fixtureVersion`, `dataProvenance`, `seed`, `fixedClock`, `viewport`, `theme`, `locale`, `timezone`, `expectedState`, `interactions`, `expectedOutputs`, `networkPolicy`, `evidencePaths`.
- **Ejecución:** `checkId`, `command`, `cwd`, `sourceCommit`, `timestamp`, `exitCode`, `status`, `artifacts`, `blocker`.

Define `productOrSupport` para separar producto, catálogo y pruebas. Distingue SHA del commit de hash de contenido. Representa datos desconocidos con un estado explícito permitido por el esquema y su causa.

### 17.1 Procedimientos reutilizables

Conserva seis procedimientos operativos, como secciones de la guía o skills únicamente cuando su creación esté autorizada y sea útil: auditoría semántica, separación smart/presentational, composición atómica, factories de contrato, preview real y migración con evidencia.

Cada procedimiento debe indicar activación, entradas, pasos, salida, verificación y motivos de rechazo. No generes skills decorativas, no afirmes que están instaladas y no construyas cadenas infinitas de delegación. Primero debe existir un flujo concreto que esas instrucciones ayuden a repetir.

## 18. Gates de aceptación que no se compensan entre sí

Una extracción está terminada únicamente si cumple todos los puntos aplicables:

- La responsabilidad de datos/negocio quedó fuera de la presentación y no solo se renombró una clase.
- Cada estado tiene dueño y los derivados no son copias mutables sincronizadas manualmente.
- La plantilla describe regiones y acciones; no contiene orquestación de negocio oculta.
- La abstracción comparte reglas demostradas y conserva diferencias legítimas.
- No se introdujeron dependencias prohibidas, ciclos, interfaces universales ni capas de simple reenvío injustificadas.
- Los consumidores comprometidos usan la implementación canónica y se probaron en contexto.
- El catálogo importa esa misma implementación y la monta con contratos válidos.
- Los outputs esenciales producen resultados observables; no hay acciones decorativas que aparentan persistir.
- Formularios, foco, responsive, navegación y reglas del producto conservan su comportamiento acordado.
- El preview no altera sesión ni datos anfitriones ni ejecuta operaciones reales inesperadas.
- Las implementaciones anteriores se retiraron o sus excepciones tienen consumidor y motivo explícitos.
- Los fallos no se silencian y las pruebas no se relajan para aparentar éxito.
- Los artefactos generados concuerdan con sus fuentes y el build de producto mantiene la separación del preview.
- La evidencia distingue aislado, integrado, visualmente verificado y bloqueado.

Mide componentes inspeccionados/total del alcance, consumidores migrados/comprometidos, familias verificadas, reglas duplicadas eliminadas, escenarios acreditados y rutas comprobadas. Mantén el denominador y explica cambios de alcance.

No confundas líneas eliminadas, carpetas `atoms`, número de componentes o cobertura porcentual con calidad por sí solos. Una abstracción puede agregar líneas y reducir conocimiento duplicado; debe demostrarlo con usos y reglas.

## 19. Revisión adversarial antes de cerrar cada oleada

Responde con evidencia y corrige cualquier respuesta que deje un escape:

1. ¿Se podría aprobar este cambio moviendo archivos sin cambiar responsabilidades?
2. ¿Existe un smart gigante trasladado a una fachada gigante?
3. ¿La UI consigue negocio mediante una dependencia indirecta con nombre inocente?
4. ¿Hay dos estados que representan el mismo hecho y dependen de sincronización manual?
5. ¿El componente nuevo necesita saber qué pantalla lo usa para decidir su conducta?
6. ¿La extracción borra una diferencia real de dominio porque dos formularios se parecían?
7. ¿Una variación decorativa produjo otro organismo completo?
8. ¿El contrato proyectado permite usos inválidos que ningún check detecta?
9. ¿La tabla del catálogo está vacía para evitar probar columnas o funciones requeridas?
10. ¿La demo recrea la pantalla en vez de importar la fuente canónica?
11. ¿El producto todavía usa el duplicado mientras el catálogo muestra la pieza nueva?
12. ¿Un cambio externo pierde un borrador, selección o respuesta vigente?
13. ¿Un cierre evita la protección de cambios sin guardar?
14. ¿Un output se llama éxito aunque solo se emitió una solicitud?
15. ¿El iframe comparte sesión o servicios del padre de manera inadvertida?
16. ¿Un mock exitoso se presenta como integración terminada?
17. ¿Se retiró código sin revisar consumidores dinámicos y rutas?
18. ¿Se declara verificado algo que solo fue inspeccionado estáticamente?
19. ¿El informe oculta pendientes reduciendo el alcance o el denominador?
20. ¿Otra persona puede ubicar una regla y cambiarla sin aprender detalles privados de varios componentes?

## 20. Cómo empezar y cómo entregar

Comienza por confirmar repositorio, `mockup`, SHA e instrucciones. Relee los puntos de entrada descritos, localiza consumidores y delimita la primera familia. Presenta un diagnóstico corto con hechos y supuestos separados. Después avanza por el primer incremento habilitado bajo las autorizaciones aplicables.

No respondas con otro prompt que ordene generar un plan. Cuando exista acceso y autorización para implementar, entrega cambios reales, consumidores migrados y verificaciones. Si el encargo se limitó a planificar, entrega contratos y tareas específicas sin afirmar implementación.

Tu cierre debe indicar, de forma breve:

1. Qué responsabilidades separaste y qué regla quedó centralizada.
2. Qué piezas conservaste, extendiste, extrajiste o decidiste no fusionar.
3. Qué consumidores reales adoptaron cada extracción.
4. Cómo comprobaste identidad del catálogo y paridad en contexto.
5. Qué comandos pasaron, cuáles fallaron y qué no pudo ejecutarse.
6. Dónde están el diff, el punto de entrada y las evidencias.
7. Qué queda pendiente dentro del alcance y por qué.

**Criterio final:** la aplicación expresa sus pantallas mediante composición; las piezas pequeñas no deciden negocio; las reglas compartidas viven en un lugar identificable; el catálogo representa el producto; y el resultado puede comprobarse sin confiar en tu resumen.

---

## Referencias para el ejecutor

Las reglas arquitectónicas y gates de este prompt son una síntesis diseñada para este encargo. Estas fuentes respaldan conceptos concretos, no certifican la arquitectura ni el estado del repositorio:

- Angular documenta `computed` como derivación de solo lectura y advierte que una señal readonly no impide mutaciones profundas. Consulta la documentación compatible con la versión instalada: [Angular Signals](https://angular.dev/guide/signals).
- Angular distingue proyección de contenido y fragmentos de plantilla, y describe las restricciones de `ng-content`: [Content projection](https://angular.dev/guide/components/content-projection).
- Atomic Design describe átomos, moléculas, organismos, templates y páginas como niveles de un sistema de interfaz. La separación smart/presentational de este prompt es un eje arquitectónico adicional: [Atomic Design, capítulo 2](https://atomicdesign.bradfrost.com/chapter-2/).

Consulta de referencias: 21 de septiembre de 2026. La documentación pública evoluciona; verifica compatibilidad antes de incorporar una API.
