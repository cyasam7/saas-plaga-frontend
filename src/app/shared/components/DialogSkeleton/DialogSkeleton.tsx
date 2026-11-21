import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { IDialogSkeletonProps } from './IDialogSkeletonProps';

/** Same dialog frame as "Nueva orden": bold title + subtitle + close button, divided content, actions footer. */
function DialogSkeleton(props: IDialogSkeletonProps) {
	const { content, header, subtitle, actions, onClose, open, maxWidth, sx } = props;
	const isTextHeader = typeof header === 'string';

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth={maxWidth}
			sx={sx}
			fullWidth
			PaperProps={{ sx: { borderRadius: 3 } }}
		>
			<DialogTitle sx={{ pb: 1.5 }}>
				{isTextHeader ? (
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
								{header}
							</Typography>
							{subtitle && (
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{subtitle}
								</Typography>
							)}
						</Box>
						{onClose && (
							<IconButton
								aria-label="Cerrar"
								onClick={onClose}
								sx={{ mt: -0.5, mr: -0.5 }}
							>
								<Close />
							</IconButton>
						)}
					</Stack>
				) : (
					header
				)}
			</DialogTitle>
			<DialogContent dividers>{content}</DialogContent>
			{actions && <DialogActions sx={{ px: 3, py: 2 }}>{actions}</DialogActions>}
		</Dialog>
	);
}

export default DialogSkeleton;
