import { Autocomplete, Button, MenuItem, Stack, TextField } from '@mui/material';
import SearchField from 'app/shared/components/SearchField/SearchField';

import { EStatusOrder } from 'src/app/requests/orders/types';
import { IClientsResponse } from 'src/app/requests/clients/useQueryClients';
import FumigatorFilter from '../HeaderFilters/FumigatorFilter';
import { OrdersFilters as IOrdersFilters } from '../../hooks/useOrdersFilters';
import { DATAGRID_STATUSES, statusLabel } from '../../utils';

interface OrdersFiltersProps {
	filters: IOrdersFilters;
	onFilterChange: <K extends keyof IOrdersFilters>(key: K, value: IOrdersFilters[K]) => void;
	onClearFilters: () => void;
	clients: IClientsResponse;
	/** Mobile (drawer): un campo por fila. */
	isStacked: boolean;
}

function OrdersFilters({ filters, onFilterChange, onClearFilters, clients, isStacked }: OrdersFiltersProps) {
	const hasActiveFilters = Boolean(filters.search || filters.status || filters.fumigatorId || filters.clientId);

	return (
		<Stack
			direction={isStacked ? 'column' : 'row'}
			spacing={1.5}
			alignItems={isStacked ? 'stretch' : 'center'}
			flexWrap="wrap"
			useFlexGap
		>
			<SearchField
				placeholder="Buscar folio, cliente, dirección, teléfono"
				ariaLabel="Buscar órdenes"
				value={filters.search}
				onChange={(search) => onFilterChange('search', search)}
				sx={{ flex: isStacked ? undefined : '1 1 260px', minWidth: isStacked ? 0 : 240 }}
			/>
			<TextField
				select
				size="small"
				label="Estatus"
				value={filters.status}
				onChange={(event) => onFilterChange('status', event.target.value as EStatusOrder | '')}
				sx={{ width: isStacked ? '100%' : 160 }}
			>
				<MenuItem value="">Todos</MenuItem>
				{DATAGRID_STATUSES.map((status) => (
					<MenuItem key={status} value={status}>
						{statusLabel[status]}
					</MenuItem>
				))}
			</TextField>
			<FumigatorFilter
				value={filters.fumigatorId}
				onChange={(fumigatorId) => onFilterChange('fumigatorId', fumigatorId)}
				fullWidth={isStacked}
			/>
			<Autocomplete
				size="small"
				options={clients}
				value={clients.find((client) => client.id === filters.clientId) ?? null}
				getOptionLabel={(client) => client.name}
				isOptionEqualToValue={(option, selected) => option.id === selected.id}
				onChange={(_, client) => onFilterChange('clientId', client?.id ?? '')}
				renderInput={(params) => <TextField {...params} label="Cliente" />}
				sx={{ width: isStacked ? '100%' : 220 }}
			/>
			<Button
				variant="text"
				color="inherit"
				disabled={!hasActiveFilters}
				onClick={onClearFilters}
				sx={{ flexShrink: 0 }}
			>
				Limpiar filtros
			</Button>
		</Stack>
	);
}

export default OrdersFilters;
