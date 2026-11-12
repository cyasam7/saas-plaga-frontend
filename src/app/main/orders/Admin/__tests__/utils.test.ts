import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';

import { IOrdersDatagridResponse } from 'src/app/requests/orders/useQueryOrdersDatagrid';
import { EStatusOrder } from 'src/app/requests/orders/types';
import { EMPTY_ADMIN_FILTERS, countActiveFilters, filterOrders, formatOrderWhen } from '../utils';

function buildOrder(overrides: Partial<IOrdersDatagridResponse['orders'][number]>): IOrdersDatagridResponse['orders'][number] {
	return {
		id: 'order-1',
		date: '2026-11-10T10:00:00',
		folio: 'F-1001',
		timezone: 'America/Mexico_City',
		client: { name: 'Hotel Casa Azul', phone: '55 5512 7781', address: 'Calle Londres 247' },
		status: EStatusOrder.CREATED,
		price: 1000,
		isFollowUp: false,
		...overrides
	};
}

const hotelOrder = buildOrder({ id: 'hotel', date: '2026-11-12T08:00:00' });
const bakeryOrder = buildOrder({
	id: 'bakery',
	folio: 'F-2002',
	date: '2026-11-09T16:00:00',
	status: EStatusOrder.ASSIGNED,
	client: { name: 'Panadería San Ángel', phone: '55 2841 0937', address: 'Av. Revolución 1520' }
});
const orders = [hotelOrder, bakeryOrder];

describe('filterOrders', () => {
	it('sorts orders chronologically when no filter is set', () => {
		const filteredOrderIds = filterOrders(orders, EMPTY_ADMIN_FILTERS).map((order) => order.id);

		expect(filteredOrderIds).toEqual(['bakery', 'hotel']);
	});

	it('searches folio, client name, address and phone case-insensitively', () => {
		const searchTerms = ['f-2002', 'PANADERÍA', 'revolución', '2841'];

		searchTerms.forEach((searchTerm) => {
			const filteredOrders = filterOrders(orders, { ...EMPTY_ADMIN_FILTERS, search: searchTerm });

			expect(filteredOrders.map((order) => order.id)).toEqual(['bakery']);
		});
	});

	it('keeps orders inside the inclusive date range', () => {
		const filteredOrders = filterOrders(orders, { ...EMPTY_ADMIN_FILTERS, dateFrom: '2026-11-10', dateTo: '2026-11-12' });

		expect(filteredOrders.map((order) => order.id)).toEqual(['hotel']);
	});

	it('filters by status and client name', () => {
		const ordersByStatus = filterOrders(orders, { ...EMPTY_ADMIN_FILTERS, status: EStatusOrder.ASSIGNED });
		const ordersByClient = filterOrders(orders, { ...EMPTY_ADMIN_FILTERS, clientName: 'Hotel Casa Azul' });

		expect(ordersByStatus.map((order) => order.id)).toEqual(['bakery']);
		expect(ordersByClient.map((order) => order.id)).toEqual(['hotel']);
	});
});

describe('countActiveFilters', () => {
	it('counts filter fields and the fumigator, but not the search', () => {
		const activeFilterCount = countActiveFilters({ ...EMPTY_ADMIN_FILTERS, search: 'hotel', status: EStatusOrder.CREATED }, 'fumigator-1');

		expect(activeFilterCount).toBe(2);
	});
});

describe('formatOrderWhen', () => {
	const today = dayjs('2026-11-10T09:00:00');

	it('uses relative labels for yesterday, today and tomorrow', () => {
		expect(formatOrderWhen('2026-11-09T16:00:00', today)).toBe('Ayer · 4:00 PM');
		expect(formatOrderWhen('2026-11-10T10:00:00', today)).toBe('Hoy · 10:00 AM');
		expect(formatOrderWhen('2026-11-11T08:30:00', today)).toBe('Mañana · 8:30 AM');
	});

	it('falls back to day and month for other dates', () => {
		expect(formatOrderWhen('2026-11-14T12:00:00', today)).toMatch(/^14 \S+ · 12:00 PM$/);
	});
});
