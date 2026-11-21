import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

interface IUseFilterParams<TKey extends string> {
	/** Valor crudo de cada filtro; cadena vacía = sin filtro. */
	filters: Record<TKey, string>;
	/** Cambia uno o varios filtros en una sola escritura de la URL; '' borra el filtro. */
	setFilters: (changes: Partial<Record<TKey, string>>) => void;
	/** Borra solo estos filtros; la pestaña y otros params se conservan. */
	clearFilters: () => void;
	hasActiveFilters: boolean;
}

/**
 * Filtros de la página guardados en query params: la vista es enlazable, sobrevive el refresh
 * y el back/forward. Trabaja con strings; el hook de filtros de cada pantalla valida y convierte
 * los valores a sus tipos (enums, listas, booleanos).
 * `filterKeys` debe ser una constante del módulo (`as const`) para que la referencia sea estable.
 */
function useFilterParams<TKey extends string>(filterKeys: readonly TKey[]): IUseFilterParams<TKey> {
	const [searchParams, setSearchParams] = useSearchParams();

	const filters = useMemo(
		() =>
			Object.fromEntries(filterKeys.map((filterKey) => [filterKey, searchParams.get(filterKey) ?? ''])) as Record<
				TKey,
				string
			>,
		[searchParams, filterKeys]
	);

	const setFilters = useCallback(
		(changes: Partial<Record<TKey, string>>) => {
			setSearchParams(
				(previousParams) => {
					const nextParams = new URLSearchParams(previousParams);

					Object.entries(changes).forEach(([filterKey, filterValue]) => {
						if (filterValue) nextParams.set(filterKey, filterValue as string);
						else nextParams.delete(filterKey);
					});

					return nextParams;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	const clearFilters = useCallback(() => {
		setSearchParams(
			(previousParams) => {
				const nextParams = new URLSearchParams(previousParams);

				filterKeys.forEach((filterKey) => nextParams.delete(filterKey));

				return nextParams;
			},
			{ replace: true }
		);
	}, [filterKeys, setSearchParams]);

	const hasActiveFilters = filterKeys.some((filterKey) => Boolean(filters[filterKey]));

	return { filters, setFilters, clearFilters, hasActiveFilters };
}

export default useFilterParams;
