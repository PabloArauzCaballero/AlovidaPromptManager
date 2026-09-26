# Plan — rama `test` de preproducción, en seis máquinas (2026-09-26)

> **Qué es:** el plan para que AloVida deje de ser una maqueta y pase a ser un sistema de
> preproducción: una rama **`test`** en front y API que construye **contra la API real**, con los
> doce padrones bolivianos sembrados al arrancar, cuentas logueables de verdad, las brechas
> front ↔ API cerradas, y todo eso desplegado y sano en el VPS de Contabo. Se ejecuta en **36
> carriles repartidos entre seis máquinas**, sobre contratos congelados de antemano, para que
> ninguna máquina espere a otra.
>
> - Pedido: [`TEST-PREPRODUCCION-2026-09-26.md`](../../docs/requisitos/TEST-PREPRODUCCION-2026-09-26.md)
> - Hechos medidos: [`VERIFICACION-CONTRA-CODIGO-2026-09-26.md`](../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-26.md)
> - Reparto y los seis prompts: [`repartos/2026-09-26/PromptMaquinas/`](../../repartos/2026-09-26/PromptMaquinas/Daily-Maquinas-2026-09-26.md)
> - Peldaño de evidencia de este documento: **`DISCOVERED`**. Es un plan. Lo único ya ejecutado es
>   la Ola 0 (la rama `test`), y eso está en `RUNS` con su medición.

---

## 1 · La base ya está construida: nadie espera para arrancar

Éste era el único bloqueante de arranque, y ya no está.

| Repo | Rama | Commit | Medido |
|---|---|---|---|
| `mantra-core-health` | `test` | `ec7037f7` | `typecheck` 0 · `build` exit 0 · 602/613 suites |
| `mantra-core-health-api` | `test` | `016caaa1` | `typecheck` 0 · `lint` 0 |
| `mantra-core-health-model` | `dev` | `13dd040` | v4.2.23 |

`test` = rama de integración **y** de despliegue. `mockup` sigue viva como maqueta visual y **no se
toca**. Al cierre, PR espejo `test → dev`, que mergea el propietario.

---

## 2 · Las cuatro reglas que hacen que nadie se bloquee

Son la respuesta literal a «no deben haber bloqueantes carajo», y cada una ataca una causa
concreta de espera.

1. **Nadie comparte checkout.** Cada máquina clona los tres repos una vez y cada carril es un
   `git worktree` propio dentro de esa máquina. Es la lección de
   `20-resource-control.md`, que se leía como límite global y es **por máquina**.
2. **Toda rama sale de `origin/test` y vuelve por PR contra `test`.** Nadie espera un merge para
   seguir: cierra su carril, abre el PR y arranca el siguiente desde `origin/test` otra vez. Si su
   PR quedó atrás, hace `merge origin/test` **al final, no al principio**.
3. **Cada carril es dueño exclusivo de sus archivos.** Dos máquinas nunca editan el mismo archivo.
   Lo que un carril necesita de otro se pide como **contrato escrito el primer día** (forma del
   DTO, ruta, códigos de estado) y cada lado construye contra esa forma. El front tiene su
   simulador justamente para no esperar a la API.
4. **Un solo dueño por compuerta compartida.** Los merges a `test`, el despliegue al VPS y el
   espejo a `dev` los hace **M1**. Nadie más toca Coolify ni la base del VPS.

### El único punto de serialización que queda, y por qué es aceptable

**M2 es la única máquina que edita `@Roles(...)` de endpoints que ya existen.** No es un capricho:
`role-mapping.ts` declara un `RoleCode` cerrado y descarta en silencio lo desconocido, así que si
dos carriles agregan roles a la vez el conflicto es semántico y no lo caza ningún merge. Los demás
carriles **no esperan**: anotan el rol que necesitan en su reporte, siguen con lo suyo, y M2 lo
aplica en su carril. Un 403 pendiente de rol no bloquea escribir el servicio ni el DTO.

---

## 3 · Las tres olas

### Ola 0 — hecha (la única parte secuencial)

| Carril | Qué produjo | Estado |
|---|---|---|
| **A1** | `test` del front = `dev` + `mockup`, 45 conflictos resueltos por patch-id | `RUNS` · `ec7037f7` |
| **D1** | `test` de la API = `dev` + el commit propio de `test`, y `lint`/`typecheck` en 0 | `RUNS` · `016caaa1` |
| **0.3** | Contratos congelados (§5) y los seis prompts | hecho |

### Ola 1 — arranca ya, en paralelo total

Build real, mock honesto, enrutado, roles, datasets, Coolify y autodespliegue. Cada una en una
máquina distinta (§4).

### Ola 2 — las brechas por dominio

Un carril por prompt `BR-NN` del informe del 2026-09-24, agrupados por módulo para que cada máquina
sea dueña de una carpeta y nadie pise a nadie.

### Ola 3 — verificación, bucle y cierre

Smoke real contra el VPS, `/loop` hasta `running:healthy`, compuertas de preproducción (seguridad
con lente OWASP/ASVS, accesibilidad y responsive en lo tocado, OpenAPI regenerado) y el PR espejo
a `dev`.

---

## 4 · El reparto, en una tabla

| Máquina | Eje | Por qué ésa | Carriles |
|---|---|---|---|
| **M1** Mac mini | Infraestructura, base de datos y despliegue | única con el stack Docker, el token de Coolify y el vigilante de autodespliegue | D2, D3, D4, C0, E1, E2 + los merges |
| **M2** MacBook | API con base viva | la otra que puede levantar Postgres | B3, C1, C2, B4 |
| **M3** Dell Inspiron 1 | API clínica, sin base | unitarias con `EntityManager` mockeado | B5, B6, B8 |
| **M4** Dell Inspiron 2 | API de agenda, directorios y dinero, sin base | idem | B10, B12, B13 |
| **M5** Laptop Justin | Front: la salida del simulador | no necesita backend; la rama trae su maqueta | **A2**, A3, A4 |
| **M6** Acer Aspire 3 | Datos y calidad de la suite | nada de esto pide RAM | C6, F3, F2, F1 |

**A2 es el carril más importante de los 36.** Hoy `mockBackend: true` está fijo en `production` y
también en `dev`, y la única configuración sin simulador apaga el SSR: no existe ningún artefacto
que hable con la API real. Sin A2 no hay preproducción, sólo maqueta.

**Los carriles 2 y 3 de M6 destraban a las otras cinco:** hoy ni la suite del front ni su lint
sirven como compuerta (hallazgos H-3 y H-4 de la verificación).

---

## 5 · Contratos congelados — no se discuten por máquina

| Qué | Valor |
|---|---|
| Configuración Angular real | `production-api` |
| Dominio del front de prueba | `https://test.173.249.39.237.sslip.io` |
| Contraseña de toda cuenta de prueba | `12345678`, **sólo por variable de entorno**, nunca literal en el código |
| Correo inventado | `<nombre>.<apellido>@alovida.test` (dominio reservado; nunca entrega) |
| Datos personales | **todos inventados**, deterministas (uuid5 por fila, mismo namespace que `deterministicId`), marcados `synthetic: true`. El markdown aporta nombre, matrícula, especialidad y ocupación |
| Variables de seed nuevas | `SEED_PEOPLE_ENABLED`, `SEED_PEOPLE_PASSWORD`, `SEED_DIRECTORY_NETWORKS_ENABLED`, `SEED_DEMO_SCENARIOS_ENABLED`, `SEED_ALLOW_PRODUCTION` |
| Procedencia | toda fila sembrada lleva `source_name`, `source_file`, `source_row`, `imported_at` |
| Identificadores | inglés en todo lo nuevo o tocado; prosa de pantalla en castellano rioplatense |
| Un solo camino de seed en el VPS | la cadena de `SeedBootstrapService`. El paquete del modelo queda para reconstrucciones locales: **un solo dueño por dato** |
| Nivel para cerrar un carril | `REGRESSION_VERIFIED`, con `docs/progress/evidence/lane-<id>/REPORT.md` |

---

## 6 · Lo que ya está construido y NO se vuelve a crear

Está medido en la verificación y en el informe de brechas. Que el pedido lo nombre como nuevo no lo
hace nuevo.

- **Contabilidad** existe y es grande: módulo 16, 42 tablas, 42 entidades, 8 controladores,
  pantalla en `/administration/accounting`, partida doble que valida con 422 y la máquina
  `DRAFT→POSTED→REVERSED` escrita. Los carriles la **exponen y completan**.
- **El alta de cita del doctor** está completa: `POST /scheduling/appointments/direct`, con
  paciente, modalidad, retracción de cupos y E2E propio.
- **«Dónde comprar la receta»** está hecho: `GET /pharmacy-inventory/availability` devuelve
  `complete`, `missingProductIds`, `distanceKm` y `totalAmount`.
- **El motor de formularios existe dos veces** (módulo 09 `forms` y módulo 65 `surveys`, con editor
  en el front) y hay 43 plantillas de fichas clínicas sembradas.
- **`/directory` ya agrupa por especialidad.** Copiar «la lógica de la red social» sería una
  regresión medida: esa versión agrupa parseando el titular por `·`.
- **El módulo `terminology`** existe con 15 tablas. No se instala un núcleo de terminología nuevo:
  se extiende el 03.

---

## 7 · Riesgos, con su dueño

| Riesgo | Medido | Dueño |
|---|---|---|
| **`db:vendor` borra 4 patches** que sólo viven en la API (H-2) | sí | M1 (D4). **Nadie corre `db:vendor` hasta que cierre** |
| **La suite del front no es determinista** (H-3): dos corridas, dos conjuntos rojos | sí | M6 (F3). Mientras tanto, specs dirigidos |
| **Build del front en Coolify: 15–30 min** por vuelta; la caché de Docker no se aprovecha | sí, en septiembre | M1 (E2 se pacea por eso, no por reloj) |
| **`api-migrate` con `ORM_SCHEMA_SYNC=safe` sobre una base vieja** puede crear tablas sin sus patches (`vector_rag` sin dimensión es el caso documentado) | documentado | M1, con SSH |
| **Disco de la Mac mini al 100 %** | sí: 377 MiB de 228 GiB, 78 worktrees, 31 GB de `node_modules` | **el propietario**: decide qué worktrees se borran |
| **Llave SSH del VPS sin autorizar** | sí: `Permission denied (publickey,password)` | **el propietario**: completa el `ssh-copy-id`. No bloquea el arranque de ninguna máquina, sólo inspeccionar la base y reiniciar volúmenes |
| **Bundle inicial 1,29 MB contra 620 kB** de presupuesto | sí (avisos, el build pasa) | sin asignar |
| **CI en runners propios** que suelen estar apagados | documentado | la verificación local es obligatoria, no opcional |

---

## 8 · Las ocho decisiones de producto que ningún carril resuelve solo

Vienen del informe del 2026-09-24 y cada carril afectado **arranca pidiendo la suya** y la registra
en `docs/progress/DECISIONS.md`. Resolverla por conveniencia está prohibido (regla 1.2).

| # | Decisión | Carril | Por qué bloquea |
|---|---|---|---|
| D-A | «Horario flexible»: ¿bloque con capacidad, o pedido de hora que el médico confirma? | B10 / M4 | No hay columna en el modelo; el simulador inventa `floor(dur/15)` |
| D-B | «Aspectos médicos» del paciente: ¿tabla propia, `health_context` o `forms`? | B5 / M3 | La ruta no existe y el modelo no tiene dónde guardarlo |
| D-C | Triage IA: ¿qué servicio lo atiende, con qué base legal y dónde corre? | A4 / M5 | Hoy manda **texto clínico sin autenticar** a una IP pública escrita en el repo |
| D-D | Opciones de los campos de elección: ¿value sets por campo o tabla de opciones? | B8 / M3 | El modelo usa `value_set_id`; el front manda `options[]` libres |
| D-E | Liberación de informes: ¿cuál de los dos caminos? | B7 | Hoy son dos y sólo uno llega a «Mis resultados» |
| D-F | Farmacias 24 h y de turno: ¿dato del modelo o calendario externo? | B12 / M4 | `openNow` no lo calcula nadie |
| D-G | Mostrador del médico: ¿vía hold sumando `PRACTITIONER`, o `appointments/direct`? | B10 / M4 + B3 / M2 | Hoy da 403 |
| D-I | ¿Encender la cookie httpOnly del refresh? | B2 | La API ya la soporta; encenderla sin tocar el front pierde la sesión al recargar |

**D-H queda resuelta por este plan:** la rama fuente del despliegue real es `test`.

---

## 9 · Cómo se sabe que terminó

No es una sensación de avance: son las seis cosas que el propietario dijo que iba a mirar.

1. `test` desplegada en Contabo, las dos apps `running:healthy`, y el smoke real verde **3 veces
   seguidas** sobre el mismo commit.
2. Entra con las cuentas del padrón (13 médicos + 92 pacientes) y con las de Alianza y Nacional
   (455 + 508), clave `12345678`.
3. El directorio muestra médicos reales, y **uno que trabaja en varios lugares aparece una vez con
   varias sedes**.
4. Los doce markdown se siembran **al arrancar**, sin que nadie corra un script.
5. El PR espejo `test → dev` está abierto y verde en los dos repos.
6. Las seis máquinas trabajaron sin esperarse: cada carril cerró con su reporte y su peldaño.
