import { Text, View } from '@react-pdf/renderer';
import React from 'react';

interface IInputValue {
	displayName: string;
	value: string;
	color: string;
}

function InputValue(props: IInputValue) {
	const { displayName, value, color } = props;
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				gap: '12px'
			}}
		>
			<Text style={{ fontSize: '10px', color }}>{displayName}:</Text>
			<Text style={{ fontSize: '10px' }}>{value}</Text>
		</View>
	);
}

export default InputValue;
