/**
 * Texts of a named catalog (pest, service and application types), in lowercase except `singularTitle`.
 * Every catalog name is masculine ("tipo de …"), so the shared copy uses "Nuevo"/"del".
 */
export interface INamedCatalogLabels {
	/** e.g. "tipo de plaga" */
	singular: string;
	/** e.g. "Tipo de Plaga" */
	singularTitle: string;
	/** e.g. "tipos de plaga" */
	plural: string;
	/** Shown under the empty-state title. */
	emptyDescription: string;
}

export type NamedCatalogAccentColor = 'primary' | 'secondary' | 'info';
