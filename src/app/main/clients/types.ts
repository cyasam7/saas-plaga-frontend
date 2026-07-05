export interface Branch {
  id: string;
  clientId: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  schedule?: string;
  description?: string;
  area?: number;
  notes?: string;
}

export interface Area {
  id: string;
  branchId: string;
  clientId: string;
  name: string;
  description?: string;
}

export type ClientType = 'business' | 'individual';

export type TaxpayerType = 'fisica' | 'moral';

export type PropertyType = 'house' | 'apartment';

export interface BusinessDetails {
  contactPerson: string;
  position: string;
}

export interface ClientArea {
  id?: string;
  name: string;
  description?: string;
}

export interface ClientLocation {
  id?: string;
  name: string;
  address: string;
  contactPhone: string;
  contactPerson?: string;
  references?: string;
  areas: ClientArea[];
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  email?: string;
  phone?: string;
  address?: string;
  legalName?: string;
  taxpayerType?: TaxpayerType;
  rfc?: string;
  // B2B (business)
  businessActivity?: string;
  requiresCompliance?: boolean;
  locations?: ClientLocation[];
  // Residential (individual)
  ownerName?: string;
  propertyType?: PropertyType;
  // Deprecated
  businessDetails?: BusinessDetails;
}

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
