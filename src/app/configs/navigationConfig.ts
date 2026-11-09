import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonPinTwoToneIcon from '@mui/icons-material/PersonPinTwoTone';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { INavItem } from 'app/core/navigation/types';

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
				auth: ['staff'],
				icon: PersonPinTwoToneIcon,
				url: '/clients'
			}
		]
	},
	{
		id: 'orders-app',
		title: 'Ordenes',
		type: 'group',
		auth: ['staff'],
		children: [
			{
				id: 'orders-created',
				title: 'Registradas',
				type: 'item',
				auth: ['staff'],
				icon: AssignmentOutlinedIcon,
				url: '/orders',
				end: true
			},
			{
				id: 'orders-history',
				title: 'Historial',
				type: 'item',
				auth: ['staff'],
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
