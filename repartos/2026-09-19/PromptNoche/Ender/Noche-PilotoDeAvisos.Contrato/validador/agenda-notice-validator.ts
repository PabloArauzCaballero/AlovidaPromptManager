/**
 * Validador runtime de las reglas que `AgendaNoticePort` deja como comentario, no como tipo.
 *
 * Alcance (H2 de `ContratoValidadorYCompatibilidad.md`): esto es un ORÁCULO INDEPENDIENTE de
 * laboratorio. No se instala en `mantra-core-health-api`, no reemplaza nada del adaptador real
 * y no toca `src/` de Mantra — ver `PLAN.md` de esta carpeta, ambigüedad registrada sobre quién
 * construye este archivo.
 *
 * Cada regla nombra su fuente. Ninguna regla de este archivo existe sin una cita a
 * `CONTRATO-AGENDA-NOTICE-PORT.md` o al archivo original del puerto.
 */

import type {
  AgendaNotice,
  AgendaNoticeRecipient,
  AgendaNoticeResult,
} from './agenda-notice.types.js';
import { KINDS_CON_CHAT, RESULT_KEYS } from './agenda-notice.types.js';

export type ValidationFailure = {
  readonly ok: false;
  readonly rule: string;
  readonly message: string;
  readonly fields: readonly string[];
  readonly source: string;
};

export type ValidationSuccess = { readonly ok: true };

export type ValidationResult = ValidationSuccess | ValidationFailure;

function fail(
  rule: string,
  message: string,
  fields: readonly string[],
  source: string,
): ValidationFailure {
  return { ok: false, rule, message, fields, source };
}

const OK: ValidationSuccess = { ok: true };

/**
 * Regla EXACTLY_ONE_RECIPIENT_FIELD.
 *
 * Fuente: `agenda-notice.port.ts` L43, comentario JSDoc — "A quién va dirigido el aviso. Uno de
 * los dos, no los dos." El tipo `AgendaNoticeRecipient` (dos campos opcionales independientes)
 * NO hace cumplir esto (ver `CONTRATO-AGENDA-NOTICE-PORT.md` §3.1 y §5).
 */
export function validateRecipient(
  recipient: AgendaNoticeRecipient,
): ValidationResult {
  const presentes = (
    ['patientProfileId', 'userId'] as const
  ).filter((campo) => {
    const valor = recipient[campo];
    return valor !== undefined && valor !== null && valor !== '';
  });

  if (presentes.length === 0) {
    return fail(
      'EXACTLY_ONE_RECIPIENT_FIELD',
      'El destinatario no tiene ni patientProfileId ni userId: no hay a quién avisar.',
      ['patientProfileId', 'userId'],
      'agenda-notice.port.ts L43',
    );
  }
  if (presentes.length === 2) {
    return fail(
      'EXACTLY_ONE_RECIPIENT_FIELD',
      'El destinatario tiene patientProfileId Y userId: la regla exige exactamente uno.',
      ['patientProfileId', 'userId'],
      'agenda-notice.port.ts L43',
    );
  }
  return OK;
}

/**
 * Regla RESULT_SHAPE_EXACT.
 *
 * Fuente: `agenda-notice.port.ts` L85-118, interfaz `AgendaNoticeResult` (8 campos exactos).
 * Detecta campos de más (un doble que "enriquece" la respuesta con algo que el contrato no
 * declara) y el único campo obligatorio (`delivered`) ausente o de tipo incorrecto.
 */
export function validateResultShape(
  candidato: Readonly<Record<string, unknown>>,
): ValidationResult {
  if (typeof candidato.delivered !== 'boolean') {
    return fail(
      'RESULT_SHAPE_EXACT',
      `"delivered" es obligatorio y debe ser boolean; llegó ${typeof candidato.delivered}.`,
      ['delivered'],
      'agenda-notice.port.ts L93',
    );
  }

  const clavesDeMas = Object.keys(candidato).filter(
    (clave) => !(RESULT_KEYS as readonly string[]).includes(clave),
  );
  if (clavesDeMas.length > 0) {
    return fail(
      'RESULT_SHAPE_EXACT',
      `El resultado trae campos que AgendaNoticeResult no declara: ${clavesDeMas.join(', ')}.`,
      clavesDeMas,
      'agenda-notice.port.ts L85-118',
    );
  }

  const opcionalesString: readonly (keyof AgendaNoticeResult)[] = [
    'inAppNotificationId',
    'notificationRequestId',
    'skippedReason',
    'emailRequestId',
    'emailSkippedReason',
    'chatSkippedReason',
  ];
  for (const campo of opcionalesString) {
    const valor = (candidato as Record<string, unknown>)[campo];
    if (valor !== undefined && typeof valor !== 'string') {
      return fail(
        'RESULT_SHAPE_EXACT',
        `"${campo}" debe ser string u omitido; llegó ${typeof valor}.`,
        [campo],
        'agenda-notice.port.ts L85-118',
      );
    }
  }
  if (
    candidato.chatDelivered !== undefined &&
    typeof candidato.chatDelivered !== 'boolean'
  ) {
    return fail(
      'RESULT_SHAPE_EXACT',
      `"chatDelivered" debe ser boolean u omitido; llegó ${typeof candidato.chatDelivered}.`,
      ['chatDelivered'],
      'agenda-notice.port.ts L115',
    );
  }

  return OK;
}

/**
 * Regla CHAT_FIELDS_ONLY_FOR_BOOKING_STATE_CHANGED.
 *
 * Sustituye al "ADV-03: tenant incorrecto" genérico de la ficha de encargo por una regla que
 * **sí** tiene fuente en este contrato — inventar una regla de negocio sobre `tenantId` que
 * ningún archivo declara está prohibido por la propia ficha ("inventar una regla que ninguna
 * fuente define"). Ver `PLAN.md` / nota en `CONTRATO-AGENDA-NOTICE-PORT.md` §8: el puerto no
 * define qué hace a un tenant "correcto"; eso es `DECISION_REQUIRED`, no una regla que se pueda
 * implementar hoy.
 *
 * La regla real y sourceable es la de L110-113 del puerto + `KINDS_CON_CHAT` del adaptador
 * (L119-120 de `messaging-agenda-notice.adapter.ts`): los campos de chat sólo pueden estar
 * presentes cuando `kind === 'BOOKING_STATE_CHANGED'`. Es exactamente el kill-test de H2:
 * estructura válida (dos booleanos y dos strings, todos del tipo correcto) pero semánticamente
 * incorrecta para ese `kind`.
 */
export function validateChatFieldsMatchKind(
  notice: Pick<AgendaNotice, 'kind'>,
  resultado: Pick<AgendaNoticeResult, 'chatDelivered' | 'chatSkippedReason'>,
): ValidationResult {
  const tieneCamposDeChat =
    resultado.chatDelivered !== undefined ||
    resultado.chatSkippedReason !== undefined;

  if (tieneCamposDeChat && !KINDS_CON_CHAT.has(notice.kind)) {
    return fail(
      'CHAT_FIELDS_ONLY_FOR_BOOKING_STATE_CHANGED',
      `El resultado trae campos de chat para kind=${notice.kind}, que el contrato no manda ` +
        `por chat (sólo BOOKING_STATE_CHANGED lo hace).`,
      ['chatDelivered', 'chatSkippedReason'],
      'agenda-notice.port.ts L110-113 + messaging-agenda-notice.adapter.ts L119-120',
    );
  }
  return OK;
}

/** Corre las tres reglas sobre un par (aviso, resultado) y devuelve la primera que falle. */
export function validateNoticeAndResult(
  notice: AgendaNotice,
  resultadoCrudo: Readonly<Record<string, unknown>>,
): ValidationResult {
  const recipiente = validateRecipient(notice.recipient);
  if (!recipiente.ok) return recipiente;

  const forma = validateResultShape(resultadoCrudo);
  if (!forma.ok) return forma;

  const resultado = resultadoCrudo as unknown as AgendaNoticeResult;
  return validateChatFieldsMatchKind(notice, resultado);
}
