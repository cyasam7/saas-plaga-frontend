import { EClientType, EStatusOrder } from './OrderEntity';

export interface ClientOrderHistorySimpleCatalog {
  id: string;
  label: string;
  value: string;
}

export interface ClientOrderHistoryProductApplied {
  id: string;
  productName: string;
  chemicalName: string;
  productDose: string;
}

/**
 * Dedicated response contract for GET /api/clients/:id/orders.
 * Mirrors the backend `ClientOrderHistoryResponse`; not reused by other endpoints.
 */
export interface ClientOrderHistoryResponse {
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
  servicesType: ClientOrderHistorySimpleCatalog[];
  applicationsType: ClientOrderHistorySimpleCatalog[];
  pests: ClientOrderHistorySimpleCatalog[];
  productsApplied: ClientOrderHistoryProductApplied[];
  infestationLvl: string | null;
  infestationArea: string[];
  includeCertificate: boolean;
}
