/** Códigos de rol que envía y acepta el API (`ERoleCode` en `api/.../_shared/auth/domain/RoleEntity.ts`). */
export enum ERoleCode {
  SUPER_ADMIN = 'RL000',
  ADMIN_TENANT = 'RL001',
  FUMIGATOR_TENANT = 'RL002'
}

/** Usuario del tenant. Espejo de `IGetUsersDatagridResponse` e `IGetUserByIdResponse`. */
export interface IUserRow {
  userId: string;
  name: string;
  email: string;
  phone: string;
  rol: string;
  rolId: string;
  roleCode: string;
  tenant: string;
  tenantId: string;
  isActive: boolean;
  /** URL de la firma; `null` si aún no firma. */
  sign: string | null;
}
