import { Box, MenuItem, TextField } from '@mui/material';

import { EStatusOrder } from 'src/app/shared/entities/OrderEntity';
import FumigatorFilter from '../../components/HeaderFilters/FumigatorFilter';
import { statusLabel } from '../../utils';
import { OrdersAdminFilters } from '../types';
import { fieldSx } from '../utils';

/** Estatus que devuelve GET /order/datagrid (OPERATIONAL_STATUSES del API). */
const DATAGRID_STATUSES = [EStatusOrder.CREATED, EStatusOrder.ASSIGNED, EStatusOrder.PASSED];

interface OrdersFilterFieldsProps {
	filters: OrdersAdminFilters;
	onFilterChange: <K extends keyof OrdersAdminFilters>(key: K, value: OrdersAdminFilters[K]) => void;
	fumigatorId: string;
	onFumigatorChange: (fumigatorId: string) => void;
	clientNames: string[];
	/** Mobile (drawer): un campo por fila. */
	isStacked?: boolean;
}

function OrdersFilterFields({
	filters,
	onFilterChange,
	fumigatorId,
	onFumigatorChange,
	clientNames,
	isStacked = false
}: OrdersFilterFieldsProps) {
	const widthSx = (desktopWidth: number) => (isStacked ? { width: '100%' } : { width: desktopWidth });

	return (
		<>
			<Box sx={{ display: 'flex', gap: 1.5, ...(isStacked ? {} : { flexShrink: 0 }) }}>
				<TextField
					type="date"
					size="small"
					label="Desde"
					value={filters.dateFrom}
					onChange={(event) => onFilterChange('dateFrom', event.target.value)}
					InputLabelProps={{ shrink: true }}
					inputProps={{ max: filters.dateTo || undefined }}
					sx={{ ...fieldSx, ...widthSx(160) }}
				/>
				<TextField
					type="date"
					size="small"
					label="Hasta"
					value={filters.dateTo}
					onChange={(event) => onFilterChange('dateTo', event.target.value)}
					InputLabelProps={{ shrink: true }}
					inputProps={{ min: filters.dateFrom || undefined }}
					sx={{ ...fieldSx, ...widthSx(160) }}
				/>
			</Box>
			<TextField
				select
				size="small"
				label="Estatus"
				value={filters.status}
				onChange={(event) => onFilterChange('status', event.target.value as OrdersAdminFilters['status'])}
				sx={{ ...fieldSx, ...widthSx(160) }}
			>
				<MenuItem value="">Todos</MenuItem>
				{DATAGRID_STATUSES.map((status) => (
					<MenuItem key={status} value={status}>
						{statusLabel[status]}
					</MenuItem>
				))}
			</TextField>
			<FumigatorFilter
				value={fumigatorId}
				onChange={onFumigatorChange}
				fullWidth={isStacked}
			/>
			<TextField
				select
				size="small"
				label="Cliente"
				value={filters.clientName}
				onChange={(event) => onFilterChange('clientName', event.target.value)}
				sx={{ ...fieldSx, ...widthSx(200) }}
			>
				<MenuItem value="">Todos</MenuItem>
				{clientNames.map((clientName) => (
					<MenuItem key={clientName} value={clientName}>
						{clientName}
					</MenuItem>
				))}
			</TextField>
		</>
	);
}

export default OrdersFilterFields;
