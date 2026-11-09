import { IRouteConfig } from 'app/core/routing/types';
import RedirectionPage from './RedirectionPage';

const RedirectionConfig: IRouteConfig = {
	auth: ['staff', 'admin'],
	routes: [
		{
			path: 'redirect',
			element: <RedirectionPage />
		}
	]
};

export default RedirectionConfig;
