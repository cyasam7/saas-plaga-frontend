import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';

const Users = lazy(() => import('./Users'));

const UsersConfig: IRouteConfig = {
	auth: ['staff', 'admin'],
	routes: [
		{
			path: 'users',
			element: <Users />
		}
	]
};

export default UsersConfig;
