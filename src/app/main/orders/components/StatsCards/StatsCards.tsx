import { useMemo } from 'react';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { ReceiptLong, PendingActions, Today, Autorenew } from '@mui/icons-material';
import dayjs from 'dayjs';
import { DatagridRowOrder, EStatusOrder } from 'src/app/shared/entities/OrderEntity';

interface StatsCardsProps {
	orders: DatagridRowOrder[];
}

interface StatItem {
	label: string;
	value: number;
	icon: React.ReactNode;
	color: string;
	bgColor: string;
}

export function StatsCards({ orders }: StatsCardsProps) {
	const theme = useTheme();

	const stats = useMemo<StatItem[]>(() => {
		const today = dayjs().format('YYYY-MM-DD');

		return [
			{
				label: 'Total',
				value: orders.length,
				icon: <ReceiptLong />,
				color: theme.palette.primary.main,
				bgColor: 'rgba(30, 41, 59, 0.08)'
			},
			{
				label: 'Pendientes',
				value: orders.filter(
					(o) => o.status === EStatusOrder.CREATED || o.status === EStatusOrder.ASSIGNED
				).length,
				icon: <PendingActions />,
				color: '#f59e0b',
				bgColor: 'rgba(245, 158, 11, 0.08)'
			},
			{
				label: 'Hoy',
				value: orders.filter((o) => dayjs(o.date).format('YYYY-MM-DD') === today).length,
				icon: <Today />,
				color: '#3b82f6',
				bgColor: 'rgba(59, 130, 246, 0.08)'
			},
			{
				label: 'En progreso',
				value: orders.filter((o) => o.status === EStatusOrder.IN_PROGRESS).length,
				icon: <Autorenew />,
				color: theme.palette.secondary.main,
				bgColor: 'rgba(79, 70, 229, 0.08)'
			}
		];
	}, [orders, theme]);

	return (
		<Grid
			container
			spacing={2.5}
			sx={{ mb: 3 }}
		>
			{stats.map((stat) => (
				<Grid
					item
					xs={6}
					sm={3}
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
