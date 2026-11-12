import { QueryKey, useQueryClient } from 'react-query';

interface UseQueryInvalidator {
	invalidate: (value: QueryKey) => void;
}

const useQueryInvalidator = (): UseQueryInvalidator => {
	const queryClient = useQueryClient();

	function invalidate(value?: QueryKey): void {
		if (value) {
			queryClient.invalidateQueries(value);
		}
	}

	return { invalidate };
};

export default useQueryInvalidator;
