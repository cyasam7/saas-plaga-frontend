import {
	Box,
	Divider,
	Fade,
	Grid,
	InputAdornment,
	Paper,
	TextField,
	Typography
} from '@mui/material';
import { Business, Person } from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import { NumericFormatAdapter } from 'app/shared-components/NumericFormatAdapter/NumericFormatAdapter';
import { DateTimePickerField } from 'app/shared-components/DateTimePicker';
import { EClientType, IFormOrderProps } from './FormOrderProps';
import FormOrderIndividual from './FormOrderIndividual';
import FormOrderBusiness from './FormOrderBusiness';
import { defaultValuesOrder } from './defaultValues';

const clientTypeOptions = [
	{
		value: EClientType.BUSINESS,
		icon: <Business sx={{ fontSize: 32 }} />,
		label: 'Empresas',
		description: 'Cliente corporativo (B2B)'
	},
	{
		value: EClientType.INDIVIDUAL,
		icon: <Person sx={{ fontSize: 32 }} />,
		label: 'Residencial',
		description: 'Cliente particular'
	}
] as const;

function FormOrder(props: IFormOrderProps) {
	const { formHandler, disabled, isUpdating, disableSpecificField } = props;

	const {
		dateField = false,
		priceField = false,
		clientNameField = false,
		clientPhoneField = false,
		clientAddressField = false,
		descriptionField = false,
		clientTypeField = false
	} = disableSpecificField || {};

	const clientType = formHandler.watch('clientType');

	function handleClientTypeChange(type: EClientType) {
		formHandler.reset({
			...defaultValuesOrder,
			clientType: type
		});
	}

	return (
		<Grid
			container
			spacing={2.5}
		>
			{/* Sección: Tipo de cliente */}
			<Grid
				item
				xs={12}
			>
				<Paper
					variant="outlined"
					sx={{ p: 2.5, borderRadius: 2 }}
				>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}
					>
						Tipo de cliente
					</Typography>

					<Box sx={{ display: 'flex', gap: 1.5 }}>
						{clientTypeOptions.map((option) => {
							const isSelected = clientType === option.value;
							return (
								<Box
									key={option.value}
									onClick={() => {
										if (!disabled && !clientTypeField) {
											handleClientTypeChange(option.value);
										}
									}}
									sx={{
										flex: 1,
										display: 'flex',
										alignItems: 'center',
										gap: 1.5,
										p: 2,
										borderRadius: 2,
										border: 2,
										borderColor: isSelected ? 'primary.main' : 'divider',
										bgcolor: isSelected ? 'action.selected' : 'background.paper',
										cursor: disabled || clientTypeField ? 'default' : 'pointer',
										opacity: disabled || clientTypeField ? 0.6 : 1,
										transition: 'border-color 0.2s, background-color 0.2s',
										'&:hover': {
											borderColor: disabled || clientTypeField ? undefined : 'primary.light'
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
				</Paper>
			</Grid>

			{/* Sección: Datos del cliente */}
			<Grid
				item
				xs={12}
			>
				<Paper
					variant="outlined"
					sx={{ p: 2.5, borderRadius: 2 }}
				>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}
					>
						Datos del cliente
					</Typography>

					<Fade
						in
						key={clientType}
					>
						<Box>
							{!isUpdating && clientType === EClientType.BUSINESS ? (
								<FormOrderBusiness
									formHandler={formHandler}
									disabled={disabled}
								/>
							) : (
								<FormOrderIndividual
									formHandler={formHandler}
									disabled={disabled}
									disableSpecificField={{
										clientNameField,
										clientPhoneField,
										clientAddressField,
										descriptionField
									}}
								/>
							)}
						</Box>
					</Fade>
				</Paper>
			</Grid>

			<Grid
				item
				xs={12}
			>
				<Divider />
			</Grid>

			{/* Sección: Fecha y costo */}
			<Grid
				item
				xs={12}
			>
				<Paper
					variant="outlined"
					sx={{ p: 2.5, borderRadius: 2 }}
				>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}
					>
						Fecha y costo
					</Typography>

					<Grid
						container
						spacing={2}
					>
						<Grid
							item
							xs={12}
							md={6}
						>
							<DateTimePickerField
								control={formHandler.control}
								name="date"
								disabled={disabled || dateField}
								datePickerProps={{
									timeSteps: { minutes: 15 },
									ampm: false,
									format: 'DD/MM/YYYY HH:mm',
									views: ['year', 'month', 'day', 'hours', 'minutes']
								}}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
						>
							<Controller
								control={formHandler.control}
								name="price"
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										size="small"
										disabled={disabled || priceField}
										label="Costo"
										fullWidth
										variant="outlined"
										autoComplete="off"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">$</InputAdornment>
											),
											// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
											inputComponent: NumericFormatAdapter as any
										}}
										required
										error={Boolean(fieldState.error?.message)}
										helperText={
											fieldState.error
												? fieldState.error.message
												: 'Precio del servicio'
										}
									/>
								)}
							/>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
		</Grid>
	);
}

export default FormOrder;
