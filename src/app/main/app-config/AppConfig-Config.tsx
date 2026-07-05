import { lazy } from 'react';
import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';

const ConfigurationReports = lazy(() => import('./configurationReports/ConfigurationReports'));

/**
 * The Example page config.
 */
const AppConfigurationsConfig: FuseRouteConfigType = {
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
	auth: ['staff', 'admin'],
	routes: [

		{
			path: '/configuration/reports',
			element: <ConfigurationReports />
		}
	]
};

export default AppConfigurationsConfig;
