/**
 * Casos del validador (H2). Corre con el test runner nativo de Node (`node --test`), sin
 * dependencias externas — coherente con "no tocar Mantra" y con no instalar un framework de
 * test para un laboratorio de una noche.
 *
 * Regla `unit-testing` §6 aplicada acá con una variante: el "oráculo" de cada caso es un valor
 * escrito a mano en el propio `assert`, nunca el resultado de llamar al validador para "ver qué
 * da" y copiar eso como esperado (H2.S1.M3 — "el oráculo NO usa la función que prueba para
 * calcular lo esperado"). Cada `assert.equal(resultado.rule, 'ALGO_LITERAL')` es un string
 * tipeado por mí leyendo el código de la regla, no generado ejecutándolo primero.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateRecipient,
  validateResultShape,
  validateChatFieldsMatchKind,
  validateNoticeAndResult,
} from './agenda-notice-validator.js';
import type { AgendaNotice, AgendaNoticeResult } from './agenda-notice.types.js';

// ---------------------------------------------------------------------------
// H2.S1.M1 — EXACTLY_ONE_RECIPIENT_FIELD: los dos casos negativos del kill-test
// ---------------------------------------------------------------------------

test('rechaza un recipient con los dos campos vacíos (kill-test del hito)', () => {
  const resultado = validateRecipient({});
  assert.equal(resultado.ok, false);
  if (!resultado.ok) {
    assert.equal(resultado.rule, 'EXACTLY_ONE_RECIPIENT_FIELD');
    assert.match(resultado.message, /ni patientProfileId ni userId/);
  }
});

test('rechaza un recipient con los dos campos presentes', () => {
  const resultado = validateRecipient({
    patientProfileId: 'perfil-123',
    userId: 'cuenta-456',
  });
  assert.equal(resultado.ok, false);
  if (!resultado.ok) {
    assert.equal(resultado.rule, 'EXACTLY_ONE_RECIPIENT_FIELD');
    assert.match(resultado.message, /Y userId/);
  }
});

test('acepta un recipient con sólo patientProfileId', () => {
  const resultado = validateRecipient({ patientProfileId: 'perfil-123' });
  assert.equal(resultado.ok, true);
});

test('acepta un recipient con sólo userId', () => {
  const resultado = validateRecipient({ userId: 'cuenta-456' });
  assert.equal(resultado.ok, true);
});

test('un string vacío no cuenta como "presente" (evita el falso-aceptar de ambos "puestos")', () => {
  const resultado = validateRecipient({ patientProfileId: '', userId: 'cuenta-456' });
  assert.equal(resultado.ok, true, 'sólo userId cuenta como presente');
});

// ---------------------------------------------------------------------------
// H2.S1.M2 — RESULT_SHAPE_EXACT: un campo de más o de menos se detecta
// ---------------------------------------------------------------------------

test('acepta el resultado mínimo válido: sólo delivered', () => {
  const resultado = validateResultShape({ delivered: true });
  assert.equal(resultado.ok, true);
});

test('rechaza un resultado sin delivered (campo obligatorio ausente)', () => {
  const resultado = validateResultShape({ skippedReason: 'sin cuenta' });
  assert.equal(resultado.ok, false);
  if (!resultado.ok) assert.equal(resultado.rule, 'RESULT_SHAPE_EXACT');
});

test('rechaza un resultado con un campo que el contrato no declara (el doble "enriqueció" la respuesta)', () => {
  const resultado = validateResultShape({
    delivered: true,
    pushNotificationId: 'algo-que-el-contrato-no-tiene',
  });
  assert.equal(resultado.ok, false);
  if (!resultado.ok) {
    assert.equal(resultado.rule, 'RESULT_SHAPE_EXACT');
    assert.deepEqual(resultado.fields, ['pushNotificationId']);
  }
});

test('rechaza delivered con tipo incorrecto (string en vez de boolean)', () => {
  const resultado = validateResultShape({ delivered: 'true' });
  assert.equal(resultado.ok, false);
});

// ---------------------------------------------------------------------------
// H2.S2.M1/M2 — caso "ADV-03 sustituido": estructura válida, semántica inválida
// ---------------------------------------------------------------------------

test('rechaza chatDelivered=true en un aviso SLOT_RELEASED (estructura válida, semántica inválida — kill-test del hito)', () => {
  const notice: Pick<AgendaNotice, 'kind'> = { kind: 'SLOT_RELEASED' };
  const resultado: Pick<AgendaNoticeResult, 'chatDelivered' | 'chatSkippedReason'> = {
    chatDelivered: true,
  };
  const veredicto = validateChatFieldsMatchKind(notice, resultado);
  assert.equal(veredicto.ok, false);
  if (!veredicto.ok) {
    assert.equal(veredicto.rule, 'CHAT_FIELDS_ONLY_FOR_BOOKING_STATE_CHANGED');
    assert.match(veredicto.message, /SLOT_RELEASED/);
  }
});

test('acepta chatDelivered=true en un aviso BOOKING_STATE_CHANGED (el único kind con chat)', () => {
  const notice: Pick<AgendaNotice, 'kind'> = { kind: 'BOOKING_STATE_CHANGED' };
  const resultado: Pick<AgendaNoticeResult, 'chatDelivered' | 'chatSkippedReason'> = {
    chatDelivered: true,
  };
  const veredicto = validateChatFieldsMatchKind(notice, resultado);
  assert.equal(veredicto.ok, true);
});

test('acepta un PRACTITIONER_DELAY sin ningún campo de chat', () => {
  const notice: Pick<AgendaNotice, 'kind'> = { kind: 'PRACTITIONER_DELAY' };
  const veredicto = validateChatFieldsMatchKind(notice, {});
  assert.equal(veredicto.ok, true);
});

// ---------------------------------------------------------------------------
// H2.S2.M2 — "respuesta incompatible del doble" combinando las tres reglas
// ---------------------------------------------------------------------------

test('un doble que cumple el esquema pero viola la semántica de chat es rechazado igual (no "pasa por cumplir el esquema")', () => {
  const notice: AgendaNotice = {
    kind: 'APPOINTMENT_REMINDER',
    recipient: { patientProfileId: 'perfil-1' },
    subject: 'Recordatorio',
    bodyText: 'Tu turno es mañana',
    relatedResourceType: 'scheduling.appointment_bookings',
  };
  const resultadoDelDoble = {
    delivered: true,
    inAppNotificationId: 'notif-1',
    chatDelivered: true, // <- estructuralmente válido (boolean), semánticamente prohibido para este kind
  };
  const veredicto = validateNoticeAndResult(notice, resultadoDelDoble);
  assert.equal(veredicto.ok, false);
  if (!veredicto.ok) {
    assert.equal(veredicto.rule, 'CHAT_FIELDS_ONLY_FOR_BOOKING_STATE_CHANGED');
  }
});

test('un doble correcto pasa las tres reglas', () => {
  const notice: AgendaNotice = {
    kind: 'BOOKING_STATE_CHANGED',
    recipient: { userId: 'cuenta-1' },
    subject: 'Tu cita fue confirmada',
    bodyText: 'El profesional aceptó tu solicitud',
    relatedResourceType: 'scheduling.appointment_bookings',
    relatedResourceId: 'booking-1',
  };
  const resultadoDelDoble: Readonly<Record<string, unknown>> = {
    delivered: true,
    inAppNotificationId: 'notif-2',
    notificationRequestId: 'req-2',
    chatDelivered: true,
  };
  const veredicto = validateNoticeAndResult(notice, resultadoDelDoble);
  assert.equal(veredicto.ok, true);
});
