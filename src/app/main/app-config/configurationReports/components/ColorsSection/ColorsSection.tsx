import { Skeleton, Stack } from '@mui/material';
import { Palette } from '@mui/icons-material';
import { Control } from 'react-hook-form';
import { IFormSaveAccount } from 'src/app/shared/entities/AppConfig';
import Section from '../Section/Section';
import ColorField from '../ColorField/ColorField';

interface ColorsSectionProps {
	control: Control<IFormSaveAccount>;
	isLoading: boolean;
	isSubmitting: boolean;
}

function ColorsSection({ control, isLoading, isSubmitting }: ColorsSectionProps) {
	return (
		<Section
			title="Colores"
			icon={<Palette fontSize="small" />}
		>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={2}
			>
				{isLoading ? (
					<>
						<Skeleton
							height={64}
							width="100%"
						/>
						<Skeleton
							height={64}
							width="100%"
						/>
					</>
				) : (
					<>
						<ColorField
							control={control}
							name="primaryColor"
							label="Color primario"
							disabled={isSubmitting}
						/>
						<ColorField
							control={control}
							name="secondaryColor"
							label="Color secundario"
							disabled={isSubmitting}
						/>
					</>
				)}
			</Stack>
		</Section>
	);
}

export default ColorsSection;
