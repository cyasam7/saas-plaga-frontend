import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { IHeaderDialogProps } from './IHeaderDialogProps';

function HeaderDialog(props: IHeaderDialogProps) {
	const {
		onClickPrimaryButton,
		onClickSecondaryButton,
		title,
		textPrimaryButton = 'Guardar',
		textSecondaryButton = 'Cancelar',
		justifyContent
	} = props;

	return (
		<Stack
			direction="row"
			justifyContent={title ? 'space-between' : justifyContent}
			alignItems="center"
		>
			{title && <Typography variant="h6">{title}</Typography>}
			<Stack
				direction="row"
				spacing={1}
			>
				<Button
					color="primary"
					variant="outlined"
					onClick={onClickSecondaryButton}
				>
					{textSecondaryButton}
				</Button>
				<Button
					color="primary"
					variant="contained"
					onClick={onClickPrimaryButton}
				>
					{textPrimaryButton}
				</Button>
			</Stack>
		</Stack>
	);
}

export default HeaderDialog;
