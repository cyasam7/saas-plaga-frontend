import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import React from 'react';
import { ISignViewerProps } from './ISignViewer';

function SignViewer(props: ISignViewerProps) {
	const { onClose, open, url } = props;
	return (
		<Dialog open={open}>
			<DialogTitle>
				<Typography variant="h6">Firma</Typography>
			</DialogTitle>
			<DialogContent>
				{url && (
					<img
						src={url}
						alt="firma"
					/>
				)}
			</DialogContent>
			<DialogActions>
				<Stack
					direction="row"
					justifyContent="flex-end"
				>
					<Button
						variant="outlined"
						color="primary"
						onClick={onClose}
					>
						Cerrar
					</Button>
				</Stack>
			</DialogActions>
		</Dialog>
	);
}

export default SignViewer;
