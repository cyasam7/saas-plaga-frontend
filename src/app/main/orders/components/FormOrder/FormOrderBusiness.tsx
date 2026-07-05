import { useState } from 'react';
import {
	Autocomplete,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	InputAdornment,
	MenuItem,
	Stack,
	TextField,
	Typography
} from '@mui/material';
import { Add, LocationOn, Search, Store } from '@mui/icons-material';
import { UseFormReturn } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import PhoneInputForm from 'app/shared-components/Form/PhoneInputForm/PhoneInputForm';
import { PhoneInput } from 'app/shared-components/Form/PhoneInput/PhoneInput';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';
import { ClientService } from 'src/app/shared/services/ClientService';
import { BranchService } from 'src/app/shared/services/BranchService';
import { Branch } from 'src/app/main/clients/types';
import { EBusinessMode, EClientType, IFormCreatePest } from './FormOrderProps';
import { defaultValuesOrder } from './defaultValues';

interface IFormOrderBusinessProps {
	formHandler: UseFormReturn<IFormCreatePest>;
	disabled?: boolean;
}

const emptyNewLocation = { name: '', address: '', contactPhone: '' };

const businessModeOptions = [
	{
		value: EBusinessMode.EXISTING,
		icon: <Search sx={{ fontSize: 28 }} />,
		label: 'Cliente existente',
		description: 'Seleccionar de la base de datos'
	},
	{
		value: EBusinessMode.NEW,
		icon: <Add sx={{ fontSize: 28 }} />,
		label: 'Nuevo cliente',
		description: 'Registrar una empresa nueva'
	}
] as const;

function FormOrderBusiness(props: IFormOrderBusinessProps) {
	const { formHandler, disabled } = props;
	const queryClient = useQueryClient();

	const businessMode = formHandler.watch('businessMode');
	const clientId = formHandler.watch('clientId');

	const [selectedBranchId, setSelectedBranchId] = useState<string>('');
	const [addingLocation, setAddingLocation] = useState(false);
	const [newLocation, setNewLocation] = useState(emptyNewLocation);

	const { data: clients = [], isLoading: isLoadingClients } = useQuery({
		queryKey: ['business-clients'],
		queryFn: () => ClientService.getByQuery({ type: 'business' })
	});

	const branchesQueryKey = ['client-branches', clientId];
	const { data: branches = [], isLoading: isLoadingBranches } = useQuery({
		queryKey: branchesQueryKey,
		queryFn: () => BranchService.byQuery({ clientId }),
		enabled: Boolean(clientId) && businessMode === EBusinessMode.EXISTING
	});

	function handleModeChange(mode: EBusinessMode): void {
		formHandler.reset({
			...defaultValuesOrder,
			clientType: EClientType.BUSINESS,
			businessMode: mode
		});
		setSelectedBranchId('');
		setAddingLocation(false);
		setNewLocation(emptyNewLocation);
	}

	function handleSelectClient(client: { id: string; name: string } | null): void {
		formHandler.setValue('clientId', client?.id ?? '');
		formHandler.setValue('clientName', client?.name ?? '');
		formHandler.setValue('clientAddress', '');
		formHandler.setValue('clientPhone', '');
		setSelectedBranchId('');
		setAddingLocation(false);
	}

	function applyLocation(branch: Branch): void {
		setSelectedBranchId(branch.id);
		formHandler.setValue('clientAddress', branch.address ?? '');
		formHandler.setValue('clientPhone', branch.contactPhone ?? '');
	}

	const createLocation = useMutation({
		mutationFn: () =>
			BranchService.save({
				clientId,
				name: newLocation.name,
				address: newLocation.address,
				contactPhone: newLocation.contactPhone,
				contactPerson: formHandler.watch('clientName')
			}),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: branchesQueryKey });
			const refreshed = await BranchService.byQuery({ clientId });
			const created = refreshed.find(
				(b) => b.name === newLocation.name && b.address === newLocation.address
			);
			if (created) {
				applyLocation(created);
			}
			setAddingLocation(false);
			setNewLocation(emptyNewLocation);
			displayToast({
				message: 'Ubicación agregada',
				variant: 'success',
				autoHideDuration: 3000,
				anchorOrigin: { horizontal: 'right', vertical: 'top' }
			});
		},
		onError: () => {
			displayToast({
				message: 'No se pudo agregar la ubicación',
				variant: 'error',
				autoHideDuration: 3000,
				anchorOrigin: { horizontal: 'right', vertical: 'top' }
			});
		}
	});

	const selectedClient = clients.find((c) => c.id === clientId) ?? null;
	const canAddLocation =
		newLocation.name.trim() && newLocation.address.trim() && newLocation.contactPhone.trim();

	return (
		<Grid
			container
			spacing={2}
		>
			{/* Business mode selector */}
			<Grid
				item
				xs={12}
			>
				<Box sx={{ display: 'flex', gap: 1.5 }}>
					{businessModeOptions.map((option) => {
						const isSelected = businessMode === option.value;
						return (
							<Box
								key={option.value}
								onClick={() => {
									if (!disabled) handleModeChange(option.value);
								}}
								sx={{
									flex: 1,
									display: 'flex',
									alignItems: 'center',
									gap: 1.5,
									p: 1.5,
									borderRadius: 1.5,
									border: 1.5,
									borderColor: isSelected ? 'primary.main' : 'divider',
									bgcolor: isSelected ? 'action.selected' : 'background.paper',
									cursor: disabled ? 'default' : 'pointer',
									opacity: disabled ? 0.6 : 1,
									transition: 'border-color 0.2s, background-color 0.2s',
									'&:hover': {
										borderColor: disabled ? undefined : 'primary.light'
									}
								}}
							>
								<Box
									sx={{
										color: isSelected ? 'primary.main' : 'text.secondary',
										transition: 'color 0.2s',
										display: 'flex'
									}}
								>
									{option.icon}
								</Box>
								<Box>
									<Typography
										variant="body2"
										sx={{ fontWeight: 600, lineHeight: 1.3 }}
									>
										{option.label}
									</Typography>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										{option.description}
									</Typography>
								</Box>
							</Box>
						);
					})}
				</Box>
			</Grid>

			{businessMode === EBusinessMode.EXISTING ? (
				<>
					<Grid
						item
						xs={12}
					>
						<Autocomplete
							options={clients}
							loading={isLoadingClients}
							value={selectedClient}
							getOptionLabel={(option) => option.name}
							isOptionEqualToValue={(option, value) => option.id === value.id}
							disabled={disabled}
							onChange={(_, value) => handleSelectClient(value)}
							renderInput={(params) => (
								<TextField
									{...params}
									size="small"
									label="Cliente"
									required
									autoComplete="off"
									error={!!formHandler.formState.errors.clientId}
									helperText={formHandler.formState.errors.clientId?.message}
									InputProps={{
										...params.InputProps,
										startAdornment: (
											<InputAdornment position="start">
												<Search fontSize="small" />
											</InputAdornment>
										),
										endAdornment: (
											<>
												{isLoadingClients ? (
													<CircularProgress size={18} />
												) : null}
												{params.InputProps.endAdornment}
											</>
										)
									}}
								/>
							)}
						/>
					</Grid>

					{clientId ? (
						<Grid
							item
							xs={12}
						>
							<TextField
								select
								size="small"
								fullWidth
								label="Ubicación"
								value={selectedBranchId}
								disabled={disabled || isLoadingBranches}
								onChange={(e) => {
									const branch = branches.find((b) => b.id === e.target.value);
									if (branch) {
										applyLocation(branch);
									}
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LocationOn fontSize="small" />
										</InputAdornment>
									)
								}}
								helperText={
									branches.length === 0 && !isLoadingBranches
										? 'Este cliente no tiene ubicaciones. Agrega una nueva.'
										: 'Selecciona la ubicación del servicio'
								}
							>
								{branches.map((branch) => (
									<MenuItem
										key={branch.id}
										value={branch.id}
									>
										{branch.name} — {branch.address}
									</MenuItem>
								))}
							</TextField>

							<Button
								size="small"
								sx={{ mt: 1 }}
								startIcon={<Add />}
								onClick={() => setAddingLocation(true)}
								disabled={disabled}
							>
								Agregar nueva ubicación
							</Button>
						</Grid>
					) : null}
				</>
			) : (
				<>
					<Grid
						item
						xs={12}
						md={6}
					>
						<TextFieldForm
							control={formHandler.control}
							name="clientName"
							label="Nombre de la empresa"
							disabled={disabled}
							fullWidth
							required
							size="small"
							autoComplete="organization"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Store fontSize="small" />
									</InputAdornment>
								)
							}}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
					>
						<PhoneInputForm
							name="clientPhone"
							control={formHandler.control}
							variant="outlined"
							label="Teléfono"
							size="small"
							disabled={disabled}
							fullWidth
							required
						/>
					</Grid>
					<Grid
						item
						xs={12}
					>
						<TextFieldForm
							control={formHandler.control}
							name="clientAddress"
							label="Dirección"
							disabled={disabled}
							fullWidth
							size="small"
							autoComplete="street-address"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<LocationOn fontSize="small" />
									</InputAdornment>
								)
							}}
						/>
					</Grid>
				</>
			)}

			<Grid
				item
				xs={12}
			>
				<TextFieldForm
					name="description"
					control={formHandler.control}
					label="Descripción"
					disabled={disabled}
					fullWidth
					multiline
					rows={3}
					variant="outlined"
					size="small"
					autoComplete="off"
				/>
			</Grid>

			<Dialog
				open={addingLocation}
				onClose={() => {
					setAddingLocation(false);
					setNewLocation(emptyNewLocation);
				}}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: { borderRadius: 2 }
				}}
			>
				<DialogTitle sx={{ pb: 1 }}>Nueva ubicación</DialogTitle>
				<DialogContent>
					<Stack
						spacing={2}
						sx={{ mt: 1 }}
					>
						<TextField
							size="small"
							label="Nombre"
							fullWidth
							placeholder="Ej. Oficina central…"
							autoComplete="off"
							autoFocus
							value={newLocation.name}
							onChange={(e) =>
								setNewLocation((prev) => ({ ...prev, name: e.target.value }))
							}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Store fontSize="small" />
									</InputAdornment>
								)
							}}
						/>
						<TextField
							size="small"
							label="Dirección"
							fullWidth
							placeholder="Ej. Av. Reforma 222, Col. Juárez…"
							autoComplete="street-address"
							value={newLocation.address}
							onChange={(e) =>
								setNewLocation((prev) => ({ ...prev, address: e.target.value }))
							}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<LocationOn fontSize="small" />
									</InputAdornment>
								)
							}}
						/>
						<PhoneInput
							label="Teléfono"
							value={newLocation.contactPhone}
							onChange={(phone) =>
								setNewLocation((prev) => ({ ...prev, contactPhone: phone }))
							}
						/>
					</Stack>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button
						onClick={() => {
							setAddingLocation(false);
							setNewLocation(emptyNewLocation);
						}}
					>
						Cancelar
					</Button>
					<Button
						onClick={() => createLocation.mutate()}
						disabled={!canAddLocation || createLocation.isLoading}
						variant="contained"
					>
						{createLocation.isLoading ? 'Guardando…' : 'Guardar ubicación'}
					</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	);
}

export default FormOrderBusiness;
