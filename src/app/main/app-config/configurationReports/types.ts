/** Valores del formulario de configuración de la cuenta (el logo es el archivo elegido, aún sin subir). */
export interface IFormSaveAccount {
	name: string;
	address: string;
	logo: Blob | null;
	primaryColor: string;
	secondaryColor: string;
	licenseSanitary: string;
}
