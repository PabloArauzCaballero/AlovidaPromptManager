# Itzan — daily de la noche del 2026-09-21

> **AVANCE: 0 / 64 — 0 %.** ← actualizá esta línea al cerrar. Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Refactor-FormulariosYPerfil.RegistroYMiPerfil`](Refactor-FormulariosYPerfil.RegistroYMiPerfil/SeparacionSmartDumbDeLosSeisRegistrosYDelPerfil.md)
- Corte: `origin/mockup` @ `5a0776c6…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
- Daily de equipo: [`Daily-Noche-2026-09-21.md`](../Daily-Noche-2026-09-21.md)

## 0. Tu carril es distinto al de los otros: el organismo no es el problema

`paginated-form` ya tiene **52 consumidores** y los **seis** registros ya lo usan. No hay nada que
adoptar. Lo que hay que separar es lo que quedó **adentro de los contenedores**:

| Dónde | Bytes (sin specs) |
|---|---|
| `features/auth/register-*/**` (seis carpetas) | **460 858** |
| `features/account/my-profile/**` | **600 630** |

⚠️ **El tamaño no es el defecto.** El §5.6 lo dice: «no uses límites arbitrarios de líneas como
definición de calidad». Esa tabla te dice **dónde buscar**, no qué está mal. Lo que decide es cohesión,
motivos de cambio y dependencias — y eso exige abrir el archivo, que es tu H2.

**Y no pierdas un minuto cazando `any`:** hay **0** `: any` y **0** `as any` en todo `src/app`.

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 176>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 26 skills de mi lote, empezando por `smart-dumb-components`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | | | |
| `yarn typecheck` | | | |
| `yarn test --watch=false` | | | |

## 3. El comportamiento de ANTES — esto es lo que te salva de una regresión invisible

Antes de tocar nada, recorré dos registros y anotá qué hacen. Sin esto no podés demostrar que no
cambiaste el comportamiento.

| Comportamiento | Registro de profesional | Registro de paciente |
|---|---|---|
| ¿Cuándo valida cada campo? | | |
| ¿Dónde aparece el error del servidor? | | |
| ¿Se preserva lo escrito si falla el guardado? | | |
| ¿Se bloquea el doble envío? | | |
| ¿El foco va al primer error? | | |
| ¿Qué pasa al cancelar a mitad? | | |

## 4. La regla repetida — el corazón de tu noche

No busques archivos grandes: buscá **la misma regla escrita dos veces**, con archivo y línea de cada
copia. Sin las dos citas, no hay familia (§7.1).

| Regla candidata | Copia 1 (ruta:línea) | Copia 2 (ruta:línea) | ¿Es la misma? | Contraejemplo declarado |
|---|---|---|---|---|
| | | | | |

**Qué cambio se hará una sola vez después de extraerla:** `________________________________`

## 5. Las dos decisiones que no se toman en silencio

| Qué | Por qué es delicado | Decisión escrita | Elevada a |
|---|---|---|---|
| `form: FormGroup` **sin tipar** (línea 201) contra el §10.1 | **52 consumidores**: tiparlo es incompatible. El §10 exige adaptador con consumidores identificados y **condición de eliminación**; el §15 exige versionar | | Pablo |
| **Seis** inputs `booleanAttribute`: `pending`, `destructive`, `interactiveSteps`, `iconOnlyNav`, `compactSteps`, y el par `confirmTitle`/`confirmMessage` | Es «una bandera por pantalla» (§5.6), pero el motor funciona en 52 lugares. Se evalúa **una por una**: conservar / variante semántica / proyección | | Pablo |

**Decidirlas es de esta noche. Implementarlas puede ser oleada 2 — eso se declara, no se omite.**

## 6. Checkpoints del turno

```text
AVANCE — formularios y perfil — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 7. Lo que pediste y su estado

| Qué | A quién | Estado | Si no llegó: contrato simulado en tres niveles (regla 65) |
|---|---|---|---|
| Escenario de `paginated-form` con `paginas` y `form` reales | Ender | | |
| Fixtures del perfil de profesional | Ender | | |

## 8. Al cerrar

- [ ] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (una vacía se escribe
      «ninguna»; borrarla está prohibido).
- [ ] Baseline repetido y comparado: ningún rojo **nuevo**.
- [ ] **El comportamiento comparado paso por paso contra la tabla de la §3**, no sólo visualmente.
- [ ] **Si tocaste `paginated-form` o `form-field`: cinco consumidores ajenos comprobados a mano**,
      con captura. Viven en `admin`, `auth-providers`, `delegated-access`, `geo`, `health-context`,
      `identity-assurance`, `assets-liabilities` y `form-builder`.
- [ ] El borrador se preserva ante fallo · el doble envío está bloqueado · el error del servidor se
      ancla a su campo (regla 95.3).
- [ ] El formulario se completa **sólo con teclado**, y el foco es visible.
- [ ] Capturas por viewport y tema, **miradas**, con su línea.
- [ ] **Datos sintéticos declarados únicamente.** Los registros manejan datos personales: ni un dato
      real en capturas, logs, plan ni reporte (regla 90.2).
- [ ] Las 20 preguntas del §19 respondidas — en especial: **¿existe un smart gigante trasladado a una
      fachada gigante?**
- [ ] Procesos corriendo, enumerados y cerrados. Si no quedó nada, decilo.
