import { Box, Typography } from '@mui/material';

import { formatCurrency } from 'src/app/shared-constants/formatCurrency';
import { IOrdersDatagridResponse } from 'src/app/requests/orders/useQueryOrdersDatagrid';
import { formatOrderWhen } from '../utils';
import FumigatorAvatar from './FumigatorAvatar';
import OrderActions from './OrderActions';
import StatusBadge from './StatusBadge';

const GRID_COLUMNS = '132px minmax(0,1.2fr) minmax(0,1.6fr) 130px 108px 128px minmax(0,1.2fr) 148px';
const COLUMN_HEADERS = ['Folio', 'Cliente', 'Dirección', 'Teléfono', 'Costo', 'Estatus', 'Fumigador', 'Acciones'];
const RIGHT_ALIGNED_HEADERS = ['Costo', 'Acciones'];

interface OrdersTableProps {
	orders: IOrdersDatagridResponse['orders'];
	onAssign: (orderId: string) => void;
	onGenerateReport: (orderId: string) => void;
}

function OrdersTable({ orders, onAssign, onGenerateReport }: OrdersTableProps) {
	return (
		<Box role="table" sx={{ overflowX: 'auto' }}>
			<Box
				role="row"
				sx={{
					display: 'grid',
					gridTemplateColumns: GRID_COLUMNS,
					gap: 1.5,
					px: 2.5,
					py: 1.5,
					minWidth: 1040,
					bgcolor: 'var(--gray-50)',
					borderBottom: '1px solid var(--border-subtle)',
					font: 'var(--text-caption)',
					letterSpacing: 'var(--tracking-label)',
					textTransform: 'uppercase',
					color: 'var(--fg-3)'
				}}
			>
				{COLUMN_HEADERS.map((header) => (
					<Box
						key={header}
						role="columnheader"
						sx={{ textAlign: RIGHT_ALIGNED_HEADERS.includes(header) ? 'right' : 'left' }}
					>
						{header}
					</Box>
				))}
			</Box>

			{orders.map((order) => (
				<Box
					key={order.id}
					role="row"
					sx={{
						display: 'grid',
						gridTemplateColumns: GRID_COLUMNS,
						gap: 1.5,
						px: 2.5,
						py: 1.75,
						minWidth: 1040,
						alignItems: 'center',
						borderBottom: '1px solid var(--border-subtle)',
						'&:hover': { bgcolor: 'var(--gray-50)' }
					}}
				>
					<Box role="cell" sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
						<Typography sx={{ font: '500 13px/1.4 var(--font-mono)', color: 'var(--fg-1)' }}>
							{order.folio}
						</Typography>
						<Typography sx={{ font: 'var(--text-caption)', color: 'var(--fg-3)' }}>
							{formatOrderWhen(order.date)}
						</Typography>
					</Box>
					<Box role="cell" sx={{ minWidth: 0 }}>
						<Typography sx={{ font: '600 14px/1.4 var(--font-sans)', color: 'var(--fg-1)' }}>
							{order.client.name}
						</Typography>
						{order.isFollowUp && (
							<Typography sx={{ font: 'var(--text-caption)', color: 'var(--fg-3)' }}>Seguimiento</Typography>
						)}
					</Box>
					<Typography role="cell" sx={{ font: 'var(--text-body-sm)', color: 'var(--fg-2)', textWrap: 'pretty' }}>
						{order.client.address}
					</Typography>
					<Typography role="cell" sx={{ font: 'var(--text-mono)', color: 'var(--fg-2)' }}>
						{order.client.phone}
					</Typography>
					<Typography
						role="cell"
						sx={{
							font: '600 14px/1.4 var(--font-sans)',
							color: 'var(--fg-1)',
							textAlign: 'right',
							fontVariantNumeric: 'tabular-nums'
						}}
					>
						${formatCurrency(order.price)}
					</Typography>
					<Box role="cell">
						<StatusBadge status={order.status} />
					</Box>
					<Box role="cell" sx={{ minWidth: 0 }}>
						<FumigatorAvatar fumigatorName={order.assignedName} size={28} />
					</Box>
					<Box role="cell">
						<OrderActions order={order} onAssign={onAssign} onGenerateReport={onGenerateReport} />
					</Box>
				</Box>
			))}
		</Box>
	);
}

export default OrdersTable;
