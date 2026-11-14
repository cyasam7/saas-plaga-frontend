import 'react-international-phone/style.css';

import { BaseTextFieldProps, InputAdornment, TextField } from '@mui/material';
import { defaultCountries, FlagImage, parseCountry, usePhoneInput } from 'react-international-phone';

export interface MUIPhoneProps extends BaseTextFieldProps {
	value: string;
	onChange: (phone: string) => void;
}

// Todos los teléfonos son de México: el +52 queda fijo y no se puede cambiar de país.
const MEXICO_ONLY_COUNTRIES = defaultCountries.filter((country) => parseCountry(country).iso2 === 'mx');

export function PhoneInput({ value, onChange, ...restProps }: MUIPhoneProps) {
	const { inputValue, handlePhoneValueChange, inputRef } = usePhoneInput({
		defaultCountry: 'mx',
		value,
		countries: MEXICO_ONLY_COUNTRIES,
		forceDialCode: true,
		disableCountryGuess: true,
		onChange: (data) => {
			// Solo el +52 (sin dígitos) cuenta como vacío, para que `required` siga funcionando.
			const hasOnlyDialCode = data.phone === `+${data.country.dialCode}`;
			onChange(hasOnlyDialCode ? '' : data.phone);
		}
	});

	return (
		<TextField
			variant="outlined"
			label="Phone number"
			color="primary"
			placeholder="Phone number"
			value={inputValue}
			onChange={(event) => {
				// Al pegar un número sin lada (p. ej. "5555555555") se reemplaza el +52 fijo y la librería
				// descartaría el valor; se le antepone el +52.
				if (!event.target.value.includes('+')) {
					event.target.value = `+52${event.target.value}`;
				}
				handlePhoneValueChange(event);
			}}
			type="tel"
			inputRef={inputRef}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<FlagImage
							iso2="mx"
							style={{ display: 'flex' }}
						/>
					</InputAdornment>
				)
			}}
			{...restProps}
		/>
	);
}
