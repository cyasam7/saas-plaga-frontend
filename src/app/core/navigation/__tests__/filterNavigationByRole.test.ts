import { describe, expect, it } from 'vitest';
import { filterNavigationByRole } from '../Navigation';
import { INavItem } from '../types';

const navItems: INavItem[] = [
	{
		id: 'users-group',
		title: 'Usuarios',
		type: 'group',
		children: [
			{ id: 'membership', title: 'Membresías', type: 'item', url: '/membership', auth: ['admin'] },
			{ id: 'clients', title: 'Clientes', type: 'item', url: '/clients', auth: ['staff'] }
		]
	},
	{
		id: 'orders-group',
		title: 'Ordenes',
		type: 'group',
		auth: ['staff'],
		children: [{ id: 'orders', title: 'Registradas', type: 'item', url: '/orders', auth: ['staff'] }]
	}
];

function getVisibleIds(visibleNavItems: INavItem[]): string[] {
	return visibleNavItems.flatMap((navItem) => [navItem.id, ...getVisibleIds(navItem.children ?? [])]);
}

describe('filterNavigationByRole', () => {
	it('shows staff only the items their role allows', () => {
		expect(getVisibleIds(filterNavigationByRole(navItems, ['staff']))).toEqual([
			'users-group',
			'clients',
			'orders-group',
			'orders'
		]);
	});

	it('drops groups left without visible children', () => {
		expect(getVisibleIds(filterNavigationByRole(navItems, ['admin']))).toEqual(['users-group', 'membership']);
	});
});
