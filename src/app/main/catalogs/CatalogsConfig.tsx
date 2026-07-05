import i18next from 'i18next';
import { lazy } from 'react';
import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'CatalogsPage', en);
i18next.addResourceBundle('tr', 'CatalogsPage', tr);
i18next.addResourceBundle('ar', 'CatalogsPage', ar);

const Catalogs = lazy(() => import('./Catalogs'));

/**
 * The Catalogs page config.
 */
const CatalogsConfig: FuseRouteConfigType = {
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
			path: 'catalogs',
			element: <Catalogs />
		}
	]
};

export default CatalogsConfig;
