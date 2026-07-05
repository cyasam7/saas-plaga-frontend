export interface IResponseGetConfigAccount {
	name: string;
	address: string;
	logo: string;
	primaryColor: string;
	secondaryColor: string;
	licenseSanitary: string;
}

export interface ISaveAccountConfig {
	name: string;
	address: string;
	logo: Blob;
	primaryColor: string;
	secondaryColor: string;
	licenseSanitary: string;
}

export interface IFormSaveAccount {
	name: string;
	address: string;
	logo: Blob | null;
	primaryColor: string;
	secondaryColor: string;
	licenseSanitary: string;
}
