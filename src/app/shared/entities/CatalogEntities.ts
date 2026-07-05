export enum ECatalogType {
	TYPE_SERVICE = 'TYPE_SERVICE',
	APPLICATION_TYPE = 'APPLICATION_TYPE',
	TYPE_PLAGUE = 'TYPE_PLAGUE',
	INSECTICIDE = 'INSECTICIDE'
}

export type CatalogType = (ITypeService | IApplicationType | ITypePlague | IInsecticide) & {
	type: ECatalogType;
};

export const enum EInfestationLevel {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH'
}

export const enum EInfestationArea {
	INTERIOR = 'INTERIOR',
	EXTERIOR = 'EXTERIOR'
}

export interface ITypeService {
	id: string;
	name: string;
	type: string;
}

export interface IApplicationType {
	id: string;
	name: string;
	type: string;
}

export interface ITypePlague {
	id: string;
	name: string;
	type: string;
}

export interface IInsecticide {
	id: string;
	type: string;
	comercialName: string;
	chemical: string;
	doses: string[];
}
