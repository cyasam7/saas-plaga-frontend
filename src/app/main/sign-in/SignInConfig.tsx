import { IRouteConfig } from 'app/core/routing/types';
import SignInPage from './SignInPage';
import authRoles from 'src/app/core/auth/authRoles';

const SignInConfig: IRouteConfig = {
	isFullScreen: true,
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'sign-in',
			element: <SignInPage />
		}
	]
};

export default SignInConfig;
