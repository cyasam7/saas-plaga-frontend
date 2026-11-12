import { ClientEntity } from './ClientsEntities';
import { IUserEntity } from './UserEntity';
import { EStatusOrder } from 'src/app/requests/orders/types';

export enum EClientType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business'
}

// Legacy: el enum vive en `requests/orders/types.ts`; se re-exporta para no romper a los consumidores actuales.
export { EStatusOrder };

export interface OrderEntity {
  id: string;
  date: Date;
  price: number;
  observations: string;
  isFollowUp: boolean;
  status: EStatusOrder;
  tenantId: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientType?: EClientType;
  dateFollowUp?: Date;
  assigned?: IUserEntity;
}

export interface DatagridRowOrder {
  id: string;
  date: Date;
  folio: string;
  timezone: string;
  client: {
    name: string;
    phone: string;
    address: string;
  };
  status: EStatusOrder;
  price: number;
  isFollowUp: boolean;
  assignedId?: string;
  assignedName?: string;
}

export interface IUserValidToStartOrder {
  userId: string;
  name: string;
  disabled: boolean;
}
