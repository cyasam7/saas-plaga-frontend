import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';
import { authRoles } from 'src/app/auth';
import ViewReportOrder from './ViewReportOrder';

const Orders = lazy(() => import('./Orders'));
const OrdersHistory = lazy(() => import('./History/OrdersHistory'));
const OrdersAdmin = lazy(() => import('./Admin/OrdersAdmin'));

const OrdersConfig: IRouteConfig = {
	routes: [
		{
			path: 'orders',
			auth: ['staff', 'admin'],
			element: <Orders />
		},
		{
			path: 'orders/admin',
			auth: ['staff', 'admin'],
			element: <OrdersAdmin />
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
