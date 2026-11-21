import { Button, MenuItem, Stack, Tab, Tabs, TextField } from '@mui/material';
import SearchField from 'app/shared/components/SearchField/SearchField';
import { UserRoleTab } from '../../types';
import { USER_ROLE_TABS } from '../../utils';

type StatusFilter = 'all' | 'active' | 'inactive';

interface UsersFiltersProps {
	search: string;
	isActive: boolean | null;
	roleTab: UserRoleTab;
	onChangeSearch: (search: string) => void;
	onChangeIsActive: (isActive: boolean | null) => void;
	onChangeRoleTab: (roleTab: UserRoleTab) => void;
	onClearFilters: () => void;
}

function UsersFilters({
	search,
	isActive,
	roleTab,
	onChangeSearch,
	onChangeIsActive,
	onChangeRoleTab,
	onClearFilters
}: UsersFiltersProps) {
	// La pestaña de rol no cuenta como filtro: "Limpiar filtros" la conserva.
	const hasActiveFilters = Boolean(search || isActive !== null);

	let statusFilter: StatusFilter = 'all';
	if (isActive !== null) statusFilter = isActive ? 'active' : 'inactive';

	function handleChangeStatusFilter(selectedStatusFilter: StatusFilter) {
		onChangeIsActive(selectedStatusFilter === 'all' ? null : selectedStatusFilter === 'active');
	}

	return (
		<Stack spacing={1.5}>
			<Tabs
				value={roleTab}
				onChange={(_event, nextRoleTab: UserRoleTab) => onChangeRoleTab(nextRoleTab)}
				variant="scrollable"
				scrollButtons={false}
				aria-label="Filtrar trabajadores por rol"
				sx={{ minHeight: '40px', '.MuiTab-root': { minHeight: '40px' } }}
			>
				{USER_ROLE_TABS.map((userRoleTab) => (
					<Tab
						key={userRoleTab.value}
						label={userRoleTab.label}
						value={userRoleTab.value}
					/>
				))}
			</Tabs>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={1.5}
				alignItems={{ xs: 'stretch', md: 'center' }}
				flexWrap="wrap"
				useFlexGap
			>
				<SearchField
					placeholder="Buscar por nombre, correo o teléfono"
					ariaLabel="Buscar usuarios por nombre, correo o teléfono"
					value={search}
					onChange={onChangeSearch}
					sx={{ flex: { md: '1 1 260px' }, minWidth: { md: 240 } }}
				/>
				<TextField
					select
					size="small"
					label="Estado"
					value={statusFilter}
					onChange={(event) => handleChangeStatusFilter(event.target.value as StatusFilter)}
					sx={{ width: { xs: '100%', md: 160 } }}
				>
					<MenuItem value="all">Todos</MenuItem>
					<MenuItem value="active">Activos</MenuItem>
					<MenuItem value="inactive">Inactivos</MenuItem>
				</TextField>
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
		</Stack>
	);
}

export default UsersFilters;
