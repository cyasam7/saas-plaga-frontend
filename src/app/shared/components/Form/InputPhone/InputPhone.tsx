import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import es from 'react-phone-input-2/lang/es.json';

interface IInputPhoneProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

function InputPhone(props: IInputPhoneProps) {
	const { onChange, value, disabled } = props;
	return (
		<PhoneInput
			country="mx"
			containerClass="w-full"
			disableCountryCode
			value={value}
			localization={es}
			onlyCountries={['mx']}
			disabled={disabled}
			inputProps={{
				name: 'phone',
				required: true
			}}
			onChange={(phone) => onChange(phone)}
		/>
	);
}

export default InputPhone;
