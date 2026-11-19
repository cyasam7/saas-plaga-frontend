import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';
import ViewReportOrder from './ViewReportOrder';

const Orders = lazy(() => import('./Orders'));
const OrdersHistory = lazy(() => import('./History/OrdersHistory'));

const OrdersConfig: IRouteConfig = {
	routes: [
		{
			path: 'orders',
			auth: ['staff', 'admin', 'coordinator'],
			element: <Orders />
		},
		{
			path: 'orders/history',
			auth: ['staff', 'admin', 'coordinator'],
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
