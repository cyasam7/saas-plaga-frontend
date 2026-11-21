import { DataGrid, GridActionsCellItem, gridClasses, GridColDef } from '@mui/x-data-grid';
import { Box, Stack, Typography, IconButton, Drawer, useTheme, useMediaQuery } from '@mui/material';
import PageContentCard from 'app/shared/components/PageContentCard/PageContentCard';
import EmptyState from 'app/shared/components/EmptyState/EmptyState';
import { LIST_DATA_GRID_SX } from 'src/app/shared/constants/dataGrid';
import { useState } from 'react';
import PageLayout from 'app/core/page/PageLayout';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Block, Delete, FilterList, ReceiptLong, EventRepeat } from '@mui/icons-material';
import { useGlobalDialog } from 'app/shared/components/GlobalDialog/GlobalDialogContext';
import { displayToast } from 'app/core/feedback/toast';
import { columnsOrders } from './columns';
import { IOrdersDatagridResponse, useQueryOrdersDatagrid } from 'src/app/requests/orders/useQueryOrdersDatagrid';
import { useMutationDeleteOrder } from 'src/app/requests/orders/useMutationDeleteOrder';
import { useMutationCancelOrder } from 'src/app/requests/orders/useMutationCancelOrder';
import { useQueryOrdersDatagridStats } from 'src/app/requests/orders/useQueryOrdersDatagridStats';
import { EStatusOrder } from 'src/app/requests/orders/types';
import OrderDialog from './components/SaveOrderOrderDialog/OrderDialog';
import OrdersFilters from './components/OrdersFilters/OrdersFilters';
import { useQueryClients } from 'src/app/requests/clients/useQueryClients';
import OrdersHeader from './components/OrdersHeader/OrdersHeader';
import AssignOrderDialog from './components/AssignOrderDialog/AssignOrderDialog';
import RescheduleOrderDialog from './components/RescheduleOrderDialog/RescheduleOrderDialog';
import useOrdersFilters from './hooks/useOrdersFilters';
import { MobileCard } from './components/MobileCard/MobileCard';
import './styles/actionButtons.css';

function Order() {
	const { openDialog } = useGlobalDialog();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [open, setOpen] = useState<boolean>(false);
	const [openAssign, setOpenAssign] = useState<boolean>(false);
	const [openReschedule, setOpenReschedule] = useState<boolean>(false);
	const [shouldOpenDialogAssign, setShouldOpenDialogAssign] = useState<boolean>(false);
	const [orderId, setOrderId] = useState<string>('');
	const [openFilterDrawer, setOpenFilterDrawer] = useState(false);

	// Los filtros viven en la URL y se resuelven en el backend: se mandan como query params.
	const { filters, query, setFilter, clearFilters } = useOrdersFilters();

	const { data = { orders: [] }, isLoading, refetch: refetchOrders } = useQueryOrdersDatagrid(query);
	// El conteo de las pestañas va aparte: no depende de los filtros, así que no se recarga al filtrar.
	const { data: stats = { total: 0, today: 0, tomorrow: 0, pending: 0, passed: 0 }, refetch: refetchStats } =
		useQueryOrdersDatagridStats();
	const refetch = () => Promise.all([refetchOrders(), refetchStats()]);
	const { mutateAsync: deleteOrder } = useMutationDeleteOrder();
	const { mutateAsync: cancelOrder } = useMutationCancelOrder();

	const handleCancelOrder = (orderIdToCancel: string) => {
		openDialog({
			title: 'Cancelar orden',
			text: '¿Estas seguro que deseas cancelar la orden de servicio? Pasará al historial como cancelada.',
			onAccept: async () => {
				await cancelOrder({ orderId: orderIdToCancel });
				await refetch();
				displayToast({
					message: 'Se ha cancelado la orden',
					variant: 'success',
					autoHideDuration: 1000,
					anchorOrigin: {
						horizontal: 'right',
						vertical: 'top'
					}
				});
			}
		});
	};

	// Todos los filtros se resuelven en el API (`useOrdersFilters` arma el query).
	const orders = data.orders;
	const { data: clients = [] } = useQueryClients({});

	const columns: GridColDef<IOrdersDatagridResponse['orders'][number]>[] = [
		...columnsOrders,
		{
			headerName: 'Acciones',
			field: 'actions',
			sortable: false,
			flex: 0.8,
			minWidth: 190,
			align: 'center',
			type: 'actions',
			disableColumnMenu: true,
			getActions: (params) => {
				const { status, assignedId } = params.row;
				return [
					<GridActionsCellItem
						key="assign"
						label={assignedId ? 'Reasignar' : 'Asignar'}
						icon={<AssignmentIndIcon />}
						showInMenu
						onClick={() => {
							setOrderId(params.row.id);
							setOpenAssign(true);
						}}
						disabled={[EStatusOrder.DONE, EStatusOrder.FINISHED].includes(status)}
						className="action-button"
					/>,
					<GridActionsCellItem
						key="reschedule"
						label="Cambiar fecha"
						icon={<EventRepeat />}
						showInMenu
						onClick={() => {
							setOrderId(params.row.id);
							setOpenReschedule(true);
						}}
						// Mismos estatus que acepta el API: en curso o cerrada, la fecha es la del servicio hecho.
						disabled={![EStatusOrder.CREATED, EStatusOrder.ASSIGNED, EStatusOrder.PASSED].includes(status)}
						className="action-button"
					/>,
					<GridActionsCellItem
						key="cancel"
						label="Cancelar"
						icon={<Block />}
						showInMenu
						onClick={() => handleCancelOrder(params.row.id)}
						// Mismos estatus que acepta el API (CancelOrder).
						disabled={![EStatusOrder.CREATED, EStatusOrder.ASSIGNED, EStatusOrder.PASSED].includes(status)}
						className="action-button delete"
					/>,
					<GridActionsCellItem
						key="delete"
						label="Eliminar"
						icon={<Delete />}
						showInMenu
						onClick={() => {
							openDialog({
								title: 'Advertencia',
								text: '¿Estas seguro que deseas eliminar la orden de servicio?',
								onAccept: async () => {
									await deleteOrder({ orderId: params.row.id });
									await refetch();
									displayToast({
										message: 'Se ha eliminado correctamente',
										variant: 'success',
										autoHideDuration: 1000,
										anchorOrigin: {
											horizontal: 'right',
											vertical: 'top'
										}
									});
								}
							});
						}}
						className="action-button delete"
					/>
				];
			}
		}
	];

	// El filtro de día vive en las pestañas del header.
	const renderFilters = () => (
		<OrdersFilters
			filters={filters}
			onFilterChange={setFilter}
			onClearFilters={clearFilters}
			clients={clients}
			isStacked={isMobile}
		/>
	);

	return (
		<PageLayout
			scroll='content'
			header={
				<OrdersHeader
					stats={stats}
					selectedDayFilter={filters.dayFilter}
					onDayFilterChange={(dayFilter) => setFilter('dayFilter', dayFilter)}
					onCreateOrder={() => {
						setOpen(true);
						setShouldOpenDialogAssign(true);
					}}
				/>
			}
			content={
				<div className="p-16 sm:p-24 w-full flex flex-col flex-1 min-h-0">
					<OrderDialog
						open={open}
						onCancel={() => {
							setOpen(false);
							setOrderId('');
						}}
						shouldOpenDialogAssign={shouldOpenDialogAssign}
						onSubmit={async (orderId, shouldOpenDialogAssign) => {
							await refetch();
							if (shouldOpenDialogAssign) {
								setOrderId(orderId);
								setOpenAssign(true);
							}
							setShouldOpenDialogAssign(false);
						}}
					/>
					<AssignOrderDialog
						orderId={orderId}
						open={openAssign}
						onClose={() => {
							setOpenAssign(false);
							setOrderId('');
						}}
					/>
					<RescheduleOrderDialog
						orderId={orderId}
						open={openReschedule}
						currentOrderDate={orders.find((order) => order.id === orderId)?.date ?? null}
						onClose={() => {
							setOpenReschedule(false);
							setOrderId('');
						}}
					/>
					<PageContentCard
						filters={isMobile ? undefined : renderFilters()}
						footer={
							orders.length > 0 && (
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Mostrando {orders.length} de {stats.total} órdenes
								</Typography>
							)
						}
						sx={{ flex: 1, minHeight: 0 }}
					>
						{isMobile && (
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'flex-end',
									mb: 1
								}}
							>
								<IconButton
									color="primary"
									aria-label="Filtros"
									onClick={() => setOpenFilterDrawer(true)}
								>
									<FilterList />
								</IconButton>
							</Box>
						)}

						{orders.length === 0 && !isLoading ? (
							<EmptyState
								icon={ReceiptLong}
								title="Sin órdenes"
								description="No hay órdenes que coincidan con los filtros seleccionados."
							/>
						) : isMobile ? (
							<Stack
								spacing={2}
								sx={{
									flex: 1,
									overflowY: 'auto',
									pb: 2,
									'&::-webkit-scrollbar': {
										width: '8px',
										backgroundColor: 'transparent'
									},
									'&::-webkit-scrollbar-thumb': {
										backgroundColor: (theme) => theme.palette.divider,
										borderRadius: '4px'
									},
									scrollbarWidth: 'thin',
									scrollbarColor: (theme) => `${theme.palette.divider} transparent`
								}}
							>
								{orders.map((order) => (
									<MobileCard
										key={order.id}
										order={order}
										onAssign={(id) => {
											setOrderId(id);
											setOpenAssign(true);
										}}
										onReschedule={(id) => {
											setOrderId(id);
											setOpenReschedule(true);
										}}
										onCancel={handleCancelOrder}
										onDelete={async (id) => {
											await deleteOrder({ orderId: id });
											await refetch();
										}}
									/>
								))}
							</Stack>
						) : (
							<DataGrid
								autoHeight
								hideFooterPagination
								hideFooter
								loading={isLoading}
								rows={orders}
								columns={columns}
								rowSelection={false}
								density="comfortable"
								getRowHeight={() => 'auto'}
								sx={LIST_DATA_GRID_SX}
							/>
						)}
					</PageContentCard>

					<Drawer
						anchor="right"
						open={openFilterDrawer}
						onClose={() => setOpenFilterDrawer(false)}
						PaperProps={{
							sx: {
								width: '80%',
								maxWidth: '360px',
								p: 2
							}
						}}
					>
						<div className="flex flex-col h-full">
							<div className="flex justify-between items-center mb-4">
								<Typography variant="h6">Filtros</Typography>
								<IconButton onClick={() => setOpenFilterDrawer(false)}>
									<FilterList />
								</IconButton>
							</div>
							{renderFilters()}
						</div>
					</Drawer>
				</div>
			}
		/>
	);
}

export default Order;
