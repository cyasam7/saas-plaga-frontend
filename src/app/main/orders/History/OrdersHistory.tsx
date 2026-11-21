import { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { FileDownload, ReceiptLong, Visibility } from '@mui/icons-material';
import { DataGrid, GridActionsCellItem, GridColDef, gridClasses } from '@mui/x-data-grid';

import PageLayout from 'app/core/page/PageLayout';
import SimpleHeader from 'app/shared/components/SimpleHeader';
import PageContentCard from 'app/shared/components/PageContentCard/PageContentCard';
import EmptyState from 'app/shared/components/EmptyState/EmptyState';
import { LIST_DATA_GRID_SX } from 'src/app/shared/constants/dataGrid';
import { EStatusOrder } from 'src/app/requests/orders/types';
import { IOrdersHistoryResponse } from 'src/app/requests/orders/useQueryOrdersHistory';

import { columnsOrdersHistory } from './columns';
import GenerateReportDialog from '../components/GenerateReportDialog/GenerateReportDialog';
import OrderDetailDialog from './components/OrderDetailDialog/OrderDetailDialog';
import HistoryFilters from './components/HistoryFilters/HistoryFilters';
import useOrdersHistory from './hooks/useOrdersHistory';
import useOrdersHistoryFilters from './hooks/useOrdersHistoryFilters';

const CAN_GENERATE_REPORT_STATUSES = [EStatusOrder.DONE, EStatusOrder.FINISHED];

function OrdersHistory() {
	const { filters, queryFilters, hasActiveFilters, setFilter, clearFilters } = useOrdersHistoryFilters();
	const { rows, totalCount, isLoading, isFetchingNextPage, hasNextPage, sentinelRef } = useOrdersHistory(queryFilters);
	const [orderId, setOrderId] = useState<string>('');
	const [openDownloadReport, setOpenDownloadReport] = useState<boolean>(false);
	const [openDetail, setOpenDetail] = useState<boolean>(false);

	const isEmpty = !isLoading && rows.length === 0;

	const columns: GridColDef<IOrdersHistoryResponse['data'][number]>[] = [
		...columnsOrdersHistory,
		{
			headerName: 'Acciones',
			field: 'actions',
			type: 'actions',
			sortable: false,
			flex: 0.6,
			minWidth: 100,
			align: 'center',
			disableColumnMenu: true,
			getActions: (params) => [
				<GridActionsCellItem
					key="view-detail"
					label="Ver detalle"
					icon={<Visibility />}
					onClick={() => {
						setOrderId(params.row.id);
						setOpenDetail(true);
					}}
				/>,
				<GridActionsCellItem
					key="download-report"
					label="Generar reporte"
					icon={<FileDownload />}
					disabled={!CAN_GENERATE_REPORT_STATUSES.includes(params.row.status)}
					onClick={() => {
						setOrderId(params.row.id);
						setOpenDownloadReport(true);
					}}
				/>
			]
		}
	];

	return (
		<PageLayout
			scroll="content"
			header={
				<SimpleHeader
					title="Historial de órdenes"
					subtitle={`Órdenes que ya salieron del flujo inicial${
						isLoading ? '' : ` · ${totalCount} ${totalCount === 1 ? 'orden' : 'órdenes'} en el historial`
					}`}
				/>
			}
			content={
				<div className="p-16 sm:p-24 w-full flex flex-col flex-1 min-h-0">
					<GenerateReportDialog
						id={orderId}
						open={openDownloadReport}
						onClose={() => {
							setOrderId('');
							setOpenDownloadReport(false);
						}}
					/>
					<OrderDetailDialog
						id={orderId}
						open={openDetail}
						onClose={() => {
							setOrderId('');
							setOpenDetail(false);
						}}
					/>
					<PageContentCard
						filters={
							<HistoryFilters
								filters={filters}
								hasActiveFilters={hasActiveFilters}
								onFilterChange={setFilter}
								onClear={clearFilters}
							/>
						}
						footer={
							!isLoading &&
							rows.length > 0 && (
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{hasNextPage
										? `Mostrando ${rows.length} de ${totalCount} órdenes`
										: `${totalCount} ${totalCount === 1 ? 'orden' : 'órdenes'} en total`}
								</Typography>
							)
						}
					>
						{isEmpty ? (
							<EmptyState
								icon={ReceiptLong}
								title="Sin órdenes"
								description="No hay órdenes en el historial que coincidan con los filtros seleccionados."
							/>
						) : (
							<DataGrid
								autoHeight
								hideFooter
								disableRowSelectionOnClick
								loading={isLoading}
								rows={rows}
								columns={columns}
								density="comfortable"
								getRowHeight={() => 'auto'}
								sx={{
									...LIST_DATA_GRID_SX,
									[`& .${gridClasses.cell}`]: { py: 1, px: 1, display: 'flex', alignItems: 'center' }
								}}
							/>
						)}

						{/* Sentinel: al entrar al viewport se carga la siguiente página. */}
						<Box
							ref={sentinelRef}
							sx={{ display: 'flex', justifyContent: 'center', py: isFetchingNextPage ? 2 : 0, minHeight: 8 }}
						>
							{isFetchingNextPage && <CircularProgress size={24} />}
						</Box>
					</PageContentCard>
				</div>
			}
		/>
	);
}

export default OrdersHistory;
