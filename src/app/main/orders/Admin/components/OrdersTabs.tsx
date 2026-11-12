import { Box, ButtonBase } from '@mui/material';

import { EOrdersDayFilter, OrdersDatagridStats } from 'src/app/shared/services/OrderService';

const DAY_TABS: { dayFilter: EOrdersDayFilter; label: string; statKey: keyof OrdersDatagridStats }[] = [
	{ dayFilter: EOrdersDayFilter.ALL, label: 'Todas', statKey: 'total' },
	{ dayFilter: EOrdersDayFilter.TODAY, label: 'Hoy', statKey: 'today' },
	{ dayFilter: EOrdersDayFilter.TOMORROW, label: 'Mañana', statKey: 'tomorrow' },
	{ dayFilter: EOrdersDayFilter.PENDING, label: 'Pendientes', statKey: 'pending' },
	{ dayFilter: EOrdersDayFilter.PASSED, label: 'No visitadas', statKey: 'passed' }
];

interface OrdersTabsProps {
	selectedDayFilter: EOrdersDayFilter;
	stats: OrdersDatagridStats;
	onChange: (dayFilter: EOrdersDayFilter) => void;
	/** Mobile: pills con scroll horizontal en lugar del control segmentado. */
	isPill?: boolean;
}

function OrdersTabs({ selectedDayFilter, stats, onChange, isPill = false }: OrdersTabsProps) {
	return (
		<Box
			role="tablist"
			sx={
				isPill
					? { display: 'flex', gap: 1, overflowX: 'auto', scrollbarWidth: 'none' }
					: {
							display: 'inline-flex',
							alignSelf: 'flex-start',
							gap: 0.5,
							p: 0.5,
							bgcolor: 'var(--surface-sunken)',
							borderRadius: 'var(--radius-md)',
							maxWidth: '100%',
							overflowX: 'auto'
						}
			}
		>
			{DAY_TABS.map((tab) => {
				const isSelected = tab.dayFilter === selectedDayFilter;
				const segmentedSx = {
					height: 34,
					px: '14px',
					borderRadius: 'var(--radius-sm)',
					bgcolor: isSelected ? 'var(--surface-card)' : 'transparent',
					boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
					color: isSelected ? 'var(--fg-1)' : 'var(--fg-2)',
					'&:hover': { color: 'var(--fg-1)' }
				};
				const pillSx = {
					height: 36,
					px: '14px',
					borderRadius: 'var(--radius-pill)',
					border: '1px solid',
					borderColor: isSelected ? 'var(--surface-dark)' : 'var(--border-default)',
					bgcolor: isSelected ? 'var(--surface-dark)' : 'var(--surface-card)',
					color: isSelected ? '#fff' : 'var(--fg-2)'
				};
				const countSx = isPill
					? { color: isSelected ? 'var(--green-300)' : 'var(--fg-3)' }
					: isSelected
						? { px: '7px', py: '1px', borderRadius: 'var(--radius-pill)', bgcolor: 'var(--accent-soft-bg)', color: 'var(--accent-soft-fg)' }
						: { color: 'var(--fg-3)' };

				return (
					<ButtonBase
						key={tab.dayFilter}
						role="tab"
						aria-selected={isSelected}
						onClick={() => onChange(tab.dayFilter)}
						sx={{
							flexShrink: 0,
							gap: 1,
							font: isSelected ? 'var(--text-label)' : '500 13px/1.3 var(--font-sans)',
							...(isPill ? pillSx : segmentedSx)
						}}
					>
						{tab.label}
						<Box component="span" sx={{ font: 'var(--text-caption)', ...countSx }}>
							{stats[tab.statKey]}
						</Box>
					</ButtonBase>
				);
			})}
		</Box>
	);
}

export default OrdersTabs;
