import { Stack, TextField, Button, MenuItem, InputAdornment } from '@mui/material';
import React from 'react';
import { Add, Search } from '@mui/icons-material';
import { IHeaderGridProps } from './IHeaderGrid';

type StatusFilter = 'all' | 'active' | 'inactive';

function HeaderGrid(props: IHeaderGridProps) {
	const { isActive, onClickCreate, onChangeIsActive, onChangeSearch } = props;

	let statusFilter: StatusFilter = 'all';
	if (isActive !== null) statusFilter = isActive ? 'active' : 'inactive';

	function handleChangeStatusFilter(selectedStatusFilter: StatusFilter) {
		onChangeIsActive(selectedStatusFilter === 'all' ? null : selectedStatusFilter === 'active');
	}

	return (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			justifyContent="space-between"
			spacing={2}
		>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={2}
				sx={{ flex: 1 }}
			>
				<TextField
					size="small"
					type="search"
					sx={{ width: { xs: '100%', sm: 400 } }}
					placeholder="Buscar por nombre, correo o teléfono"
					inputProps={{ 'aria-label': 'Buscar usuarios por nombre, correo o teléfono' }}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Search fontSize="small" />
							</InputAdornment>
						)
					}}
					onChange={(event) => onChangeSearch(event.target.value)}
				/>
				<TextField
					select
					size="small"
					label="Estado"
					value={statusFilter}
					sx={{ width: { xs: '100%', sm: 180 } }}
					onChange={(event) => handleChangeStatusFilter(event.target.value as StatusFilter)}
				>
					<MenuItem value="all">Todos</MenuItem>
					<MenuItem value="active">Activos</MenuItem>
					<MenuItem value="inactive">Inactivos</MenuItem>
				</TextField>
			</Stack>
			<Button
				color="primary"
				variant="contained"
				startIcon={<Add />}
				onClick={onClickCreate}
				sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}
			>
				Agregar
			</Button>
		</Stack>
	);
}

export default HeaderGrid;
