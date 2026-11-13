import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';
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
			path: 'orders/:orderId/view',
			isFullScreen: true,
			element: <ViewReportOrder />
		}
	]
};

export default OrdersConfig;
