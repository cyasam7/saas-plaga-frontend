import i18next from 'i18next';
import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';
import en from './i18n/en';
import es from './i18n/es';

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('es', 'examplePage', es);

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
