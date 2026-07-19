import { Skeleton, Stack } from '@mui/material';
import { Business } from '@mui/icons-material';
import { Control } from 'react-hook-form';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';
import { IFormSaveAccount } from 'src/app/shared/entities/AppConfig';
import Section from '../Section/Section';

interface CompanySectionProps {
	control: Control<IFormSaveAccount>;
	isLoading: boolean;
	isSubmitting: boolean;
}

function CompanySection({ control, isLoading, isSubmitting }: CompanySectionProps) {
	return (
		<Section
			title="Compañía"
			icon={<Business fontSize="small" />}
		>
			<Stack spacing={2}>
				{isLoading ? (
					<>
						<Skeleton height={56} />
						<Skeleton height={56} />
					</>
				) : (
					<>
						<Stack
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
						>
							<TextFieldForm
								disabled={isSubmitting}
								control={control}
								label="Nombre de la compañía"
								name="name"
								fullWidth
							/>
							<TextFieldForm
								disabled={isSubmitting}
								control={control}
								label="Licencia Sanitaria"
								name="licenseSanitary"
								fullWidth
							/>
						</Stack>
						<TextFieldForm
							disabled={isSubmitting}
							control={control}
							label="Dirección"
							name="address"
							fullWidth
						/>
					</>
				)}
			</Stack>
		</Section>
	);
}

export default CompanySection;
