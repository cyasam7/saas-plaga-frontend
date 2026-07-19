import { Text, View } from '@react-pdf/renderer';
import React, { ReactElement } from 'react';

interface ICategory {
	title: string;
	element: ReactElement;
	color: string;
}

function Category(props: ICategory) {
	const { title, element, color } = props;
	return (
		<View>
			<View
				style={{
					backgroundColor: color,
					height: '35px',
					justifyContent: 'center',
					paddingHorizontal: '8px'
				}}
			>
				<Text style={{ color: '#fff', fontSize: '12px' }}>{title}</Text>
			</View>
			<View style={{ paddingVertical: '8px', paddingHorizontal: '4px' }}>{element}</View>
		</View>
	);
}

export default Category;
