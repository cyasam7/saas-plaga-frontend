import { Container } from '@mui/material';
import { IRouteConfig } from 'app/core/routing/types';
import { ClientsApp } from './ClientsApp';
import { ClientDetail } from './ClientDetail';

const ClientsAppConfig: IRouteConfig = {
	routes: [
		{
			path: '/clients',
			element: <ClientsApp />
		},
		{
			path: '/clients/:clientId',
			element: (
				<Container maxWidth="xl">
					<ClientDetail />
				</Container>
			)
		}
	]
};

export default ClientsAppConfig;
