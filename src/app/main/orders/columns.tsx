import { Stack, Typography } from '@mui/material';
import InitialsAvatar from 'app/shared/components/InitialsAvatar/InitialsAvatar';
import dayjs from 'dayjs';
import { GridColDef } from '@mui/x-data-grid';

import { formatCurrency } from 'src/app/shared/constants/formatCurrency';
import ChipOrder from 'src/app/main/orders/components/ChipOrder/ChipOrder';
import { IOrdersDatagridResponse } from 'src/app/requests/orders/useQueryOrdersDatagrid';
import { statusLabel } from './utils';

/** "Hoy · 10:00 AM", "Mañana · 8:30 AM", "12 nov · 2:00 PM". */
export function formatOrderWhen(date: string, today = dayjs()): string {
	const orderDate = dayjs(date);
	const time = orderDate.format('h:mm A');
	const daysFromToday = orderDate.startOf('day').diff(today.startOf('day'), 'day');
	const relativeDayLabels: Record<number, string> = { [-1]: 'Ayer', 0: 'Hoy', 1: 'Mañana' };
	const dayLabel = relativeDayLabels[daysFromToday] ?? orderDate.format('D MMM');

	return `${dayLabel} · ${time}`;
}

export const columnsOrders: GridColDef<IOrdersDatagridResponse['orders'][number]>[] = [
	{
		headerName: 'Folio',
		field: 'folio',
		sortable: false,
		flex: 1,
		minWidth: 140,
		disableColumnMenu: true,
		renderCell: ({ row }) => (
			<Stack spacing={0.25}>
				<Typography variant="body2" fontFamily="monospace" fontWeight="medium">
					{row.folio}
				</Typography>
				<Typography variant="caption" color="text.secondary">
					{formatOrderWhen(row.date)}
				</Typography>
			</Stack>
		)
	},
	{
		headerName: 'Cliente',
		field: 'client',
		sortable: false,
		flex: 1.2,
		minWidth: 160,
		disableColumnMenu: true,
		valueGetter: ({ row }) => row.client.name,
		renderCell: ({ row }) => (
			<Stack spacing={0.25}>
				<Typography variant="subtitle2" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
					{row.client.name}
				</Typography>
				{row.isFollowUp && (
					<Typography variant="caption" color="text.secondary">
						Seguimiento
					</Typography>
				)}
			</Stack>
		)
	},
	{
		headerName: 'Dirección',
		field: 'address',
		sortable: false,
		flex: 1.6,
		minWidth: 200,
		disableColumnMenu: true,
		valueGetter: ({ row }) => row.client.address,
		renderCell: ({ value }) => (
			<Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
				{value}
			</Typography>
		)
	},
	{
		headerName: 'Teléfono',
		field: 'phone',
		sortable: false,
		flex: 0.9,
		minWidth: 130,
		disableColumnMenu: true,
		valueGetter: ({ row }) => row.client.phone,
		renderCell: ({ value }) => (
			<Typography variant="body2" fontFamily="monospace" color="text.secondary">
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
			<Typography variant="body2" fontWeight="bold" sx={{ fontVariantNumeric: 'tabular-nums' }}>
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
		field: 'assignedName',
		sortable: false,
		flex: 1.2,
		minWidth: 150,
		disableColumnMenu: true,
		renderCell: ({ row }) => {
			if (!row.assignedName) {
				return (
					<Typography variant="body2" color="text.secondary">
						Sin asignar
					</Typography>
				);
			}

			return (
				<Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
					<InitialsAvatar name={row.assignedName} />
					<Typography variant="body2" noWrap>
						{row.assignedName}
					</Typography>
				</Stack>
			);
		}
	}
];
