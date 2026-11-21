import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
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
					<Box
						sx={{
							p: 3,
							borderRadius: 2,
							border: 1,
							borderColor: 'divider',
							// La firma es tinta oscura guardada sobre blanco: fondo claro siempre, también en modo oscuro.
							bgcolor: 'common.white'
						}}
					>
						<img
							src={url}
							alt="Firma del usuario"
							style={{ display: 'block', maxWidth: '100%', maxHeight: 240, margin: '0 auto' }}
						/>
					</Box>
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
