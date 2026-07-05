import { Stack, TextField, Button, Autocomplete } from '@mui/material';
import React from 'react';
import { Add } from '@mui/icons-material';
import { IHeaderGridProps } from './IHeaderGrid';

function HeaderGrid(props: IHeaderGridProps) {
	const { onClickCreate, onChangeIsActive, onChangeSearch } = props;
	return (
		<Stack
			direction="row"
			justifyContent="space-between"
		>
			<Stack
				direction="row"
				spacing={2}
			>
				<TextField
					size="small"
					fullWidth
					sx={{ width: '500px' }}
					placeholder="Buscar"
					onChange={(e) => onChangeSearch(e.target.value)}
				/>
				<Autocomplete
					disablePortal
					options={['ACTIVO', 'INACTIVO']}
					fullWidth
					onChange={(_, value) => {
						onChangeIsActive(value !== null ? value === 'ACTIVO' : null);
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							label="ACTIVO"
							variant="outlined"
							size="small"
						/>
					)}
				/>
			</Stack>
			<Stack direction="row-reverse">
				<Button
					color="primary"
					variant="contained"
					startIcon={<Add />}
					onClick={onClickCreate}
				>
					Agregar
				</Button>
			</Stack>
		</Stack>
	);
}

export default HeaderGrid;
