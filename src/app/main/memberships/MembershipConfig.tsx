import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';

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
