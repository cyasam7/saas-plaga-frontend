import { Autocomplete, Button, MenuItem, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

import { EClientType, EStatusOrder } from 'src/app/shared/entities/OrderEntity';

import { HISTORY_STATUSES, OrdersHistoryFilters } from '../../helpers';
import { translateOrderStatus } from '../../../utils';

const clientTypeOptions = [
	{ value: EClientType.INDIVIDUAL, label: 'Residencial' },
	{ value: EClientType.BUSINESS, label: 'Empresa' }
] as const;

export interface HistoryFiltersProps {
	filters: OrdersHistoryFilters;
	searchInput: string;
	showClearButton: boolean;
	onSearchInputChange: (value: string) => void;
	onFilterChange: <K extends keyof OrdersHistoryFilters>(key: K, value: OrdersHistoryFilters[K]) => void;
	onClear: () => void;
}

function HistoryFilters({
	filters,
	searchInput,
	showClearButton,
	onSearchInputChange,
	onFilterChange,
	onClear
}: HistoryFiltersProps) {
	const handleDateChange = (key: 'dateFrom' | 'dateTo') => (value: Dayjs | null) => {
		onFilterChange(key, value?.isValid() ? value.toISOString() : null);
	};

	return (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			spacing={2}
			alignItems={{ xs: 'stretch', md: 'center' }}
			flexWrap="wrap"
			useFlexGap
		>
			<TextField
				label="Buscar"
				placeholder="Folio, cliente, teléfono, dirección o fumigador"
				size="small"
				value={searchInput}
				onChange={(e) => onSearchInputChange(e.target.value)}
				sx={{ minWidth: 260, flex: 1 }}
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

			{showClearButton && (
				<Button
					size="small"
					color="inherit"
					onClick={onClear}
				>
					Limpiar filtros
				</Button>
			)}
		</Stack>
	);
}

export default HistoryFilters;
