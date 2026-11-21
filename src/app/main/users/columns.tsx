import { GridColDef } from '@mui/x-data-grid';
import { Chip, Stack, Typography } from '@mui/material';
import InitialsAvatar from 'app/shared/components/InitialsAvatar/InitialsAvatar';
import { IUsersDatagridResponse } from 'src/app/requests/users/useQueryUsersDatagrid';

export const columnsUsers: GridColDef<IUsersDatagridResponse[number]>[] = [
	{
		field: 'name',
		headerName: 'Nombre',
		flex: 1.2,
		minWidth: 180,
		disableColumnMenu: true,
		renderCell: ({ row }) => {
			return (
				<Stack
					direction="row"
					alignItems="center"
					spacing={1.5}
					sx={{ minWidth: 0 }}
				>
					<InitialsAvatar name={row.name} />
					<Typography
						variant="body2"
						fontWeight="medium"
						noWrap
					>
						{row.name}
					</Typography>
				</Stack>
			);
		}
	},
	{
		field: 'email',
		headerName: 'Correo',
		flex: 1.2,
		minWidth: 180,
		disableColumnMenu: true,
		renderCell: ({ value }) => (
			<Typography
				variant="body2"
				color="text.secondary"
				noWrap
			>
				{value}
			</Typography>
		)
	},
	{
		field: 'phone',
		headerName: 'Teléfono',
		flex: 1,
		minWidth: 130,
		disableColumnMenu: true,
		renderCell: ({ value }) => (
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ fontVariantNumeric: 'tabular-nums' }}
			>
				{value}
			</Typography>
		)
	},
	{
		field: 'rol',
		headerName: 'Rol',
		flex: 1,
		minWidth: 130,
		disableColumnMenu: true,
		renderCell: ({ value }) => (
			<Chip
				label={value}
				variant="outlined"
				size="small"
				sx={{ fontWeight: 500 }}
			/>
		)
	},
	{
		field: 'isActive',
		headerName: 'Estado',
		width: 120,
		disableColumnMenu: true,
		renderCell: ({ value }) => (
			<Chip
				label={value ? 'Activo' : 'Inactivo'}
				color={value ? 'success' : 'default'}
				variant={value ? 'filled' : 'outlined'}
				size="small"
				sx={{ fontWeight: 500 }}
			/>
		)
	}
];
