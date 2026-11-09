import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useLayout } from './LayoutContext';

type NavbarToggleButtonProps = {
	className?: string;
};

/**
 * Toggles the sidebar: the drawer on mobile, the docked navbar on desktop.
 */
function NavbarToggleButton(props: NavbarToggleButtonProps) {
	const { className } = props;
	const { isNavbarOpen, isMobileNavbarOpen, setIsNavbarOpen, setIsMobileNavbarOpen } = useLayout();
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

	function handleToggleNavbar() {
		if (isMobile) {
			setIsMobileNavbarOpen(!isMobileNavbarOpen);
		} else {
			setIsNavbarOpen(!isNavbarOpen);
		}
	}

	return (
		<IconButton
			className={className}
			color="inherit"
			size="small"
			aria-label="Mostrar u ocultar menú"
			onClick={handleToggleNavbar}
		>
			<MenuIcon />
		</IconButton>
	);
}

export default NavbarToggleButton;
