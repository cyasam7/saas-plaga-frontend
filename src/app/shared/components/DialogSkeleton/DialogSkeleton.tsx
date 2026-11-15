import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import React from 'react';
import { IDialogSkeletonProps } from './IDialogSkeletonProps';

function DialogSkeleton(props: IDialogSkeletonProps) {
	const { content, header, actions, onClose, open, maxWidth, sx } = props;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth={maxWidth}
			sx={sx}
			fullWidth
		>
			<DialogTitle>{header}</DialogTitle>
			<DialogContent>
				<Stack pt={1}>{content}</Stack>
			</DialogContent>
			{actions && <DialogActions sx={{ px: 3, pb: 2 }}>{actions}</DialogActions>}
		</Dialog>
	);
}

export default DialogSkeleton;
