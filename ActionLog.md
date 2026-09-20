# ActionLog

Registro cronológico de qué se avanzó en este repositorio, entrada por sesión/turno. No
reemplaza los dailies (`repartos/<fecha>/<turno>/`) ni los `REPORTE.md` de cada persona — es el
resumen de alto nivel para quien no quiere abrir carpeta por carpeta. Entradas nuevas van
**arriba**, más recientes primero.

---

## 2026-09-20 — Ender, turno noche 2026-09-19 · "El contrato del piloto"

**Rama:** `ender/contrato-agenda-notice-port` · **Commits:** 16 · **Estado: cerrado, 50/50
microtareas en estado terminal** (48 `HECHO` + 2 `DESCARTADO`, cero en `TODO`/`BLOCKED`/`A
MEDIAS`/`EN CURSO`).

**Encargo:** [`ContratoValidadorYCompatibilidad.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/ContratoValidadorYCompatibilidad.md)
— fijar, validar y gobernar la evolución del contrato del puerto `AgendaNoticePort`
(`mantra-core-health-api`, módulo `scheduling`), sin tocar código de Mantra.

### Qué se avanzó

- **Contrato v1.0.0 congelado** — [`CONTRATO-AGENDA-NOTICE-PORT.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md):
  hash y commit del puerto real (`agenda-notice.port.ts`, corte `32ae9399…`), semántica de los 8
  campos reales de `AgendaNoticeResult` (el paquete de origen omitía 2), separación explícita de
  qué garantiza el tipo TypeScript vs. qué es sólo un comentario JSDoc, y varios hallazgos:
  `tenantId` opcional sin enforcement, errores sin taxonomía tipificada, orden de `emitMany` no
  garantizado por la firma.
- **Validador runtime independiente** — [`validador/`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/validador/):
  oráculo en TypeScript/Node (sin dependencias de Mantra) que hace cumplir en runtime la regla
  "exactamente uno" de `recipient` que el tipo no impone, más dos reglas más. 15/15 tests reales
  en verde (`tsc` estricto + `node --test`).
- **Gobernanza y compatibilidad** — [`GOBERNANZA-Y-COMPATIBILIDAD.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/GOBERNANZA-Y-COMPATIBILIDAD.md):
  política de compatibilidad en 3 dimensiones (lectura/escritura/significado), prueba adversa
  ADV-06 ejecutada dos veces en copias temporales descartables (falló exactamente donde debía:
  `tsc` exit 2), inmutabilidad del artefacto histórico verificada 4 veces por hash de blob.
- **Versión estable y cierre final** — [`VERSION-ESTABLE.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/VERSION-ESTABLE.md),
  [`PRUEBA-ADVERSA-Y-CIERRE-H5.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/PRUEBA-ADVERSA-Y-CIERRE-H5.md),
  [`CIERRE-FINAL.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/CIERRE-FINAL.md): v1.0.0 promovida a
  estable y final, 5 decisiones de negocio pendientes con dueño y consecuencia, 5 riesgos
  residuales con impacto y consumidores expuestos.
- **Reporte completo** — [`REPORTE.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/REPORTE.md).

### Dos hallazgos que salieron de una búsqueda incompleta, corregidos en la misma sesión

- La cita del metaprompt para la tensión Q-06 (durabilidad del aviso) parecía inexistente porque
  la búsqueda inicial sólo cubrió `Mantra Core Technologies/`. Ampliada a todo el disco, apareció
  en `~/Downloads/METAPROMPT_PARA_ASTRA.md` L96. Q-06 sigue `DECISION_REQUIRED` — tener las dos
  citas documenta la tensión, no la resuelve; eso sigue siendo decisión de negocio (Marcelo).
- `ARQUITECTURA_Y_CONTRATOS.md`, citado varias veces por el pack como plantilla de ficha de
  contrato, **no existe en ningún lugar accesible** (confirmado con búsqueda de disco completo).
  Afecta potencialmente a otras fichas del reparto (la de Itzan lo cita 4 veces). Queda como
  hallazgo transversal para quien mantenga el pack.

### Lo que quedó fuera, con motivo

- **Segunda capacidad (H3.S3):** cerrada `DESCARTADO` para este turno, no elegida. La ficha de
  Pablo (`Pablo/Noche-PilotoDeAvisos.Backend/`) sigue en `0/53`, sin ejecutar — no hay evidencia
  de ningún mecanismo del piloto probado en aislamiento sobre la cual elegir una segunda
  capacidad. Se reabre cuando esa evidencia exista.

### Nada tocado en `mantra-core-health-api`

Por diseño del carril: todo el trabajo es lectura del corte `32ae939983f0d665e4ed371362858801134d35cd`
(vía un worktree de sólo lectura, ya removido al cerrar) más documentación y laboratorio
independiente. `mantra-core-health-api` no tiene commits nuevos de este turno.
