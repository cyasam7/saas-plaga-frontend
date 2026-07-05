// ReusableTextField.tsx
import { Controller } from 'react-hook-form';
import { PhoneInput } from 'app/shared-components/Form/PhoneInput/PhoneInput';
import { PhoneInputFormProps } from './IPhoneInputForm';

function PhoneInputForm({ name, control, label, ...props }: PhoneInputFormProps) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => {
				return (
					<PhoneInput
						{...field}
						{...props}
						name={name}
						label={label}
						error={!!error}
						helperText={error?.message}
					/>
				);
			}}
		/>
	);
}

export default PhoneInputForm;
