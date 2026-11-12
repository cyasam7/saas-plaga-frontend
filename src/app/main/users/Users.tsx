import PageLayout from 'app/core/page/PageLayout';
import { Paper, Stack, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridActionsCellItemProps, GridColDef } from '@mui/x-data-grid';
import { useQueryUsersDatagrid, IUsersDatagridResponse } from 'src/app/requests/users/useQueryUsersDatagrid';
import { useMutationDeleteUser } from 'src/app/requests/users/useMutationDeleteUser';
import { useMutationSaveUserSign } from 'src/app/requests/users/useMutationSaveUserSign';
import { userKeys } from 'src/app/requests/users/keys';
import { Visibility, NotInterested, HistoryEdu, NoteAlt, RemoveCircleOutline } from '@mui/icons-material';
import { ReactElement, useMemo, useState } from 'react';
import { useGlobalDialog } from 'app/shared/components/GlobalDialog/GlobalDialogContext';
import useQueryInvalidator from 'src/app/shared/hooks/useQueryInvalidator';
import { displayToast } from 'app/core/feedback/toast';
import { useAppSelector } from 'app/store/store';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { columnsUsers } from './columns';
import HeaderGrid from './components/HeaderGrid/HeaderGrid';
import DialogUser from './components/DialogUser/DialogUser';
import DialogSigner from '../../shared/components/DialogSigner/DialogSigner';
import SignViewer from './components/SignViewer/SignViewer';
import SimpleHeader from 'app/shared/components/SimpleHeader';
import ChangePasswordDialog from './components/ChangePasswordDialog/ChangePasswordDialog';
import SyncLockIcon from '@mui/icons-material/SyncLock';

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
	const userLogged = useAppSelector(selectUser);

	const { data, isLoading } = useQueryUsersDatagrid({ userId: userLogged.uid }, !!userLogged.uid);
	const { mutateAsync: deleteUser } = useMutationDeleteUser();
	const { mutateAsync: saveUserSign } = useMutationSaveUserSign();

	const columns: GridColDef<IUsersDatagridResponse[number]>[] = [
		...columnsUsers,
		{
			field: 'sign',
			headerName: 'FIRMA',
			flex: 1,
			disableColumnMenu: true,
			type: 'actions',
			getActions: (params) => {
				const { sign } = params.row;
				const result: ReactElement<GridActionsCellItemProps>[] = [];
				if (sign) {
					result.push(
						<GridActionsCellItem
							icon={<Visibility />}
							key={0}
							label="Visualizar"
							onClick={() => {
								setPreviewURL(sign);
								setOpenPreviewSign(true);
							}}
						/>
					);
				} else {
					result.push(
						<GridActionsCellItem
							icon={<NotInterested />}
							key={1}
							label="No existe"
							onClick={() => {
								displayToast({
									anchorOrigin: {
										horizontal: 'right',
										vertical: 'top'
									},
									message: 'Aun no tiene firma registrada',
									variant: 'warning'
								});
							}}
						/>
					);
				}

				return result;
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
						key={0}
						label="MODIFICAR"
						icon={<NoteAlt />}
						showInMenu
						onClick={() => {
							setUserId(params.row.userId);
							setOpenUserDialog(true);
						}}
					/>,
					<GridActionsCellItem
						key={0}
						label="ELIMINAR"
						icon={<RemoveCircleOutline />}
						showInMenu
						onClick={() => {
							openDialog({
								title: 'Acción requerida',
								text: '¿Seguro que deseas eliminar este usuario?',
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
					/>,
					<GridActionsCellItem
						key={0}
						label="ACTUALIZAR FIRMA"
						icon={<HistoryEdu />}
						showInMenu
						onClick={() => {
							setUserId(params.row.userId);
							setOpenSigner(true);
						}}
					/>,
					<GridActionsCellItem
						key={0}
						label="CAMBIAR CONTRASEÑA"
						icon={<SyncLockIcon />}
						showInMenu
						onClick={() => {
							setUserId(params.row.userId);
							setOpenChangePassword(true);
						}}
					/>
				];
			}
		}
	];

	const filteredData = useMemo(() => {
		const searchLowerCase = search.toLowerCase();

		let copyData = [...(data ?? [])];

		if (search) {
			copyData = copyData.filter((i) => {
				return (
					i.email.toLowerCase().includes(searchLowerCase) ||
					i.name.toLowerCase().includes(searchLowerCase) ||
					i.phone.toLowerCase().includes(searchLowerCase)
				);
			});
		}

		if (isActive !== null) {
			copyData = copyData.filter((i) => i.isActive === isActive);
		}

		return copyData;
	}, [search, isActive, data]);

	async function handleSubmitOnSign(data: Blob): Promise<void> {
		const signFormData = new FormData();
		signFormData.append('file', data, `${userId}-sign.png`);
		signFormData.append('userId', userId);
		await saveUserSign({ formData: signFormData });
		invalidate(userKeys.lists());
		setUserId('');
		setOpenSigner(false);
		displayToast({
			anchorOrigin: {
				horizontal: 'right',
				vertical: 'top'
			},
			message: 'Se guardo correctamente',
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
						<Stack sx={{ height: 'calc(100vh - 240px)' }}>
							<DialogSigner
								open={openSigner}
								onClose={() => setOpenSigner(false)}
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
								onChangeIsActive={setIsActive}
								onChangeSearch={setSearch}
								onClickCreate={() => setOpenUserDialog(true)}
							/>
							<DataGrid
								getRowId={(i) => i.userId}
								rows={filteredData ?? []}
								loading={isLoading}
								columns={columns}
								hideFooter
							/>
						</Stack>
					</Paper>
				</div>
			}
		/>
	);
}

export default Users;
