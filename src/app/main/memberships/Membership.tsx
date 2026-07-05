import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useQuery } from 'react-query';
import { Button, Paper, Stack, useTheme } from '@mui/material';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Add } from '@mui/icons-material';
import FusePageSimpleHeader from '@fuse/core/FusePageSimple/FusePageSimpleHeader';
import SimpleHeader from 'app/shared-components/SimpleHeader';
import { MembershipService } from 'src/app/shared/services/MembershipService';
import dayjs from 'dayjs';
import { DATE_FORMAT } from 'src/app/shared-constants/dateFormat';
import DialogMembership from './components/DialogMembership/DialogMembership';
import { useState } from 'react';

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
	const {
		data = [],
		isLoading,
		refetch
	} = useQuery({
		queryKey: 'memberships',
		queryFn: () => MembershipService.getAll()
	});

	const [openCreateMembershipDialog, setOpenCreateMembershipDialog] = useState(false);

	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'ID', flex: 1 },
		{ field: 'tenantName', headerName: 'Nombre del tenant', flex: 1 },
		{ field: 'owner', headerName: 'Propietario', flex: 1 },
		{ field: 'ownerEmail', headerName: 'Email', flex: 1, },
		{ field: 'dueDate', headerName: 'Fecha de vencimiento', flex: 1, valueFormatter: (params) => dayjs(params.value).format(DATE_FORMAT) },
		{ field: 'isActive', headerName: 'Activo', type: 'boolean', flex: 1 },
		{
			headerName: 'ACCIONES',
			field: 'actions',
			sortable: false,
			minWidth: 50,
			align: 'center',
			type: 'actions',
			disableColumnMenu: true,
			getActions: (params) => {
				const tenantId = params.row.tenantId;
				return [
					<GridActionsCellItem
						key={0}
						label={`Cambiar estado ${params.row.isActive ? 'Inactivo' : 'Activo'}`}
						showInMenu
						onClick={() => {
							MembershipService.changeIsActive(params.row.id, !params.row.isActive, tenantId).then(() => {
								refetch();
							});
						}}
					/>,
					<GridActionsCellItem
						key={1}
						label={`Cambiar fecha de vencimiento`}
						showInMenu
						onClick={() => {
							MembershipService.extendDueDate(params.row.id, dayjs().add(1, 'month').toDate(), tenantId).then(() => {
								refetch();
							});
						}}
					/>,
				];
			}
		}
	];


	return (
		<Root
			header={
				<FusePageSimpleHeader
					header={
						<SimpleHeader
							title="Membresías"
							subtitle="Gestiona las membresías"
							actions={
								<Button
									color="primary"
									variant="contained"
									startIcon={<Add />}
									onClick={() => setOpenCreateMembershipDialog(true)}
								>
									Nuevo
								</Button>
							}
						/>
					}
				/>
			}
			content={
				<div className="p-16 sm:p-24 w-full">
					<DialogMembership
						onSubmit={() => refetch()}
						open={openCreateMembershipDialog}
						onClose={() => setOpenCreateMembershipDialog(false)}
					/>
					<Paper
						className="p-8 sm:p-24 w-full"
						sx={{
							height: '100%',
							maxHeight: 'calc(100vh - 240px)',
							display: 'flex',
							flexDirection: 'column'
						}}
					>

						<Stack sx={{ height: 'calc(100vh - 240px)' }}>
							<DataGrid
								hideFooterPagination
								loading={isLoading}
								rows={data}
								columns={columns}
								initialState={{
									pagination: {
										paginationModel: { pageSize: 10 }
									}
								}}
								pageSizeOptions={[5, 10, 25]}
								density="compact"
								getRowHeight={() => 'auto'}
								sx={{
									'& .MuiDataGrid-cell': {
										py: 1,
										px: 1,
										wordBreak: 'break-word'
									},
									'& .MuiDataGrid-columnHeader': {
										py: 1,
										px: 1
									}
								}}
							/>
						</Stack>
					</Paper>
				</div>
			}
		/>
	);
}

export default Order;
