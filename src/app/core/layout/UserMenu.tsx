import { MouseEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { darken } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useAuth } from 'src/app/auth/AuthRouteProvider';

/**
 * Toolbar button with the signed-in user's name/role and a sign-out menu.
 */
function UserMenu() {
	const user = useSelector(selectUser);
	const { signOut } = useAuth();
	const [userMenuAnchorElement, setUserMenuAnchorElement] = useState<HTMLElement | null>(null);

	if (!user) {
		return null;
	}

	function handleOpenUserMenu(event: MouseEvent<HTMLElement>) {
		setUserMenuAnchorElement(event.currentTarget);
	}

	function handleCloseUserMenu() {
		setUserMenuAnchorElement(null);
	}

	return (
		<>
			<Button
				className="min-h-40 min-w-40 p-0 md:px-16 md:py-6"
				onClick={handleOpenUserMenu}
				color="inherit"
			>
				<div className="mx-4 hidden flex-col items-end md:flex">
					<Typography
						component="span"
						className="flex font-semibold"
					>
						{user.data.displayName}
					</Typography>
					<Typography
						className="text-11 font-medium capitalize"
						color="text.secondary"
					>
						{user.role?.toString()}
					</Typography>
				</div>

				<Avatar
					sx={{
						background: (theme) => darken(theme.palette.background.default, 0.05),
						color: 'text.secondary'
					}}
					className="md:mx-4"
					alt={user.data.displayName}
					src={user.data.photoURL}
				>
					{user.data.displayName?.[0]}
				</Avatar>
			</Button>

			<Popover
				open={Boolean(userMenuAnchorElement)}
				anchorEl={userMenuAnchorElement}
				onClose={handleCloseUserMenu}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
				classes={{ paper: 'py-8' }}
			>
				<MenuItem onClick={() => signOut()}>
					<ListItemIcon className="min-w-40">
						<LogoutIcon />
					</ListItemIcon>
					<ListItemText primary="Cerrar sesión" />
				</MenuItem>
			</Popover>
		</>
	);
}

export default UserMenu;
