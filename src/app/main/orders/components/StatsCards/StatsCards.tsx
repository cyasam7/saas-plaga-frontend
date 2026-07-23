import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ReceiptLong, PendingActions, Today } from '@mui/icons-material';
import { OrdersDatagridStats } from 'src/app/shared/services/OrderService';

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
			label: 'Pendientes',
			value: stats.pending,
			icon: <PendingActions />,
			color: theme.palette.warning.main,
			bgColor: alpha(theme.palette.warning.main, 0.12)
		},
		{
			label: 'Hoy',
			value: stats.today,
			icon: <Today />,
			color: theme.palette.info.main,
			bgColor: alpha(theme.palette.info.main, 0.12)
		},
		{
			label: 'Total',
			value: stats.total,
			icon: <ReceiptLong />,
			color: theme.palette.primary.main,
			bgColor: alpha(theme.palette.primary.main, 0.08)
		}
	];

	return (
		<Grid
			container
			spacing={2.5}
			sx={{ mb: 3 }}
		>
			{cards.map((stat) => (
				<Grid
					item
					xs={12}
					sm={4}
					key={stat.label}
				>
					<Paper
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
				</Grid>
			))}
		</Grid>
	);
}
