import BuildIcon from '@mui/icons-material/Build';
import { useQueryServiceTypes } from 'src/app/requests/catalogs/useQueryServiceTypes';
import { useMutationSaveServiceType } from 'src/app/requests/catalogs/useMutationSaveServiceType';
import { useMutationDeleteServiceType } from 'src/app/requests/catalogs/useMutationDeleteServiceType';
import { NamedCatalogSection } from './named-catalog/NamedCatalogSection';
import { INamedCatalogLabels } from './named-catalog/types';

const SERVICE_TYPE_LABELS: INamedCatalogLabels = {
	singular: 'tipo de servicio',
	singularTitle: 'Tipo de Servicio',
	plural: 'tipos de servicio',
	emptyDescription: 'Comienza creando tu primer tipo de servicio para organizar mejor tus operaciones'
};

export default function ServiceTypes() {
	const { data: serviceTypes = [], isLoading, refetch: refetchServiceTypes } = useQueryServiceTypes();
	const { mutateAsync: saveServiceType } = useMutationSaveServiceType();
	const { mutateAsync: deleteServiceType } = useMutationDeleteServiceType();

	return (
		<NamedCatalogSection
			catalogItems={serviceTypes}
			isLoading={isLoading}
			labels={SERVICE_TYPE_LABELS}
			Icon={BuildIcon}
			accentColor="secondary"
			saveCatalogItem={saveServiceType}
			deleteCatalogItem={(serviceTypeId) => deleteServiceType({ id: serviceTypeId })}
			refetchCatalogItems={refetchServiceTypes}
		/>
	);
}
