import PageLayout from 'app/core/page/PageLayout';
import { useAuth } from 'src/app/core/auth/AuthRouteProvider';
import { Button, Stack, Typography } from '@mui/material';
import PageContentCard from 'app/shared/components/PageContentCard/PageContentCard';
import EmptyState from 'app/shared/components/EmptyState/EmptyState';
import { LIST_DATA_GRID_SX } from 'src/app/shared/constants/dataGrid';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useQueryUsersDatagrid, IUsersDatagridResponse } from 'src/app/requests/users/useQueryUsersDatagrid';
import { useMutationDeleteUser } from 'src/app/requests/users/useMutationDeleteUser';
import { useMutationSaveUserSign } from 'src/app/requests/users/useMutationSaveUserSign';
import { userKeys } from 'src/app/requests/users/keys';
import { Add, Group, Visibility, HistoryEdu, NoteAlt, RemoveCircleOutline } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { useGlobalDialog } from 'app/shared/components/GlobalDialog/GlobalDialogContext';
import useQueryInvalidator from 'src/app/shared/hooks/useQueryInvalidator';
import useFilterParams from 'src/app/shared/hooks/useFilterParams';
import { displayToast } from 'app/core/feedback/toast';
import { columnsUsers } from './columns';
import UsersFilters from './components/UsersFilters/UsersFilters';
import DialogUser from './components/DialogUser/DialogUser';
import DialogSigner from '../../shared/components/DialogSigner/DialogSigner';
import SignViewer from './components/SignViewer/SignViewer';
import SimpleHeader from 'app/shared/components/SimpleHeader';
import ChangePasswordDialog from './components/ChangePasswordDialog/ChangePasswordDialog';
import SyncLockIcon from '@mui/icons-material/SyncLock';

const USER_FILTER_KEYS = ['search', 'isActive', 'roleCode'] as const;

function Users() {
	const { openDialog } = useGlobalDialog();
	const [userId, setUserId] = useState('');
	const [openSigner, setOpenSigner] = useState(false);
	const [openPreviewSign, setOpenPreviewSign] = useState(false);
	const [previewURL, setPreviewURL] = useState('');
	const { filters, setFilters, clearFilters } = useFilterParams(USER_FILTER_KEYS);
	const { search, roleCode } = filters;
	// En la URL: 'true' | 'false'; ausente = todos.
	const isActive = filters.isActive === '' ? null : filters.isActive === 'true';
	const { invalidate } = useQueryInvalidator();
	const [openUserDialog, setOpenUserDialog] = useState(false);
	const [openChangePassword, setOpenChangePassword] = useState(false);
	const { user: userLogged } = useAuth();

	const { data: users = [], isLoading } = useQueryUsersDatagrid({ userId: userLogged.uid }, !!userLogged.uid);
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
			headerName: 'Firma',
			width: 170,
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
							startIcon={<Add />}
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
			headerName: 'Acciones',
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

		let matchingUsers = [...users];

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

		if (roleCode) {
			matchingUsers = matchingUsers.filter((user) => user.roleCode === roleCode);
		}

		return matchingUsers;
	}, [search, isActive, roleCode, users]);

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
			scroll="content"
			header={
				<SimpleHeader
					title="Usuarios"
					subtitle={
						isLoading
							? 'Gestiona los usuarios dentro de tu organización'
							: `${users.length} ${users.length === 1 ? 'usuario' : 'usuarios'} en tu organización`
					}
					actions={
						<Button
							variant="contained"
							color="primary"
							size="large"
							startIcon={<Add />}
							onClick={() => setOpenUserDialog(true)}
							sx={{ fontWeight: 600 }}
						>
							Nuevo usuario
						</Button>
					}
				/>
			}
			content={
				<div className="p-16 sm:p-24 w-full flex flex-col flex-1 min-h-0">
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
					<PageContentCard
						filters={
							<UsersFilters
								search={search}
								isActive={isActive}
								roleCode={roleCode}
								onChangeSearch={(nextSearch) => setFilters({ search: nextSearch })}
								onChangeIsActive={(nextIsActive) =>
									setFilters({ isActive: nextIsActive === null ? '' : String(nextIsActive) })
								}
								onChangeRoleCode={(nextRoleCode) => setFilters({ roleCode: nextRoleCode })}
								onClearFilters={clearFilters}
							/>
						}
						footer={
							users.length > 0 && (
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Mostrando {filteredUsers.length} de {users.length} usuarios
								</Typography>
							)
						}
						sx={{ flex: 1, minHeight: 0 }}
					>
						{filteredUsers.length === 0 && !isLoading ? (
							<EmptyState
								icon={Group}
								title="Sin usuarios"
								description={
									users.length === 0
										? 'Aún no hay usuarios en tu organización. Crea el primero con "Nuevo usuario".'
										: 'No hay usuarios que coincidan con la búsqueda o los filtros seleccionados.'
								}
							/>
						) : (
							<DataGrid
								autoHeight
								hideFooter
								getRowId={(user) => user.userId}
								rows={filteredUsers}
								loading={isLoading}
								columns={columns}
								density="comfortable"
								getRowHeight={() => 'auto'}
								disableRowSelectionOnClick
								sx={LIST_DATA_GRID_SX}
							/>
						)}
					</PageContentCard>
				</div>
			}
		/>
	);
}

export default Users;
