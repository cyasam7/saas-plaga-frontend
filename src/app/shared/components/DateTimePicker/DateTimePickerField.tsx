import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';
import { FormHelperText } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import { FIELD_REQUIRED } from 'src/app/shared/constants/yupMessages';
import { TIMEZONE } from 'src/app/shared/constants/dateFormat';

export type DateTimePickerViews = 'year' | 'month' | 'day' | 'hours' | 'minutes';
interface DateTimePickerFieldProps<T extends FieldValues> {
	name: Path<T>;
	control: Control<T>;
	label?: string;
	disabled?: boolean;
	required?: boolean;
	/** Fecha y hora mínimas que se pueden elegir (por defecto, ahora): bloquea también las horas ya pasadas de hoy. */
	minDateTime?: Dayjs;
	fullWidth?: boolean;
	datePickerProps?: DateTimePickerProps<Dayjs>
}

export function DateTimePickerField<T extends FieldValues>({
	name,
	control,
	label = 'Fecha',
	disabled = false,
	required = true,
	minDateTime = dayjs(),
	fullWidth = true,
	datePickerProps
}: DateTimePickerFieldProps<T>) {

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<>
					<DateTimePicker
						timezone={TIMEZONE}
						label={required ? `${label} *` : label}
						disabled={disabled}
						sx={{ width: fullWidth ? '100%' : 'auto' }}
						value={field.value}
						minDateTime={minDateTime}
						onChange={(newValue) => field.onChange(newValue)}
						ampm={true}
						{...datePickerProps}
						slotProps={{
							textField: {
								variant: 'outlined',
								color: fieldState.error?.message ? 'error' : undefined,
								size: 'small',
								error: !!fieldState.error?.message
							}
						}}
					/>
					{fieldState.error && (
						<FormHelperText
							sx={{ paddingLeft: 1.7 }}
							error={!!fieldState.error.message}
						>
							{fieldState.error.message || FIELD_REQUIRED}
						</FormHelperText>
					)}
				</>
			)}
		/>
	);
}
