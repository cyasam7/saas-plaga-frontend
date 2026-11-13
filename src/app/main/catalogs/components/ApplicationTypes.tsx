import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { useQueryApplicationTypes } from 'src/app/requests/catalogs/useQueryApplicationTypes';
import { useMutationSaveApplicationType } from 'src/app/requests/catalogs/useMutationSaveApplicationType';
import { useMutationDeleteApplicationType } from 'src/app/requests/catalogs/useMutationDeleteApplicationType';
import { NamedCatalogSection } from './named-catalog/NamedCatalogSection';
import { INamedCatalogLabels } from './named-catalog/types';

const APPLICATION_TYPE_LABELS: INamedCatalogLabels = {
	singular: 'tipo de aplicación',
	singularTitle: 'Tipo de Aplicación',
	plural: 'tipos de aplicación',
	emptyDescription: 'Comienza creando tu primer tipo de aplicación para organizar mejor tus servicios'
};

export default function ApplicationTypes() {
	const { data: applicationTypes = [], isLoading, refetch: refetchApplicationTypes } = useQueryApplicationTypes();
	const { mutateAsync: saveApplicationType } = useMutationSaveApplicationType();
	const { mutateAsync: deleteApplicationType } = useMutationDeleteApplicationType();

	return (
		<NamedCatalogSection
			catalogItems={applicationTypes}
			isLoading={isLoading}
			labels={APPLICATION_TYPE_LABELS}
			Icon={WaterDropIcon}
			accentColor="info"
			saveCatalogItem={saveApplicationType}
			deleteCatalogItem={(applicationTypeId) => deleteApplicationType({ id: applicationTypeId })}
			refetchCatalogItems={refetchApplicationTypes}
		/>
	);
}
