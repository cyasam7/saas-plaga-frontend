import { Navigate } from 'react-router-dom';
import Loading from 'app/core/feedback/Loading';
import { buildRoutes } from 'app/core/routing/buildRoutes';
import { IRouteConfig, IRouteItem, RouteAuth } from 'app/core/routing/types';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import OrdersConfig from '../main/orders/OrdersConfig';
import CatalogsConfig from '../main/catalogs/CatalogsConfig';
import ClientsAppConfig from '../main/clients/ClientsAppConfig';
import AppConfigurationsConfig from '../main/app-config/AppConfig-Config';
import UsersConfig from '../main/users/UsersConfig';
import forgotPasswordPagesConfig from '../main/forgot-password/forgotPasswordPagesConfig';
import InspectionConfig from '../main/inspection/InspectionConfig';
import MembershipConfig from '../main/memberships/MembershipConfig';
import RedirectionConfig from '../main/_redirect/RedirectionConfig';

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
