# Evidencia: alta médica navegador → API → PostgreSQL

Fecha: 2026-09-24. Fuente funcional única: `02_METAPROMPT_MEDICO.md`, SHA-256 `b57dfd316c4d642eb5e1db49257397b8fd2864b511317282ae4b70ff1262a656`.

Playwright/Chromium pasó **4/4** con frontend `real-api` (`mockBackend=false`), API real en `localhost:3000`, proxy de mismo origen y PostgreSQL 18 desechable `mch_medical_test`. Para el mismo actor, el navegador subió dos PDFs (201 cada uno), dio de alta al médico (201), inició sesión (200), leyó sus dos credenciales (200), descargó ambos archivos como titular (200; `application/pdf`, firma `%PDF-1.4`), actualizó una credencial (PATCH 204), recargó la página y leyó el cambio persistido (200). SQL confirmó dos filas con dos `fileId` distintos para cada uno de los tres perfiles sintéticos creados en las corridas.

La especificación temporal se retiró. El primer intento ampliado falló porque el frontend no estaba iniciado (`ERR_CONNECTION_REFUSED` en 4390); después de iniciar `ng serve --configuration real-api`, el archivo completo pasó 4/4. La corrida final fue `E2E_BASE_URL=http://127.0.0.1:4390 corepack yarn pw playwright/medical-real-api.temp.spec.ts --workers=1`. No se leyó `.env`, no se alteró `proxy.conf.json` ni CORS. API con `ORM_SCHEMA_SYNC=off`; PDFs almacenados en `/tmp`.

La prueba API/DB separada pasó 1/1 con diez credenciales y verifica lectura privada, ocultamiento público, descarga por dueño y rechazo de reutilización. No es el mismo actor del navegador. El test temporal de limpieza pasó 1/1 y retiró los tres perfiles y seis credenciales sintéticos; una consulta de control devolvió cero filas `MED-REAL`. También se borraron los PDFs temporales y se cerraron ambos servidores locales. Aún falta recorrer varios posgrados/especialidades en la misma cuenta y probar lectura pública/ajena en ese journey. MED-E01 permanece A MEDIAS; el plan sigue en 0/98 criterios completos.

Captura de pantalla inspeccionada: [registro-medico-mobile.png](registro-medico-mobile.png).

Reanudación 2026-09-24: no se inició otra corrida real. Una inspección de solo lectura observó PostgreSQL temporal en 55439/55440, Angular en 4300/4302/4387 y un runtime Node SSR (`dist/mantra-core-health/server/server.mjs`), con propiedad y contenido de bases desconocidos. No se conectó, reinició ni detuvo ningún proceso. El journey combinado de varios tipos de credenciales y acceso público/ajeno queda `NO EJECUTADO`; no cambia la clasificación MED-E01 ni el conteo 0/98.
