import Avatar from '@mui/material/Avatar';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import Typography from '@mui/material/Typography';

/**
 * Signed-in user's avatar, name and email at the top of the sidebar.
 */
function UserNavbarHeader() {
	const { user } = useAuth();

	return (
		<div className="relative flex flex-col items-center justify-center p-16 pb-14">
			<div className="mb-24 flex items-center justify-center">
				<Avatar
					sx={{ backgroundColor: 'background.paper', color: 'text.secondary' }}
					className="h-96 w-96 text-32 font-bold uppercase"
					src={user.data.photoURL}
					alt={user.data.displayName}
				>
					{user.data.displayName?.charAt(0)}
				</Avatar>
			</div>
			<Typography className="whitespace-nowrap text-14 font-medium">{user.data.displayName}</Typography>
			<Typography
				className="whitespace-nowrap text-13 font-medium"
				color="text.secondary"
			>
				{user.data.email}
			</Typography>
		</div>
	);
}

export default UserNavbarHeader;
