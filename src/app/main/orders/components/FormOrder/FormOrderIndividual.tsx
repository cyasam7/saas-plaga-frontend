import { Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { LocationOn, Person } from '@mui/icons-material';
import { Controller, UseFormReturn } from 'react-hook-form';
import PhoneInputForm from 'app/shared-components/Form/PhoneInputForm/PhoneInputForm';
import { openDialog } from 'app/shared-components/GlobalDialog/openDialog';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';
import { OrderService } from 'src/app/shared/services/OrderService';
import { EClientType, IFormCreatePest } from './FormOrderProps';

interface IFormOrderIndividualProps {
	formHandler: UseFormReturn<IFormCreatePest>;
	disabled?: boolean;
	disableSpecificField?: {
		clientNameField?: boolean;
		clientPhoneField?: boolean;
		clientAddressField?: boolean;
		descriptionField?: boolean;
	};
}

function FormOrderIndividual(props: IFormOrderIndividualProps) {
	const { formHandler, disabled, disableSpecificField } = props;
	const {
		clientNameField = false,
		clientPhoneField = false,
		clientAddressField = false,
		descriptionField = false
	} = disableSpecificField || {};

	async function handleAutoCompleteClient(): Promise<void> {
		const phone = formHandler.watch('clientPhone');
		if (!phone) {
			return;
		}

		const clientFound = await OrderService.getClientInfoByPhone(phone);

		if (!clientFound || clientFound.clientType !== EClientType.INDIVIDUAL) {
			return;
		}

		openDialog({
			title: 'Cliente encontrado',
			text: (
				<Stack spacing={1}>
					<Typography variant="body2">
						¿Deseas autocompletar la información con los datos del cliente?
					</Typography>
					<Stack spacing={0.5}>
						<Typography variant="body2">
							<strong>Nombre:</strong> {clientFound.clientName || '—'}
						</Typography>
						<Typography variant="body2">
							<strong>Teléfono:</strong> {phone}
						</Typography>
						<Typography variant="body2">
							<strong>Dirección:</strong> {clientFound.clientAddress || '—'}
						</Typography>
						<Typography variant="body2">
							<strong>Tipo:</strong> Residencial
						</Typography>
					</Stack>
				</Stack>
			),
			textAccept: 'Sí, autocompletar',
			textCancel: 'No',
			onAccept() {
				formHandler.setValue('clientAddress', clientFound.clientAddress);
				formHandler.setValue('clientId', clientFound.clientId);
				formHandler.setValue('clientName', clientFound.clientName);
			}
		});
	}

	return (
		<Grid
			container
			spacing={2}
		>
			<Grid
				item
				xs={12}
			>
				<PhoneInputForm
					name="clientPhone"
					control={formHandler.control}
					variant="outlined"
					label="Teléfono"
					size="small"
					disabled={disabled || clientPhoneField}
					fullWidth
					required
					onBlur={handleAutoCompleteClient}
				/>
			</Grid>
			<Grid
				item
				xs={12}
				md={6}
			>
				<Controller
					control={formHandler.control}
					name="clientName"
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							size="small"
							disabled={disabled || clientNameField}
							variant="outlined"
							required
							label="Nombre completo"
							placeholder="Escribe el nombre del cliente…"
							fullWidth
							autoComplete="name"
							spellCheck={false}
							error={!!fieldState.error}
							helperText={fieldState.error?.message && fieldState.error?.message}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Person fontSize="small" />
									</InputAdornment>
								)
							}}
						/>
					)}
				/>
			</Grid>
			<Grid
				item
				xs={12}
				md={6}
			>
				<TextFieldForm
					control={formHandler.control}
					name="clientAddress"
					label="Dirección"
					disabled={disabled || clientAddressField}
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
			<Grid
				item
				xs={12}
			>
				<TextFieldForm
					name="description"
					control={formHandler.control}
					label="Descripción"
					disabled={disabled || descriptionField}
					fullWidth
					multiline
					rows={3}
					variant="outlined"
					size="small"
					autoComplete="off"
				/>
			</Grid>
		</Grid>
	);
}

export default FormOrderIndividual;
