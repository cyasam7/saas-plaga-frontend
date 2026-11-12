/** Value sets del API (`EClientType`, `ETaxpayerType`, `EPropertyType` en `api/.../client/domain/ClientEntity.ts`). */
export type ClientType = 'business' | 'individual';

export type TaxpayerType = 'fisica' | 'moral';

export type PropertyType = 'house' | 'apartment';

/** Deprecated en el API; se conserva por compatibilidad. */
export interface IBusinessDetails {
  contactPerson: string;
  position: string;
}

/** Campos comunes del cliente en GET /clients y GET /clients/:id. */
export interface IClient {
  id: string;
  name: string;
  type: ClientType;
  email?: string;
  phone?: string;
  address?: string;
  legalName?: string;
  taxpayerType?: TaxpayerType;
  rfc?: string;
  businessActivity?: string;
  requiresCompliance?: boolean;
  ownerName?: string;
  propertyType?: PropertyType;
  businessDetails?: IBusinessDetails;
  tenantId: string;
}
