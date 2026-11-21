import { Stack, Typography } from '@mui/material';
import InitialsAvatar from 'app/shared/components/InitialsAvatar/InitialsAvatar';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';

import ChipOrder from 'src/app/main/orders/components/ChipOrder/ChipOrder';
import { DATE_FORMAT, TIME_FORMAT } from 'src/app/shared/constants/dateFormat';
import { formatCurrency } from 'src/app/shared/constants/formatCurrency';
import { IOrdersHistoryResponse } from 'src/app/requests/orders/useQueryOrdersHistory';

import { statusLabel } from '../utils';

// Mismo orden y estilo de celdas que la tabla de órdenes (`../columns.tsx`).
export const columnsOrdersHistory: GridColDef<IOrdersHistoryResponse['data'][number]>[] = [
	{
		headerName: 'Folio',
		field: 'folio',
		sortable: false,
		flex: 1,
		minWidth: 140,
		disableColumnMenu: true,
		renderCell: ({ row }) => (
			<Stack spacing={0.25}>
				<Typography
					variant="body2"
					fontFamily="monospace"
					fontWeight="medium"
				>
					{row.folio}
				</Typography>
				<Typography
					variant="caption"
					color="text.secondary"
				>
					{dayjs(row.date).format(DATE_FORMAT)} · {dayjs(row.date).format(TIME_FORMAT)}
				</Typography>
			</Stack>
		)
	},
	{
		headerName: 'Cliente',
		field: 'clientName',
		sortable: false,
		flex: 1.5,
		minWidth: 160,
		disableColumnMenu: true,
		renderCell: ({ value }) => (
			<Typography
				variant="subtitle2"
				fontWeight="bold"
				sx={{ wordBreak: 'break-word' }}
			>
				{value}
			</Typography>
		)
	},
	{
		headerName: 'Costo',
		field: 'price',
		sortable: false,
		align: 'right',
		headerAlign: 'right',
		flex: 0.7,
		minWidth: 100,
		disableColumnMenu: true,
		valueFormatter: ({ value }) => `$${formatCurrency(String(value))}`,
		renderCell: ({ value }) => (
			<Typography
				variant="body2"
				fontWeight="bold"
				sx={{ fontVariantNumeric: 'tabular-nums' }}
			>
				${formatCurrency(String(value))}
			</Typography>
		)
	},
	{
		headerName: 'Estatus',
		field: 'status',
		sortable: false,
		flex: 0.8,
		minWidth: 120,
		disableColumnMenu: true,
		valueGetter: ({ row }) => statusLabel[row.status],
		renderCell: ({ row }) => <ChipOrder status={row.status} />
	},
	{
		headerName: 'Fumigador',
		field: 'fumigatorName',
		sortable: false,
		flex: 1.2,
		minWidth: 150,
		disableColumnMenu: true,
		renderCell: ({ row }) => {
			if (!row.fumigatorName) {
				return (
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Sin asignar
					</Typography>
				);
			}

			return (
				<Stack
					direction="row"
					alignItems="center"
					spacing={1}
					sx={{ minWidth: 0 }}
				>
					<InitialsAvatar name={row.fumigatorName} />
					<Typography
						variant="body2"
						noWrap
					>
						{row.fumigatorName}
					</Typography>
				</Stack>
			);
		}
	}
];

export default columnsOrdersHistory;
