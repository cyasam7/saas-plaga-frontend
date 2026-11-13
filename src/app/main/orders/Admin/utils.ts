import dayjs from 'dayjs';

import { IOrdersDatagridResponse } from 'src/app/requests/orders/useQueryOrdersDatagrid';
import { OrdersAdminFilters } from './types';

export const EMPTY_ADMIN_FILTERS: OrdersAdminFilters = {
	search: '',
	dateFrom: '',
	dateTo: '',
	status: '',
	clientName: ''
};

export function countActiveFilters(filters: OrdersAdminFilters, fumigatorId: string): number {
	const activeValues = [filters.dateFrom, filters.dateTo, filters.status, filters.clientName, fumigatorId];
	return activeValues.filter(Boolean).length;
}

/** Aplica búsqueda, rango de fechas, estatus y cliente; ordena cronológicamente. */
export function filterOrders(orders: IOrdersDatagridResponse['orders'], filters: OrdersAdminFilters): IOrdersDatagridResponse['orders'] {
	const normalizedSearch = filters.search.trim().toLowerCase();

	return orders
		.filter((order) => {
			if (normalizedSearch) {
				const searchableValues = [order.folio, order.client.name, order.client.address, order.client.phone];
				const matchesSearch = searchableValues.some((value) =>
					(value ?? '').toLowerCase().includes(normalizedSearch)
				);

				if (!matchesSearch) return false;
			}

			const orderDay = dayjs(order.date).format('YYYY-MM-DD');

			if (filters.dateFrom && orderDay < filters.dateFrom) return false;

			if (filters.dateTo && orderDay > filters.dateTo) return false;

			if (filters.status && order.status !== filters.status) return false;

			if (filters.clientName && order.client.name !== filters.clientName) return false;

			return true;
		})
		.sort((firstOrder, secondOrder) => dayjs(firstOrder.date).valueOf() - dayjs(secondOrder.date).valueOf());
}

/** "Hoy · 10:00 AM", "Mañana · 8:30 AM", "12 nov · 2:00 PM". */
export function formatOrderWhen(date: string, today = dayjs()): string {
	const orderDate = dayjs(date);
	const time = orderDate.format('h:mm A');
	const daysFromToday = orderDate.startOf('day').diff(today.startOf('day'), 'day');
	const relativeDayLabels: Record<number, string> = { [-1]: 'Ayer', 0: 'Hoy', 1: 'Mañana' };
	const dayLabel = relativeDayLabels[daysFromToday] ?? orderDate.format('D MMM');

	return `${dayLabel} · ${time}`;
}

/** Botones del design system (Button primary/secondary) sobre MUI `Button variant="text"`. */
export const primaryButtonSx = {
	height: 40,
	px: 2,
	gap: 1,
	borderRadius: 'var(--radius-md)',
	font: 'var(--text-body-sm)',
	fontWeight: 600,
	textTransform: 'none',
	whiteSpace: 'nowrap',
	color: '#fff',
	bgcolor: 'var(--accent-primary)',
	border: '1px solid transparent',
	'&:hover': { bgcolor: 'var(--accent-primary-hover)' },
	'&:active': { bgcolor: 'var(--accent-primary-active)' },
	'&.Mui-disabled': { bgcolor: 'var(--gray-200)', color: 'var(--gray-400)' }
};

export const secondaryButtonSx = {
	...primaryButtonSx,
	color: 'var(--fg-1)',
	bgcolor: 'var(--surface-card)',
	border: '1px solid var(--border-default)',
	'&:hover': { bgcolor: 'var(--surface-sunken)' },
	'&:active': { bgcolor: 'var(--gray-200)' }
};

/** Input/Select del design system sobre MUI `TextField size="small"`. */
export const fieldSx = {
	'& .MuiOutlinedInput-root': {
		height: 40,
		borderRadius: 'var(--radius-md)',
		bgcolor: 'var(--surface-card)',
		font: 'var(--text-body-sm)',
		color: 'var(--fg-1)',
		'& fieldset': { borderColor: 'var(--border-default)' },
		'&:hover fieldset': { borderColor: 'var(--border-strong)' },
		'&.Mui-focused fieldset': { borderColor: 'var(--accent-primary)', borderWidth: 1 },
		'&.Mui-focused': { boxShadow: 'var(--shadow-focus)' }
	},
	'& .MuiInputLabel-root.Mui-focused': { color: 'var(--accent-primary)' }
};
