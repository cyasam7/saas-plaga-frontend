import { Box, Button, FormHelperText, Skeleton, Stack, Typography } from '@mui/material';
import { Upload, Image as ImageIcon } from '@mui/icons-material';
import { ChangeEvent } from 'react';
import Section from '../Section/Section';
import { ACCEPTED_LOGO_TYPES } from '../../config';

interface LogoSectionProps {
	logoUrl?: string;
	logoError: string | null;
	isLoading: boolean;
	isSubmitting: boolean;
	onChangeImage: (e: ChangeEvent<HTMLInputElement>) => void;
}

function LogoSection({ logoUrl, logoError, isLoading, isSubmitting, onChangeImage }: LogoSectionProps) {
	return (
		<Section
			title="Logo"
			icon={<ImageIcon fontSize="small" />}
		>
			<Stack
				direction="row"
				spacing={3}
				alignItems="center"
			>
				{isLoading ? (
					<Skeleton
						variant="rectangular"
						width={112}
						height={112}
						sx={{ borderRadius: 1, flexShrink: 0 }}
					/>
				) : (
					<Box
						sx={{
							width: 112,
							height: 112,
							flexShrink: 0,
							border: 1,
							borderColor: 'divider',
							borderRadius: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden',
							backgroundColor: 'background.default'
						}}
					>
						{logoUrl ? (
							<Box
								component="img"
								src={logoUrl}
								alt="Logo de la compañía"
								sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
							/>
						) : (
							<Typography
								variant="caption"
								color="text.disabled"
							>
								Sin logo
							</Typography>
						)}
					</Box>
				)}
				<Box>
					<label htmlFor="logo-upload">
						<input
							type="file"
							id="logo-upload"
							hidden
							accept={ACCEPTED_LOGO_TYPES.join(',')}
							onChange={onChangeImage}
							disabled={isLoading}
						/>
						<Button
							variant="outlined"
							component="span"
							disabled={isSubmitting || isLoading}
							startIcon={<Upload />}
						>
							Subir nuevo logo
						</Button>
					</label>
					<Typography
						variant="caption"
						color="text.secondary"
						display="block"
						mt={1}
					>
						PNG, JPG, WEBP o SVG. Recomendado 300x300px, máximo 2MB.
					</Typography>
					{logoError && <FormHelperText error>{logoError}</FormHelperText>}
				</Box>
			</Stack>
		</Section>
	);
}

export default LogoSection;
