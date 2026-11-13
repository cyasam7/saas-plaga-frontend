import { Box, Typography, Button } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { INamedCatalogLabels } from './types';

type NamedCatalogEmptyProps = {
	labels: INamedCatalogLabels;
	Icon: SvgIconComponent;
	onAddNew: () => void;
};

export function NamedCatalogEmpty({ labels, Icon, onAddNew }: NamedCatalogEmptyProps) {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				py: 8,
				px: 2,
				textAlign: 'center'
			}}
		>
			<Icon
				sx={{
					fontSize: 64,
					color: 'text.secondary',
					mb: 2
				}}
			/>
			<Typography
				variant="h6"
				color="text.secondary"
				sx={{ mb: 1 }}
			>
				No hay {labels.plural}
			</Typography>
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ mb: 3, maxWidth: 400 }}
			>
				{labels.emptyDescription}
			</Typography>
			<Button
				variant="contained"
				color="primary"
				startIcon={<AddIcon />}
				onClick={onAddNew}
				sx={{
					borderRadius: 2,
					textTransform: 'none',
					px: 3,
					py: 1,
					boxShadow: 2,
					'&:hover': {
						boxShadow: 4,
						transform: 'translateY(-1px)'
					},
					transition: 'all 0.2s ease-in-out'
				}}
			>
				Crear primer {labels.singular}
			</Button>
		</Box>
	);
}
