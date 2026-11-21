import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { INavItem } from './types';

/**
 * Sidebar navigation, filtered per user role by `auth`.
 */
const navigationConfig: INavItem[] = [
	{
		id: 'modules-app',
		title: 'Usuarios',
		type: 'group',
		children: [
			{
				id: 'membership',
				title: 'Membresías',
				type: 'item',
				icon: CardMembershipOutlinedIcon,
				auth: ['admin'],
				url: '/membership'
			},
			{
				id: 'users',
				title: 'Trabajadores',
				type: 'item',
				icon: EngineeringOutlinedIcon,
				auth: ['staff'],
				url: '/users'
			},
			{
				id: 'clients',
				title: 'Clientes',
				type: 'item',
				auth: ['staff', 'coordinator'],
				icon: ContactsOutlinedIcon,
				url: '/clients'
			}
		]
	},
	{
		id: 'orders-app',
		title: 'Ordenes',
		type: 'group',
		auth: ['staff', 'coordinator'],
		children: [
			{
				id: 'orders-created',
				title: 'Panel de órdenes',
				type: 'item',
				auth: ['staff', 'coordinator'],
				icon: AssignmentOutlinedIcon,
				url: '/orders',
				end: true
			},
			{
				id: 'orders-history',
				title: 'Historial',
				type: 'item',
				auth: ['staff', 'coordinator'],
				icon: HistoryOutlinedIcon,
				url: '/orders/history'
			}
		]
	},
	{
		id: 'configurations-app',
		title: 'Configuración',
		auth: ['staff'],
		type: 'group',
		children: [
			{
				id: 'company-branches',
				title: 'Sucursales',
				type: 'item',
				icon: StorefrontOutlinedIcon,
				auth: ['staff'],
				url: '/company-branches'
			},
			{
				id: 'catalogs',
				title: 'Catálogos',
				type: 'item',
				auth: ['staff'],
				icon: CategoryOutlinedIcon,
				url: '/catalogs'
			},
			{
				id: 'configurations-account',
				title: 'Reportes',
				type: 'item',
				auth: ['staff'],
				icon: DescriptionOutlinedIcon,
				url: '/configuration/reports'
			}
		]
	}
];

export default navigationConfig;
