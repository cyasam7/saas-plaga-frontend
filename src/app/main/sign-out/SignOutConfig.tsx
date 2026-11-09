import { IRouteConfig } from 'app/core/routing/types';
import SignOutPage from './SignOutPage';

const SignOutConfig: IRouteConfig = {
	isFullScreen: true,
	auth: null,
	routes: [
		{
			path: 'sign-out',
			element: <SignOutPage />
		}
	]
};

export default SignOutConfig;
