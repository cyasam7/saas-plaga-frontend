import { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface IFormSectionProps {
	/** Domain icon shown in the tinted leading tile. */
	icon: ReactNode;
	title: string;
	description?: string;
	children: ReactNode;
}

/**
 * Grouped section used across the order form: a branded teal icon tile plus a
 * title/description header over an outlined card. Keeps every section on the same
 * visual rhythm.
 */
function FormSection(props: IFormSectionProps) {
	const { icon, title, description, children } = props;

	return (
		<Paper
			variant="outlined"
			sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2 }}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
				<Box
					aria-hidden
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexShrink: 0,
						width: 36,
						height: 36,
						borderRadius: 1.5,
						color: 'primary.main',
						bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08)
					}}
				>
					{icon}
				</Box>
				<Box>
					<Typography
						variant="subtitle2"
						sx={{ fontWeight: 700, lineHeight: 1.25 }}
					>
						{title}
					</Typography>
					{description ? (
						<Typography
							variant="caption"
							color="text.secondary"
						>
							{description}
						</Typography>
					) : null}
				</Box>
			</Box>
			{children}
		</Paper>
	);
}

export default FormSection;
