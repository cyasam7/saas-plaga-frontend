import { EClientType, EStatusOrder } from './OrderEntity';

export interface OrderDetailSimpleCatalog {
  id: string;
  label: string;
  value: string;
}

export interface OrderDetailProductApplied {
  id: string;
  productName: string;
  chemicalName: string;
  productDose: string;
}

export interface OrderDetailAreaInfestation {
  areaId: string;
  areaName: string;
  skipped: boolean;
  infestationLvl?: string;
  skipReason?: string;
  skipReasonOther?: string;
}

/**
 * Dedicated response contract for GET /api/order/:id.
 * Mirrors the backend `OrderDetailResponse`; not reused by other endpoints.
 */
export interface OrderDetailResponse {
  id: string;
  folioNumber: string;
  date: Date;
  status: EStatusOrder;
  price: number;
  isFollowUp: boolean;
  hasFollowUp: boolean;
  dateFollowUp: Date | null;
  daysFollowUp: number | null;
  observations: string | null;
  timeZone: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientType: EClientType;
  assigned: { id: string; name: string } | null;
  servicesType: OrderDetailSimpleCatalog[];
  applicationsType: OrderDetailSimpleCatalog[];
  pests: OrderDetailSimpleCatalog[];
  productsApplied: OrderDetailProductApplied[];
  areaInfestations: OrderDetailAreaInfestation[];
  includeCertificate: boolean;
}
