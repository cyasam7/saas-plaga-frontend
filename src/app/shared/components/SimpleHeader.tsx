import { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface SimpleHeaderProps {
	title: string;
	subtitle?: ReactNode;
	/** Main page action (e.g. "Nueva orden"), aligned to the right of the title. */
	actions?: ReactNode;
	/** Extra content below the title row, e.g. the day tabs in Orders. */
	children?: ReactNode;
}

/** Header for every page in `main/`: bold title, secondary subtitle and the page action. */
function SimpleHeader({ title, subtitle, actions, children }: SimpleHeaderProps) {
	return (
		<Stack
			spacing={2.5}
			sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 }, pb: children ? 1 : 2 }}
		>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="flex-end"
				spacing={2}
			>
				<Box sx={{ minWidth: 0 }}>
					<Typography
						variant="h4"
						component="h1"
						fontWeight={700}
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
				{actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
			</Stack>
			{children}
		</Stack>
	);
}

export default SimpleHeader;
