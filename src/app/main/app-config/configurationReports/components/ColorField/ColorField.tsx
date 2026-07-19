import { Stack, TextField, Typography } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { IFormSaveAccount } from 'src/app/shared/entities/AppConfig';

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export interface IColorFieldProps {
	control: Control<IFormSaveAccount>;
	name: 'primaryColor' | 'secondaryColor';
	label: string;
	disabled?: boolean;
}

function ColorField({ control, name, label, disabled }: IColorFieldProps) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Stack
					spacing={1}
					flex={1}
				>
					<Typography variant="subtitle2">{label}</Typography>
					<Stack
						direction="row"
						spacing={1}
						alignItems="flex-start"
					>
						<input
							type="color"
							aria-label={label}
							disabled={disabled}
							/* El selector nativo siempre emite un hex válido; el texto puede ir a medias. */
							value={HEX_PATTERN.test(field.value) ? field.value : '#000000'}
							onChange={(e) => field.onChange(e.target.value)}
							style={{ width: 40, height: 40, padding: 0, border: 'none', background: 'none' }}
						/>
						<TextField
							{...field}
							disabled={disabled}
							error={Boolean(fieldState.error)}
							helperText={fieldState.error?.message}
							size="small"
							fullWidth
							inputProps={{ maxLength: 7, spellCheck: false }}
						/>
					</Stack>
				</Stack>
			)}
		/>
	);
}

export default ColorField;
