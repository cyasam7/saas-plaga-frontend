import { GridColDef } from '@mui/x-data-grid';
import { Chip } from '@mui/material';
import { IDataGridUserRow } from 'src/app/shared/entities/UserEntity';

export const columnsUsers: GridColDef<IDataGridUserRow>[] = [
  {
    field: 'name',
    headerName: 'NOMBRE',
    flex: 1,
    disableColumnMenu: true,
    renderCell: (params) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{params.value}</span>
      </div>
    ),
  },
  {
    field: 'email',
    headerName: 'CORREO',
    flex: 1,
    disableColumnMenu: true,
    renderCell: (params) => (
      <span className="text-gray-600">{params.value}</span>
    ),
  },
  {
    field: 'phone',
    headerName: 'TELÉFONO',
    flex: 1,
    disableColumnMenu: true,
    renderCell: (params) => (
      <span className="text-gray-600">{params.value}</span>
    ),
  },
  {
    field: 'rol',
    headerName: 'ROL',
    flex: 1,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color="primary"
        variant="outlined"
        size="small"
        sx={{
          fontWeight: 500,
          '& .MuiChip-label': {
            px: 1,
          },
        }}
      />
    ),
  },
  /* {
    field: 'tenant',
    headerName: 'TENANT / COMPAÑÍA',
    flex: 1,
    disableColumnMenu: true,
    renderCell: (params) => (
      <span className="text-gray-600">{params.value}</span>
    ),
  }, */
  {
    field: 'isActive',
    headerName: 'ACTIVADO',
    flex: 1,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Chip
        label={params.value ? 'Activo' : 'Inactivo'}
        color={params.value ? 'success' : 'error'}
        size="small"
        sx={{
          fontWeight: 500,
          '& .MuiChip-label': {
            px: 1,
          },
        }}
      />
    ),
  },
]; 