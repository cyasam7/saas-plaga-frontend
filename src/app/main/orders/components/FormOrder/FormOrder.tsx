import { Box, Fade, Grid, InputAdornment, TextField } from '@mui/material';
import {
	Business,
	CalendarMonth,
	ContactMail,
	Groups,
	Person
} from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import { NumericFormatAdapter } from 'app/shared-components/NumericFormatAdapter/NumericFormatAdapter';
import { DateTimePickerField } from 'app/shared-components/DateTimePicker';
import { EClientType, IFormOrderProps } from './FormOrderProps';
import FormOrderIndividual from './FormOrderIndividual';
import FormOrderBusiness from './FormOrderBusiness';
import SelectableCard from './SelectableCard';
import FormSection from './FormSection';
import { defaultValuesOrder } from './defaultValues';

const clientTypeOptions = [
	{
		value: EClientType.BUSINESS,
		icon: <Business sx={{ fontSize: 32 }} />,
		label: 'Empresas',
		description: 'Cliente corporativo (B2B)',
		ariaLabel: 'Empresas (B2B)'
	},
	{
		value: EClientType.INDIVIDUAL,
		icon: <Person sx={{ fontSize: 32 }} />,
		label: 'Residencial',
		description: 'Cliente particular',
		ariaLabel: 'Residencial'
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
				<FormSection
					icon={<Groups fontSize="small" />}
					title="Tipo de cliente"
					description="¿Para quién es esta orden de servicio?"
				>
					<Box
						role="radiogroup"
						aria-label="Tipo de cliente"
						sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}
					>
						{clientTypeOptions.map((option) => (
							<SelectableCard
								key={option.value}
								icon={option.icon}
								label={option.label}
								description={option.description}
								ariaLabel={option.ariaLabel}
								selected={clientType === option.value}
								disabled={disabled || clientTypeField}
								onSelect={() => handleClientTypeChange(option.value)}
							/>
						))}
					</Box>
				</FormSection>
			</Grid>

			{/* Sección: Datos del cliente */}
			<Grid
				item
				xs={12}
			>
				<FormSection
					icon={<ContactMail fontSize="small" />}
					title="Datos del cliente"
					description="Información de contacto y ubicación del servicio."
				>
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
				</FormSection>
			</Grid>

			{/* Sección: Fecha y costo */}
			<Grid
				item
				xs={12}
			>
				<FormSection
					icon={<CalendarMonth fontSize="small" />}
					title="Fecha y costo"
					description="Cuándo se realiza el servicio y su precio."
				>
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
				</FormSection>
			</Grid>
		</Grid>
	);
}

export default FormOrder;
