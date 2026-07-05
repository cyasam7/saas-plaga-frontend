import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import ExampleConfig from '../main/example/ExampleConfig';
import OrdersConfig from '../main/orders/OrdersConfig';
import CatalogsConfig from '../main/catalogs/CatalogsConfig';
import ContactsAppConfig from '../main/clients/ClientsAppConfig';
import AppConfigurationsConfig from '../main/app-config/AppConfig-Config';
import UsersConfig from '../main/users/UsersConfig';
import forgotPasswordPagesConfig from '../main/forgot-password/forgotPasswordPagesConfig';
import InspectionConfig from '../main/inspection/InspectionConfig';
import MembershipConfig from '../main/memberships/MembershipConfig';
import RedirectionConfig from '../main/_redirect/RedirectionConfig';
const routeConfigs: FuseRouteConfigsType = [
	SignOutConfig,
	SignInConfig,
	SignUpConfig,
	forgotPasswordPagesConfig,
	ExampleConfig,
	OrdersConfig,
	CatalogsConfig,
	ContactsAppConfig,
	AppConfigurationsConfig,
	UsersConfig,
	InspectionConfig,
	MembershipConfig,
	RedirectionConfig
];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to="/redirect" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: 'loading',
		element: <FuseLoading />
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
