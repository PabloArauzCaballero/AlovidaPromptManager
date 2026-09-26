# M7 · Lenovo Legion — encargo de preproducción (2026-09-26)

> **Estado del encargo:** `TODO` · **Eje:** brechas front ↔ API sin dueño · **Hitos:** 6 · **Microtareas:** 101
> **Peldaño al repartir:** `DISCOVERED`. Nada de este encargo se ejecutó todavía.
>
> - Daily del reparto: [`Daily-Maquinas-2026-09-26.md`](../../Daily-Maquinas-2026-09-26.md)
> - Tu daily: [`M7-Legion-Daily-Maquinas-2026-09-26.md`](../M7-Legion-Daily-Maquinas-2026-09-26.md)
> - Plan completo: [`planes/05-test-preproduccion-2026-09-26/README.md`](../../../../../planes/05-test-preproduccion-2026-09-26/README.md)
> - Informe de brechas y sus 30 prompts: [`planes/03-brechas-front-back-2026-09-24/`](../../../../../planes/03-brechas-front-back-2026-09-24/README.md)
> - **Cortes:** front `origin/test` @ `ec7037f7` · API `origin/test` @ `016caaa1`

Sos la máquina **M7**, la Lenovo Legion (Windows 11, 15,7 GB de RAM, Docker con la VM de 7,6 GB
compartida con otros proyectos). El pedido del propietario cuenta siete computadoras; el reparto
publicado asignó seis. Tu carril es **todo lo que quedó sin dueño** del informe de brechas.

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

```bash
ls .claude/skills | wc -l
ls .claude/rules/[0-9]*.md | wc -l
python .claude/hooks/plan_gate.py --self-test
```

Pegá la salida en tu daily. Entrá por `skills-router`. Los hechos de cada repo viven en su
`CLAUDE.md` y mandan sobre cualquier skill.

## 2. Resultado observable

Los 16 prompts `BR-04, 05, 07, 08, 09, 14, 15, 16, 17, 20, 22, 26, 27, 28, 29, 30` cerrados contra
la API real levantada, cada hallazgo con su prueba, y un PR contra `test` por hito.

**Kill-test:** tomar tres hallazgos al azar de cada hito y reproducir el síntoma original contra el
artefacto real. Si alguno sigue ocurriendo, el hito no está hecho.

## 3. Alcance

**IN:** los prompts de la tabla de hitos, en los dos repos (`mantra-core-health` y
`mantra-core-health-api`). Diff mínimo por hallazgo.

**OUT:** (dueños de otra máquina)

| Qué | Dueño |
|---|---|
| `@Roles(...)` de endpoints existentes, `role-mapping.ts`, seeds de personas y directorio | M2 |
| Receta, alergia desde la consulta, aspectos médicos, notas clínicas, formularios y encuestas (BR-10..13, 18, 19) | M3 |
| Agenda, directorios públicos, farmacia, cotizaciones y contabilidad (BR-21, 23..25) | M4 |
| Configuración de build real, simulador honesto y enrutado (BR-01..03) | M5 |
| Los doce markdown, la suite del front y el lint | M6 |
| Coolify, base del VPS, `db:vendor`, merges a `test` y espejo a `dev` | M1 |

Donde un prompt exige tocar algo de la tabla, se pide como **contrato escrito** en el reporte y
se sigue: nadie espera.

## 4. Contexto que no se deduce leyendo el repo

- **No escribís DDL en el repo de la API.** Lo que toca el modelo (BR-26 lo exige) empieza en
  `mantra-core-health-model` y lo integra M1. Mientras tanto, DTO, servicio y controlador contra la
  forma acordada.
- **`yarn db:vendor` no se corre** hasta que M1 cierre H3.
- **Las decisiones de producto** (D-A..D-I) se registran en `docs/progress/DECISIONS.md` con el
  criterio elegido y por qué; no se resuelven por conveniencia y no detienen el resto del hito
  (regla 65: doble del contrato en tres niveles, `aceptado | límite | inválido`).
- **RAM:** un solo build o suite pesada a la vez (regla 70). Con la Docker VM compartida, las
  integraciones se corren en el contenedor documentado del API, no en el host.
- Techo honesto sin base viva: `TESTED`. Con el artefacto real levantado y el recorrido
  reproducido: `VERIFIED`.

## 5. Plan

Cada hito toma sus prompts `BR-NN` **tal cual están escritos** (hallazgos que cierra, estado del
front, estado de la API, criterios Gherkin, DoD). Este documento no los repite: los ordena y
convierte cada hallazgo en una microtarea. Orden dentro de H1: BR-04 primero (la cookie y el
tenant destraban a las demás pantallas); H3: BR-14 antes que BR-15; H5: BR-26 al final porque
toca el modelo; H6: BR-30 al final porque regenera OpenAPI y tipos con todo lo anterior adentro.


### H1 — Sesión, cuenta y archivos

**CA:** Dados los prompts BR-04, BR-05, BR-20, cuando se reproduce cada hallazgo contra el artefacto real, entonces el síntoma original ya no ocurre.
**DoD:** Todas las microtareas de H1 en `HECHO`, con la prueba y su salida literal pegadas y un PR contra `test`.
**Estado:** TODO

#### H1.S1 — BR-04 — Sesión, tenants y seguridad de la cuenta

**CA:** Dado el prompt [`BR-04`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-04-sesion-tenants-y-seguridad-cuenta.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Cerrar TX-10 (anexo D) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S1.M2 | Cerrar TX-11 (anexo D) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S1.M3 | Cerrar TX-15 (anexo D) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S1.M4 | Cerrar TX-16 (anexo D) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S1.M5 | Cerrar TX-19 (anexo D) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S1.M6 | Cerrar TX-20 (anexo D) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S1.M7 | Cerrar TX-28 (anexo D) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S1.M8 | Cerrar TX-29 (anexo D) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S1.M9 | Cerrar TX-30 (anexo D) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S1.M10 | Cerrar TX-31 (anexo D) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S1.M11 | Cerrar ID-24 (anexo A) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S1.M12 | Cerrar CV-22 (anexo E) tal como lo describe BR-04 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

#### H1.S2 — BR-05 — Archivos: descarga autenticada, acceso del paciente a lo suyo, escaneo y almacenamiento

**CA:** Dado el prompt [`BR-05`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-05-archivos-descarga-y-acceso.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Cerrar CL-40 (anexo B) tal como lo describe BR-05 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S2.M2 | Cerrar CL-27 (anexo B) tal como lo describe BR-05 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S2.M3 | Cerrar CL-28 (anexo B) tal como lo describe BR-05 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S2.M4 | Cerrar TX-09 (anexo D) tal como lo describe BR-05 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S2.M5 | Cerrar TX-33 (anexo D) tal como lo describe BR-05 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S2.M6 | Cerrar TX-34 (anexo D) tal como lo describe BR-05 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

#### H1.S3 — BR-20 — Consentimiento (M07) y accesos a la historia vistos por el paciente

**CA:** Dado el prompt [`BR-20`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-20-consentimiento-y-accesos-del-paciente.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Cerrar CL-77 (anexo B) tal como lo describe BR-20 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S3.M2 | Cerrar CL-78 (anexo B) tal como lo describe BR-20 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S3.M3 | Cerrar CV-07 (anexo E) tal como lo describe BR-20 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H1.S3.M4 | Cerrar CV-19 (anexo E) tal como lo describe BR-20 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

### H2 — Alta y perfil del profesional, y altas de instituciones

**CA:** Dados los prompts BR-07, BR-08, BR-09, cuando se reproduce cada hallazgo contra el artefacto real, entonces el síntoma original ya no ocurre.
**DoD:** Todas las microtareas de H2 en `HECHO`, con la prueba y su salida literal pegadas y un PR contra `test`.
**Estado:** TODO

#### H2.S1 — BR-07 — Alta y perfil del médico (cerrar el PR #453 y completar lo que le falta)

**CA:** Dado el prompt [`BR-07`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-07-alta-y-perfil-del-medico.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Cerrar ID-01 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S1.M2 | Cerrar ID-02 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S1.M3 | Cerrar ID-03 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S1.M4 | Cerrar ID-04 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S1.M5 | Cerrar ID-05 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S1.M6 | Cerrar ID-06 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S1.M7 | Cerrar ID-07 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S1.M8 | Cerrar ID-08 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S1.M9 | Cerrar ID-09 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S1.M10 | Cerrar ID-12 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S1.M11 | Cerrar ID-13 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S1.M12 | Cerrar ID-14 (anexo A) tal como lo describe BR-07 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

#### H2.S2 — BR-08 — Título (universidad, país y ciudad), historial laboral del padrón y alta del paciente

**CA:** Dado el prompt [`BR-08`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-08-titulo-historial-laboral-y-alta-paciente.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Cerrar ID-10 (anexo A) tal como lo describe BR-08 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S2.M2 | Cerrar ID-11 (anexo A) tal como lo describe BR-08 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S2.M3 | Cerrar ID-16 (anexo A) tal como lo describe BR-08 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S2.M4 | Cerrar ID-21 (anexo A) tal como lo describe BR-08 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S2.M5 | Cerrar ID-22 (anexo A) tal como lo describe BR-08 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S2.M6 | Cerrar ID-23 (anexo A) tal como lo describe BR-08 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

#### H2.S3 — BR-09 — Altas de laboratorio, imagenología y hospital conectadas a la API

**CA:** Dado el prompt [`BR-09`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-09-altas-laboratorio-imagenologia-hospital.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Cerrar ID-17 (anexo A) tal como lo describe BR-09 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S3.M2 | Cerrar CL-42 (anexo B) tal como lo describe BR-09 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S3.M3 | Cerrar CL-43 (anexo B) tal como lo describe BR-09 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H2.S3.M4 | Cerrar CV-03 (anexo E) tal como lo describe BR-09 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

### H3 — Encuentro, historia del paciente y plan de cuidados

**CA:** Dados los prompts BR-14, BR-15, BR-16, cuando se reproduce cada hallazgo contra el artefacto real, entonces el síntoma original ya no ocurre.
**DoD:** Todas las microtareas de H3 en `HECHO`, con la prueba y su salida literal pegadas y un PR contra `test`.
**Estado:** TODO

#### H3.S1 — BR-14 — Encuentros: sello del cierre, acceso por paciente, CDS y lecturas del resumen

**CA:** Dado el prompt [`BR-14`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-14-encuentros-y-seguridad-clinica.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Cerrar CL-07 (anexo B) tal como lo describe BR-14 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S1.M2 | Cerrar CL-08 (anexo B) tal como lo describe BR-14 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S1.M3 | Cerrar CL-09 (anexo B) tal como lo describe BR-14 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S1.M4 | Cerrar CL-10 (anexo B) tal como lo describe BR-14 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S1.M5 | Cerrar CL-11 (anexo B) tal como lo describe BR-14 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S1.M6 | Cerrar CL-16 (anexo B) tal como lo describe BR-14 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

#### H3.S2 — BR-15 — Historia del paciente: lo liberado visible y PDF oficial desde la API

**CA:** Dado el prompt [`BR-15`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-15-historia-del-paciente-y-pdf-oficial.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Cerrar CL-30 (anexo B) tal como lo describe BR-15 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S2.M2 | Cerrar CL-31 (anexo B) tal como lo describe BR-15 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S2.M3 | Cerrar CV-06 (anexo E) tal como lo describe BR-15 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S2.M4 | Cerrar TX-32 (anexo D) tal como lo describe BR-15 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

#### H3.S3 — BR-16 — Plan de cuidados, plantillas de nota y documentos del expediente

**CA:** Dado el prompt [`BR-16`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-16-plan-de-cuidados-plantillas-y-documentos.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Cerrar CL-24 (anexo B) tal como lo describe BR-16 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S3.M2 | Cerrar CL-25 (anexo B) tal como lo describe BR-16 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S3.M3 | Cerrar CL-26 (anexo B) tal como lo describe BR-16 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S3.M4 | Cerrar CL-34 (anexo B) tal como lo describe BR-16 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H3.S3.M5 | Cerrar CL-36 (anexo B) tal como lo describe BR-16 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

### H4 — Diagnósticos: un solo camino de liberación y consola del laboratorio

**CA:** Dados los prompts BR-17, cuando se reproduce cada hallazgo contra el artefacto real, entonces el síntoma original ya no ocurre.
**DoD:** Todas las microtareas de H4 en `HECHO`, con la prueba y su salida literal pegadas y un PR contra `test`.
**Estado:** TODO

#### H4.S1 — BR-17 — Diagnósticos: un solo camino de liberación, consola del laboratorio y compartir resultados

**CA:** Dado el prompt [`BR-17`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-17-diagnosticos-liberacion-y-consola-laboratorio.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Cerrar CV-02 (anexo E) tal como lo describe BR-17 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H4.S1.M2 | Cerrar CL-45 (anexo B) tal como lo describe BR-17 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H4.S1.M3 | Cerrar CL-46 (anexo B) tal como lo describe BR-17 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H4.S1.M4 | Cerrar CL-47 (anexo B) tal como lo describe BR-17 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H4.S1.M5 | Cerrar CL-48 (anexo B) tal como lo describe BR-17 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H4.S1.M6 | Cerrar CL-50 (anexo B) tal como lo describe BR-17 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H4.S1.M7 | Cerrar CL-51 (anexo B) tal como lo describe BR-17 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H4.S1.M8 | Cerrar CL-55 (anexo B) tal como lo describe BR-17 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H4.S1.M9 | Cerrar CL-56 (anexo B) tal como lo describe BR-17 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

### H5 — Notificaciones, comunidad y visitadores

**CA:** Dados los prompts BR-22, BR-27, BR-26, cuando se reproduce cada hallazgo contra el artefacto real, entonces el síntoma original ya no ocurre.
**DoD:** Todas las microtareas de H5 en `HECHO`, con la prueba y su salida literal pegadas y un PR contra `test`.
**Estado:** TODO

#### H5.S1 — BR-22 — Notificaciones y tiempo real: destinos de la campana, horario liberado, socket y chat F4

**CA:** Dado el prompt [`BR-22`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-22-notificaciones-y-tiempo-real.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Cerrar AG-06 (anexo C) tal como lo describe BR-22 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S1.M2 | Cerrar AG-07 (anexo C) tal como lo describe BR-22 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S1.M3 | Cerrar AG-17 (anexo C) tal como lo describe BR-22 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S1.M4 | Cerrar AG-19 (anexo C) tal como lo describe BR-22 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S1.M5 | Cerrar AG-20 (anexo C) tal como lo describe BR-22 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S1.M6 | Cerrar AG-21 (anexo C) tal como lo describe BR-22 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S1.M7 | Cerrar AG-22 (anexo C) tal como lo describe BR-22 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S1.M8 | Cerrar AG-29 (anexo C) tal como lo describe BR-22 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S1.M9 | Cerrar TX-17 (anexo D) tal como lo describe BR-22 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S1.M10 | Cerrar TX-18 (anexo D) tal como lo describe BR-22 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

#### H5.S2 — BR-27 — Comunidad: apelación del sancionado y funciones de la API sin UI (incluye grupos médicos)

**CA:** Dado el prompt [`BR-27`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-27-comunidad-moderacion-y-funciones-sin-ui.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Cerrar AG-18 (anexo C) tal como lo describe BR-27 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S2.M2 | Cerrar AG-23 (anexo C) tal como lo describe BR-27 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S2.M3 | Cerrar CV-26 (anexo E) tal como lo describe BR-27 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

#### H5.S3 — BR-26 — Visitadores médicos y laboratorio farmacéutico: modelo, DDL y pantallas

**CA:** Dado el prompt [`BR-26`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-26-visitadores-y-pharma-lab.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Cerrar AG-30 (anexo C) tal como lo describe BR-26 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S3.M2 | Cerrar AG-31 (anexo C) tal como lo describe BR-26 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S3.M3 | Cerrar AG-43 (anexo C) tal como lo describe BR-26 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H5.S3.M4 | Cerrar CV-17 (anexo E) tal como lo describe BR-26 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

### H6 — Organización, clínica extendida y contrato de calidad

**CA:** Dados los prompts BR-28, BR-29, BR-30, cuando se reproduce cada hallazgo contra el artefacto real, entonces el síntoma original ya no ocurre.
**DoD:** Todas las microtareas de H6 en `HECHO`, con la prueba y su salida literal pegadas y un PR contra `test`.
**Estado:** TODO

#### H6.S1 — BR-28 — Organización: aprobar médicos, miembros, hubs de administración con listados y verificación de matrícula

**CA:** Dado el prompt [`BR-28`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-28-organizacion-miembros-y-hubs-admin.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Cerrar CV-13 (anexo E) tal como lo describe BR-28 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S1.M2 | Cerrar CV-14 (anexo E) tal como lo describe BR-28 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S1.M3 | Cerrar CV-20 (anexo E) tal como lo describe BR-28 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S1.M4 | Cerrar ID-19 (anexo A) tal como lo describe BR-28 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

#### H6.S2 — BR-29 — Clínica extendida: derivaciones, teleconsulta, cobertura de seguros, lecturas de facturación y perioperatorio

**CA:** Dado el prompt [`BR-29`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-29-clinica-extendida-seguros-facturacion.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Cerrar CV-10 (anexo E) tal como lo describe BR-29 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S2.M2 | Cerrar CV-11 (anexo E) tal como lo describe BR-29 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S2.M3 | Cerrar CV-12 (anexo E) tal como lo describe BR-29 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S2.M4 | Cerrar CV-23 (anexo E) tal como lo describe BR-29 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |

#### H6.S3 — BR-30 — Contrato y calidad: OpenAPI regenerado, tipos generados, CI, suite real con SSR, N+1, request-id, docs y residuos del portal admin

**CA:** Dado el prompt [`BR-30`](../../../../../planes/03-brechas-front-back-2026-09-24/prompts/BR-30-contrato-ci-e2e-y-observabilidad.md), cuando se ejecutan sus criterios Gherkin contra el artefacto real, entonces pasan todos.
**DoD:** Una microtarea por hallazgo, cada una con su prueba pegada.
**Estado:** TODO

| ID | Microtarea | Criterio de aceptación | Definition of Done | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Cerrar TX-14 (anexo D) tal como lo describe BR-30 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S3.M2 | Cerrar TX-23 (anexo D) tal como lo describe BR-30 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S3.M3 | Cerrar TX-24 (anexo D) tal como lo describe BR-30 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S3.M4 | Cerrar TX-25 (anexo D) tal como lo describe BR-30 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S3.M5 | Cerrar TX-27 (anexo D) tal como lo describe BR-30 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S3.M6 | Cerrar CV-21 (anexo E) tal como lo describe BR-30 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S3.M7 | Cerrar CV-25 (anexo E) tal como lo describe BR-30 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |
| H6.S3.M8 | Cerrar AG-44 (anexo C) tal como lo describe BR-30 | el síntoma original no se reproduce contra el artefacto real | prueba dirigida pegada | TODO |


## 6. Ambigüedades registradas

| ID | Ambigüedad | Criterio de trabajo hasta que el propietario resuelva |
|---|---|---|
| Q-01 | D-I: ¿encender la cookie httpOnly del refresh? | Se enciende **con** el cambio del front en el mismo PR, nunca sólo la API |
| Q-02 | D-E: ¿cuál de los dos caminos de liberación de informes? | El que ya llega a «Mis resultados»; el otro se marca obsoleto sin borrarse |
| Q-03 | TX-29: ¿MFA obligatorio para roles administrativos? | Detrás de bandera, apagada por defecto |

## 7. Definition of Done del encargo

Los seis hitos en `HECHO` con salida literal pegada, un PR por hito contra `test`, las ambigüedades
en `docs/progress/DECISIONS.md`, y un reporte por hito en
`docs/progress/evidence/lane-M7-h<N>/REPORT.md` con `COMPLETADO / A MEDIAS / PENDIENTE /
EVIDENCIA / NO CUBIERTO / DESVÍOS`.

## 8. Reglas que no se negocian

Las mismas ocho del resto de los encargos del reparto: `corepack yarn` nunca `npm`; nada se declara
hecho por debajo del peldaño que la evidencia sostiene; no inventar (buscar el equivalente por
código); diff mínimo; identificadores en inglés y prosa de pantalla en castellano rioplatense;
`data-privacy-phi` si hay datos de personas; sin DDL en la API; validación global
`whitelist + forbidNonWhitelisted + transform`.
