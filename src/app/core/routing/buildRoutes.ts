import { IRouteConfig, IRouteItem, RouteAuth } from './types';

/**
 * Flattens feature route configs into one route list, resolving each route's `auth` and
 * `isFullScreen` from: the route itself → its config → `defaultAuth` / not full screen.
 */
export function buildRoutes(routeConfigs: IRouteConfig[], defaultAuth: RouteAuth): IRouteItem[] {
	return routeConfigs.flatMap((routeConfig) =>
		routeConfig.routes.map((route) => ({
			...route,
			auth: route.auth !== undefined ? route.auth : (routeConfig.auth !== undefined ? routeConfig.auth : defaultAuth),
			isFullScreen: route.isFullScreen ?? routeConfig.isFullScreen ?? false
		})) as IRouteItem[]
	);
}
