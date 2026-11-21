import { Box, Button, Typography } from '@mui/material';
import FormDialog from 'app/shared/components/FormDialog/FormDialog';
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
		<FormDialog
			open={open}
			onClose={onClose}
			title="Firma del usuario"
			subtitle="Dibuja la firma con el mouse o con el dedo. Así aparecerá en los reportes."
			onSubmit={handleSubmit}
			submitLabel="Guardar firma"
			isSubmitting={isSaving}
			isSubmitDisabled={!hasSignature}
			onEntered={handleDialogEntered}
			secondaryAction={
				<Button
					variant="text"
					color="inherit"
					onClick={handleClear}
					disabled={isSaving || !hasSignature}
				>
					Limpiar
				</Button>
			}
		>
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
		</FormDialog>
	);
}

export default DialogSigner;
