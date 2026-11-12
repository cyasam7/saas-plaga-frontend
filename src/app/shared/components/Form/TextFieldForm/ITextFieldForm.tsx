// ReusableTextField.tsx
import { TextFieldProps } from '@mui/material';
import { Control, Path } from 'react-hook-form';

export type ITextFieldFormProps<T> = {
	name: Path<T>;
	control: Control<T>;
	label: string;
} & TextFieldProps;
