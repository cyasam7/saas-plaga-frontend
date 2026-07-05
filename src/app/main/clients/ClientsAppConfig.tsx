import { ClientsApp } from './ClientsApp';
import { ClientDetail } from './ClientDetail';
import { Container } from '@mui/material';


/**
 * The ClientsApp configuration.
 */
const ClientsAppConfig = {
	settings: {
		layout: {
			style: 'layout1',
			config: {
				footer: {
					display: false
				}
			}
		}
	},
	routes: [
		{
			path: '/clients',
			element: <ClientsApp />
		},
		{
			path: '/clients/:clientId',
			element:
				<Container maxWidth="xl">
					<ClientDetail />
				</Container>
		}
	]
};

export default ClientsAppConfig;
