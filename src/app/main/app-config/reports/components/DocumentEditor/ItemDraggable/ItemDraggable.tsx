import React, { memo } from 'react';
import { Rnd } from 'react-rnd';
import { Box } from '@mui/material';
import { IItemDraggable, useDocumentCanvas } from '../../../hooks/useDocumentCanvas';

function ItemDraggable(props: IItemDraggable) {
	const { title, x, y, id } = props;
	const { addItemToCanvas } = useDocumentCanvas();

	return (
		<Rnd
			default={{
				x,
				y,
				width: 'auto',
				height: 'auto'
			}}
			onDragStop={(e, d) => {
				addItemToCanvas({ x: d.x, y: d.y, title, id });
			}}
			bounds="parent"
		>
			<Box sx={{ border: '1px dashed gray' }}>{title}</Box>
		</Rnd>
	);
}

export default memo(ItemDraggable);
