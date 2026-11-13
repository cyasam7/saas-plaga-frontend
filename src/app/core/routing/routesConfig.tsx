import { Navigate } from 'react-router-dom';
import Loading from 'app/core/feedback/Loading';
import { buildRoutes } from './buildRoutes';
import { IRouteConfig, IRouteItem, RouteAuth } from './types';
import SignInConfig from 'src/app/main/sign-in/SignInConfig';
import SignUpConfig from 'src/app/main/sign-up/SignUpConfig';
import SignOutConfig from 'src/app/main/sign-out/SignOutConfig';
import Error404Page from 'src/app/main/404/Error404Page';
import OrdersConfig from 'src/app/main/orders/OrdersConfig';
import CatalogsConfig from 'src/app/main/catalogs/CatalogsConfig';
import ClientsAppConfig from 'src/app/main/clients/ClientsAppConfig';
import AppConfigurationsConfig from 'src/app/main/app-config/AppConfig-Config';
import UsersConfig from 'src/app/main/users/UsersConfig';
import forgotPasswordPagesConfig from 'src/app/main/forgot-password/forgotPasswordPagesConfig';
import InspectionConfig from 'src/app/main/inspection/InspectionConfig';
import MembershipConfig from 'src/app/main/memberships/MembershipConfig';
import RedirectionConfig from 'src/app/main/_redirect/RedirectionConfig';

/**
 * Routes without their own `auth` (and whose config has none) require a signed-in user.
 */
const DEFAULT_ROUTE_AUTH: RouteAuth = ['admin', 'staff', 'user'];

const routeConfigs: IRouteConfig[] = [
	SignOutConfig,
	SignInConfig,
	SignUpConfig,
	forgotPasswordPagesConfig,
	OrdersConfig,
	CatalogsConfig,
	ClientsAppConfig,
	AppConfigurationsConfig,
	UsersConfig,
	InspectionConfig,
	MembershipConfig,
	RedirectionConfig
];

const routes: IRouteItem[] = [
	...buildRoutes(routeConfigs, DEFAULT_ROUTE_AUTH),
	{
		path: '/',
		element: <Navigate to="/redirect" />,
		auth: DEFAULT_ROUTE_AUTH
	},
	{
		path: 'loading',
		element: <Loading />
	},
	{
		path: '404',
		element: <Error404Page />
	},
	{
		path: '*',
		element: <Navigate to="404" />
	}
];

export default routes;
