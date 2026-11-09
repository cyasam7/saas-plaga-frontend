import PageLayout from 'app/core/page/PageLayout';
import { Container } from '@mui/material';
import { ClientService } from 'src/app/shared/services/ClientService';
import { useQuery } from 'react-query';
import { ClientList } from './ClientDetail/ClientList';
import { FormClientValues } from './Forms/NewClientForm/types';
import SimpleHeader from 'app/shared-components/SimpleHeader';

/**
 * The ContactsApp page.
 */
export function ClientsApp() {
	const {
		data = [],
		refetch
	} = useQuery({
		queryKey: ['clients'],
		queryFn: () => ClientService.getByQuery()
	});

	async function handleSaveClient(data: FormClientValues, id?: string) {
		await ClientService.save(data, id);
		await refetch();
	}

	async function handleDeleteClient(id: string) {
		await ClientService.remove(id);
		await refetch();
	}

	return (
		<PageLayout
			scroll="content"
			header={
				<SimpleHeader
					title="Clientes"
					subtitle="Gestiona los clientes del sistema"
				/>
			}
			content={
				<Container maxWidth="xl" sx={{ pb: 4 }}>
					<ClientList
						clients={data}
						onSaveClient={handleSaveClient}
						onDeleteClient={handleDeleteClient}
					/>
				</Container>
			}
		/>
	);
}
