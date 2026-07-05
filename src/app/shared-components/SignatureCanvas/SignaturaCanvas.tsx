import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import GestureIcon from '@mui/icons-material/Gesture';

function SignaturaCanvas() {
	const ref = useRef(null);
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	function handleOpenSigner(event: React.MouseEvent<HTMLButtonElement>): void {
		setOpenDialog(true);
	}

	function handleCloseSigner(): void {
		setOpenDialog(false);
	}

	return (
		<div>
			<Button
				variant="contained"
				onClick={handleOpenSigner}
				startIcon={<GestureIcon />}
				color="primary"
			>
				Actualizar firma
			</Button>
			<Dialog
				open={openDialog}
				onClose={handleCloseSigner}
			>
				<DialogTitle>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography variant="h6">Actualiza tu firma del reporte</Typography>
						<Stack
							direction="row"
							spacing={2}
						>
							<Button
								color="primary"
								variant="outlined"
								onClick={handleCloseSigner}
							>
								Cancelar
							</Button>
							<Button
								color="primary"
								variant="contained"
							>
								Actualizar
							</Button>
						</Stack>
					</Stack>
				</DialogTitle>
				<DialogContent>
					<SignaturePad
						ref={ref}
						canvasProps={{
							className: 'signatureCanvas',
							style: {
								background: 'white'
							}
						}}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default SignaturaCanvas;
