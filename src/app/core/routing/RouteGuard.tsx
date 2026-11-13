import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { hasPermission } from './hasPermission';
import { IRouteItem, UserRole } from './types';
import { useCurrentRoute } from './useCurrentRoute';

const SIGN_IN_PATH = '/sign-in';
const SIGNED_IN_HOME_PATH = '/';

type RouteGuardProps = {
	routes: IRouteItem[];
	userRole: UserRole;
	children: ReactNode;
};

/**
 * Blocks routes the current user can't open:
 * guests go to sign-in, signed-in users without the role (or on guest-only pages) go home.
 */
function RouteGuard(props: RouteGuardProps) {
	const { routes, userRole, children } = props;
	const currentRoute = useCurrentRoute(routes);

	if (!currentRoute || hasPermission(currentRoute.auth, userRole)) {
		return children;
	}

	const isGuest = hasPermission([], userRole);

	return (
		<Navigate
			to={isGuest ? SIGN_IN_PATH : SIGNED_IN_HOME_PATH}
			replace
		/>
	);
}

export default RouteGuard;
