import { useEffect, useState } from 'react';

interface IDebounceValue<T> {
	debounceValue: T;
	loading: boolean;
}

function useDebounce<T>(value: T, delay: number): IDebounceValue<T> {
	const [debounceValue, setDebounceValue] = useState<null | T>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setLoading(true);
		const timeout = setTimeout(() => {
			setDebounceValue(value);
			setLoading(false);
		}, delay);

		return () => {
			if (timeout) {
				clearTimeout(timeout);
			}
		};
	}, [value, delay]);

	return { debounceValue, loading };
}

export default useDebounce;
