import { Chip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { EStatusOrder } from 'src/app/shared/entities/OrderEntity';
import { statusColor, statusLabel, StatusOrderColors } from '../../utils';

export interface IChipOrderProps {
	status: EStatusOrder;
}

function ChipOrder({ status }: IChipOrderProps) {
	const theme = useTheme();
	const colorKey: StatusOrderColors = statusColor[status] ?? 'default';
	const main =
		colorKey === 'default' ? theme.palette.text.secondary : theme.palette[colorKey].main;

	return (
		<Chip
			size="small"
			label={statusLabel[status]}
			sx={{
				fontWeight: 600,
				color: main,
				bgcolor: alpha(main, 0.12),
				border: 1,
				borderColor: alpha(main, 0.3)
			}}
		/>
	);
}

export default ChipOrder;
