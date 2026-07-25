import { TextField, useTheme, useMediaQuery, MenuItem, Tabs, Tab } from '@mui/material';
import React from 'react';
import { ETabsPlagues } from './HeaderFilterProps';

const filterOptions = [
	{ value: ETabsPlagues.ALL, label: 'Todas' },
	{ value: ETabsPlagues.TODAY, label: 'Hoy' },
	{ value: ETabsPlagues.TOMORROW, label: 'Mañana' },
	{ value: ETabsPlagues.PENDING, label: 'Pendientes' }
] as const;

interface HeaderFiltersProps {
	selectedTab: ETabsPlagues;
	onTabChange: (value: ETabsPlagues) => void;
}

function HeaderFilters({ selectedTab, onTabChange }: HeaderFiltersProps) {
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

	return renderFilterControl();
}

export default HeaderFilters;
