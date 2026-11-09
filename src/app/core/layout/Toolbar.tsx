import AppBar from '@mui/material/AppBar';
import MuiToolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import { useLayout } from './LayoutContext';
import NavbarToggleButton from './NavbarToggleButton';
import UserMenu from './UserMenu';

/**
 * Top bar: sidebar toggle (when the sidebar is hidden or on mobile) and the user menu.
 */
function Toolbar() {
	const { isNavbarOpen } = useLayout();
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
	const isToggleVisible = isMobile || !isNavbarOpen;

	return (
		<AppBar
			id="app-toolbar"
			className="sticky top-0 z-20 flex shadow"
			color="default"
			sx={{ backgroundColor: 'background.paper' }}
			position="static"
			elevation={0}
		>
			<MuiToolbar className="min-h-48 p-0 md:min-h-64">
				<div className="flex flex-1 px-16">
					{isToggleVisible && <NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />}
				</div>

				<div className="flex h-full items-center overflow-x-auto px-8">
					<UserMenu />
				</div>
			</MuiToolbar>
		</AppBar>
	);
}

export default Toolbar;
