import { ECatalogType } from 'src/app/shared/entities/CatalogEntities';

export interface IBasicCatalogConfig {
	type: ECatalogType;
	id: string;
}

export const BASIC_CATALOG_CONFIG_DEFAULT_VALUE = {
	id: '',
	type: ECatalogType.APPLICATION_TYPE
};
