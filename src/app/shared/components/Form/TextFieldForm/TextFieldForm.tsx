import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { ITextFieldFormProps } from './ITextFieldForm';

function TextFieldForm<T>({ name, control, label, ...props }: ITextFieldFormProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<TextField
					{...props}
					{...field}
					label={label}
					error={!!error}
					helperText={error ? error.message : null}
				/>
			)}
		/>
	);
}

export default TextFieldForm;
