import { lazy } from 'react';
import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { authRoles } from 'src/app/auth';

const ModernForgotPasswordPage = lazy(() => import('./ModernForgotPasswordPage'));

/**
 * Route Configuration for Forgot Password Pages.
 */
const forgotPasswordPagesConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
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
