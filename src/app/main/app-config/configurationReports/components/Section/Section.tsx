import { Box, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface SectionProps {
	title: string;
	icon: ReactNode;
	children: ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
	return (
		<Box>
			<Stack
				direction="row"
				spacing={1}
				alignItems="center"
				mb={2}
			>
				<Box
					sx={{ color: 'text.secondary', display: 'flex' }}
					aria-hidden
				>
					{icon}
				</Box>
				<Typography
					variant="subtitle1"
					fontWeight={600}
				>
					{title}
				</Typography>
			</Stack>
			{children}
		</Box>
	);
}

export default Section;
