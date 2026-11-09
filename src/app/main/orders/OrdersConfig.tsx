import i18next from 'i18next';
import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';
import en from './i18n/en';
import { authRoles } from 'src/app/auth';
import ViewReportOrder from './ViewReportOrder';

i18next.addResourceBundle('en', 'examplePage', en);

const Orders = lazy(() => import('./Orders'));
const OrdersHistory = lazy(() => import('./History/OrdersHistory'));

const OrdersConfig: IRouteConfig = {
	routes: [
		{
			path: 'orders',
			auth: ['staff', 'admin'],
			element: <Orders />
		},
		{
			path: 'orders/history',
			auth: ['staff', 'admin'],
			element: <OrdersHistory />
		},
		{
			path: 'orders/:orderId/download',
			auth: authRoles.onlyGuest,
			isFullScreen: true,
			element: <ViewReportOrder />
		},
		{
			path: 'orders/:orderId/view',
			isFullScreen: true,
			element: <ViewReportOrder />
		}
	]
};

export default OrdersConfig;
