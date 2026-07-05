import { Button, Stack } from '@mui/material';
import React, { InputHTMLAttributes } from 'react';
import { v4 as uuid } from 'uuid';
import { useDocumentCanvas } from '../../../hooks/useDocumentCanvas';

function DocumentOptions() {
	const { setUpCanvas, addItemToCanvas, canvas, downloadDocument } = useDocumentCanvas();

	const handleFileChange = async (e: InputHTMLAttributes<HTMLInputElement>) => {
		console.log(e);
	};

	function handleAddItem(): void {
		addItemToCanvas({
			title: uuid(),
			x: canvas.width / 2,
			y: canvas.height / 2,
			id: uuid()
		});
	}

	return (
		<Stack>
			<input
				type="file"
				accept=".pdf"
				onChange={handleFileChange}
			/>
			<Button onClick={handleAddItem}>Agregar Texto</Button>
			<Button
				color="primary"
				variant="contained"
				onClick={downloadDocument}
			>
				Descargar
			</Button>
		</Stack>
	);
}

export default DocumentOptions;
