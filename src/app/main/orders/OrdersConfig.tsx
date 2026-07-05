import i18next from 'i18next';
import { lazy } from 'react';
import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import { authRoles } from 'src/app/auth';
import DownloadOrder from './DownloadOrder';
import ViewReportOrder from './ViewReportOrder';

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const Orders = lazy(() => import('./Orders'));

/**
 * The Example page config.
 */
const OrdersConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			style: 'layout1',
			config: {
				footer: {
					display: false
				}
			}
		}
	},
	routes: [
		{
			path: 'orders',
			auth: ['staff', 'admin'],
			element: <Orders />
		},
		{
			path: "orders/:orderId/download",
			auth: authRoles.onlyGuest,
			element: <ViewReportOrder />,
			settings: {
				layout: {
					config: {
						navbar: {
							display: false
						},
						toolbar: {
							display: false
						},
						footer: {
							display: false
						},
						leftSidePanel: {
							display: false
						},
						rightSidePanel: {
							display: false
						}
					}
				}
			}
		},
		{
			path: "orders/:orderId/view",
			element: <ViewReportOrder />,
			settings: {
				layout: {
					config: {
						navbar: {
							display: false
						},
						toolbar: {
							display: false
						},
						footer: {
							display: false
						},
						leftSidePanel: {
							display: false
						},
						rightSidePanel: {
							display: false
						}
					}
				}
			}
		}
	]
};

export default OrdersConfig;
