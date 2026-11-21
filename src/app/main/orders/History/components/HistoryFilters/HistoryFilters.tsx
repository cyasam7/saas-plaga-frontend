import { Autocomplete, Button, MenuItem, Stack, TextField } from '@mui/material';
import SearchField from 'app/shared/components/SearchField/SearchField';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

import { EClientType } from 'src/app/requests/clients/types';
import { EStatusOrder } from 'src/app/requests/orders/types';

import FumigatorFilter from '../../../components/HeaderFilters/FumigatorFilter';
import { HISTORY_STATUSES, OrdersHistoryFilters } from '../../helpers';
import { translateOrderStatus } from '../../../utils';

const clientTypeOptions = [
	{ value: EClientType.INDIVIDUAL, label: 'Residencial' },
	{ value: EClientType.BUSINESS, label: 'Empresa' }
] as const;

export interface HistoryFiltersProps {
	filters: OrdersHistoryFilters;
	hasActiveFilters: boolean;
	onFilterChange: <K extends keyof OrdersHistoryFilters>(key: K, value: OrdersHistoryFilters[K]) => void;
	onClear: () => void;
}

function HistoryFilters({
	filters,
	hasActiveFilters,
	onFilterChange,
	onClear
}: HistoryFiltersProps) {
	const handleDateChange = (key: 'dateFrom' | 'dateTo') => (value: Dayjs | null) => {
		onFilterChange(key, value?.isValid() ? value.toISOString() : null);
	};

	return (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			spacing={1.5}
			alignItems={{ xs: 'stretch', md: 'center' }}
			flexWrap="wrap"
			useFlexGap
		>
			<SearchField
				placeholder="Buscar folio, cliente, teléfono, dirección o fumigador"
				ariaLabel="Buscar en el historial de órdenes"
				value={filters.search}
				onChange={(search) => onFilterChange('search', search)}
				sx={{ flex: { md: '1 1 260px' }, minWidth: { md: 240 } }}
			/>

			<DatePicker
				label="Desde"
				value={filters.dateFrom ? dayjs(filters.dateFrom) : null}
				onChange={handleDateChange('dateFrom')}
				slotProps={{ textField: { size: 'small' }, field: { clearable: true } }}
			/>

			<DatePicker
				label="Hasta"
				value={filters.dateTo ? dayjs(filters.dateTo) : null}
				minDate={filters.dateFrom ? dayjs(filters.dateFrom) : undefined}
				onChange={handleDateChange('dateTo')}
				slotProps={{ textField: { size: 'small' }, field: { clearable: true } }}
			/>

			<Autocomplete
				multiple
				size="small"
				options={HISTORY_STATUSES}
				value={filters.status}
				getOptionLabel={translateOrderStatus}
				onChange={(_, value) => onFilterChange('status', value as EStatusOrder[])}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Estatus"
					/>
				)}
				sx={{ minWidth: 240 }}
			/>

			<TextField
				select
				label="Tipo de cliente"
				size="small"
				value={filters.clientType ?? ''}
				onChange={(e) => onFilterChange('clientType', (e.target.value || null) as EClientType | null)}
				sx={{ minWidth: 160 }}
			>
				<MenuItem value="">Todos</MenuItem>
				{clientTypeOptions.map((option) => (
					<MenuItem
						key={option.value}
						value={option.value}
					>
						{option.label}
					</MenuItem>
				))}
			</TextField>

			<FumigatorFilter
				value={filters.fumigatorId}
				onChange={(fumigatorId) => onFilterChange('fumigatorId', fumigatorId)}
			/>

			<Button
				variant="text"
				color="inherit"
				disabled={!hasActiveFilters}
				onClick={onClear}
				sx={{ flexShrink: 0 }}
			>
				Limpiar filtros
			</Button>
		</Stack>
	);
}

export default HistoryFilters;
