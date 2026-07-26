import { TextField, useTheme, useMediaQuery, MenuItem, Tabs, Tab, Stack } from '@mui/material';
import { EOrdersDayFilter } from 'src/app/shared/services/OrderService';
import FumigatorFilter from './FumigatorFilter';

const dayFilterOptions = [
	{ value: EOrdersDayFilter.ALL, label: 'Todas' },
	{ value: EOrdersDayFilter.TODAY, label: 'Hoy' },
	{ value: EOrdersDayFilter.TOMORROW, label: 'Mañana' },
	{ value: EOrdersDayFilter.PENDING, label: 'Pendientes' },
	{ value: EOrdersDayFilter.PASSED, label: 'Pasadas' }
] as const;

interface HeaderFiltersProps {
	dayFilter: EOrdersDayFilter;
	onDayFilterChange: (value: EOrdersDayFilter) => void;
	fumigatorId: string;
	onFumigatorChange: (value: string) => void;
}

function HeaderFilters({ dayFilter, onDayFilterChange, fumigatorId, onFumigatorChange }: HeaderFiltersProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const renderDayFilter = () => {
		if (isMobile) {
			return (
				<TextField
					select
					value={dayFilter}
					label="Filtrar por"
					size="small"
					fullWidth
					onChange={(e) => onDayFilterChange(e.target.value as EOrdersDayFilter)}
				>
					{dayFilterOptions.map((option) => (
						<MenuItem
							key={option.value}
							value={option.value}
						>
							{option.label}
						</MenuItem>
					))}
				</TextField>
			);
		}

		return (
			<Tabs
				value={dayFilter}
				onChange={(_, value) => onDayFilterChange(value as EOrdersDayFilter)}
				variant="scrollable"
				scrollButtons="auto"
				sx={{
					minHeight: 40,
					'& .MuiTab-root': {
						minHeight: 40,
						py: 0
					}
				}}
			>
				{dayFilterOptions.map((option) => (
					<Tab
						key={option.value}
						value={option.value}
						label={option.label}
					/>
				))}
			</Tabs>
		);
	};

	return (
		<Stack
			direction={isMobile ? 'column' : 'row'}
			spacing={2}
			alignItems={isMobile ? 'stretch' : 'center'}
			justifyContent="space-between"
		>
			{renderDayFilter()}
			<FumigatorFilter
				value={fumigatorId}
				onChange={onFumigatorChange}
				fullWidth={isMobile}
			/>
		</Stack>
	);
}

export default HeaderFilters;
