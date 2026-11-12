import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';

const Inspection = lazy(() => import('./Inspection'));

const InspectionConfig: IRouteConfig = {
	auth: ['staff', 'admin'],
	routes: [
		{
			path: '/inspection',
			element: <Inspection />
		}
	]
};

export default InspectionConfig;
