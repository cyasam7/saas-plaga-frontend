import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import type { IGlobalDialogOptions } from './GlobalDialogContext';

type GlobalDialogProps = {
	dialogOptions: IGlobalDialogOptions | null;
	onClose: () => void;
};

function GlobalDialog({ dialogOptions, onClose }: GlobalDialogProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function handleSubmit(): Promise<void> {
		try {
			setIsLoading(true);
			await dialogOptions?.onAccept();
		} catch {
			// onAccept handles and reports its own errors; the dialog only needs to close.
		} finally {
			onClose();
			setIsLoading(false);
		}
	}

	function handleCancel(): void {
		dialogOptions?.onCancel?.();
		onClose();
	}

	return (
		<Dialog
			open={dialogOptions !== null}
			PaperProps={{ sx: { minWidth: '400px', minHeight: '160px' } }}
		>
			<DialogTitle>{dialogOptions?.title}</DialogTitle>
			<DialogContent>{dialogOptions?.text}</DialogContent>
			<DialogActions>
				<Button
					onClick={handleCancel}
					disabled={isLoading}
					color="secondary"
					variant="outlined"
				>
					{dialogOptions?.textCancel ?? 'Cancelar'}
				</Button>
				<LoadingButton
					onClick={handleSubmit}
					color="primary"
					variant="contained"
					loading={isLoading}
				>
					{dialogOptions?.textAccept ?? 'Aceptar'}
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}

export default GlobalDialog;
