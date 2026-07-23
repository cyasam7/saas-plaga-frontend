import { Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';

import ChipOrder from 'src/app/main/orders/components/ChipOrder/ChipOrder';
import { DATE_FORMAT, TIME_FORMAT } from 'src/app/shared-constants/dateFormat';
import { formatCurrency } from 'src/app/shared-constants/formatCurrency';
import { OrderHistoryRow } from 'src/app/shared/services/OrderService';

import { statusLabel } from '../utils';

export const columnsOrdersHistory: GridColDef<OrderHistoryRow>[] = [
	{
		headerName: 'Folio',
		field: 'folio',
		sortable: false,
		flex: 1,
		minWidth: 120,
		align: 'left',
		disableColumnMenu: true
	},
	{
		headerName: 'Fumigador',
		field: 'fumigatorName',
		sortable: false,
		flex: 1.2,
		minWidth: 140,
		align: 'left',
		disableColumnMenu: true,
		valueGetter: ({ value }) => (value || 'Sin asignar') as string,
		renderCell: ({ value }) => (
			<Typography
				variant="body2"
				color={value === 'Sin asignar' ? 'text.secondary' : 'text.primary'}
				fontWeight={value === 'Sin asignar' ? 'normal' : 'medium'}
				sx={{ wordBreak: 'break-word' }}
			>
				{value}
			</Typography>
		)
	},
	{
		headerName: 'Cliente',
		field: 'clientName',
		sortable: false,
		flex: 1.5,
		minWidth: 160,
		align: 'left',
		disableColumnMenu: true
	},
	{
		headerName: 'Fecha y hora',
		headerAlign: 'left',
		field: 'date',
		sortable: false,
		flex: 1,
		minWidth: 130,
		align: 'left',
		disableColumnMenu: true,
		renderCell: ({ row }) => (
			<Stack spacing={0.5}>
				<Typography variant="body2">{dayjs(row.date).format(DATE_FORMAT)}</Typography>
				<Typography variant="body2">{dayjs(row.date).format(TIME_FORMAT)}</Typography>
			</Stack>
		)
	},
	{
		headerName: 'Estatus',
		field: 'status',
		sortable: false,
		flex: 0.8,
		minWidth: 110,
		align: 'left',
		disableColumnMenu: true,
		valueGetter: ({ row }) => statusLabel[row.status],
		renderCell: ({ row }) => <ChipOrder status={row.status} />
	},
	{
		headerName: 'Precio',
		field: 'price',
		sortable: false,
		align: 'right',
		headerAlign: 'right',
		flex: 0.8,
		minWidth: 100,
		disableColumnMenu: true,
		renderCell: ({ value }) => (
			<Typography variant="body2" fontWeight="medium" color="primary">
				${formatCurrency(String(value))}
			</Typography>
		)
	}
];

export default columnsOrdersHistory;
