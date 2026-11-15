import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add } from '@mui/icons-material';
import dayjs from 'dayjs';

import { EOrdersDayFilter } from 'src/app/requests/orders/types';
import { IOrdersDatagridStatsResponse } from 'src/app/requests/orders/useQueryOrdersDatagridStats';

const DAY_TABS: { dayFilter: EOrdersDayFilter; label: string; statKey: keyof IOrdersDatagridStatsResponse }[] = [
	{ dayFilter: EOrdersDayFilter.ALL, label: 'Todas', statKey: 'total' },
	{ dayFilter: EOrdersDayFilter.TODAY, label: 'Hoy', statKey: 'today' },
	{ dayFilter: EOrdersDayFilter.TOMORROW, label: 'Mañana', statKey: 'tomorrow' },
	{ dayFilter: EOrdersDayFilter.PENDING, label: 'Pendientes', statKey: 'pending' },
	{ dayFilter: EOrdersDayFilter.PASSED, label: 'No visitadas', statKey: 'passed' }
];

interface OrdersHeaderProps {
	stats: IOrdersDatagridStatsResponse;
	selectedDayFilter: EOrdersDayFilter;
	onDayFilterChange: (dayFilter: EOrdersDayFilter) => void;
	onCreateOrder: () => void;
}

function OrdersHeader({ stats, selectedDayFilter, onDayFilterChange, onCreateOrder }: OrdersHeaderProps) {
	const todayLabel = dayjs().format('dddd, D [de] MMMM YYYY');

	return (
		<Stack spacing={2.5} sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 }, pb: 1 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={2}>
				<Box sx={{ minWidth: 0 }}>
					<Typography variant="h4" component="h1" fontWeight={700}>
						Órdenes
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ '&::first-letter': { textTransform: 'uppercase' } }}
					>
						{todayLabel} · {stats.total} órdenes en el sistema
					</Typography>
				</Box>
				<Button
					variant="contained"
					color="primary"
					size="large"
					startIcon={<Add />}
					onClick={onCreateOrder}
					sx={{ flexShrink: 0, fontWeight: 600 }}
				>
					Nueva orden
				</Button>
			</Stack>

			{/* Control segmentado: Tabs de MUI sin indicador, la pestaña activa se "levanta" sobre el fondo. */}
			<Tabs
				value={selectedDayFilter}
				onChange={(_, dayFilter: EOrdersDayFilter) => onDayFilterChange(dayFilter)}
				variant="scrollable"
				scrollButtons={false}
				TabIndicatorProps={{ hidden: true }}
				sx={{
					alignSelf: 'flex-start',
					maxWidth: '100%',
					minHeight: 0,
					p: 0.5,
					borderRadius: 2,
					bgcolor: 'action.hover',
					'& .MuiTabs-flexContainer': { gap: 0.5 }
				}}
			>
				{DAY_TABS.map((tab) => {
					const isSelected = tab.dayFilter === selectedDayFilter;

					return (
						<Tab
							key={tab.dayFilter}
							value={tab.dayFilter}
							disableRipple
							label={
								<Stack direction="row" alignItems="center" spacing={1}>
									<span>{tab.label}</span>
									<Box
										component="span"
										sx={{
											px: 0.875,
											borderRadius: 999,
											fontSize: 12,
											fontWeight: 500,
											color: isSelected ? 'primary.dark' : 'text.secondary',
											bgcolor: (theme) => (isSelected ? alpha(theme.palette.primary.main, 0.12) : 'transparent')
										}}
									>
										{stats[tab.statKey]}
									</Box>
								</Stack>
							}
							sx={{
								minHeight: 34,
								minWidth: 0,
								px: 1.75,
								py: 0,
								my: .25,
								borderRadius: 1.5,
								textTransform: 'none',
								fontSize: 14,
								fontWeight: isSelected ? 600 : 500,
								color: 'text.secondary',
								'&.Mui-selected': {
									color: 'text.primary',
									bgcolor: 'background.paper',
									boxShadow: 1
								},
								'&:hover': { color: 'text.primary' }
							}}
						/>
					);
				})}
			</Tabs>
		</Stack>
	);
}

export default OrdersHeader;
