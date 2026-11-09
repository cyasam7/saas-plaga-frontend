import { RouteAuth, UserRole } from './types';

/**
 * Whether a user with `userRole` can open a route protected by `routeAuth` (see RouteAuth).
 */
export function hasPermission(routeAuth: RouteAuth | undefined, userRole: UserRole): boolean {
	if (routeAuth === null || routeAuth === undefined) {
		return true;
	}

	const userRoles = Array.isArray(userRole) ? userRole : [userRole].filter(Boolean);

	if (routeAuth.length === 0) {
		return userRoles.length === 0;
	}

	return routeAuth.some((allowedRole) => userRoles.includes(allowedRole));
}
