import { Box, Paper, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ReceiptLong, PendingActions, Today, Event, EventBusy } from '@mui/icons-material';
import { OrdersDatagridStats } from 'src/app/shared/services/OrderService';
import { statusColor } from '../../utils';
import { EStatusOrder } from 'src/app/shared/entities/OrderEntity';

interface StatsCardsProps {
	stats: OrdersDatagridStats;
}

interface StatItem {
	label: string;
	value: number;
	icon: React.ReactNode;
	color: string;
	bgColor: string;
}

export function StatsCards({ stats }: StatsCardsProps) {
	const theme = useTheme();

	const cards: StatItem[] = [
		{
			label: 'Total',
			value: stats.total,
			icon: <ReceiptLong />,
			color: theme.palette.primary.main,
			bgColor: alpha(theme.palette.primary.main, 0.08)
		},
		{
			label: 'Hoy',
			value: stats.today,
			icon: <Today />,
			color: theme.palette.info.main,
			bgColor: alpha(theme.palette.info.main, 0.12)
		},
		{
			label: 'Mañana',
			value: stats.tomorrow,
			icon: <Event />,
			color: theme.palette.secondary.main,
			bgColor: alpha(theme.palette.secondary.main, 0.12)
		},
		{
			label: 'Pendientes',
			value: stats.pending,
			icon: <PendingActions />,
			color: theme.palette.warning.main,
			bgColor: alpha(theme.palette.warning.main, 0.12)
		},
		{
			label: 'Pasadas',
			value: stats.passed,
			icon: <EventBusy />,
			color: statusColor[EStatusOrder.PASSED],
			bgColor: alpha(statusColor[EStatusOrder.PASSED], 0.12)
		}
	];

	return (
		// Son 5 tarjetas: CSS grid en vez de Grid de MUI, que solo reparte columnas enteras sobre 12.
		<Box
			sx={{
				display: 'grid',
				gap: 2.5,
				mb: 3,
				gridTemplateColumns: {
					xs: 'repeat(2, 1fr)',
					sm: 'repeat(3, 1fr)',
					lg: 'repeat(5, 1fr)'
				}
			}}
		>
			{cards.map((stat) => (
				<Paper
					key={stat.label}
					elevation={0}
					sx={{
						p: 2.5,
						borderRadius: 2,
						border: 1,
						borderColor: 'divider',
						display: 'flex',
						alignItems: 'center',
						gap: 2,
						transition: 'transform 0.2s, box-shadow 0.2s',
						'&:hover': {
							transform: 'translateY(-2px)',
							boxShadow: 2
						}
					}}
				>
					<Box
						sx={{
							width: 44,
							height: 44,
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							bgcolor: stat.bgColor,
							color: stat.color,
							flexShrink: 0
						}}
					>
						{stat.icon}
					</Box>
					<Box>
						<Typography
							variant="h5"
							sx={{ fontWeight: 700, lineHeight: 1.2 }}
						>
							{stat.value}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							{stat.label}
						</Typography>
					</Box>
				</Paper>
			))}
		</Box>
	);
}
