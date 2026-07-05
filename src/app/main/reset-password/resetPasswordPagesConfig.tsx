import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';

const ModernResetPasswordPage = lazy(() => import('./ModernResetPasswordPage'));

/**
 * The reset password pages config.
 */
const resetPasswordPagesConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/reset-password',
			children: [
				{
					path: '',
					element: <Navigate to="classic" />
				},
				{
					path: 'modern',
					element: <ModernResetPasswordPage />
				}
			]
		}
	]
};

export default resetPasswordPagesConfig;
