# Farmacia como ecommerce — 2026-09-25

> **Este archivo es fuente, no análisis.** Según la regla 00 §8, un requisito explícito del cliente
> es la evidencia de **máxima** jerarquía: gana sobre el comportamiento del código, sobre los tests
> y sobre cualquier documentación de proveedor. Cuando algo de acá choca con lo que hace el sistema,
> **el sistema está mal**, no el requisito.
>
> Lo que **no** es fuente y por eso va en otro archivo: dónde vive cada cosa en el código. Eso está
> verificado, con archivo y línea, en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-25.md`](../verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-25.md).
> El orden de ejecución, las dependencias y el kill-test de cada requisito están en el
> [`PLAN-MAESTRO.md`](../trabajo/2026-09-25-plan-y-reparto-farmacia-ecommerce/PLAN-MAESTRO.md); el plan
> completo (arquitectura, contratos congelados, carriles) en
> [`planes/04-farmacia-ecommerce-2026-09-25/README.md`](../../planes/04-farmacia-ecommerce-2026-09-25/README.md).

## Ficha de procedencia

| Campo | Valor |
|---|---|
| Qué es | El pedido del propietario del producto de reestructurar «Farmacia» del paciente como una tienda con estándar de ecommerce |
| Título del original | No tiene. Es un mensaje dictado en la sesión de trabajo, seguido de cuatro respuestas a preguntas de aclaración |
| Quién lo entregó | El propietario del producto (Justin), directamente en la sesión |
| Cómo llegó | Pegado en la sesión del **2026-09-25**, después de revisar el resultado de los PR #658 y #659 del front («está muy mal integrado y no veo el carrito»), con el pedido explícito de **un plan, no una implementación**, y de que ese plan se reparta en carriles que se puedan ejecutar en automático sin bloqueantes |
| Fecha de redacción del original | 2026-09-25, entre las 00:40 y la 01:30 (hora de la sesión, -04) |
| Versión | Primera transcripción versionada |
| Estado | `REQUIREMENT_APPROVED` en cuanto a su origen. Las lecturas del §2 fueron confirmadas por el propietario en la misma sesión (§3). **Nada de esto está verificado contra el código en este archivo**: eso es el otro documento |
| Sobre qué rama aplica | Front: `origin/mockup` (la maqueta que el propietario mira). Backend: `origin/dev`, sólo para el contrato real del carril 47 |
| Predecesor | Los PR [#658](https://github.com/mdavila-2001/mantra-core-health/pull/658) y [#659](https://github.com/mdavila-2001/mantra-core-health/pull/659) del front (hub «Farmacia» con tres pestañas), que este pedido **reemplaza**. Y `N-02` de [`CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](./CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md) (Cotizaciones del paciente), que este pedido **no toca** |

### Cómo se transcribió — leer antes de usarlo

- El texto del §1 es **palabra por palabra** el que entregó el propietario, con su ortografía. No se corrigió.
- Los identificadores `R1…R8` del §2 los pone este documento para que los prompts los citen; el original no los trae.
- Las aclaraciones del §3 son las respuestas literales del propietario a cuatro preguntas cerradas; la pregunta se transcribe resumida, la respuesta tal cual.

## 1. Lo que dijo el propietario (literal)

> Necesito que realices un plan completo para la re-estructuracion de la farmacia porque lo hiciste completamenete mal. PRIMERO NECESITO VER SI COMPRENDES MI REQUERIMIENTOS. NECESITO QUE PIENSES EN UN ESTANDAR DE ECOMMERCE, POR EJEMPLO LAS TIENDAS DE PEDIDOS YA MARKETS O COMO ALGO ASI COMO AMAZON. En este sentido necesito que tenga carrito, siendo un icono en la parte superior. La cual es por tienda especifica de alguna farmacia especifica. Ahora bien, nefcesito que la pestana farmacia tenga un buscador que permita dos tipos de filtros fundamentales: 1) Por precios 2) Por distancia. En tal sentido, las estrucutas que ya lo tienen (lugares cercanos como pestana deben desaparecer, en realidad dado que esto esta siendo absordbido por cotizaciones toda esta pestana debe desaparecer). Por otro lado, necesito que haya un boton en la parte lateral que permita subir toda una receta completa y que pueda buscar toda la receta con ambos filtros. DEBE PODER REALIZAR POR ABMAS VIAS, ESTO ES UN REQUERIMIENTO FUNDAMENTAL. NECESITO UN PLAN COMPLETO ULTRA DETALLADO DIVIDIO EN MICROTAREAS DE FORMA QUE NUNA JAMAS EXISTA UN BLOQUEANTE Y QUE SE PUEDA REPARTIR EN VARIAS PERSONAS O CARRILES QUE SE PUEDAN EJECUTAR AUTONAMEMNTE EN AUTOMATICO. TEN EN MENTE ESTO COMO UN REQUERIMIENTO. REALIZA UN PLAN NO UNA IMPLEMENTAICION.

Y, sobre el reparto (mensaje siguiente, literal):

> ahor necesito que la repartas las tareas en todos los prgogramadores menos a ender y lo pushees a main porfavor ya mismo esto

## 2. Los requisitos, uno por línea

| ID | Requisito (en una línea) | De dónde sale |
|---|---|---|
| **R1** | Farmacia con estándar de ecommerce (PedidosYa Market / Amazon): una tienda, no una pantalla con pestañas | «NECESITO QUE PIENSES EN UN ESTANDAR DE ECOMMERCE…» |
| **R2** | Carrito como ícono en la parte superior | «tenga carrito, siendo un icono en la parte superior» |
| **R3** | El carrito es por tienda específica de una farmacia específica | «La cual es por tienda especifica de alguna farmacia especifica» |
| **R4** | La pestaña Farmacia tiene un buscador con dos filtros fundamentales: por precio y por distancia | «un buscador que permita dos tipos de filtros fundamentales: 1) Por precios 2) Por distancia» |
| **R5** | Las estructuras que ya lo tienen desaparecen: «Lugares cercanos» sale del menú | «lugares cercanos como pestana deben desaparecer… toda esta pestana debe desaparecer» |
| **R6** | Un botón lateral para subir una receta completa y buscar toda la receta con ambos filtros; **las dos vías (producto por producto y receta completa) son requisito fundamental** | «un boton en la parte lateral que permita subir toda una receta completa… DEBE PODER REALIZAR POR ABMAS VIAS, ESTO ES UN REQUERIMIENTO FUNDAMENTAL» |
| **R7** | El plan es ultra detallado, en microtareas sin bloqueantes, repartible entre personas o carriles que corran en automático | «NECESITO UN PLAN COMPLETO ULTRA DETALLADO DIVIDIO EN MICROTAREAS…» |
| **R8** | Plan, no implementación; repartido entre todos los programadores **menos Ender**; publicado en `main` del prompt manager | «REALIZA UN PLAN NO UNA IMPLEMENTAICION» · «todos los prgogramadores menos a ender y lo pushees a main» |

## 3. Aclaraciones del propietario (misma sesión, literal)

| # | Pregunta (resumida) | Respuesta literal | Efecto |
|---|---|---|---|
| A1 | «Cotizaciones» hoy compara 4 verticales. ¿Desaparece, absorbe las 4, o se queda aparte? | **Se queda como está, aparte** | R5 aplica sólo a «Lugares cercanos». `features/account/cotizaciones/**` no se toca |
| A2 | «Subir una receta completa»: ¿elegir una de la historia clínica, subir un archivo externo, o ambas? | **La receta es la que da el doctor y la que el paciente puede ver en cualquier momento en su hisrtoria medica, fijate como esta modelado todo en back y fornyt** | R6 = elegir una receta emitida en AloVida (resumen clínico). Sin subida de archivos externos |
| A3 | ¿Qué devuelve el buscador: productos (Amazon), farmacias/tiendas (PedidosYa Market), o ambos? | **Ambos modos (recomendado)** | R4 tiene modo Productos y modo Farmacias, cada uno ordenable por precio y por distancia |
| A4 | ¿Dónde va el «botón lateral» de la receta? | **lo mas limpio** | Decisión del plan: dentro de Farmacia, junto al buscador; no un renglón nuevo del menú |

## 4. Lo que el original no dice (y el plan decide, declarándolo)

- Qué pasa al agregar un producto de otra farmacia con carrito lleno → conflicto estándar: vaciar y cambiar de tienda.
- Si el carrito persiste al recargar → sí, por usuario, en el navegador.
- Qué pasa con un medicamento con receta obligatoria en el carrito libre → no entra por la vía A; entra sólo por la vía B (receta).
- Si se muestra un precio en el catálogo → sólo el que publica la sede (`sites/:siteId/prices`); nunca uno inventado.
- Qué pasa con «Imagenología» y «Centros médicos» de «Lugares cercanos» al borrarla → dejan de tener pantalla; se registra como consecuencia aceptada.

Cada una de estas está en la tabla de ambigüedades del prompt de su dueño, con supuesto y quién la cierra.
