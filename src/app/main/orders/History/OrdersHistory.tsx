import { Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { ReceiptLong } from '@mui/icons-material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

import FusePageSimple from '@fuse/core/FusePageSimple';
import FusePageSimpleHeader from '@fuse/core/FusePageSimple/FusePageSimpleHeader';
import SimpleHeader from 'app/shared-components/SimpleHeader';

import { columnsOrdersHistory } from './columns';
import HistoryFilters from './components/HistoryFilters/HistoryFilters';
import { hasActiveFilters } from './helpers';
import useOrdersHistory from './hooks/useOrdersHistory';
import useOrdersHistoryFilters from './hooks/useOrdersHistoryFilters';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	}
}));

function EmptyState() {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				py: 10,
				gap: 1
			}}
		>
			<ReceiptLong sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
			<Typography
				variant="subtitle1"
				color="text.secondary"
			>
				Sin órdenes
			</Typography>
			<Typography
				variant="body2"
				color="text.disabled"
			>
				No hay órdenes en el historial que coincidan con los filtros seleccionados.
			</Typography>
		</Box>
	);
}

function OrdersHistory() {
	const { filters, searchInput, setSearchInput, setFilter, clearFilters } = useOrdersHistoryFilters();
	const { rows, totalCount, isLoading, isFetchingNextPage, hasNextPage, sentinelRef } = useOrdersHistory(filters);

	const isEmpty = !isLoading && rows.length === 0;

	return (
		<Root
			header={
				<FusePageSimpleHeader
					header={
						<SimpleHeader
							title="Historial de órdenes"
							subtitle="Consulta las órdenes que ya salieron del flujo inicial"
						/>
					}
				/>
			}
			content={
				<Box sx={{ p: 3, width: '100%' }}>
					<Paper sx={{ p: 2 }}>
						<Stack spacing={2}>
							<HistoryFilters
								filters={filters}
								searchInput={searchInput}
								showClearButton={hasActiveFilters(filters)}
								onSearchInputChange={setSearchInput}
								onFilterChange={setFilter}
								onClear={clearFilters}
							/>

							{isEmpty ? (
								<EmptyState />
							) : (
								<DataGrid
									autoHeight
									hideFooter
									disableRowSelectionOnClick
									loading={isLoading}
									rows={rows}
									columns={columnsOrdersHistory}
									getRowHeight={() => 'auto'}
									sx={{
										[`& .${gridClasses.cell}`]: { py: 1.5, display: 'flex', alignItems: 'center' }
									}}
								/>
							)}

							{/* Sentinel: al entrar al viewport se carga la siguiente página. */}
							<Box
								ref={sentinelRef}
								sx={{ display: 'flex', justifyContent: 'center', py: 2, minHeight: 8 }}
							>
								{isFetchingNextPage && <CircularProgress size={24} />}
							</Box>

							{!isLoading && rows.length > 0 && (
								<Typography
									variant="caption"
									color="text.secondary"
									textAlign="center"
								>
									{hasNextPage
										? `Mostrando ${rows.length} de ${totalCount} órdenes`
										: `${totalCount} ${totalCount === 1 ? 'orden' : 'órdenes'} en total`}
								</Typography>
							)}
						</Stack>
					</Paper>
				</Box>
			}
		/>
	);
}

export default OrdersHistory;
