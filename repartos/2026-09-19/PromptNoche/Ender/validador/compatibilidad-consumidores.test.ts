/**
 * H2.S3.M2 — Probar el contrato v1.0.0 contra los consumidores inventariados en H1.
 *
 * No hay todavía un doble (es de Justin) ni un adaptador nuevo: lo que sí puedo probar hoy es
 * que el validador de H2 **no rechaza por falso positivo** las formas de `recipient` que las 7
 * fábricas reales de `notices/agenda-notices.ts` ya construyen en el corte `32ae9399…`
 * (compatibilidad de LECTURA: nadie que ya construye contra este contrato se rompe).
 *
 * Fuente de cada línea: `grep -n "recipient: {" src/modules/scheduling/notices/agenda-notices.ts`
 * sobre el corte congelado — ver `../evidencia/h1-s1-m4-inventario-consumidores.txt`.
 * Compatibilidad de ESCRITURA y de SIGNIFICADO no aplican acá: nadie escribe un `AgendaNotice`
 * nuevo a partir de este documento todavía, y el significado de cada campo no cambió (v1.0.0 es
 * el contrato ya implementado, no uno propuesto).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRecipient } from './agenda-notice-validator.js';

const RECIPIENTS_REALES_L91_L392 = [
  { linea: 91, valor: { patientProfileId: 'perfil-cupo-liberado' } },
  { linea: 155, valor: { userId: 'cuenta-demora-profesional' } },
  { linea: 197, valor: { patientProfileId: 'perfil-solicitud' } },
  { linea: 237, valor: { patientProfileId: 'perfil-aceptada' } },
  { linea: 277, valor: { patientProfileId: 'perfil-rechazada' } },
  { linea: 392, valor: { userId: 'cuenta-recordatorio-profesional' } },
] as const;

test('ninguna de las 6 formas reales de recipient (L91-L392 de agenda-notices.ts) es rechazada por EXACTLY_ONE_RECIPIENT_FIELD', () => {
  for (const caso of RECIPIENTS_REALES_L91_L392) {
    const veredicto = validateRecipient(caso.valor);
    assert.equal(
      veredicto.ok,
      true,
      `L${caso.linea} debería ser compatible con v1.0.0 y no lo es`,
    );
  }
});
