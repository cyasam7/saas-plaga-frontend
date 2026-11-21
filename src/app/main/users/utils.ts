import { ERoleCode } from 'src/app/requests/users/types';

import { UserRoleTab } from './types';

/** La primera pestaña es la de por defecto. `roleCode` vacío = todos los roles. */
export const USER_ROLE_TABS: { value: UserRoleTab; label: string; roleCode: ERoleCode | '' }[] = [
	{ value: 'all', label: 'Todas', roleCode: '' },
	{ value: 'admins', label: 'Administradores', roleCode: ERoleCode.ADMIN_TENANT },
	{ value: 'coordinators', label: 'Coordinadores', roleCode: ERoleCode.COORDINATOR_TENANT },
	{ value: 'fumigators', label: 'Fumigadores', roleCode: ERoleCode.FUMIGATOR_TENANT }
];

export const USER_ROLE_TAB_KEYS = USER_ROLE_TABS.map((userRoleTab) => userRoleTab.value);
