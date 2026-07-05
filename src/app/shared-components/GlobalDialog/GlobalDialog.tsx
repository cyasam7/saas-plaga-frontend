import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import { useAppSelector } from 'app/store/store';
import { useDispatch } from 'react-redux';
import { closeModal, selectGlobalDialog } from '../../auth/user/store/dialogSlice';

function GlobalDialog() {
	const [loading, setLoading] = useState<boolean>(false);
	const dispatch = useDispatch();
	const { onAccept, open, text, title, onCancel, textAccept, textCancel } = useAppSelector(selectGlobalDialog);

	async function handleSubmit(): Promise<void> {
		try {
			setLoading(true);
			await onAccept();
		} catch {
			dispatch(closeModal());
			setLoading(false);
		} finally {
			dispatch(closeModal());
			setLoading(false);
		}
	}
	function handleClose(): void {
		onCancel?.();
		dispatch(closeModal());
	}

	return (
		<Dialog
			open={open}
			PaperProps={{ sx: { minWidth: '400px', minHeight: '160px' } }}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{text}</DialogContent>
			<DialogActions>
				<Button
					onClick={handleClose}
					disabled={loading}
					color="secondary"
					variant="outlined"
				>
					{textCancel ?? 'Cancelar'}
				</Button>
				<LoadingButton
					onClick={handleSubmit}
					color="primary"
					variant="contained"
					loading={loading}
				>
					{textAccept ?? 'Aceptar'}
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}

export default GlobalDialog;
