import { Box, Typography } from '@mui/material';
import { PhoneOutlined } from '@mui/icons-material';

import { formatCurrency } from 'src/app/shared/constants/formatCurrency';
import { IOrdersDatagridResponse } from 'src/app/requests/orders/useQueryOrdersDatagrid';
import { formatOrderWhen } from '../utils';
import FumigatorAvatar from './FumigatorAvatar';
import OrderActions from './OrderActions';
import StatusBadge from './StatusBadge';

interface OrderCardProps {
	order: IOrdersDatagridResponse['orders'][number];
	onAssign: (orderId: string) => void;
	onGenerateReport: (orderId: string) => void;
}

function OrderCard({ order, onAssign, onGenerateReport }: OrderCardProps) {
	return (
		<Box
			sx={{
				bgcolor: 'var(--surface-card)',
				border: '1px solid var(--border-subtle)',
				borderRadius: 'var(--radius-md)',
				boxShadow: 'var(--shadow-xs)',
				p: 1.75,
				display: 'flex',
				flexDirection: 'column',
				gap: 1.25
			}}
		>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
				<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, minWidth: 0 }}>
					<Typography sx={{ font: '500 13px/1.4 var(--font-mono)', color: 'var(--fg-1)' }}>
						{order.folio}
					</Typography>
					<Typography noWrap sx={{ font: 'var(--text-caption)', color: 'var(--fg-3)' }}>
						{formatOrderWhen(order.date)}
					</Typography>
				</Box>
				<StatusBadge status={order.status} />
			</Box>

			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
				<Box sx={{ minWidth: 0 }}>
					<Typography sx={{ font: '600 15px/1.35 var(--font-sans)', color: 'var(--fg-1)' }}>
						{order.client.name}
					</Typography>
					<Typography sx={{ font: 'var(--text-body-sm)', color: 'var(--fg-2)' }}>
						{order.client.address}
					</Typography>
				</Box>
				<Typography
					sx={{
						font: '600 15px/1.35 var(--font-sans)',
						color: 'var(--fg-1)',
						whiteSpace: 'nowrap',
						fontVariantNumeric: 'tabular-nums'
					}}
				>
					${formatCurrency(order.price)}
				</Typography>
			</Box>

			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, color: 'var(--fg-2)' }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
					<PhoneOutlined sx={{ fontSize: 14 }} />
					<Typography sx={{ font: '400 12px/1.5 var(--font-mono)' }}>{order.client.phone}</Typography>
				</Box>
				<FumigatorAvatar fumigatorName={order.assignedName} size={22} />
			</Box>

			<Box sx={{ pt: 1.25, borderTop: '1px solid var(--border-subtle)' }}>
				<OrderActions
					order={order}
					onAssign={onAssign}
					onGenerateReport={onGenerateReport}
					isFullWidth
				/>
			</Box>
		</Box>
	);
}

export default OrderCard;
