import { IRouteConfig } from 'app/core/routing/types';
import SignUpPage from './SignUpPage';
import authRoles from '../../auth/authRoles';

const SignUpConfig: IRouteConfig = {
	isFullScreen: true,
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'sign-up',
			element: <SignUpPage />
		}
	]
};

export default SignUpConfig;
