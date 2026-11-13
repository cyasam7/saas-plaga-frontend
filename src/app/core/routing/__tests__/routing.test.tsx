import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { buildRoutes } from '../buildRoutes';
import { hasPermission } from '../hasPermission';
import RouteGuard from '../RouteGuard';
import { IRouteItem, UserRole } from '../types';

describe('hasPermission', () => {
	it('allows everybody on public routes', () => {
		expect(hasPermission(null, null)).toBe(true);
		expect(hasPermission(undefined, ['staff'])).toBe(true);
	});

	it('allows only guests on guest-only routes', () => {
		expect(hasPermission([], null)).toBe(true);
		expect(hasPermission([], [])).toBe(true);
		expect(hasPermission([], ['staff'])).toBe(false);
		expect(hasPermission([], 'staff')).toBe(false);
	});

	it('requires one of the allowed roles', () => {
		expect(hasPermission(['staff', 'admin'], ['staff'])).toBe(true);
		expect(hasPermission(['staff', 'admin'], 'admin')).toBe(true);
		expect(hasPermission(['admin'], ['staff'])).toBe(false);
		expect(hasPermission(['admin'], null)).toBe(false);
	});
});

describe('buildRoutes', () => {
	it('resolves auth and isFullScreen from route, then config, then defaults', () => {
		const builtRoutes = buildRoutes(
			[
				{ routes: [{ path: 'a' }] },
				{
					auth: ['admin'],
					isFullScreen: true,
					routes: [{ path: 'b' }, { path: 'c', auth: null, isFullScreen: false }]
				}
			],
			['staff']
		);

		expect(builtRoutes.map(({ path, auth, isFullScreen }) => ({ path, auth, isFullScreen }))).toEqual([
			{ path: 'a', auth: ['staff'], isFullScreen: false },
			{ path: 'b', auth: ['admin'], isFullScreen: true },
			{ path: 'c', auth: null, isFullScreen: false }
		]);
	});
});

describe('RouteGuard', () => {
	const guardedRoutes: IRouteItem[] = [
		{ path: '/', auth: ['staff'] },
		{ path: '/sign-in', auth: [] },
		{ path: '/membership', auth: ['admin'] }
	];

	function renderAt(pathname: string, userRole: UserRole) {
		render(
			<MemoryRouter initialEntries={[pathname]}>
				<RouteGuard
					routes={guardedRoutes}
					userRole={userRole}
				>
					<Routes>
						<Route path="/" element={<div>home</div>} />
						<Route path="/sign-in" element={<div>sign-in</div>} />
						<Route path="/membership" element={<div>membership</div>} />
					</Routes>
				</RouteGuard>
			</MemoryRouter>
		);
	}

	it('sends guests on protected routes to sign-in', () => {
		renderAt('/membership', null);
		expect(screen.getByText('sign-in')).toBeTruthy();
	});

	it('sends signed-in users without the role home', () => {
		renderAt('/membership', ['staff']);
		expect(screen.getByText('home')).toBeTruthy();
	});

	it('sends signed-in users away from guest-only pages', () => {
		renderAt('/sign-in', ['staff']);
		expect(screen.getByText('home')).toBeTruthy();
	});

	it('renders the page when the user has permission', () => {
		renderAt('/membership', ['admin']);
		expect(screen.getByText('membership')).toBeTruthy();
	});
});
