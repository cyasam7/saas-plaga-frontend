import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const TAB_PARAM = 'tabSelected';

/**
 * Pestaña activa de la página guardada en el query param `tabSelected`: la vista es enlazable,
 * sobrevive el refresh y el back/forward. Un valor ausente o inválido cae en la primera pestaña,
 * que no se escribe en la URL. Los demás query params (filtros) se conservan.
 */
function useTabParam<TTab extends string>(tabKeys: readonly TTab[]): [TTab, (tab: TTab) => void] {
	const [searchParams, setSearchParams] = useSearchParams();

	const requestedTab = searchParams.get(TAB_PARAM) as TTab | null;
	const activeTab = requestedTab && tabKeys.includes(requestedTab) ? requestedTab : tabKeys[0];
	const defaultTab = tabKeys[0];

	const setActiveTab = useCallback(
		(tab: TTab) => {
			setSearchParams(
				(previousParams) => {
					const nextParams = new URLSearchParams(previousParams);

					if (tab === defaultTab) nextParams.delete(TAB_PARAM);
					else nextParams.set(TAB_PARAM, tab);

					return nextParams;
				},
				{ replace: true }
			);
		},
		[defaultTab, setSearchParams]
	);

	return [activeTab, setActiveTab];
}

export default useTabParam;
