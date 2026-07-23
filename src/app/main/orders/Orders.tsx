import { DataGrid, GridActionsCellItem, gridClasses, GridColDef } from '@mui/x-data-grid';
import { useQuery } from 'react-query';
import { Box, Button, Paper, Stack, Typography, IconButton, Drawer, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { Dayjs } from 'dayjs';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Delete, FileDownload, FilterList, Add, ReceiptLong } from '@mui/icons-material';
import { openDialog } from 'app/shared-components/GlobalDialog/openDialog';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { columnsOrders } from './columns';
import { EOrdersDayFilter, OrderService } from '../../shared/services/OrderService';
import { DatagridRowOrder, EStatusOrder } from '../../shared/entities/OrderEntity';
import OrderDialog from './components/SaveOrderOrderDialog/OrderDialog';
import OrderDetailDialog from './components/OrderDetailDialog/OrderDetailDialog';
import OrderFollowUpDialog from './components/OrderFollowUpDialog/OrderFollowUpDialog';
import HeaderFilters from './components/HeaderFilters/HeaderFilters';
import AssignOrderDialog from './components/AssignOrderDialog/AssignOrderDialog';
import { ETabsPlagues } from './components/HeaderFilters/HeaderFilterProps';
import { MobileCard } from './components/MobileCard/MobileCard';
import FusePageSimpleHeader from '@fuse/core/FusePageSimple/FusePageSimpleHeader';
import SimpleHeader from 'app/shared-components/SimpleHeader';
import { StatsCards } from './components/StatsCards/StatsCards';
import './styles/actionButtons.css';
import GenerateReportDialog from './components/GenerateReportDialog/GenerateReportDialog';

const TAB_TO_DAY_FILTER: Record<ETabsPlagues, EOrdersDayFilter> = {
	[ETabsPlagues.ALL]: EOrdersDayFilter.ALL,
	[ETabsPlagues.TODAY]: EOrdersDayFilter.TODAY,
	[ETabsPlagues.TOMORROW]: EOrdersDayFilter.TOMORROW,
	[ETabsPlagues.PENDING]: EOrdersDayFilter.PENDING
};

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function Order() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [tabFilter, setTabFilter] = useState<ETabsPlagues>(ETabsPlagues.ALL);
	const [calendarFilter, setCalendarFilter] = useState<Dayjs | undefined>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [openDetails, setOpenDetails] = useState<boolean>(false);
	const [openAssign, setOpenAssign] = useState<boolean>(false);
	const [openFollow, setOpenFollow] = useState<boolean>(false);
	const [openDownloadReport, setOpenDownloadReport] = useState<boolean>(false);
	const [shouldOpenDialogAssign, setShouldOpenDialogAssign] = useState<boolean>(false);
	const [orderId, setOrderId] = useState<string>('');
	const [openFilterDrawer, setOpenFilterDrawer] = useState(false);

	// Los filtros de la tabla se resuelven en el backend: se mandan como query params.
	const dayFilter = TAB_TO_DAY_FILTER[tabFilter];
	const dateParam = calendarFilter ? calendarFilter.toISOString() : undefined;

	const {
		data = { orders: [], stats: { total: 0, today: 0, pending: 0, passed: 0 } },
		isLoading,
		refetch
	} = useQuery({
		queryKey: ['orders', dayFilter, dateParam],
		queryFn: () => OrderService.getDatagridOrders({ dayFilter, date: dateParam })
	});

	const orders = data.orders;

	const columns: GridColDef<DatagridRowOrder>[] = [
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
						key="view"
						label="Ver"
						icon={<RemoveRedEyeIcon />}
						onClick={() => {
							setOrderId(params.row.id);
							setOpenDetails(true);
						}}
						className="action-button"
					/>,
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
						key="modify"
						label="Modificar"
						icon={<NoteAltIcon />}
						showInMenu
						onClick={() => {
							setOrderId(params.row.id);
							setOpen(true);
						}}
						disabled={[EStatusOrder.FINISHED].includes(status)}
						className="action-button"
					/>,
					<GridActionsCellItem
						key="follow"
						label="Crear seguimiento"
						icon={<MoveUpIcon />}
						showInMenu
						onClick={() => {
							setOrderId(params.row.id);
							setOpenFollow(true);
						}}
						className="action-button"
					/>,
					<GridActionsCellItem
						key="certificate"
						label="Generar reporte"
						icon={<FileDownload />}
						disabled={![EStatusOrder.DONE, EStatusOrder.FINISHED].includes(params.row.status)}
						onClick={async () => {
							setOrderId(params.row.id);
							setOpenDownloadReport(true)
						}}
						className="action-button download"
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
									await OrderService.deleteById(params.row.id);
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

	const renderFilters = () => (
		<HeaderFilters
			selectedTab={tabFilter}
			selectedDate={calendarFilter}
			onTabChange={setTabFilter}
			onDateChange={setCalendarFilter}
		/>
	);

	return (
		<Root
			scroll='content'
			header={
				<FusePageSimpleHeader
					header={
						<SimpleHeader
							title="Ordenes de servicio"
							subtitle="Gestiona las ordenes de servicio"
							actions={
								<Button
									color="primary"
									variant="contained"
									startIcon={<Add />}
									onClick={() => {
										setOpen(true);
										setShouldOpenDialogAssign(true);
									}}
								>
									Nuevo
								</Button>
							}
						/>
					}
				/>
			}
			content={
				<div className="p-16 sm:p-24 w-full flex flex-col flex-1 min-h-0">
					<StatsCards stats={data.stats} />

					<GenerateReportDialog
						id={orderId}
						open={openDownloadReport}
						onClose={() => {
							setOrderId("")
							setOpenDownloadReport(false)
						}}
					/>
					<OrderDialog
						open={open}
						id={orderId}
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
					<OrderFollowUpDialog
						id={orderId}
						onClose={() => {
							setOrderId('');
							setOpenFollow(false);
						}}
						open={openFollow}
						onSubmit={async () => {
							await refetch();
						}}
					/>
					<OrderDetailDialog
						open={openDetails}
						id={orderId}
						onClose={() => {
							setOrderId('');
							setOpenDetails(false);
						}}
					/>
					<Paper
						elevation={0}
						sx={{
							display: 'flex',
							flexDirection: 'column',
							flex: 1,
							minHeight: 0,
							p: { xs: 2, sm: 3 },
							borderRadius: 2,
							border: 1,
							borderColor: 'divider'
						}}
					>
						{!isMobile && (
							<Box
								sx={{
									pb: 2,
									mb: 1,
									borderBottom: 1,
									borderColor: 'divider'
								}}
							>
								{renderFilters()}
							</Box>
						)}

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
									onClick={() => setOpenFilterDrawer(true)}
								>
									<FilterList />
								</IconButton>
							</Box>
						)}

						{isMobile ? (
							orders.length === 0 ? (
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										py: 8,
										gap: 1
									}}
								>
									<ReceiptLong
										sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}
									/>
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
										No hay órdenes que coincidan con los filtros seleccionados.
									</Typography>
								</Box>
							) : (
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
											onView={(id) => {
												setOrderId(id);
												setOpenDetails(true);
											}}
											onEdit={(id) => {
												setOrderId(id);
												setOpen(true);
											}}
											onAssign={(id) => {
												setOrderId(id);
												setOpenAssign(true);
											}}
											onFollow={(id) => {
												setOrderId(id);
												setOpenFollow(true);
											}}
											onDownloadCertificate={async (id) => {
												await OrderService.downloadCertificate({
													daysValid: 30,
													id
												});
											}}
											onDelete={async (id) => {
												await OrderService.deleteById(id);
												await refetch();
											}}
										/>
									))}
								</Stack>
							)
						) : (
							orders.length === 0 ? (
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
									<ReceiptLong
										sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}
									/>
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
										No hay órdenes que coincidan con los filtros seleccionados.
									</Typography>
								</Box>
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
									sx={{
										[`& .${gridClasses.main}`]: {
											mt: 2,
											border: 1,
											borderColor: 'divider',
											borderRadius: 2
										},
										'& .MuiDataGrid-cell': {
											py: 1,
											px: 1,
											wordBreak: 'break-word'
										}
									}}
								/>
							)
						)}

						{orders.length > 0 && (
							<Box
								sx={{
									pt: 1.5,
									mt: 1,
									borderTop: 1,
									borderColor: 'divider',
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center'
								}}
							>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Mostrando {orders.length} de {data.stats.total} órdenes
								</Typography>
							</Box>
						)}
					</Paper>

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
