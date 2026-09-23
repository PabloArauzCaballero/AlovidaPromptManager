# Daily de equipo — noche del 2026-09-21

> **REPARTIDO: 5 / 5 carriles · 317 microtareas · 6 fases del documento maestro en cada carril.**
> **COBERTURA DEL SISTEMA DE DISEÑO EN ESTA OLEADA: 16 / 96 piezas con dueño.**
> Esto **no** es un porcentaje de avance: nadie empezó todavía. Es cuánto del frontend entra en la
> oleada y cuánto queda declarado para la siguiente. El avance de cada uno sale de su `REPORTE.md`.

- Fecha: 2026-09-21 · Turno: **noche**
- Pedido: [`REFACTOR-FRONTEND-2026-09-21.md`](../../../docs/requisitos/REFACTOR-FRONTEND-2026-09-21.md)
- Hechos verificados: [`VERIFICACION-CONTRA-CODIGO-2026-09-21.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md)
- Repo de destino: `alovida/mantra-core-health` · Ref: `origin/mockup` ·
  **Corte: `5a0776c66b005ad4d2d6722321e933cd7adea621`** (2026-09-21T17:35-04)
- Peldaño de evidencia del reparto: **`DISCOVERED`** (regla 30). Se leyó el árbol de git; **no se
  ejecutó nada**: ni `yarn start`, ni un test, ni una captura.

## 1. Lo que cambió el diseño del reparto

El documento maestro §9 propone «crear» doce familias de organismos. **Casi todas ya existen** en
`src/app/shared/components/organisms/`: `data-table`, `directory-page`, `content-dialog`,
`view-state-host`, `filter-bar`, `page-header`, `fact-section`, `paginated-form`, `attachment-dialog`,
`attachment-uploader`, `survey-form`. Y varias con adopción alta y real: `page-header` en **171**
plantillas, `view-state-host` en **69**, `paginated-form` en **52**, `data-table` en **29**,
`content-dialog` en **26**.

**Así que el trabajo de esta oleada no es crear organismos. Es tres cosas distintas:**

| Qué | Dónde está el problema | De quién |
|---|---|---|
| **Adopción**: pantallas que copian el CSS del sistema y no instancian el componente | `features/alovida/**` — **70 tablas escritas a mano** en 161 pantallas, de las cuales sólo 22 importan algo de `shared/components` | Pablo (31) y Justin (39) |
| **Separación smart/dumb**: el organismo está adoptado, pero el contenedor acumuló todo | `auth/register-*` **450 KB** y `account/my-profile` **600 KB** · `clinical-record` **540 KB** | Itzan y Marcelo |
| **El catálogo y el inventario dicen cosas que no puede saber** | el scanner deduce composición por `imports` y nivel por ruta; el faker adivina props y cae en `[]` | Ender |

## 2. Reserva de archivos — **disjunta, verificada**

Ningún path aparece en dos carriles. Si necesitás algo de otro, **se pide por el daily; no se toca.**

| Persona | Organismos y moléculas que posee | Features que posee |
|---|---|---|
| **Ender** | los **tres barrels** `shared/components/{atoms,molecules,organisms}/index.ts` | `scripts/generate-component-index.mjs` · `scripts/lib/**` · `scripts/check-architecture.mjs` · `features/component-stock/**` · `core/mock/faker/**` |
| **Pablo** | `organisms/data-table` · `view-state-host` · `filter-bar` | `features/alovida/accesos/**` · `features/alovida/personas/**` |
| **Justin** | `organisms/directory-page` · `page-header` · `molecules/search-field` · `pagination` | `features/alovida/{terminologia,datos-compartidos,buscar,directorio,inicio}/**` |
| **Itzan** | `organisms/paginated-form` · `form-section` · `form-actions` · `molecules/form-field` | `features/auth/register-*/**` · `features/account/my-profile/**` |
| **Marcelo** | `organisms/content-dialog` · `attachment-dialog` · `attachment-uploader` · `fact-section` · `molecules/fact-list` | `features/clinical-record/**` |

**Dos archivos merecen atención especial:**

1. **Los tres barrels son de Ender y de nadie más.** Es el único archivo central del reparto y por eso
   tiene un solo dueño (regla 70.9). ¿Necesitás un export nuevo? Se lo pedís.
2. **`features/alovida/alovida.routes.ts` (43 KB) lo comparten Pablo y Justin.** Sólo se agrega, nunca
   se reordena ni se reformatea, y se avisa **antes** de tocarlo.

## 3. Orden de dependencias — quién destraba a quién

```
Ender  ──(factories y hosts tipados del catálogo)──▶  los otros cuatro acreditan sus organismos
Pablo  ──(decisión Q-A sobre el generador)────────▶  Justin puede migrar sin que se le borre
Marcelo ──(contrato de content-dialog)────────────▶  Justin migra sus dos diálogos crudos
Pablo  ──(patrón de migración de tabla)───────────▶  Justin lo reusa en sus 39
```

**Nadie se queda esperando.** La regla 65 es obligatoria: si el insumo del otro no llegó y su contrato
se puede nombrar, se simula en **tres niveles** —correcto, límite e inválido— se cierra la microtarea
contra el doble, y **se declara que se cerró contra un doble**. `BLOQUEADO` sin simulación previa no es
un cierre válido, y el `blocker_gate.py` lo frena.

## 4. Cobertura de esta oleada — con denominador

### 4.1 Piezas del sistema de diseño

| Nivel | Total en el repo | Con dueño esta oleada | Sin dueño (oleada 2) |
|---|---|---|---|
| Átomos | 22 | 0 | 22 |
| Moléculas | 41 | 4 | 37 |
| Organismos | 33 | 12 | 21 |
| **Total** | **96** | **16** | **80** |

### 4.2 Duplicación concreta

| Qué | Total medido | En esta oleada | Fuera (oleada 2) |
|---|---|---|---|
| Plantillas de `features/**` con `<table>` escrito a mano | **81** | **70** (Pablo 31 + Justin 39) | 11 |
| Plantillas con `<dialog>` o `role="dialog"` a mano | **9** | **3** (Marcelo 1 + Justin 2) | 6 |
| Plantillas totales bajo `src/app` | 520 | — | — |

### 4.3 Las 11 tablas y los 6 diálogos que quedan fuera, con dueño propuesto

| Qué | Dónde | Dueño propuesto para la oleada 2 |
|---|---|---|
| 3 tablas + 3 diálogos | `features/agenda/**` (`agenda.ts` 112 KB, `my-agenda.ts` 74 KB, `agenda-create.ts` 55 KB) | Pablo — ya trabajó agenda el 2026-09-20 |
| 2 diálogos | `features/messaging/thread/**` | a definir |
| 3 tablas | `features/insurance/**` | a definir |
| 2 tablas | `features/account/**` (fuera de `my-profile`) | Itzan |
| 1 tabla | `features/dashboard/**` | Ender |
| 1 tabla | `features/clinical-record/**` (además de su diálogo) | Marcelo, ya está en su alcance |
| 1 diálogo | `features/public-profile/**` | a definir |
| 1 tabla | `features/component-stock/**` | Ender, ya está en su alcance |

**Y los contenedores grandes que no entran en ningún carril de esta noche:**
`form-builder.ts` 50 KB · `admin/medical-laboratory.ts` 44 KB · `accounting.ts` 43 KB ·
`account/appointments.ts` 73 KB · `account/medical-record/where-to-buy.ts` 43 KB.

> **Esto se declara, no se esconde.** El documento maestro §6 lo pide explícitamente: «no confundas
> completar un piloto con completar todo el alcance», y el §18 exige mantener el denominador. Repartir
> 16 de 96 piezas y llamarlo «la refactorización del frontend» sería exactamente lo que el §19.19
> prohíbe.

## 5. Ambigüedades abiertas — ninguna se resuelve por conveniencia

| ID | Ambigüedad | Quién la resuelve | A quién bloquea |
|---|---|---|---|
| ~~**Q-A**~~ | **RESUELTA el 2026-09-21 — [`ADR-0014`](../../../docs/adr/) en `pablo/refactor-tabla-canonica`.** **La pregunta tenía un supuesto equivocado: no hace falta graduar nada.** Las pantallas portadas de `features/alovida/**` son, por decisión explícita del producto y visible en pantalla, «referencia de diseño, no la aplicación» — **no se migran**. Las pantallas reales ya montan el organismo canónico. Ver §5.bis (reescrita) | Pablo — **hecho** | nadie |
| **Q-B** | El §17 pide siete artefactos y un `REFACTOR_FRONTEND.md`. Pero ya existe `docs/refactor-profesional/trabajo/` con `INVENTARIO.md`, `MATRIZ_COBERTURA.md`, `ESTADO.md`, `HALLAZGOS.md`, `DECISIONES.md` y `EVIDENCIAS.md`. ¿Se reusa o se crea? | Pablo | los cinco |
| **Q-C** | `form: FormGroup` de `paginated-form` no está tipado, contra el §10.1 — pero tiene **52 consumidores** | Pablo, con el plan de compatibilidad de Itzan | Itzan |
| **Q-D** | `fact-section` existe (239 líneas) y `<app-fact-section` aparece en **0** plantillas | Pablo, con las cuatro mediciones de Marcelo | Marcelo |
| **Q-E** | ¿`attachment-dialog` y `attachment-uploader` son complementarias? El §9 **prohíbe** fusionarlas sólo por el nombre | Pablo, con la evidencia de Marcelo | Marcelo |

**Supuesto tomado para Q-B, y hay que confirmarlo:** se **reusa** `docs/refactor-profesional/trabajo/`,
porque el propio §17 dice «reutiliza archivos equivalentes si existen. No multipliques documentos que
repiten lo mismo».

## 5.bis Q-A resuelta — **REESCRITA**: el ADR se corrigió a mitad del turno y esta sección lo sigue

> ⚠️ **Si leíste esta sección antes y viste hablar de "graduar" pantallas mudándolas de carpeta, esa
> era la primera versión del ADR.** Pablo la reescribió al medir un paso más: el resultado final es
> el de acá. Se deja constancia del giro en vez de editar en silencio.

Medido sobre el corte. Afecta a **Pablo y a Justin**, o sea a las 70 pantallas — pero al revés de lo
que el reparto original suponía.

1. **El propio producto ya declara qué son esas pantallas.** `alovida/shell/alovida-design-notice.ts`
   pinta, en los dos marcos de la maqueta, un aviso que **no se puede cerrar**: *«Referencia de
   diseño, no la aplicación… La pantalla que sí funciona es Pacientes.»* Su documentación dice que las
   126 portadas son **el entregable del diseñador y la fuente contra la que se rehidratan las vistas
   reales** (corrección #8), y que el carril 01 pide **marcarlas, no borrarlas**.
2. **Las pantallas reales ya montan el organismo canónico**, medido:
   `admin/organizations/organization-list`, `admin/patients/patient-list` y
   `admin/terminology/terminology-catalog` usan `<app-data-table>`. **Ninguna** tiene una tabla
   escrita a mano.
3. **Conclusión: las 70 tablas de la maqueta NO son deuda de adopción.** Migrarlas destruiría el
   entregable de diseño para conseguir cero valor de producto. **No se migran, y nadie más las migre.**

**Lo que sí sigue siendo válido de la primera pasada**, por si alguna vez hace falta graduar una
pantalla real (no una portada de la maqueta):

- El generador no sobrescribe, **borra**: `port-vistas-alovida.mjs:275-284`,
  `rmSync(..., {recursive:true})` sobre los siete segmentos.
- **`alovida.routes.ts` es generado.** El daily de Justin decía «compartido con Pablo, sólo agregar»:
  **eso estaba mal y quedó corregido**. El archivo de coordinación real es **`src/app/app.routes.ts`**.
- El repo ya tiene el mecanismo, documentado y probado, en `app.routes.ts:1232-1240` (precedente de
  `/search`), y `features/alovida/shell/` como ejemplo de carpeta que sobrevive por no ser un segmento.

**`yarn audit:vistas` → `maqueta portada: 119` NO es un indicador de deuda a bajar.** Es el recuento
del entregable de diseño. Usarlo como meta sería medir mal.

**La brecha real estaba al revés de lo que el reparto suponía**: no es que la maqueta necesite
adopción, es que la pantalla **real** de Pacientes tenía menos columnas que las que su propio
contrato ya declaraba. Pablo lo cerró en el mismo turno (H7): agregó Documento y Teléfono a
`admin/patients/patient-list`, con los tres niveles del contrato probados y verificado en pantalla
real. Quedan pendientes los 5 filtros que el diseño especifica y que la pantalla real no tiene.

## 6. Lo que NO hay que hacer, y ya está medido

| Tentación | Por qué no |
|---|---|
| Crear un `DataTable`, un `ContentDialog` o un `PageHeader` | **Ya existen**, con contrato maduro. Crearlos es regla 00 §1.1 |
| Cazar `any` | Hay **0** `: any` y **0** `as any` en `src/app`. El §5.4 ya se cumple |
| Medir adopción con `grep app-page-header` | Cuenta **falsos positivos**: en `alovida` el atributo es decorativo y no engancha ningún selector. Contá con el `<` pegado |
| Sustituir `ViewState<T>` por `loading/error/success` | Son **10** estados con su razón escrita, y **69** consumidores |
| Fusionar las dos piezas de adjuntos | El §9 lo prohíbe sin evidencia |
| Borrar `fact-section` porque «no se usa» | Cero consumidores no es un veredicto: se mide primero |
| Tocar el barrel de otro «para destrabar» | Es de Ender. Se pide |
| Romper el generador del índice | `yarn start` y `yarn build` corren `stock:generate` **antes** de compilar: romperlo deja a cuatro personas sin arrancar |

## 7. Obligatorio para todos, sin excepción

1. **Instalar el estándar antes de la primera línea** (sección 1 de cada prompt) y pegar la salida de
   `ls .claude/skills | wc -l` → 176 y de `python .claude/hooks/plan_gate.py --self-test` → 11 PASS.
   **Sin eso el lote arranca en `BLOQUEADO`.**
2. **`PLAN.md` en disco antes del primer `Edit`/`Write` de código.** El `plan_gate.py` lo frena; en
   Codex o Cursor **no**, y la obligación es la misma.
3. **`REPORTE.md` al cerrar**, con el avance calculado en la **primera línea** y sus tres secciones —
   `Completado`, `A medias`, `Pendiente`. Una vacía se escribe «ninguna»; borrarla está prohibido.
4. **Checkpoint** en cada apertura y cierre de microtarea. Prohibido encadenar más de tres operaciones
   materiales sin uno.
5. **Baseline antes de tocar.** `lint`, `typecheck`, `test` y `audit:vistas`, con su salida y su código
   de salida guardados, y **cada rojo previo clasificado** (regla 80.4). Un rojo que ya estaba no es una
   regresión tuya, pero si no lo guardaste no lo podés demostrar.
6. **Un `yarn start`, un build, un navegador, Playwright `--workers=1`** (regla 70).
7. **Nada de datos de personas** en logs, capturas, plan ni reporte. Las cuentas sintéticas declaradas
   (`medica@`, `paciente@`, `admin@`, `superadmin@`, `visitador@alovida.mock`, cualquier contraseña no
   vacía) **sí** se pueden pegar.
8. **Ninguna palabra más fuerte que la evidencia** (regla 30). «Compila» no es «funciona»; leer el
   código nunca cuenta como verificación.

## 8. Los carriles

| Persona | Lote | Micro | Qué demuestra si sale bien |
|---|---|---|---|
| **Ender** | [`Refactor-CatalogoEInventario.Plataforma`](Ender/Refactor-CatalogoEInventario.Plataforma/CatalogoRealScannerYFactoriesTipadas.md) | 61 | Que el catálogo monta `DataTable` y `ContentDialog` con contrato **válido**, y que el inventario distingue «importado» de «instanciado» |
| **Pablo** | [`Refactor-TablaCanonica.AccesosYPersonas`](Pablo/Refactor-TablaCanonica.AccesosYPersonas/ContratoDeTablaYAdopcionEnAccesosYPersonas.md) | 63 | Que dos pantallas de `alovida` usan la tabla canónica de verdad, con la decisión del generador tomada |
| **Justin** | [`Refactor-DirectorioYCabecera.TerminologiaYDatosCompartidos`](Justin/Refactor-DirectorioYCabecera.TerminologiaYDatosCompartidos/PaginaDeDirectorioCabeceraYBusquedaEnCuatroSubmodulos.md) | 68 | Que la cabecera y la búsqueda canónicas reemplazan el CSS copiado en dos submódulos distintos |
| **Itzan** | [`Refactor-FormulariosYPerfil.RegistroYMiPerfil`](Itzan/Refactor-FormulariosYPerfil.RegistroYMiPerfil/SeparacionSmartDumbDeLosSeisRegistrosYDelPerfil.md) | 64 | Que una regla que estaba escrita dos veces vive una sola vez, sin perder el borrador ni cambiar el comportamiento |
| **Marcelo** | [`Refactor-DialogosYAdjuntos.Expediente`](Marcelo/Refactor-DialogosYAdjuntos.Expediente/ContratoDeDialogoAdjuntosYSeccionDeDatosDelExpediente.md) | 61 | Que el diálogo del expediente respeta la política de descarte por los tres caminos y devuelve el foco |
| | **Total** | **317** | |

> **Cierre de Marcelo (2026-09-21/22, 90,0 % — 63/70, denominador propio declarado):** el
> contrato de `content-dialog` está entregado — `mantra-core-health/docs/refactor-profesional/
> trabajo/contratos/content-dialog.md` — con receta de migración para los dos diálogos crudos de
> Justin. `patient-chart` cablea la política de descarte por los tres caminos, verificado con E2E
> real (3 passed/1 skipped) y 37 tests unitarios nuevos, 0 regresión (`mantra-core-health`, rama
> `marcelo/noche-2026-09-21-dialogos-adjuntos-expediente`). Detalle completo en
> [`Marcelo-Daily-Noche-2026-09-21.md`](Marcelo/Marcelo-Daily-Noche-2026-09-21.md).

> **Cierre de Itzan (2026-09-21/22, 91,2 % — 62/68, denominador propio: subió de 64 a 68 porque el
> trabajo destapó cuatro piezas que el plan no preveía):** la política de contraseña de las cinco
> altas vive una sola vez y las cinco la consumen; el perfil del profesional quedó partido en vista
> y contenedor. **Sin cambiar comportamiento**: el diff de `features/auth/` son 10 archivos `.ts` y
> cero `.html`/`.css`, y `paginated-form` no se tocó. Entregado en `mantra-core-health` PR
> [#576](https://github.com/mdavila-2001/mantra-core-health/pull/576) (merge `480c9ecf`) y en este
> repo PR [#26](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/26) (merge
> `94f0843`). Suite completa **7 107/7 107, 0 fallos**, reconciliada contra la medición previa; los
> 6 rojos de E2E se probaron ajenos con un A/B contra la base limpia. **Peldaño del trabajo:
> `VERIFIED`, no `REGRESSION_VERIFIED`** — las tres pruebas de recorrido del perfil se saltan solas
> contra la maqueta y un `exit=0` con saltadas no es cobertura. Quedan **3 `A MEDIAS`**, todas del
> motor de formularios, que alcanza a sus otros consumidores. Nueve hallazgos ajenos documentados
> con `ruta:línea` en [`Itzan-Daily-Noche-2026-09-21.md`](Itzan/Itzan-Daily-Noche-2026-09-21.md) §9.

## 9. Advertencia sobre el alcance

**Ningún carril entra completo en una noche, y está dicho a propósito en los cinco prompts.** 31 y 39
pantallas no se migran en un turno; un millón de bytes de contenedor no se separa en un turno.

Lo que se espera de cada uno es lo mismo: **dos consumidores migrados y demostrados valen más que
treinta a medias.** Lo que no cierra queda `A MEDIAS` con las cuatro respuestas —qué anda, qué no anda,
qué falta exactamente, dónde quedó— y eso es un cierre **legítimo**. Disfrazarlo de `HECHO` no lo es.

**Recortar el alcance es decisión de coordinación, no individual, y se registra.**
