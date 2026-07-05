export interface IUserCreator {
	id?: string;
	name: string;
	phone: string;
	email: string;
	password: string;
	roleCode: string;
	tenantId: string;
}

export enum ERoleCode {
	SUPER_ADMIN = 'RL000',
	ADMIN_TENANT = 'RL001',
	FUMIGATOR_TENANT = 'RL002'
}

export interface IUserEntity {
	id: string;
	name: string;
	phone: string;
	email: string;
	password?: string;
	roleId: string;
	tenantId?: string;
	accessToken?: string;
	refreshToken?: string;
}

export class IQueryUser {
	id?: string;

	email?: string;

	roleCode?: string;

	phone?: string;

	tenantId?: string;

	accessToken?: string;

	refreshToken?: string;
}

export interface IDataGridUserRow {
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
	sign: string | null;
}

export interface ISaveSignUser {
	userId: string;
	sign: Blob;
}

export interface ResponseId {
	id: string;
}
