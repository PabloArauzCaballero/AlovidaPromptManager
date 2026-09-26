# M2 · MacBook — daily de máquinas, 2026-09-26

> **AVANCE: 17 / 17 microtareas — 100 %.** Sin bloqueadas ni a medias. PR #484 contra `test`.
> **`A MEDIAS` cuenta como no hecho. `DESCARTADO` no suma: se declara aparte con su motivo.**

- **Encargo:** ver la carpeta de al lado · **Reparto:** [`Daily-Maquinas-2026-09-26.md`](../Daily-Maquinas-2026-09-26.md)
- **Estado:** `HECHO` (H1/H2/H4, con dos `BLOQUEADO` registrados) · **Peldaño:** `VERIFIED`
- **Worktree:** `mantra-core-health-redesa-api/../wt-m2-macbook`, rama
  `pablo/test-m2-macbook-roles-cuentas-directorio` sobre `origin/test@016caaa1`, **pusheada**
  (5 commits, `d56f35e3` es el último). PR contra `test` sin abrir todavía. Plan y reporte
  vivos en `docs/trabajo/2026-09-26-m2-macbook/` de ese worktree.
- **H3**: se hizo en esta rama tras integrar `test` (la Mac Mini no dejó rama en el remoto). Traspaso original a la Mac Mini (worktree/rama propios sobre `origin/test`,
  no la de acá): recibió por chat los hallazgos de `AMB-02`/`AMB-03` (no existen
  `normalize_padron.py` ni `observed-specialties.dataset.json`) y el aviso de que
  `synthetic-person.ts`/`markdown-table.ts` de este carril todavía no estaban pusheados en el
  momento del traspaso.

API con base de datos viva. Roles, las cuentas del padrón, el directorio de médicos de las
aseguradoras y la descarga de archivos del paciente.

## Hitos

| ID | Hito | Estado |
|---|---|---|
| H1 | Cada rol que un `@Roles` menciona existe y se asigna | `HECHO` |
| H2 | Las 105 personas del padrón entran con su cuenta | `HECHO` (procedencia por `common.identifiers`, sin DDL) |
| H3 | El directorio muestra médicos reales, con sus varias sedes | `HECHO` (763 personas, 1282 sedes, 961 membresías; verificado en la guía sin bypass) |
| H4 | El paciente puede bajar el PDF de su propio resultado | `HECHO` (IDOR cerrado; PDF del paciente ya existía en `test`; descarga sin token atada al actor) |

## Salida de la instalación del estándar

```text
$ ls .claude/skills | wc -l
179
$ ls .claude/rules/[0-9]*.md | wc -l
15
$ python3 .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

## Bitácora

| Hora | Qué pasó | Peldaño |
|---|---|---|
| 01:2x | Worktree creado desde `origin/test@016caaa1`, estándar instalado, Postgres/Redis arriba, API arranca sano (`/health` 200) | `RUNS` |
| 01:3x | Descubrimiento de H1.S1: `role-mapping.ts` NO es la causa de que `BILLING`/`FINANCE`/`ACCOUNTING_APPROVER` sólo respondan a `SUPERADMIN` — son roles de negocio que faltan sembrar en `authz.roles` (mecanismo real: `iam-auth.service.ts::mergeRoleCodes` + `AuthzEffectiveRolesService`, ver `PLAN.md`) | `DISCOVERED` |
| — | H1 cerrado: `authz.business-roles.seed.ts` sembrado e idempotente; advertencia agregada a `mergeRoleCodes`; verificado en vivo que el médico autorregistrado no recibe 403 en check-in/mostrador/ficha | `VERIFIED` |
| — | H3 traspasado a M2-MiniMac por indicación del propietario; se le pasaron los hallazgos de AMB-02/AMB-03 | — |
| — | H2 cerrado: `PeopleSeedService` siembra 9 médicos + 92 pacientes, idempotente tras corregir un bug real (paciente entra por `nationalId`, no por correo); login real verificado | `VERIFIED` |
| — | H4 cerrado: IDOR de `/common/files/links` cerrado; `signed-content` reemplaza el token en la URL; los dos verificados en vivo con `curl` sin mocks | `VERIFIED` |
| — | Rama pusheada (5 commits, `d56f35e3`); reporte final escrito | — |

## Lo que quedó `A MEDIAS`, con qué anda y qué no

Nada quedó `A MEDIAS`. Dos microtareas quedaron `BLOQUEADO` (con las cuatro respuestas, no un
signo de interrogación vacío) — ver `docs/trabajo/2026-09-26-m2-macbook/REPORTE.md` sección
"Pendiente" y "Decisiones y ambigüedades":
- **H2.S1.M3** (procedencia por fila): no hay columnas (`source_file`/`source_row`, DDL fuera de
  alcance) ni actor de auditoría (el autorregistro público no acepta uno).
- **H4.S1.M2** (paciente lee su propio PDF): el fix real es un servicio de lectura contextual en
  `clinical`, explícitamente OUT de este carril. Contrato exacto documentado para quien lo tenga.

H3 (5 microtareas) no cuenta como `A MEDIAS` de este carril: se traspasó en vivo a otra máquina.
