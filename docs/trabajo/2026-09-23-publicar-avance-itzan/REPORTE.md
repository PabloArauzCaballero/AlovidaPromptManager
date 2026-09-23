# Reporte — Publicar el avance del carril de formularios y perfil

> **AVANCE: 3 / 3 — 100 %.**

- Fecha: 2026-09-23 · Plan: [PLAN.md](./PLAN.md) · Rama: `itzan/publicar-avance-formularios-y-perfil`
- Peldaño de evidencia alcanzado: `VERIFIED` — los tres DoD se ejecutaron y su salida está abajo.
  El peldaño del **carril original** no cambia: sigue `VERIFIED`, con lo que le falta declarado en
  [su reporte](../2026-09-21-refactor-formularios-y-perfil/REPORTE.md) §7.

## Completado

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | El daily personal de Itzan declara los dos PRs, sus merges y sus fechas, más un cuadro de qué se entregó y con qué estado | `rg -c '#576\|#26' repartos/2026-09-21/PromptNoche/Itzan/Itzan-Daily-Noche-2026-09-21.md` | **6** (esperado ≥ 4) |
| H1.S1.M2 | El daily de equipo cierra el carril de Itzan junto a los otros, con el avance y los dos PRs | `rg -c '#576' repartos/2026-09-21/PromptNoche/Daily-Noche-2026-09-21.md` | **1** (esperado ≥ 1) |
| H1.S1.M3 | La estructura del reparto sigue en verde tras el cambio | `py -3 tools/check_reparto.py repartos/2026-09-21/` | `OK, 2026-09-21 cumple la estructura obligatoria`, `exit=0` |

## A medias

Ninguna para esta publicación. **Las tres del carril original siguen `A MEDIAS` y publicar el
puntero no las mueve**: anclar el error del servidor a su campo (H3.S2.M3), mover el foco al primer
error (H3.S2.M4) y observar el quinto consumidor ajeno del motor (H6.S1.M3). Sus cuatro respuestas
están en [el reporte del carril](../2026-09-21-refactor-formularios-y-perfil/REPORTE.md) §3.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| Carril H3.S2.M3 y H3.S2.M4 | `A MEDIAS` | Una decisión sobre el motor de formularios: hoy no tiene por dónde recibir errores por campo venidos de afuera, y cambiarlo alcanza a sus otros consumidores |
| Carril H6.S1.M3 | `A MEDIAS` | Una cuenta con otras habilitaciones para abrir el quinto consumidor |

## Evidencia

```text
$ rg -c '#576|#26' repartos/2026-09-21/PromptNoche/Itzan/Itzan-Daily-Noche-2026-09-21.md
6

$ rg -c '#576' repartos/2026-09-21/PromptNoche/Daily-Noche-2026-09-21.md
1

$ py -3 tools/check_reparto.py repartos/2026-09-21/
check_reparto: OK, 2026-09-21 cumple la estructura obligatoria
exit=0
```

Kill-test del plan — «`rg -n '#576|#26' repartos/2026-09-21/PromptNoche/` devuelve 0»:

```text
$ rg -c '#576|#26' repartos/2026-09-21/PromptNoche/
repartos/2026-09-21/PromptNoche/Itzan/Itzan-Daily-Noche-2026-09-21.md:6
repartos/2026-09-21/PromptNoche/Daily-Noche-2026-09-21.md:2
```

Antes de este cambio ese comando devolvía **cero coincidencias**, con los dos PRs ya fusionados.
Esa era exactamente la falla.

Estado de los dos PRs al publicar:

```text
$ gh pr view 26 --json state,mergedAt
estado: MERGED   mergeado: 2026-09-23T03:42:56Z

$ gh pr view 576 --json state,mergedAt
estado: MERGED   mergeado: 2026-09-23T12:12:26Z
```

## No cubierto

- **No se re-verificó nada del carril original.** Este trabajo publica punteros a evidencia ya
  producida; no vuelve a correr la suite, los recorridos ni las capturas.
- **No se tocó el reparto del 2026-09-22**, que tiene su propio carril y su propio daily.
- No se revisó si los dailies de otras personas del 2026-09-21 tienen el mismo hueco. Se miró el
  de Itzan porque es el propio.

## Desvíos del plan

Ninguno.

## Riesgos residuales

1. **El hueco se puede repetir en cada carril**, porque nada lo detecta. El CI de este repo
   verifica el espejo de `.agents/`, los candados y la estructura del reparto; **ningún paso
   comprueba que el daily apunte a la entrega**. Un carril entregado sin puntero sale igual de
   verde que uno publicado.
2. **El puntero puede leerse como cierre.** Se mitigó diciendo el avance real (`62 / 68`) en los
   dos dailies y nombrando las tres `A MEDIAS`, pero el riesgo sigue si alguien lee sólo el título.

## Decisiones y ambigüedades

- **Decisión — el formato se copió, no se inventó.** El cuadro «qué se entregó, dónde y con qué
  estado» y el aviso de publicación tardía siguen el precedente ya fusionado en `main`,
  `repartos/2026-09-22/PromptNoche/Justin/Justin-Daily-Noche-2026-09-22.md` §8. Había dos formas
  posibles de publicar el avance y se eligió la que el repo ya tenía.
- **Decisión — el carril no se reabre.** El `PLAN.md` y el `REPORTE.md` del 2026-09-21 están
  fusionados y no se reescriben: su avance es el que se midió esa noche.
- **Ambigüedad registrada — a confirmar con Pablo:** no hay ninguna regla escrita que obligue a
  publicar el puntero en el daily, y sin embargo es el canal por el que el equipo se entera. O la
  obligación se escribe (y entonces un candado puede comprobarla), o va a seguir dependiendo de
  que cada persona se acuerde. Este trabajo y el de Justin son dos casos del mismo hueco en tres días.

## Hallazgo ajeno — no se tocó

**Rutas de una máquina personal versionadas en el repo.** Cinco archivos de evidencia del carril de
Pablo traen la ruta de su equipo en la primera línea de la salida de las pruebas:

```text
repartos/2026-09-21/PromptNoche/Pablo/Refactor-TablaCanonica.AccesosYPersonas/evidencia/antes/test.txt:3
repartos/2026-09-21/PromptNoche/Pablo/Refactor-TablaCanonica.AccesosYPersonas/evidencia/h6/test-despues.txt:3
repartos/2026-09-21/PromptNoche/Pablo/Refactor-TablaCanonica.AccesosYPersonas/evidencia/h7/spec-patient-list.txt:3
repartos/2026-09-21/PromptNoche/Pablo/Refactor-TablaCanonica.AccesosYPersonas/evidencia/h8/regresion-acotada.txt:3
repartos/2026-09-21/PromptNoche/Pablo/Refactor-TablaCanonica.AccesosYPersonas/evidencia/h8/test-completo-despues.txt:2
```

Es territorio ajeno y ya está en `main`: se anota, no se corrige. Se detecta con
`rg -F -n 'C:\Users' repartos/` — con `-F`, porque sin él la barra invertida del patrón no casa
una ruta literal y el chequeo devuelve cero sin haber mirado nada.
