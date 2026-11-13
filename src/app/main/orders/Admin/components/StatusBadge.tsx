import { Box } from '@mui/material';

import { EStatusOrder } from 'src/app/requests/orders/types';
import { statusLabel } from '../../utils';

type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const STATUS_TONE: Record<EStatusOrder, BadgeTone> = {
	[EStatusOrder.CREATED]: 'warning',
	[EStatusOrder.ASSIGNED]: 'info',
	[EStatusOrder.IN_PROGRESS]: 'neutral',
	[EStatusOrder.PASSED]: 'danger',
	[EStatusOrder.DONE]: 'success',
	[EStatusOrder.FINISHED]: 'success'
};

interface StatusBadgeProps {
	status: EStatusOrder;
}

function StatusBadge({ status }: StatusBadgeProps) {
	const tone = STATUS_TONE[status] ?? 'neutral';

	return (
		<Box
			component="span"
			sx={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: '6px',
				px: '12px',
				py: '5px',
				borderRadius: 'var(--radius-pill)',
				font: 'var(--text-label)',
				whiteSpace: 'nowrap',
				bgcolor: `var(--status-${tone}-bg)`,
				color: `var(--status-${tone}-fg)`
			}}
		>
			<Box
				component="span"
				sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: `var(--status-${tone}-dot)` }}
			/>
			{statusLabel[status]}
		</Box>
	);
}

export default StatusBadge;
