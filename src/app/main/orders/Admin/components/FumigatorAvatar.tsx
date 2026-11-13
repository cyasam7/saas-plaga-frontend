import { Box, Typography } from '@mui/material';

interface FumigatorAvatarProps {
	/** Sin nombre = orden sin asignar. */
	fumigatorName?: string;
	size: number;
}

function FumigatorAvatar({ fumigatorName, size }: FumigatorAvatarProps) {
	if (!fumigatorName) {
		return <Typography sx={{ font: 'var(--text-body-sm)', color: 'var(--fg-3)' }}>Sin asignar</Typography>;
	}

	const initials = fumigatorName
		.split(' ')
		.map((word) => word[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
			<Box
				aria-hidden
				sx={{
					width: size,
					height: size,
					flexShrink: 0,
					borderRadius: '50%',
					bgcolor: 'var(--green-100)',
					color: 'var(--green-800)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					font: `600 ${Math.round(size * 0.4)}px var(--font-sans)`
				}}
			>
				{initials}
			</Box>
			<Typography
				noWrap
				sx={{ font: 'var(--text-body-sm)', color: 'var(--fg-1)' }}
			>
				{fumigatorName}
			</Typography>
		</Box>
	);
}

export default FumigatorAvatar;
