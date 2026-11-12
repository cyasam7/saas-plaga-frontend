/**
 * Estatus de una orden tal como los envía el API (`EStatusOrder` en `api/.../orders/domain/OrderEntity.ts`).
 * `shared/entities/OrderEntity.ts` (legacy) lo re-exporta mientras el dominio de órdenes migra a `requests/`.
 */
export enum EStatusOrder {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  PASSED = 'PASSED',
  DONE = 'DONE',
  FINISHED = 'FINISHED'
}
