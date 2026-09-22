# Capturas del estado ANTES — carril Pablo, 2026-09-21

Corte `5a0776c6`, rama `pablo/refactor-tabla-canonica`, `yarn start` en `localhost:4200`,
viewport 1440x900, página completa, cuenta sintética `superadmin@alovida.mock`.

## 01 — la MAQUETA: `/personas/pacientes-listado`

Lo que se ve, mirado y no sólo capturado:

- **Un aviso que no se puede cerrar, arriba de todo:** *«Referencia de diseño, no la aplicación.
  Esta pantalla viene de la bóveda con datos de ejemplo: lo que se ve acá no se guarda en ningún
  lado y los filtros y botones no consultan la API. La pantalla que sí funciona es Pacientes.»*
  Lo pinta `alovida/shell/alovida-design-notice.ts`, en el marco, para las 126 portadas.
- Tabla con **8 columnas**: Perfil · Paciente · Código MPI · Grupo ABO · Factor Rh · Estado de
  seguro · Idioma clínico · Estado de vinculación. Acciones de fila en un desplegable.
- **Barra de filtros completa**: búsqueda, Perfil, Grupo ABO, Factor Rh, Estado de seguro, Idioma
  clínico, con dos chips de filtro activo.
- Pestañas: Pacientes · Vínculos de identidad · Resumen propio · Apoderados de portal · Personas
  relacionadas.
- Paginación «25 filas por página · Anteriores / Siguientes».
- **No pasa por `authGuard`**: se abre sin sesión.

## 02 — la REAL: `/administration/patients`

- **No** tiene el aviso: es la aplicación.
- **Sí pasa por `authGuard`**: entrar a la URL sin sesión redirige a `/auth`.
- Monta `<app-page-header>` y `<app-data-table>` — verificado en
  `features/admin/patients/patient-list/patient-list.html:1,34`.
- Tabla con **4 columnas**: Paciente · Código · Nacimiento · Estado.
- **Sin barra de filtros**: sólo un campo de búsqueda.
- Paginación «Anterior / Siguiente», por cursor.

## Qué demuestra el par

1. La adopción del organismo canónico en la pantalla real **ya está hecha**: nada que migrar ahí.
2. La maqueta **no es deuda de adopción**: es el entregable de diseño, declarado en pantalla.
3. Lo que sí existe es una **brecha de producto**: la pantalla real tiene 4 de las 8 columnas y
   ninguno de los cinco filtros que el diseño especifica. Eso es trabajo de producto sobre
   `features/admin/patients/**`, no refactorización, y **no tiene dueño en la oleada del 2026-09-21**.
