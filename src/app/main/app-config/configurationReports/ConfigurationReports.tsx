import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import {
	Box,
	Button,
	Card,
	Chip,
	Divider,
	FormHelperText,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
	Skeleton
} from '@mui/material';
import { Palette, Upload, Business, Image as ImageIcon } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { AppConfigService } from 'src/app/shared/services/AppConfig';
import { useSelector } from 'react-redux';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useForm } from 'react-hook-form';
import { IFormSaveAccount } from 'src/app/shared/entities/AppConfig';
import { ChangeEvent, MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FIELD_REQUIRED } from 'src/app/shared-constants/yupMessages';
import CertificatePreview from './components/CertificatePreview/CertificatePreview';
import ServiceOrderPreview from './components/ServiceOrderPreview/ServiceOrderPreview';
import ColorField from './components/ColorField/ColorField';
import { REPORT_TYPE_OPTIONS, ReportType } from './entities/ReportPreview';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

const INVALID_COLOR = 'Usa un color en formato #RRGGBB';

/** El backend todavía no valida el archivo: esto es sólo feedback, no una garantía. */
const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const ACCEPTED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

const accountSchema = yup.object().shape({
	name: yup.string().required(FIELD_REQUIRED),
	address: yup.string().required(FIELD_REQUIRED),
	logo: yup.mixed().nullable(),
	primaryColor: yup.string().required(FIELD_REQUIRED).matches(/^#[0-9a-fA-F]{6}$/, INVALID_COLOR),
	secondaryColor: yup.string().required(FIELD_REQUIRED).matches(/^#[0-9a-fA-F]{6}$/, INVALID_COLOR),
	licenseSanitary: yup.string().required(FIELD_REQUIRED)
});

const defaultValuesAccountUser = {
	address: '',
	logo: '',
	name: '',
	primaryColor: '#000000',
	secondaryColor: '#000000',
	licenseSanitary: ''
};

function validateLogo(file: File): string | null {
	if (!ACCEPTED_LOGO_TYPES.includes(file.type)) {
		return 'Formato no válido. Usa PNG, JPG, WEBP o SVG.';
	}

	if (file.size > MAX_LOGO_BYTES) {
		return 'La imagen supera el tamaño máximo de 2MB.';
	}

	return null;
}

const PREVIEW_BY_REPORT_TYPE = {
	certificate: CertificatePreview,
	serviceOrder: ServiceOrderPreview
};

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
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

function ConfigurationReports() {
	const user = useSelector(selectUser);
	const tenantId = user.data.tenant;
	const [logoError, setLogoError] = useState<string | null>(null);
	const [reportType, setReportType] = useState<ReportType>('certificate');

	const { data, isLoading } = useQuery({
		queryFn: () => AppConfigService.get({ tenantId }),
		queryKey: ['AccountUser', tenantId]
	});

	const formHandler = useForm<IFormSaveAccount>({
		defaultValues: defaultValuesAccountUser,
		resolver: yupResolver(accountSchema),
		mode: 'onChange'
	});

	const { logo, name, address, licenseSanitary, primaryColor, secondaryColor } = formHandler.watch();

	const imagePreview = useMemo(() => {
		if (!logo) {
			return undefined;
		}

		return URL.createObjectURL(logo);
	}, [logo]);

	useEffect(() => {
		if (!imagePreview) {
			return undefined;
		}

		return () => URL.revokeObjectURL(imagePreview);
	}, [imagePreview]);

	useEffect(() => {
		if (data) {
			formHandler.reset({
				address: data.address,
				name: data.name,
				primaryColor: data.primaryColor || '#000000',
				secondaryColor: data.secondaryColor || '#000000',
				licenseSanitary: data.licenseSanitary || ''
			});
		}

		return () => {
			formHandler.reset(defaultValuesAccountUser);
		};
	}, [JSON.stringify(data)]);

	function handleChangeImage(e: ChangeEvent<HTMLInputElement>): void {
		const { files } = e.target;

		if (files.length === 0) {
			return;
		}

		const [file] = files;
		const error = validateLogo(file);

		setLogoError(error);

		if (!error) {
			formHandler.setValue('logo', file, { shouldDirty: true });
		}

		/* Sin esto, volver a elegir el mismo archivo tras un error no dispara change. */
		e.target.value = '';
	}

	async function handleSubmit(formValue: IFormSaveAccount): Promise<void> {
		await AppConfigService.save(formValue);
		formHandler.reset(formValue);
		displayToast({
			anchorOrigin: { horizontal: 'right', vertical: 'top' },
			autoHideDuration: 1500,
			message: 'Se ha guardado correctamente',
			variant: 'success'
		});
	}

	function handleChangeReportType(_e: MouseEvent<HTMLElement>, value: ReportType | null): void {
		/* value es null cuando se pulsa el botón ya activo: mantenemos siempre uno seleccionado. */
		if (value) {
			setReportType(value);
		}
	}

	const { isSubmitting, isDirty, isValid } = formHandler.formState;
	const logoUrl = imagePreview ?? data?.logo;
	const PreviewComponent = PREVIEW_BY_REPORT_TYPE[reportType];

	return (
		<Root
			scroll='content'
			header={
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					spacing={2}
					className="p-24"
				>
					<Box>
						<Typography variant="h6">Configuración de reportes</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							Personaliza cómo se ve tu marca en los certificados y órdenes de servicio.
						</Typography>
					</Box>
					<Stack
						direction="row"
						spacing={2}
						alignItems="center"
					>
						{isDirty && (
							<Chip
								size="small"
								label="Cambios sin guardar"
								color="warning"
								variant="outlined"
							/>
						)}
						<Button
							variant="contained"
							color="primary"
							disabled={isSubmitting || isLoading || !isValid || !isDirty}
							onClick={formHandler.handleSubmit(handleSubmit)}
						>
							Guardar
						</Button>
					</Stack>
				</Stack>
			}
			content={
				<Stack
					direction={{ xs: 'column', lg: 'row' }}
					spacing={3}
					alignItems="flex-start"
					className="p-24 w-full"
				>
					<Card sx={{ flex: 1, width: '100%', maxWidth: { lg: 640 } }}>
						<Stack
							spacing={3}
							p={3}
							divider={<Divider flexItem />}
						>
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
												onChange={handleChangeImage}
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
													control={formHandler.control}
													label="Nombre de la compañía"
													name="name"
													fullWidth
												/>
												<TextFieldForm
													disabled={isSubmitting}
													control={formHandler.control}
													label="Licencia Sanitaria"
													name="licenseSanitary"
													fullWidth
												/>
											</Stack>
											<TextFieldForm
												disabled={isSubmitting}
												control={formHandler.control}
												label="Dirección"
												name="address"
												fullWidth
											/>
										</>
									)}
								</Stack>
							</Section>

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
												control={formHandler.control}
												name="primaryColor"
												label="Color primario"
												disabled={isSubmitting}
											/>
											<ColorField
												control={formHandler.control}
												name="secondaryColor"
												label="Color secundario"
												disabled={isSubmitting}
											/>
										</>
									)}
								</Stack>
							</Section>
						</Stack>
					</Card>

					<Box sx={{ flex: 1, width: '100%', position: { lg: 'sticky' }, top: { lg: 24 } }}>
						<Stack
							direction={{ xs: 'column', sm: 'row' }}
							spacing={1.5}
							justifyContent="space-between"
							alignItems={{ xs: 'flex-start', sm: 'center' }}
							mb={1.5}
						>
							<Stack
								direction="row"
								spacing={1}
								alignItems="center"
							>
								<Typography
									variant="subtitle1"
									fontWeight={600}
								>
									Vista previa
								</Typography>
								<Chip
									size="small"
									label="Datos de ejemplo"
									variant="outlined"
								/>
							</Stack>
							<ToggleButtonGroup
								exclusive
								size="small"
								value={reportType}
								aria-label="Tipo de reporte"
								onChange={handleChangeReportType}
							>
								{REPORT_TYPE_OPTIONS.map((option) => (
									<ToggleButton
										key={option.value}
										value={option.value}
									>
										{option.label}
									</ToggleButton>
								))}
							</ToggleButtonGroup>
						</Stack>
						{isLoading ? (
							<Skeleton
								variant="rectangular"
								sx={{ width: '100%', aspectRatio: '794 / 1123', borderRadius: 1 }}
							/>
						) : (
							<PreviewComponent
								name={name}
								address={address}
								licenseSanitary={licenseSanitary}
								primaryColor={primaryColor}
								secondaryColor={secondaryColor}
								logoUrl={logoUrl}
							/>
						)}
					</Box>
				</Stack>
			}
		/>
	);
}

export default ConfigurationReports;
