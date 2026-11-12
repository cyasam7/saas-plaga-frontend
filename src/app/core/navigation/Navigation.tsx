import { NavLink } from 'react-router-dom';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import navigationConfig from './navigationConfig';
import { hasPermission } from 'app/core/routing/hasPermission';
import { UserRole } from 'app/core/routing/types';
import { INavItem } from './types';

/**
 * Removes the items the user can't access, and groups left without visible children.
 */
export function filterNavigationByRole(navItems: INavItem[], userRole: UserRole): INavItem[] {
	return navItems
		.filter((navItem) => hasPermission(navItem.auth, userRole))
		.map((navItem) =>
			navItem.children ? { ...navItem, children: filterNavigationByRole(navItem.children, userRole) } : navItem
		)
		.filter((navItem) => navItem.type !== 'group' || (navItem.children?.length ?? 0) > 0);
}

type NavigationItemProps = {
	navItem: INavItem;
	onItemClick: () => void;
};

function NavigationItem(props: NavigationItemProps) {
	const { navItem, onItemClick } = props;
	const ItemIcon = navItem.icon;

	return (
		<ListItemButton
			component={NavLink}
			to={navItem.url ?? ''}
			end={navItem.end}
			onClick={onItemClick}
			sx={{
				minHeight: 44,
				borderRadius: '6px',
				mb: '4px',
				px: 2,
				py: '10px',
				color: (theme) => alpha(theme.palette.text.primary, 0.7),
				textDecoration: 'none!important',
				'&:hover': { color: 'text.primary' },
				'&.active': {
					color: 'text.primary',
					backgroundColor: 'rgba(255, 255, 255, .1)!important',
					pointerEvents: 'none'
				}
			}}
		>
			{ItemIcon && (
				<ItemIcon
					className="mr-16 shrink-0"
					fontSize="small"
					color="action"
				/>
			)}
			<ListItemText
				primary={navItem.title}
				classes={{ primary: 'text-13 font-medium truncate' }}
			/>
		</ListItemButton>
	);
}

type NavigationProps = {
	onItemClick: () => void;
};

/**
 * Sidebar menu built from navigationConfig, showing only what the current user can access.
 */
function Navigation(props: NavigationProps) {
	const { onItemClick } = props;
	const userRole = useAuth().user.role;
	const visibleNavItems = filterNavigationByRole(navigationConfig, userRole);

	return (
		<List className="navigation flex-1 whitespace-nowrap px-12 py-0">
			{visibleNavItems.map((navItem) =>
				navItem.type === 'group' ? (
					<li key={navItem.id}>
						<Typography
							className="mb-4 mt-24 px-12 text-12 font-semibold uppercase tracking-wider"
							color="secondary.main"
						>
							{navItem.title}
						</Typography>
						<List disablePadding>
							{navItem.children?.map((childNavItem) => (
								<NavigationItem
									key={childNavItem.id}
									navItem={childNavItem}
									onItemClick={onItemClick}
								/>
							))}
						</List>
					</li>
				) : (
					<NavigationItem
						key={navItem.id}
						navItem={navItem}
						onItemClick={onItemClick}
					/>
				)
			)}
		</List>
	);
}

export default Navigation;
