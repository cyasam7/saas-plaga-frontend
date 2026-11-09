import { Suspense, useEffect } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import routes from 'app/configs/routesConfig';
import Loading from 'app/core/feedback/Loading';
import RouteGuard from 'app/core/routing/RouteGuard';
import { useCurrentRoute } from 'app/core/routing/useCurrentRoute';
import { selectUserRole } from 'src/app/auth/user/store/userSlice';
import { LayoutProvider } from './LayoutContext';
import Navbar from './Navbar';
import Toolbar from './Toolbar';

/** Max width of `.container` blocks inside pages (see PageLayout). */
const CONTAINER_MAX_WIDTH = 1570;

/**
 * App shell: sidebar + toolbar around the routed page, behind the route guard.
 * Full-screen routes (sign-in, public report views) render the page alone.
 */
function AppLayout() {
	const routedPage = useRoutes(routes);
	const currentRoute = useCurrentRoute(routes);
	const userRole = useSelector(selectUserRole);
	const isFullScreen = currentRoute?.isFullScreen ?? false;
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<RouteGuard
			routes={routes}
			userRole={userRole}
		>
			<LayoutProvider>
				<Box
					id="app-layout"
					className="flex w-full"
					sx={{ '& .container': { maxWidth: `${CONTAINER_MAX_WIDTH}px`, width: '100%', margin: '0 auto' } }}
				>
					<div className="flex min-w-0 flex-auto">
						{!isFullScreen && <Navbar />}

						<main className="relative z-10 flex min-h-full min-w-0 flex-auto flex-col">
							{!isFullScreen && <Toolbar />}

							<div className="relative z-10 flex min-h-0 flex-auto flex-col">
								<Suspense fallback={<Loading />}>{routedPage}</Suspense>
							</div>
						</main>
					</div>
				</Box>
			</LayoutProvider>
		</RouteGuard>
	);
}

export default AppLayout;
