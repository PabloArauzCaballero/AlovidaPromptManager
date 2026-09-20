/**
 * Espejo de tipos de `AgendaNoticePort`, para el laboratorio de validación (H2).
 *
 * **No es la fuente de verdad.** La fuente de verdad es
 * `src/modules/scheduling/ports/agenda-notice.port.ts` en `mantra-core-health-api`, corte
 * `32ae939983f0d665e4ed371362858801134d35cd`, hash SHA-256
 * `b462700cd8f382c0c42676cd931a2281198abaf5dca614cb739a47910bfb5877`
 * (ver `../evidencia/h1-s1-m2-archivo-literal-agenda-notice-port.ts` para el literal completo).
 * Este archivo existe porque el laboratorio no puede depender de `mantra-core-health-api` como
 * paquete (no está publicado, y no se toca el repo de Mantra desde este carril). Si el puerto
 * cambia, este espejo se actualiza como parte de la gobernanza de H3, nunca por su cuenta.
 *
 * Las anotaciones `// [L##]` remiten a la línea del archivo original.
 */

export type AgendaNoticeKind =
  | 'SLOT_RELEASED' // [L35]
  | 'PRACTITIONER_DELAY' // [L37]
  | 'APPOINTMENT_REMINDER' // [L39]
  | 'BOOKING_STATE_CHANGED'; // [L41]

export interface AgendaNoticeRecipient {
  readonly patientProfileId?: string; // [L50]
  readonly userId?: string; // [L52]
}

export interface AgendaNotice {
  readonly kind: AgendaNoticeKind; // [L57]
  readonly recipient: AgendaNoticeRecipient; // [L58]
  readonly tenantId?: string; // [L60]
  readonly subject: string; // [L62]
  readonly bodyText: string; // [L64]
  readonly relatedResourceType: string; // [L66]
  readonly relatedResourceId?: string; // [L68]
  readonly payload?: Readonly<Record<string, unknown>>; // [L73]
  readonly debounceKey?: string; // [L79]
  readonly actorUserId?: string; // [L81]
}

export interface AgendaNoticeResult {
  readonly delivered: boolean; // [L93]
  readonly inAppNotificationId?: string; // [L95]
  readonly notificationRequestId?: string; // [L97]
  readonly skippedReason?: string; // [L99]
  readonly emailRequestId?: string; // [L107]
  readonly emailSkippedReason?: string; // [L109]
  readonly chatDelivered?: boolean; // [L115]
  readonly chatSkippedReason?: string; // [L117]
}

/** Kinds que el adaptador real (`MessagingAgendaNoticeAdapter`) manda también por chat. [L119-120] */
export const KINDS_CON_CHAT: ReadonlySet<AgendaNoticeKind> = new Set([
  'BOOKING_STATE_CHANGED',
]);

/** Las 8 claves reales del resultado — usado para detectar campos de más (H2.S1.M2). */
export const RESULT_KEYS = [
  'delivered',
  'inAppNotificationId',
  'notificationRequestId',
  'skippedReason',
  'emailRequestId',
  'emailSkippedReason',
  'chatDelivered',
  'chatSkippedReason',
] as const;
