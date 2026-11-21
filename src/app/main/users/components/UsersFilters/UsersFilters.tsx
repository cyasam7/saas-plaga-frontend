import { Button, MenuItem, Stack, TextField } from '@mui/material';
import SearchField from 'app/shared/components/SearchField/SearchField';
import { ERoleCode } from 'src/app/requests/users/types';
import { ROLE_CATALOG } from '../FormUser/constant';

type StatusFilter = 'all' | 'active' | 'inactive';

interface UsersFiltersProps {
	search: string;
	isActive: boolean | null;
	roleCode: string;
	onChangeSearch: (search: string) => void;
	onChangeIsActive: (isActive: boolean | null) => void;
	onChangeRoleCode: (roleCode: string) => void;
	onClearFilters: () => void;
}

function UsersFilters({
	search,
	isActive,
	roleCode,
	onChangeSearch,
	onChangeIsActive,
	onChangeRoleCode,
	onClearFilters
}: UsersFiltersProps) {
	const hasActiveFilters = Boolean(search || roleCode || isActive !== null);

	let statusFilter: StatusFilter = 'all';
	if (isActive !== null) statusFilter = isActive ? 'active' : 'inactive';

	function handleChangeStatusFilter(selectedStatusFilter: StatusFilter) {
		onChangeIsActive(selectedStatusFilter === 'all' ? null : selectedStatusFilter === 'active');
	}

	return (
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
				label="Rol"
				value={roleCode}
				onChange={(event) => onChangeRoleCode(event.target.value)}
				sx={{ width: { xs: '100%', md: 180 } }}
			>
				<MenuItem value="">Todos</MenuItem>
				{ROLE_CATALOG.filter((role) => role.value !== ERoleCode.SUPER_ADMIN).map((role) => (
					<MenuItem
						key={role.value}
						value={role.value}
					>
						{role.name}
					</MenuItem>
				))}
			</TextField>
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
	);
}

export default UsersFilters;
