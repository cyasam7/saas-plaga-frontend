import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';

const ConfigurationReports = lazy(() => import('./configurationReports/ConfigurationReports'));

const AppConfigurationsConfig: IRouteConfig = {
	auth: ['staff', 'admin'],
	routes: [
		{
			path: '/configuration/reports',
			element: <ConfigurationReports />
		}
	]
};

export default AppConfigurationsConfig;
