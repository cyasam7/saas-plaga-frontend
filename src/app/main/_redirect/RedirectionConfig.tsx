import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import RedirectionPage from './RedirectionPage';
/**
 * The Example page config.
 */
const RedirectionConfig: FuseRouteConfigType = {
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
			path: 'redirect',
			element: <RedirectionPage />
		}
	]
};

export default RedirectionConfig;
