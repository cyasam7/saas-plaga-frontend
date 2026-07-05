import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { LoadingButton } from '@mui/lab';
import { IDialogSignerProps } from './IDialogSigner';

function DialogSigner(props: IDialogSignerProps) {
	const { onSubmit, onClose, open } = props;
	const [isLoading, setIsLoading] = useState(false);
	const ref = useRef(null);

	function handleClear(): void {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		ref.current.clear();
	}

	async function handleSubmit(): Promise<void> {
		setIsLoading(true);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		const dataURL = ref.current.getTrimmedCanvas().toDataURL('image/png');
		const blob = await (await fetch(dataURL as string)).blob();
		await onSubmit(blob);
		setIsLoading(false);
	}

	return (
		<Dialog open={open}>
			<DialogTitle>Actualiza la firma</DialogTitle>
			<DialogContent>
				<SignaturePad
					ref={ref}
					backgroundColor="white"
					canvasProps={{
						style: {
							width: '500px',
							height: '500px'
						}
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Stack
					direction="row"
					spacing={1}
				>
					<Button
						variant="outlined"
						color="primary"
						onClick={onClose}
						disabled={isLoading}
					>
						Cerrar
					</Button>
					<Button
						variant="contained"
						color="secondary"
						onClick={handleClear}
						disabled={isLoading}
					>
						Limpiar
					</Button>
					<LoadingButton
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						loading={isLoading}
					>
						Guardar
					</LoadingButton>
				</Stack>
			</DialogActions>
		</Dialog>
	);
}

export default DialogSigner;
