import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import { ClientService } from 'src/app/shared/services/ClientService';
import { useQuery } from 'react-query';
import { ClientList } from './ClientDetail/ClientList';
import { FormClientValues } from './Forms/NewClientForm/types';
import FusePageSimpleHeader from '@fuse/core/FusePageSimple/FusePageSimpleHeader';
import SimpleHeader from 'app/shared-components/SimpleHeader';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

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
		<Root
			header={
				<FusePageSimpleHeader
					header={
						<SimpleHeader
							title="Clientes"
							subtitle="Gestiona los clientes del sistema"
						/>
					}
				/>
			}
			content={
				<Container maxWidth="xl" sx={{ py: 4 }}>
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
