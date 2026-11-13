import { SvgIconComponent } from '@mui/icons-material';
import { RouteAuth } from 'app/core/routing/types';

/**
 * A sidebar entry: a `group` (titled section holding children) or an `item` (link to `url`).
 * Items whose `auth` the user doesn't satisfy are hidden (same rules as route auth).
 */
export interface INavItem {
	id: string;
	title: string;
	type: 'group' | 'item';
	icon?: SvgIconComponent;
	url?: string;
	/** Only mark the item active on an exact URL match (e.g. `/orders` vs `/orders/history`). */
	end?: boolean;
	auth?: RouteAuth;
	children?: INavItem[];
}
