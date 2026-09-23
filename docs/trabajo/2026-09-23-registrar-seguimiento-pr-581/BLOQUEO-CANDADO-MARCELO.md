# Bloqueo del candado de procesos — carril de Marcelo

- Fecha: 2026-09-23
- Repositorio: `AlovidaPromptManager`
- Estado: `BLOQUEADO` por una verificación global ya roja en `main`.

## Qué pasó

El commit `2b6f0c2` fusionó en `main` el cierre documental del carril de Marcelo. El workflow `estandar` ejecuta `tools/check_reparto.py` sobre **todos** los repartos, no solamente sobre los archivos modificados en cada PR.

Por eso el PR [#31](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/31), que sólo registra el seguimiento de Cotizaciones de Justin, ejecuta el mismo control y queda bloqueado por archivos que no modifica.

## Archivos señalados por CI

```text
repartos/2026-09-22/PromptNoche/Marcelo/
  Noche-InicioPaciente.SintomasYConfirmacion/PLAN.md
  Noche-InicioPaciente.SintomasYConfirmacion/REPORTE.md
```

## Qué detectó el validador

En `PLAN.md` faltan la sección obligatoria de instalación del estándar, el catálogo de skills, el comando de verificación y el Definition of Done del hito. También aparecen estados con texto agregado, por ejemplo `EN CURSO — ...` y `A MEDIAS — ...`; el validador acepta únicamente los estados exactos del estándar.

En `REPORTE.md` faltan las secciones de instalación, catálogo de skills, comando de verificación, kill-test, tabla de ambigüedades, DoD, alcance OUT y las capas estructurales de hito (`H<n>`) y subtarea (`H<n>.S<m>`).

## Qué no significa

- No es un fallo del código de Cotizaciones ni del PR de producto [#581](https://github.com/mdavila-2001/mantra-core-health/pull/581).
- No demuestra que la implementación funcional de Marcelo esté rota.
- No fue causado por el PR #31 ni por los archivos de Justin.

Es un bloqueo de **formato y trazabilidad documental** en el repositorio de procesos.

## Cómo se destraba

1. El responsable del carril de Marcelo corrige `PLAN.md` y `REPORTE.md` para que cumplan la plantilla requerida.
2. Abre un PR contra `main` con esos archivos.
3. El workflow `estandar` debe terminar verde en `main`.
4. Se vuelve a ejecutar el workflow de #31; entonces podrá integrarse sin tocar trabajo ajeno.

## Evidencia

El log del workflow de #31 señala exactamente esos dos archivos y termina con:

```text
check_reparto: ESTRUCTURA INCOMPLETA en 2026-09-22
Process completed with exit code 1.
```

El último `main` verde fue `c37bdaa`; el rojo empezó tras el merge `2b6f0c2` del cierre documental de Marcelo.
