import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';
import authRoles from 'src/app/core/auth/authRoles';

const ModernForgotPasswordPage = lazy(() => import('./ModernForgotPasswordPage'));

const forgotPasswordPagesConfig: IRouteConfig = {
	isFullScreen: true,
	routes: [
		{
			path: '/forgot-password',
			auth: authRoles.onlyGuest,
			children: [
				{
					path: '',
					element: <ModernForgotPasswordPage />
				}
			]
		}
	]
};

export default forgotPasswordPagesConfig;
