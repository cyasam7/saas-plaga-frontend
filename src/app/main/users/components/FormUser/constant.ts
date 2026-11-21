import { ERoleCode } from 'src/app/requests/users/types';

export const ROLE_CATALOG = [
	{
		name: 'Super Admin',
		value: ERoleCode.SUPER_ADMIN
	},
	{
		name: 'Administrador',
		value: ERoleCode.ADMIN_TENANT
	},
	{
		name: 'Fumigador',
		value: ERoleCode.FUMIGATOR_TENANT
	},
	{
		name: 'Coordinador',
		value: ERoleCode.COORDINATOR_TENANT
	}
];
