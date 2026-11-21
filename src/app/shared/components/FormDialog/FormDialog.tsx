import { FormEvent, ReactNode } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Close } from '@mui/icons-material';

interface FormDialogProps {
	open: boolean;
	title: string;
	/** One line saying what the form is for. */
	subtitle?: string;
	/** Cancel, the close button and Esc call it (not a backdrop click, so a stray click can't lose what was typed); ignored while `isSubmitting`. */
	onClose: () => void;
	/** Submit button and Enter key. Pass `formHandler.handleSubmit(handleSave)`. */
	onSubmit: () => void;
	/** Says what the click does: "Crear usuario", "Guardar cambios"… */
	submitLabel: string;
	isSubmitting?: boolean;
	isSubmitDisabled?: boolean;
	/** Extra action on the left of the footer (e.g. "Limpiar"). */
	secondaryAction?: ReactNode;
	maxWidth?: 'xs' | 'sm' | 'md';
	/** Runs once the open animation ends — for content that must measure itself (signature pad). */
	onEntered?: () => void;
	children: ReactNode;
}

/**
 * Standard dialog for every create/edit form: bold title + subtitle + close button, divided content,
 * and a footer with Cancelar + the submit button. The paper is a <form>, so Enter submits.
 */
function FormDialog({
	open,
	title,
	subtitle,
	onClose,
	onSubmit,
	submitLabel,
	isSubmitting = false,
	isSubmitDisabled = false,
	secondaryAction,
	maxWidth = 'sm',
	onEntered,
	children
}: FormDialogProps) {
	function handleClose() {
		if (isSubmitting) return;
		onClose();
	}

	function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		// React bubbles events through portals: a FormDialog opened inside another one must not submit its parent.
		event.stopPropagation();
		if (isSubmitting || isSubmitDisabled) return;
		onSubmit();
	}

	return (
		<Dialog
			open={open}
			onClose={(_event, reason) => {
				if (reason !== 'backdropClick') handleClose();
			}}
			maxWidth={maxWidth}
			fullWidth
			scroll="paper"
			TransitionProps={{ onEntered }}
			PaperProps={{
				component: 'form',
				noValidate: true,
				onSubmit: handleFormSubmit,
				sx: { borderRadius: 3 }
			}}
		>
			<DialogTitle sx={{ pb: 1.5 }}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					spacing={2}
				>
					<Box sx={{ minWidth: 0 }}>
						<Typography
							variant="h6"
							component="span"
							sx={{ display: 'block', fontWeight: 700, lineHeight: 1.3 }}
						>
							{title}
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
					<IconButton
						aria-label="Cerrar"
						onClick={handleClose}
						disabled={isSubmitting}
						sx={{ mt: -0.5, mr: -0.5 }}
					>
						<Close />
					</IconButton>
				</Stack>
			</DialogTitle>
			<DialogContent dividers>{children}</DialogContent>
			<DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
				{secondaryAction && <Box sx={{ mr: 'auto' }}>{secondaryAction}</Box>}
				<Button
					variant="outlined"
					color="primary"
					onClick={handleClose}
					disabled={isSubmitting}
				>
					Cancelar
				</Button>
				<LoadingButton
					type="submit"
					variant="contained"
					color="primary"
					loading={isSubmitting}
					disabled={isSubmitDisabled}
				>
					{submitLabel}
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}

export default FormDialog;
