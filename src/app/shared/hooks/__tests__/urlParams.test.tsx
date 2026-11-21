import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import useFilterParams from '../useFilterParams';
import useTabParam from '../useTabParam';

const TABS = ['first', 'second'] as const;
const FILTER_KEYS = ['search', 'status'] as const;

function renderWithUrl(initialUrl: string) {
	const wrapper = ({ children }: { children: ReactNode }) => (
		<MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>
	);

	return renderHook(
		() => ({
			tabParam: useTabParam(TABS),
			filterParams: useFilterParams(FILTER_KEYS),
			location: useLocation()
		}),
		{ wrapper }
	);
}

describe('useTabParam', () => {
	it('falls back to the first tab when the param is missing or invalid', () => {
		expect(renderWithUrl('/page').result.current.tabParam[0]).toBe('first');
		expect(renderWithUrl('/page?tabSelected=unknown').result.current.tabParam[0]).toBe('first');
		expect(renderWithUrl('/page?tabSelected=second').result.current.tabParam[0]).toBe('second');
	});

	it('omits the default tab from the URL and keeps filter params', () => {
		const { result } = renderWithUrl('/page?search=ana');

		act(() => result.current.tabParam[1]('second'));
		expect(result.current.location.search).toBe('?search=ana&tabSelected=second');

		act(() => result.current.tabParam[1]('first'));
		expect(result.current.location.search).toBe('?search=ana');
	});
});

describe('useFilterParams', () => {
	it('reads missing filters as empty strings', () => {
		const { result } = renderWithUrl('/page?status=done');

		expect(result.current.filterParams.filters).toEqual({ search: '', status: 'done' });
		expect(result.current.filterParams.hasActiveFilters).toBe(true);
	});

	it('writes several filters at once and deletes empty values', () => {
		const { result } = renderWithUrl('/page?status=done');

		act(() => result.current.filterParams.setFilters({ search: 'ana', status: '' }));
		expect(result.current.location.search).toBe('?search=ana');
	});

	it('clears only its own keys, keeping the tab', () => {
		const { result } = renderWithUrl('/page?tabSelected=second&search=ana&status=done');

		act(() => result.current.filterParams.clearFilters());
		expect(result.current.location.search).toBe('?tabSelected=second');
		expect(result.current.filterParams.hasActiveFilters).toBe(false);
	});
});
