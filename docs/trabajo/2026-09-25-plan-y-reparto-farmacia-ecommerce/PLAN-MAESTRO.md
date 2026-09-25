# Plan maestro — Farmacia como ecommerce, noche del 2026-09-25

> **Qué es esto y qué no.** Es la vista consolidada de los ocho requisitos: qué hito los cubre, de quién
> es, de qué depende, en qué orden conviene ir y qué comprobación barata demuestra que **no** está hecho.
> **Las microtareas no viven acá**: viven en el prompt de cada persona
> (`repartos/2026-09-25/PromptNoche/<Persona>/…`), que es donde se ejecutan y se marcan. Duplicarlas sería
> tener dos verdades del estado (regla 20 §6.2). Cada `H*.S*` que se cita acá existe con ese mismo
> identificador en el prompt de su dueño. La arquitectura, los contratos congelados y las decisiones están en
> [`planes/04-farmacia-ecommerce-2026-09-25/README.md`](../../../planes/04-farmacia-ecommerce-2026-09-25/README.md).
>
> - Fuente: [`FARMACIA-ECOMMERCE-2026-09-25.md`](../../requisitos/FARMACIA-ECOMMERCE-2026-09-25.md)
> - Hechos: [`VERIFICACION-CONTRA-CODIGO-2026-09-25.md`](../../verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-25.md)
> - Corte front: `origin/mockup` @ **`bf2c35452363ede1d367f94c4fd726b2b9a63cb1`** (2026-09-25 00:34 -04) · API: `origin/dev` @ **`343795cc2d08745692f491c50e81427215043315`** (00:30 -04)
> - Peldaño de todo lo afirmado acá: **`DISCOVERED`**. Nada se ejecutó.

## 1. Los cuatro carriles de persona (ocho del plan), en una tabla

| Persona | Lote | Carriles | Qué demuestra si sale bien | Hitos | Requisitos |
|---|---|---|---|---|---|
| **Pablo** | `Noche-Farmacia.CarritoYNavegacion` | 41, 46 | Que hay un carrito global, de una sola farmacia, persistente por usuario, con ícono y contador en la cabecera y una pantalla que lo lleva a la revisión existente; y que «Lugares cercanos» y el hub viejo ya no existen, con las redirecciones puestas | 8 | R2, R3, R5 |
| **Justin** | `Noche-Farmacia.TiendaYReceta` | 43, 45 | Que `/my-account/pharmacy` es una tienda con buscador por producto y por farmacia, ordenable por precio y por distancia, con el botón de receta; y que una receta entera de la historia clínica entra al carrito desde `where-to-buy` | 6 | R1, R4, R6, R7 |
| **Marcelo** | `Noche-Farmacia.DatosYContratoReal` | 42, 47 | Que el cliente y el mock sirven el perfil de una farmacia con sedes y el catálogo a precio real por sede, con fixtures para los demás; y que la API real cierra la brecha (sedes sueltas, filtro por farmacia) con el mismo contrato | 7 | R1, R4 (datos) |
| **Itzan** | `Noche-Farmacia.PaginaDeFarmaciaYQA` | 44, 48 | Que la página de cada farmacia muestra su catálogo con el precio de la sede y suma al carrito; y que, al final, los tres recorridos de punta a punta, la regla visual y la regresión dan el veredicto del producto entero | 6 | R1, R3, R4 (tienda) · DoD de todos |

**Total: 27 hitos · 43 subtareas · 159 microtareas.** Ender no participa de este reparto (pedido del propietario).

## 2. Mapa requisito → hito → dueño → kill-test

| ID | Hito(s) | Dueño | Depende de | Kill-test (la comprobación más barata de que NO está hecho) |
|---|---|---|---|---|
| R1 | Justin **H3** · Itzan **H2, H3** · Pablo **H7** | Justin (home), Itzan (tienda), Pablo (borrado) | Ola 0 | Kill-test: entrá como `paciente@alovida.mock`, abrí `/my-account/pharmacy`: si ves pestañas, no está hecho. Entrá a una farmacia: si un precio no coincide con `curl …/pharmacy/sites/<siteId>/prices`, no está hecho. `grep -rn PharmacyHub src` distinto de 0 al cierre = no está hecho |
| R2 | Pablo **H4** | Pablo | Pablo H2 | Kill-test: con 2 unidades en el carrito, la cabecera no muestra un «2»; o `medica@alovida.mock` ve el ícono |
| R3 | Pablo **H2, H3, H5** · Justin **H3.S2** · Itzan **H3.S2** | Pablo (store) | — | Kill-test: agregá de farmacia A, después de farmacia B: si no pregunta antes de vaciar, no está hecho. Recargá: si el carrito se vació solo, no está hecho. Entrá con otro paciente: si ve el carrito del anterior, **está mal hecho** |
| R4 | Justin **H2, H3** · Marcelo **H2, H3, H4, H5** | Justin (buscador), Marcelo (datos) | Ola 0 | Kill-test: buscá «paracetamol», ordená por «Más barato»: si la primera fila no tiene el menor precio, no está hecho. Origen «tu casa» + «Más cerca»: si la primera distancia no es la menor, no está hecho. Si una fila tiene precio sin `availability()` detrás, **está mal hecho** |
| R5 | Pablo **H6** | Pablo | — | Kill-test: el menú del paciente tiene «Lugares cercanos»; o `/nearby-places` no redirige; o `features/account/cotizaciones/**` tiene un diff |
| R6 | Justin **H4, H5** | Justin | Pablo H2 | Kill-test: «Buscar toda una receta» → elegir → sede → «Agregar la receta al carrito»: si el carrito no tiene los medicamentos disponibles de la receta con `requestId`, no está hecho. Si el `POST /pharmacy/orders` sale sin `medicationRequestId`, no está hecho |
| R7 | Justin **H3.S1.M3** | Justin | — | Kill-test: el botón «Buscar toda una receta» no está junto al buscador de `/my-account/pharmacy` |
| R8 | este reparto | coordinación | — | Kill-test: `python tools/check_reparto.py repartos/2026-09-25` distinto de OK; o hay una carpeta `Ender/`; o no está en `main` |

## 3. Orden de ejecución — olas y dependencias

```
Ola 0 (1 h, en paralelo)   Pablo H2 ─────┐        Marcelo H2 ─────┐
                                        ▼                        ▼
Ola 1 (16 h de reloj)      Pablo H3–H6 · Marcelo H3–H6 · Justin H2–H5 · Itzan H2–H4     (cuatro en paralelo)
                                        │
Ola 3 (12 h)               Pablo H7 (borrar hub) · Itzan H5–H6 (e2e, regla visual, veredicto)
```

| Quien espera | De quién | Qué exactamente | Qué hace mientras tanto |
|---|---|---|---|
| Justin, Itzan | Pablo H2, Marcelo H2 | Contratos en `origin/mockup` | Una hora como mucho; después, doble local contra el plan §4 (regla 65) |
| Justin, Itzan | Marcelo H3.S1 | Fixtures | Arman las suyas con los tipos |
| Pablo H7 | Justin H3.S5, Itzan H4 | Tienda y página de farmacia publicadas | H3–H6 propios; H7 `TODO` con precondición |
| Itzan H5–H6 | los cuatro | Todo mergeado | H2–H4 propios; specs contra testids congelados |

**Nadie se queda esperando** (regla 65). Lo que cruza a más de una persona está en §6 del daily de equipo.

## 4. Reservas de archivos

Están en el §5 del [daily de equipo](../../../repartos/2026-09-25/PromptNoche/Daily-Noche-2026-09-25.md), sin intersección. El único archivo compartido es `app.routes.ts` (una línea por carril). `search-origin-picker/`, `cotizaciones/**`, la revisión/checkout del pedido y el modelo no los toca nadie.

## 5. Lo que este reparto asume y no puede verificar hasta que corra

- Que `PharmacySitePriceDto` real trae `requiresPrescription` y los montos (Marcelo H2.S1.M1 lo abre).
- Que `Tabs` deja de importar sin pestañas (HALL-F5).
- Que el presupuesto inicial del build (1,29 de 1,3 MB) no se pasa con el `CartStore` y el ícono: todo lo demás va diferido por ruta (Pablo H3.S1.M3, Itzan H4.S1.M1 lo miden).
- Que el runner self-hosted del CI de la API está encendido (Marcelo Q-M5; si no, verificación local pegada y `A MEDIAS`).
