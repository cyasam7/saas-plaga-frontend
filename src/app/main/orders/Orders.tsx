import { DataGrid, GridActionsCellItem, gridClasses, GridColDef } from '@mui/x-data-grid';
import { useQuery } from 'react-query';
import { Box, Button, Paper, Stack, Typography, IconButton, Drawer, useTheme, useMediaQuery } from '@mui/material';
import { useState, useMemo } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import dayjs, { Dayjs } from 'dayjs';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Delete, FileDownload, FilterList, Add, ReceiptLong } from '@mui/icons-material';
import { openDialog } from 'app/shared-components/GlobalDialog/openDialog';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { columnsOrders } from './columns';
import { OrderService } from '../../shared/services/OrderService';
import { DatagridRowOrder, EStatusOrder } from '../../shared/entities/OrderEntity';
import OrderDialog from './components/SaveOrderOrderDialog/OrderDialog';
import OrderDetailDialog from './components/OrderDetailDialog/OrderDetailDialog';
import OrderChangeStatusDialog from './components/OrderChangeStatusDialog/OrderChangeStatusDialog';
import OrderFollowUpDialog from './components/OrderFollowUpDialog/OrderFollowUpDialog';
import HeaderFilters from './components/HeaderFilters/HeaderFilters';
import { validateIfOrderIsPending } from './utils';
import AssignOrderDialog from './components/AssignOrderDialog/AssignOrderDialog';
import { ETabsPlagues } from './components/HeaderFilters/HeaderFilterProps';
import { MobileCard } from './components/MobileCard/MobileCard';
import FusePageSimpleHeader from '@fuse/core/FusePageSimple/FusePageSimpleHeader';
import SimpleHeader from 'app/shared-components/SimpleHeader';
import { StatsCards } from './components/StatsCards/StatsCards';
import './styles/actionButtons.css';
import GenerateReportDialog from './components/GenerateReportDialog/GenerateReportDialog';

const Root = styled(FusePageSimple)(({ theme }) => ({
	height: '100%',
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {
		overflow: 'hidden',
		minHeight: 0
	},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function Order() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [tabFilter, setTabFilter] = useState<ETabsPlagues>(ETabsPlagues.ALL);
	const [statusFilter, setStatusFilter] = useState<EStatusOrder | undefined>();
	const [calendarFilter, setCalendarFilter] = useState<Dayjs | undefined>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [openDetails, setOpenDetails] = useState<boolean>(false);
	const [openStatus, setOpenStatus] = useState<boolean>(false);
	const [openAssign, setOpenAssign] = useState<boolean>(false);
	const [openFollow, setOpenFollow] = useState<boolean>(false);
	const [openDownloadReport, setOpenDownloadReport] = useState<boolean>(false);
	const [shouldOpenDialogAssign, setShouldOpenDialogAssign] = useState<boolean>(false);
	const [orderId, setOrderId] = useState<string>('');
	const [openFilterDrawer, setOpenFilterDrawer] = useState(false);

	const {
		data = [],
		isLoading,
		refetch
	} = useQuery({
		queryKey: 'orders',
		queryFn: () => OrderService.getDatagridOrders()
	});

	const filteredData = useMemo(() => {
		let result = data;

		if (tabFilter === ETabsPlagues.TODAY) {
			result = result.filter((i) => {
				const date = dayjs(i.date);
				const startDay = dayjs().startOf('day');
				const finalDay = dayjs().endOf('day');
				return date.isAfter(startDay) && date.isBefore(finalDay);
			});
		}

		if (tabFilter === ETabsPlagues.TOMORROW) {
			result = result.filter((i) => {
				const date = dayjs(i.date);
				const startDay = dayjs().startOf('day').add(1, 'day');
				const finalDay = dayjs().endOf('day').add(1, 'day');
				return (date.isAfter(startDay) || date.isSame(startDay)) && date.isBefore(finalDay);
			});
		}

		if (tabFilter === ETabsPlagues.PENDING) {
			result = result.filter((i) => {
				const dateOrder = dayjs(i.date);
				const today = dayjs();
				return dateOrder.isAfter(today) && validateIfOrderIsPending(i.status);
			});
		}

		if (calendarFilter) {
			result = result.filter((i) => {
				const date = dayjs(i.date);
				const startDate = dayjs(calendarFilter).startOf('day');
				const finalDate = dayjs(calendarFilter).endOf('day');
				return (date.isAfter(startDate) || date.isSame(startDate)) && date.isBefore(finalDate);
			});
		}

		if (statusFilter) {
			result = result.filter((i) => i.status === statusFilter);
		}

		return result;
	}, [data, tabFilter, calendarFilter, statusFilter]);

	const columns: GridColDef<DatagridRowOrder>[] = [
		...columnsOrders,
		{
			headerName: 'ACCIONES',
			field: 'actions',
			sortable: false,
			minWidth: 190,
			align: 'center',
			type: 'actions',
			disableColumnMenu: true,
			getActions: (params) => {
				const { status, assignedId } = params.row;
				return [
					<GridActionsCellItem
						key="view"
						label="VER"
						icon={<RemoveRedEyeIcon />}
						onClick={() => {
							setOrderId(params.row.id);
							setOpenDetails(true);
						}}
						className="action-button"
					/>,
					<GridActionsCellItem
						key="assign"
						label={assignedId ? 'RE-ASIGNAR' : 'ASIGNAR'}
						icon={<AssignmentIndIcon />}
						showInMenu
						onClick={() => {
							setOrderId(params.row.id);
							setOpenAssign(true);
						}}
						disabled={[EStatusOrder.DONE, EStatusOrder.FINISHED, EStatusOrder.CANCELED].includes(status)}
						className="action-button"
					/>,
					<GridActionsCellItem
						key="modify"
						label="MODIFICAR"
						icon={<NoteAltIcon />}
						showInMenu
						onClick={() => {
							setOrderId(params.row.id);
							setOpen(true);
						}}
						disabled={[EStatusOrder.FINISHED, EStatusOrder.CANCELED].includes(status)}
						className="action-button"
					/>,
					<GridActionsCellItem
						key="follow"
						label="CREAR SEGUIMIENTO"
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
						label="GENERAR REPORTE"
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
						label="ELIMINAR"
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
			selectedStatus={statusFilter}
			selectedDate={calendarFilter}
			onTabChange={setTabFilter}
			onStatusChange={setStatusFilter}
			onDateChange={setCalendarFilter}
		/>
	);

	return (
		<Root
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
					<StatsCards orders={data} />

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
					<OrderChangeStatusDialog
						open={openStatus}
						id={orderId}
						onClose={() => {
							setOrderId('');
							setOpenStatus(false);
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
							filteredData.length === 0 ? (
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
									{filteredData.map((order) => (
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
							filteredData.length === 0 ? (
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
								<Stack sx={{ flex: 1, minHeight: 0, maxHeight: "400px" }}>
									<DataGrid
										hideFooterPagination
										hideFooter
										loading={isLoading}
										rows={filteredData}
										columns={columns}
										rowSelection={false}
										density="comfortable"
										getRowHeight={() => 'auto'}
										sx={{
											[`& .${gridClasses.main}`]: {
												mt: 2,
												border: 1,
												borderColor: 'divider',
												borderRadius: "10px"
											},
											height: "100% !important",
											'& .MuiDataGrid-cell': {
												py: 1,
												px: 1,
												wordBreak: 'break-word'
											}
										}}
									/>
								</Stack>
							)
						)}

						{filteredData.length > 0 && (
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
									Mostrando {filteredData.length} de {data.length} órdenes
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
