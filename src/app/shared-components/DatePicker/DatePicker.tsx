import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { FormHelperText } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import { FIELD_REQUIRED } from 'src/app/shared-constants/yupMessages';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export type DateTimePickerViews = 'year' | 'month' | 'day' | 'hours' | 'minutes';
interface DatePickerFormProps<T extends FieldValues> {
	name: Path<T>;
	control: Control<T>;
	label?: string;
	disabled?: boolean;
	required?: boolean;
	minDate?: Dayjs;
	fullWidth?: boolean;
}

export function DatePickerForm<T extends FieldValues>({
	name,
	control,
	label = 'Fecha',
	disabled = false,
	required = true,
	minDate = dayjs(),
	fullWidth = true,
}: DatePickerFormProps<T>) {

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<>
					<DatePicker
						label={required ? `${label} *` : label}
						disabled={disabled}
						sx={{ width: fullWidth ? '100%' : 'auto' }}
						value={field.value}
						minDate={minDate}
						onChange={(newValue) => field.onChange(newValue)}
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
							{FIELD_REQUIRED}
						</FormHelperText>
					)}
				</>
			)}
		/>
	);
}
