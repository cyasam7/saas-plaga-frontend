import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { IDialogSignerProps } from './IDialogSigner';

const SIGNATURE_AREA_HEIGHT = 220;

function DialogSigner(props: IDialogSignerProps) {
	const { onSubmit, onClose, open } = props;
	const [isSaving, setIsSaving] = useState(false);
	const [hasSignature, setHasSignature] = useState(false);
	const signaturePadRef = useRef<SignatureCanvas>(null);

	// The canvas' drawing buffer must match its rendered size (× pixel ratio); otherwise strokes land
	// away from the pointer and look blurry. Its size is only known once the dialog has finished opening.
	function handleDialogEntered(): void {
		const signaturePad = signaturePadRef.current;
		const canvas = signaturePad?.getCanvas();
		if (!signaturePad || !canvas) return;

		const pixelRatio = Math.max(window.devicePixelRatio || 1, 1);
		canvas.width = canvas.offsetWidth * pixelRatio;
		canvas.height = canvas.offsetHeight * pixelRatio;
		canvas.getContext('2d')?.scale(pixelRatio, pixelRatio);
		signaturePad.clear();
		setHasSignature(false);
	}

	function handleClear(): void {
		signaturePadRef.current?.clear();
		setHasSignature(false);
	}

	function handleClose(): void {
		if (isSaving) return;
		onClose();
	}

	async function handleSubmit(): Promise<void> {
		const signaturePad = signaturePadRef.current;
		if (!signaturePad || signaturePad.isEmpty()) return;

		setIsSaving(true);
		const signatureDataUrl = signaturePad.getTrimmedCanvas().toDataURL('image/png');
		const signatureImage = await (await fetch(signatureDataUrl)).blob();
		try {
			await onSubmit(signatureImage);
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{ sx: { borderRadius: 3 } }}
			TransitionProps={{ onEntered: handleDialogEntered }}
		>
			{/* Same title layout as DialogSkeleton; this dialog needs `TransitionProps`, so it uses Dialog directly. */}
			<DialogTitle sx={{ pb: 1.5 }}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					spacing={2}
				>
					<Box>
						<Typography
							variant="h6"
							component="span"
							sx={{ display: 'block', fontWeight: 700, lineHeight: 1.3 }}
						>
							Firma del usuario
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							Dibuja la firma con el mouse o con el dedo. Así aparecerá en los reportes.
						</Typography>
					</Box>
					<IconButton
						aria-label="Cerrar"
						onClick={handleClose}
						disabled={isSaving}
						sx={{ mt: -0.5, mr: -0.5 }}
					>
						<Close />
					</IconButton>
				</Stack>
			</DialogTitle>
			<DialogContent dividers>
				<Box
					sx={{
						position: 'relative',
						borderRadius: 2,
						border: 1,
						borderColor: 'divider',
						overflow: 'hidden',
						// The signature is saved on white, so the pad is white in dark mode too.
						bgcolor: 'common.white'
					}}
				>
					<SignatureCanvas
						ref={signaturePadRef}
						backgroundColor="white"
						onEnd={() => setHasSignature(true)}
						canvasProps={{
							'aria-label': 'Área para dibujar la firma',
							style: {
								display: 'block',
								width: '100%',
								height: SIGNATURE_AREA_HEIGHT,
								cursor: 'crosshair',
								touchAction: 'none'
							}
						}}
					/>
					{/* Signing line: a guide only, it is not part of the saved image. */}
					<Box
						aria-hidden
						sx={{
							position: 'absolute',
							left: 24,
							right: 24,
							bottom: 44,
							borderBottom: '1px dashed',
							borderColor: 'grey.400',
							pointerEvents: 'none'
						}}
					/>
					{!hasSignature && (
						<Typography
							aria-hidden
							variant="caption"
							sx={{
								position: 'absolute',
								left: 24,
								bottom: 20,
								color: 'grey.500',
								pointerEvents: 'none'
							}}
						>
							Firma aquí
						</Typography>
					)}
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button
					variant="text"
					color="inherit"
					onClick={handleClear}
					disabled={isSaving || !hasSignature}
					sx={{ mr: 'auto' }}
				>
					Limpiar
				</Button>
				<Button
					variant="outlined"
					color="primary"
					onClick={handleClose}
					disabled={isSaving}
				>
					Cancelar
				</Button>
				<LoadingButton
					variant="contained"
					color="primary"
					onClick={handleSubmit}
					loading={isSaving}
					disabled={!hasSignature}
				>
					Guardar firma
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}

export default DialogSigner;
