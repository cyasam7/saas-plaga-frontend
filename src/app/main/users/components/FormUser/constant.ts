import { ERoleCode } from 'src/app/requests/users/types';

export const ROLE_CATALOG = [
	{
		name: 'Admin',
		value: ERoleCode.SUPER_ADMIN
	},
	{
		name: 'Administrador',
		value: ERoleCode.ADMIN_TENANT
	},
	{
		name: 'Fumigador',
		value: ERoleCode.FUMIGATOR_TENANT
	}
];
