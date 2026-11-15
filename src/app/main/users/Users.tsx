import PageLayout from 'app/core/page/PageLayout';
import { useAuth } from 'src/app/core/auth/AuthRouteProvider';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useQueryUsersDatagrid, IUsersDatagridResponse } from 'src/app/requests/users/useQueryUsersDatagrid';
import { useMutationDeleteUser } from 'src/app/requests/users/useMutationDeleteUser';
import { useMutationSaveUserSign } from 'src/app/requests/users/useMutationSaveUserSign';
import { userKeys } from 'src/app/requests/users/keys';
import { Visibility, HistoryEdu, NoteAlt, RemoveCircleOutline } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { useGlobalDialog } from 'app/shared/components/GlobalDialog/GlobalDialogContext';
import useQueryInvalidator from 'src/app/shared/hooks/useQueryInvalidator';
import { displayToast } from 'app/core/feedback/toast';
import { columnsUsers } from './columns';
import HeaderGrid from './components/HeaderGrid/HeaderGrid';
import DialogUser from './components/DialogUser/DialogUser';
import DialogSigner from '../../shared/components/DialogSigner/DialogSigner';
import SignViewer from './components/SignViewer/SignViewer';
import SimpleHeader from 'app/shared/components/SimpleHeader';
import ChangePasswordDialog from './components/ChangePasswordDialog/ChangePasswordDialog';
import SyncLockIcon from '@mui/icons-material/SyncLock';

function NoUsersOverlay() {
	return (
		<Stack
			height="100%"
			alignItems="center"
			justifyContent="center"
		>
			<Typography color="text.secondary">No hay usuarios que coincidan con la búsqueda</Typography>
		</Stack>
	);
}

function Users() {
	const { openDialog } = useGlobalDialog();
	const [userId, setUserId] = useState('');
	const [openSigner, setOpenSigner] = useState(false);
	const [openPreviewSign, setOpenPreviewSign] = useState(false);
	const [previewURL, setPreviewURL] = useState('');
	const [search, setSearch] = useState('');
	const [isActive, setIsActive] = useState<boolean | null>(null);
	const { invalidate } = useQueryInvalidator();
	const [openUserDialog, setOpenUserDialog] = useState(false);
	const [openChangePassword, setOpenChangePassword] = useState(false);
	const { user: userLogged } = useAuth();

	const { data: users, isLoading } = useQueryUsersDatagrid({ userId: userLogged.uid }, !!userLogged.uid);
	const { mutateAsync: deleteUser } = useMutationDeleteUser();
	const { mutateAsync: saveUserSign } = useMutationSaveUserSign();

	function handleOpenSigner(selectedUserId: string) {
		setUserId(selectedUserId);
		setOpenSigner(true);
	}

	const columns: GridColDef<IUsersDatagridResponse[number]>[] = [
		...columnsUsers,
		{
			field: 'sign',
			headerName: 'FIRMA',
			width: 140,
			sortable: false,
			disableColumnMenu: true,
			renderCell: (params) => {
				const { sign, userId: rowUserId } = params.row;
				if (sign) {
					return (
						<Button
							size="small"
							startIcon={<Visibility />}
							onClick={() => {
								setPreviewURL(sign);
								setOpenPreviewSign(true);
							}}
						>
							Ver
						</Button>
					);
				}
				return (
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
					>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							Sin firma
						</Typography>
						<Button
							size="small"
							onClick={() => handleOpenSigner(rowUserId)}
						>
							Agregar
						</Button>
					</Stack>
				);
			}
		},
		{
			field: 'actions',
			headerName: 'ACCIONES',
			width: 100,
			disableColumnMenu: true,
			type: 'actions',
			getActions: (params) => {
				return [
					<GridActionsCellItem
						key="edit"
						label="Editar"
						icon={<NoteAlt />}
						showInMenu
						onClick={() => {
							setUserId(params.row.userId);
							setOpenUserDialog(true);
						}}
					/>,
					<GridActionsCellItem
						key="change-password"
						label="Cambiar contraseña"
						icon={<SyncLockIcon />}
						showInMenu
						onClick={() => {
							setUserId(params.row.userId);
							setOpenChangePassword(true);
						}}
					/>,
					<GridActionsCellItem
						key="update-sign"
						label="Actualizar firma"
						icon={<HistoryEdu />}
						showInMenu
						onClick={() => handleOpenSigner(params.row.userId)}
					/>,
					<GridActionsCellItem
						key="delete"
						label="Eliminar"
						icon={<RemoveCircleOutline color="error" />}
						sx={{ color: 'error.main' }}
						showInMenu
						onClick={() => {
							openDialog({
								title: 'Eliminar usuario',
								text: `¿Seguro que deseas eliminar a ${params.row.name}? Esta acción no se puede deshacer.`,
								onAccept: async () => {
									await deleteUser({ userId: params.row.userId });
									displayToast({
										message: 'Usuario eliminado correctamente',
										anchorOrigin: {
											horizontal: 'right',
											vertical: 'top'
										},
										variant: 'success'
									});
									invalidate(userKeys.lists());
								}
							});
						}}
					/>
				];
			}
		}
	];

	const filteredUsers = useMemo(() => {
		const searchLowerCase = search.toLowerCase();

		let matchingUsers = [...(users ?? [])];

		if (search) {
			matchingUsers = matchingUsers.filter((user) => {
				return (
					user.email.toLowerCase().includes(searchLowerCase) ||
					user.name.toLowerCase().includes(searchLowerCase) ||
					user.phone.toLowerCase().includes(searchLowerCase)
				);
			});
		}

		if (isActive !== null) {
			matchingUsers = matchingUsers.filter((user) => user.isActive === isActive);
		}

		return matchingUsers;
	}, [search, isActive, users]);

	async function handleSubmitOnSign(signImage: Blob): Promise<void> {
		const signFormData = new FormData();
		signFormData.append('file', signImage, `${userId}-sign.png`);
		signFormData.append('userId', userId);
		try {
			await saveUserSign({ formData: signFormData });
		} catch {
			// AxiosFetcher ya muestra el error; el diálogo queda abierto para reintentar.
			return;
		}
		invalidate(userKeys.lists());
		setUserId('');
		setOpenSigner(false);
		displayToast({
			anchorOrigin: {
				horizontal: 'right',
				vertical: 'top'
			},
			message: 'Firma guardada correctamente',
			variant: 'success'
		});
	}

	function handleClosePreviewSigner() {
		setPreviewURL('');
		setOpenPreviewSign(false);
	}

	return (
		<PageLayout
			header={
				<SimpleHeader
					title="Usuarios"
					subtitle="Gestiona los usuarios dentro de tu organización"
				/>
			}
			content={
				<div className="p-24 w-full">
					<Paper className="p-24 w-full">
						<Stack
							spacing={2}
							sx={{ height: 'calc(100vh - 240px)' }}
						>
							<DialogSigner
								open={openSigner}
								onClose={() => {
									setUserId('');
									setOpenSigner(false);
								}}
								onSubmit={handleSubmitOnSign}
							/>
							<DialogUser
								userId={userId}
								open={openUserDialog}
								onClose={() => {
									setUserId('');
									setOpenUserDialog(false);
								}}
							/>
							<ChangePasswordDialog
								open={openChangePassword}
								onClose={() => {
									setUserId('');
									setOpenChangePassword(false);
								}}
								userId={userId}
							/>
							<SignViewer
								open={openPreviewSign}
								url={previewURL}
								onClose={handleClosePreviewSigner}
							/>
							<HeaderGrid
								isActive={isActive}
								onChangeIsActive={setIsActive}
								onChangeSearch={setSearch}
								onClickCreate={() => setOpenUserDialog(true)}
							/>
							<DataGrid
								getRowId={(user) => user.userId}
								rows={filteredUsers}
								loading={isLoading}
								columns={columns}
								initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
								pageSizeOptions={[25, 50, 100]}
								slots={{ noRowsOverlay: NoUsersOverlay }}
								disableRowSelectionOnClick
							/>
						</Stack>
					</Paper>
				</div>
			}
		/>
	);
}

export default Users;
