import { ClientEntity } from './ClientsEntities';
import { IUserEntity } from './UserEntity';

export enum EClientType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business'
}

export enum EStatusOrder {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  PASSED = 'PASSED',
  DONE = 'DONE',
  FINISHED = 'FINISHED'
}

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
