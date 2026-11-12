/** Estatus de una orden tal como los envía el API (`EStatusOrder` en `api/.../orders/domain/OrderEntity.ts`). */
export enum EStatusOrder {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  PASSED = 'PASSED',
  DONE = 'DONE',
  FINISHED = 'FINISHED'
}

/** Filtro de día de GET /order/datagrid (`EOrdersDayFilter` en `api/.../orders/domain/OrderEntity.ts`). */
export enum EOrdersDayFilter {
  ALL = 'all',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  PENDING = 'pending',
  PASSED = 'passed'
}

/** Cuerpo común de POST /order/individual y POST /order/business (`Create*OrderDTO` del API). */
export interface ICreateOrderPayload {
  /** Cliente existente; sin él, el API lo crea. */
  clientId?: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  description?: string;
  /** ISO. */
  date: string;
  /** El DTO lo valida con `@IsNumberString`: viaja como texto (p. ej. `'700'`). */
  price: string;
}
