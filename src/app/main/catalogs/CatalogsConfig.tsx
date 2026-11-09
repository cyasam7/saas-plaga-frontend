import i18next from 'i18next';
import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';
import en from './i18n/en';

i18next.addResourceBundle('en', 'CatalogsPage', en);

const Catalogs = lazy(() => import('./Catalogs'));

const CatalogsConfig: IRouteConfig = {
	auth: ['staff', 'admin'],
	routes: [
		{
			path: 'catalogs',
			element: <Catalogs />
		}
	]
};

export default CatalogsConfig;
