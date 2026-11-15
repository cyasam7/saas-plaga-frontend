import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { ISignViewerProps } from './ISignViewer';

function SignViewer(props: ISignViewerProps) {
	const { onClose, open, url } = props;
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Firma</DialogTitle>
			<DialogContent>
				{url && (
					<img
						src={url}
						alt="Firma del usuario"
						style={{ display: 'block', maxWidth: '100%', margin: '0 auto' }}
					/>
				)}
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button
					variant="outlined"
					color="primary"
					onClick={onClose}
				>
					Cerrar
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default SignViewer;
