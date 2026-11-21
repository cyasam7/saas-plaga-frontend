import { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface EmptyStateProps {
	icon: SvgIconComponent;
	title: string;
	description: string;
	/** Optional call to action, e.g. "Nuevo cliente" when the list has never had items. */
	action?: ReactNode;
}

/** Empty list message. Works inline or as a DataGrid `noRowsOverlay`. */
function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
	return (
		<Stack
			alignItems="center"
			justifyContent="center"
			spacing={1}
			sx={{ py: 8, px: 2, height: '100%', textAlign: 'center' }}
		>
			<Icon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
			<Typography
				variant="subtitle1"
				color="text.secondary"
			>
				{title}
			</Typography>
			<Typography
				variant="body2"
				color="text.disabled"
			>
				{description}
			</Typography>
			{action && <Stack sx={{ pt: 2 }}>{action}</Stack>}
		</Stack>
	);
}

export default EmptyState;
