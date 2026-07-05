import { Autocomplete, Stack, TextField, useTheme, useMediaQuery, MenuItem, Tabs, Tab } from '@mui/material';
import { Dayjs } from 'dayjs';
import React from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { EStatusOrder } from 'src/app/shared/entities/OrderEntity';
import { ETabsPlagues } from './HeaderFilterProps';
import { translateOrderStatus } from '../../utils';

const filterOptions = [
	{ value: ETabsPlagues.ALL, label: 'TODAS' },
	{ value: ETabsPlagues.TODAY, label: 'HOY' },
	{ value: ETabsPlagues.TOMORROW, label: 'MAÑANA' },
	{ value: ETabsPlagues.PENDING, label: 'PENDIENTES' }
] as const;

interface HeaderFiltersProps {
	selectedTab: ETabsPlagues;
	selectedStatus: EStatusOrder | undefined;
	selectedDate: Dayjs | undefined;
	onTabChange: (value: ETabsPlagues) => void;
	onStatusChange: (value: EStatusOrder | undefined) => void;
	onDateChange: (value: Dayjs | undefined) => void;
}

function HeaderFilters({
	selectedTab,
	selectedStatus,
	selectedDate,
	onTabChange,
	onStatusChange,
	onDateChange
}: HeaderFiltersProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const statusCatalog = Object.values(EStatusOrder);

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
				<Autocomplete
					value={selectedStatus}
					options={statusCatalog}
					getOptionLabel={(i) => translateOrderStatus(i)}
					sx={{ width: isMobile ? '100%' : 300 }}
					onChange={(_, value) => onStatusChange(value || undefined)}
					renderInput={(params) => (
						<TextField
							{...params}
							size="small"
							label="Estatus"
							fullWidth
						/>
					)}
				/>
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
