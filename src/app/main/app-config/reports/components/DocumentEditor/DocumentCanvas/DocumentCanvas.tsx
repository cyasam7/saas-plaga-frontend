import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Box, Button, Stack } from '@mui/material';
import { useDocumentCanvas } from '../../../hooks/useDocumentCanvas';
import ItemDraggable from '../ItemDraggable/ItemDraggable';

function DocumentCanvas() {
	const { canvas, itemsDraggable, addItemToCanvas } = useDocumentCanvas();

	const [scale, setScale] = useState<number>(1);

	const changeScale = (value: number) => () => {
		setScale((prev) => prev + value);
	};

	return (
		<Box
			sx={{
				background: 'gray',
				p: 6,
				display: 'flex',
				justifyContent: 'center',
				overflow: 'scroll',
				position: 'relative',
				maxHeight: 'calc(100vh - 200px);'
			}}
		>
			<Stack
				direction="row"
				spacing={2}
				sx={{ position: 'absolute', top: 2, left: 2 }}
			>
				<Button
					variant="contained"
					color="primary"
					size="small"
					onClick={changeScale(0.1)}
				>
					+
				</Button>
				<Button
					variant="contained"
					color="primary"
					size="small"
					onClick={changeScale(-0.1)}
				>
					-
				</Button>
			</Stack>
			<Document file={canvas && canvas.base64}>
				<Page
					scale={scale}
					renderTextLayer={false}
					renderAnnotationLayer={false}
					pageNumber={1}
				/>

				{Object.values(itemsDraggable).map((i, index) => (
					<ItemDraggable
						key={index}
						{...i}
					/>
				))}
			</Document>
		</Box>
	);
}

export default DocumentCanvas;
