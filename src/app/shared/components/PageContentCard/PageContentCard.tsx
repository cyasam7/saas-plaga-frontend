import { ReactNode } from 'react';
import { Box, Paper } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface PageContentCardProps {
	/** Filter bar, separated from the list by a divider. */
	filters?: ReactNode;
	/** Summary below the list (e.g. "Mostrando 20 de 80 órdenes"), separated by a divider. */
	footer?: ReactNode;
	children: ReactNode;
	sx?: SxProps<Theme>;
}

/** Bordered card that holds a page's main content: optional filter bar on top, the list/grid/tabs, and an optional footer. Same frame on every page in `main/`. */
function PageContentCard({ filters, footer, children, sx = [] }: PageContentCardProps) {
	return (
		<Paper
			elevation={0}
			sx={[
				{
					display: 'flex',
					flexDirection: 'column',
					p: { xs: 2, sm: 3 },
					borderRadius: 2,
					border: 1,
					borderColor: 'divider'
				},
				...(Array.isArray(sx) ? sx : [sx])
			]}
		>
			{filters && <Box sx={{ pb: 2, mb: 1, borderBottom: 1, borderColor: 'divider' }}>{filters}</Box>}
			{children}
			{footer && <Box sx={{ pt: 1.5, mt: 1, borderTop: 1, borderColor: 'divider' }}>{footer}</Box>}
		</Paper>
	);
}

export default PageContentCard;
