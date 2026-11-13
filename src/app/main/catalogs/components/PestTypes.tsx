import BugReportIcon from '@mui/icons-material/BugReport';
import { useQueryPestTypes } from 'src/app/requests/catalogs/useQueryPestTypes';
import { useMutationSavePestType } from 'src/app/requests/catalogs/useMutationSavePestType';
import { useMutationDeletePestType } from 'src/app/requests/catalogs/useMutationDeletePestType';
import { NamedCatalogSection } from './named-catalog/NamedCatalogSection';
import { INamedCatalogLabels } from './named-catalog/types';

const PEST_TYPE_LABELS: INamedCatalogLabels = {
	singular: 'tipo de plaga',
	singularTitle: 'Tipo de Plaga',
	plural: 'tipos de plaga',
	emptyDescription: 'Comienza creando tu primer tipo de plaga para organizar mejor tus registros'
};

export default function PestTypes() {
	const { data: pestTypes = [], isLoading, refetch: refetchPestTypes } = useQueryPestTypes();
	const { mutateAsync: savePestType } = useMutationSavePestType();
	const { mutateAsync: deletePestType } = useMutationDeletePestType();

	return (
		<NamedCatalogSection
			catalogItems={pestTypes}
			isLoading={isLoading}
			labels={PEST_TYPE_LABELS}
			Icon={BugReportIcon}
			accentColor="primary"
			saveCatalogItem={savePestType}
			deleteCatalogItem={(pestTypeId) => deletePestType({ id: pestTypeId })}
			refetchCatalogItems={refetchPestTypes}
		/>
	);
}
