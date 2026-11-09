import { matchRoutes, useLocation } from 'react-router-dom';
import { IRouteItem } from './types';

/**
 * The top-level route config matching the current URL, or undefined when nothing matches.
 */
export function useCurrentRoute(routes: IRouteItem[]): IRouteItem | undefined {
	const { pathname } = useLocation();
	const matchedRoutes = matchRoutes(routes, pathname);

	return matchedRoutes?.[0]?.route as IRouteItem | undefined;
}
