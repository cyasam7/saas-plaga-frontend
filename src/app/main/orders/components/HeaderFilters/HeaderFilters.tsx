import { Stack, TextField, useTheme, useMediaQuery, MenuItem, Tabs, Tab } from '@mui/material';
import { Dayjs } from 'dayjs';
import React from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { ETabsPlagues } from './HeaderFilterProps';

const filterOptions = [
	{ value: ETabsPlagues.ALL, label: 'Todas' },
	{ value: ETabsPlagues.TODAY, label: 'Hoy' },
	{ value: ETabsPlagues.TOMORROW, label: 'Mañana' },
	{ value: ETabsPlagues.PENDING, label: 'Pendientes' }
] as const;

interface HeaderFiltersProps {
	selectedTab: ETabsPlagues;
	selectedDate: Dayjs | undefined;
	onTabChange: (value: ETabsPlagues) => void;
	onDateChange: (value: Dayjs | undefined) => void;
}

function HeaderFilters({ selectedTab, selectedDate, onTabChange, onDateChange }: HeaderFiltersProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const renderFilterControl = () => {
		if (isMobile) {
			return (
				<TextField
					select
					value={selectedTab}
					label="Filtrar por"
					size="small"
					onChange={(e) => onTabChange(e.target.value as unknown as ETabsPlagues)}
				>
					{filterOptions.map((option) => (
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
				value={selectedTab}
				onChange={(_, value) => onTabChange(value as ETabsPlagues)}
				sx={{
					minHeight: 40,
					'& .MuiTab-root': {
						minHeight: 40,
						py: 0
					}
				}}
			>
				{filterOptions.map((option) => (
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
			direction="column"
			spacing={2}
			sx={{ width: '100%' }}
		>
			{renderFilterControl()}
			<Stack
				direction={isMobile ? 'column' : 'row'}
				spacing={2}
				sx={{ width: '100%' }}
			>
				<DatePicker
					value={selectedDate}
					onChange={(value: Dayjs | null) => onDateChange(value || undefined)}
					slotProps={{
						textField: {
							size: 'small',
							fullWidth: true
						},
						field: {
							clearable: true
						}
					}}
					sx={{ width: isMobile ? '100%' : 'auto' }}
				/>
			</Stack>
		</Stack>
	);
}

export default HeaderFilters;
