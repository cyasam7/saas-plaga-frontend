import { RouteObject } from 'react-router-dom';

/**
 * Who can open a route:
 * - `null`: everybody (public).
 * - `[]`: only guests (not signed in).
 * - `['staff', ...]`: signed-in users with at least one of those roles.
 */
export type RouteAuth = string[] | null;

export type UserRole = string[] | string | null | undefined;

export type IRouteItem = RouteObject & {
	auth?: RouteAuth;
	/** Renders the page without navbar/toolbar (sign-in, public report views). */
	isFullScreen?: boolean;
};

/**
 * A feature's routes plus the defaults (auth, isFullScreen) its routes inherit.
 */
export interface IRouteConfig {
	routes: IRouteItem[];
	auth?: RouteAuth;
	isFullScreen?: boolean;
}
