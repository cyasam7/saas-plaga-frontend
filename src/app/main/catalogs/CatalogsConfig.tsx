import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';

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
