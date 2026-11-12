import PageLayout from 'app/core/page/PageLayout';
import { Container } from '@mui/material';
import { useQueryClient } from 'react-query';
import { useQueryClients } from 'src/app/requests/clients/useQueryClients';
import { useMutationSaveClient } from 'src/app/requests/clients/useMutationSaveClient';
import { useMutationDeleteClient } from 'src/app/requests/clients/useMutationDeleteClient';
import { clientKeys } from 'src/app/requests/clients/keys';
import { ClientList } from './ClientDetail/ClientList';
import { FormClientValues } from './Forms/NewClientForm/types';
import SimpleHeader from 'app/shared/components/SimpleHeader';

/**
 * The ContactsApp page.
 */
export function ClientsApp() {
	const queryClient = useQueryClient();
	const { data: clients = [] } = useQueryClients({});
	const { mutateAsync: saveClient } = useMutationSaveClient();
	const { mutateAsync: deleteClient } = useMutationDeleteClient();

	async function handleSaveClient(clientFormValues: FormClientValues, clientId?: string) {
		await saveClient({ ...clientFormValues, ...(clientId ? { id: clientId } : {}) });
		await queryClient.invalidateQueries(clientKeys.all);
	}

	async function handleDeleteClient(clientId: string) {
		await deleteClient({ clientId });
		await queryClient.invalidateQueries(clientKeys.all);
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
						clients={clients}
						onSaveClient={handleSaveClient}
						onDeleteClient={handleDeleteClient}
					/>
				</Container>
			}
		/>
	);
}
