export interface Membership {
  id: string;
  tenantId: string;
  dueDate: Date;
  type: string;
}

export enum EMembershipType {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export interface IDataGridMembership {
  id: string;
  tenantId: string;
  tenantName: string;
  dueDate: Date;
  type: string;
  ownerId: string;
  owner: string;
  ownerEmail: string;
}

export class CreateMembershipDTO {
  name: string;
  phone: string;
  email: string;
  password: string;
  workspaceName: string;
  companyName: string;
  membershipType: string;
  dueDate: Date;
}
