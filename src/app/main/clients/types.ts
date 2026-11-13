import { ClientType, PropertyType, TaxpayerType } from 'src/app/requests/clients/types';

// Los tipos que vienen del API viven en `src/app/requests/clients` y `src/app/requests/branches`;
// aquí solo quedan las etiquetas de UI.

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  business: 'Empresa (B2B)',
  individual: 'Residencial'
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  house: 'Casa',
  apartment: 'Departamento'
};

export const TAXPAYER_TYPE_LABELS: Record<TaxpayerType, string> = {
  fisica: 'Física',
  moral: 'Moral'
};

export enum TypeDevice {
  RODENTS = 'RODENTS',
  CRAWLING = 'CRAWLING',
  FLYERS = 'FLYERS'
}

export enum StatusDevice {
  ENABLED = 'ACTIVE',
  DISABLED = 'DISABLED',
  MAINTENANCE = 'MAINTENANCE'
}

export interface Device {
  id: string;
  code: string;
  stationNumber: number | string;
  status: StatusDevice;
  type: TypeDevice;
  areaId: string;
  clientId: string;
  branchId: string;
}
