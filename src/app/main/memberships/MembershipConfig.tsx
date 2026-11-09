import i18next from 'i18next';
import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';
import en from './i18n/en';
import es from './i18n/es';

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('es', 'examplePage', es);

const Membership = lazy(() => import('./Membership'));

const MembershipConfig: IRouteConfig = {
	auth: ['staff', 'admin'],
	routes: [
		{
			path: 'membership',
			element: <Membership />
		}
	]
};

export default MembershipConfig;
