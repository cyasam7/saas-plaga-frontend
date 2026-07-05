import { ERoleCode } from 'src/app/shared/entities/UserEntity';

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
