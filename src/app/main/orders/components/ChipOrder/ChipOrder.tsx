import { Box } from '@mui/material';
import { EStatusOrder } from 'src/app/requests/orders/types';
import { statusLabel, statusTone, statusToneColors } from '../../utils';

export interface IChipOrderProps {
	status: EStatusOrder;
}

function ChipOrder({ status }: IChipOrderProps) {
	const toneColors = statusToneColors[statusTone[status] ?? 'neutral'];

	return (
		<Box
			component="span"
			sx={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: '6px',
				px: '12px',
				py: '4px',
				borderRadius: '999px',
				fontSize: 13,
				fontWeight: 600,
				lineHeight: 1.3,
				whiteSpace: 'nowrap',
				bgcolor: toneColors.background,
				color: toneColors.text,
				boxShadow: toneColors.border ? `inset 0 0 0 1px ${toneColors.border}` : 'none'
			}}
		>
			<Box
				component="span"
				sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: toneColors.dot }}
			/>
			{statusLabel[status]}
		</Box>
	);
}

export default ChipOrder;
