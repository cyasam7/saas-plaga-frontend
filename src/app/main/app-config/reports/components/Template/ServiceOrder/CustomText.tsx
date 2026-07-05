import { Text } from '@react-pdf/renderer';
import React from 'react';

interface IObject {
	[key: string]: number | string;
}

interface IProps {
	style?: IObject;
	text?: string;
	children?: React.ReactNode;
}

function CustomText(props: IProps) {
	const { style, text, children } = props;

	return <Text style={{ fontFamily: 'Inter', ...style }}>{text ?? children}</Text>;
}

export default CustomText;
