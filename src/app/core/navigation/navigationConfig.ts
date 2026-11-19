import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonPinTwoToneIcon from '@mui/icons-material/PersonPinTwoTone';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
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
				icon: PeopleOutlineIcon,
				auth: ['admin'],
				url: '/membership'
			},
			{
				id: 'users',
				title: 'Trabajadores',
				type: 'item',
				icon: PeopleOutlineIcon,
				auth: ['staff'],
				url: '/users'
			},
			{
				id: 'clients',
				title: 'Clientes',
				type: 'item',
				auth: ['staff', 'coordinator'],
				icon: PersonPinTwoToneIcon,
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
				icon: DashboardOutlinedIcon,
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
				id: 'catalogs',
				title: 'Catálogos',
				type: 'item',
				auth: ['staff'],
				icon: ArchiveOutlinedIcon,
				url: '/catalogs'
			},
			{
				id: 'configurations-account',
				title: 'Reportes',
				type: 'item',
				auth: ['staff'],
				icon: AssessmentOutlinedIcon,
				url: '/configuration/reports'
			}
		]
	}
];

export default navigationConfig;
