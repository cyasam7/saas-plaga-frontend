import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme, ThemeProvider } from '@mui/material/styles';
import Navigation from 'app/core/navigation/Navigation';
import { navbarTheme } from 'app/core/theme/theme';
import { useLayout } from './LayoutContext';
import NavbarToggleButton from './NavbarToggleButton';
import UserNavbarHeader from './UserNavbarHeader';

const NAVBAR_WIDTH = 280;

type NavbarContentProps = {
	onItemClick: () => void;
};

function NavbarContent(props: NavbarContentProps) {
	const { onItemClick } = props;

	return (
		<Box
			className="flex h-full flex-auto flex-col overflow-hidden"
			sx={{ backgroundColor: 'background.default', color: 'text.primary' }}
		>
			<div className="flex h-48 shrink-0 flex-row items-center px-20 md:h-72">
				<div className="mx-4 flex flex-1" />
				<NavbarToggleButton className="h-40 w-40 p-0" />
			</div>

			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain">
				<UserNavbarHeader />
				<Navigation onItemClick={onItemClick} />
			</div>
		</Box>
	);
}

/**
 * Sidebar: docked (collapsible) on desktop, swipeable drawer on mobile. Uses the dark navbar theme.
 */
function Navbar() {
	const { isNavbarOpen, isMobileNavbarOpen, setIsMobileNavbarOpen } = useLayout();
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
	const { pathname } = useLocation();

	useEffect(() => {
		setIsMobileNavbarOpen(false);
	}, [pathname, setIsMobileNavbarOpen]);

	function closeMobileNavbar() {
		setIsMobileNavbarOpen(false);
	}

	return (
		<ThemeProvider theme={navbarTheme}>
			{isMobile ? (
				<SwipeableDrawer
					anchor="left"
					variant="temporary"
					open={isMobileNavbarOpen}
					onClose={closeMobileNavbar}
					onOpen={() => setIsMobileNavbarOpen(true)}
					disableSwipeToOpen
					ModalProps={{ keepMounted: true }}
					PaperProps={{ className: 'flex-col flex-auto h-full', sx: { width: NAVBAR_WIDTH } }}
				>
					<NavbarContent onItemClick={closeMobileNavbar} />
				</SwipeableDrawer>
			) : (
				<Box
					id="app-navbar"
					className="sticky top-0 z-20 h-screen flex-none flex-col overflow-hidden shadow"
					sx={{
						width: NAVBAR_WIDTH,
						minWidth: NAVBAR_WIDTH,
						marginLeft: isNavbarOpen ? 0 : `-${NAVBAR_WIDTH}px`,
						transition: (theme) =>
							theme.transitions.create('margin', {
								easing: theme.transitions.easing.easeOut,
								duration: isNavbarOpen
									? theme.transitions.duration.enteringScreen
									: theme.transitions.duration.leavingScreen
							})
					}}
				>
					<NavbarContent onItemClick={() => {}} />
				</Box>
			)}
		</ThemeProvider>
	);
}

export default Navbar;
