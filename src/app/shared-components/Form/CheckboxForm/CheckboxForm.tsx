import { Checkbox, CheckboxProps, FormControlLabel, FormHelperText } from '@mui/material';
import { Control, Controller, Path } from 'react-hook-form';

export type CheckboxFormProps<T> = {
	name: Path<T>;
	control: Control<T>;
	label: string;
} & Omit<CheckboxProps, 'name'>;

function CheckboxForm<T>({ name, control, label, ...props }: CheckboxFormProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<>
					<FormControlLabel
						control={<Checkbox {...props} checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
						label={label}
					/>
					{error ? <FormHelperText error>{error.message}</FormHelperText> : null}
				</>
			)}
		/>
	);
}

export default CheckboxForm;
