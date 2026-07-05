import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Box, Button, Card, Stack, TextField, Typography, Skeleton } from '@mui/material';
import { Palette, Upload } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { AppConfigService } from 'src/app/shared/services/AppConfig';
import { useSelector } from 'react-redux';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useForm } from 'react-hook-form';
import { IFormSaveAccount } from 'src/app/shared/entities/AppConfig';
import { ChangeEvent, useEffect, useMemo } from 'react';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FIELD_REQUIRED } from 'src/app/shared-constants/yupMessages';

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

const accountSchema = yup.object().shape({
	name: yup.string().required(FIELD_REQUIRED),
	address: yup.string().required(FIELD_REQUIRED),
	logo: yup.mixed().nullable(),
	primaryColor: yup.string().required(FIELD_REQUIRED),
	secondaryColor: yup.string().required(FIELD_REQUIRED),
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

function ConfigurationReports() {
	const user = useSelector(selectUser);
	const tenantId = user.data.tenant;

	const { data, isLoading } = useQuery({
		queryFn: () => AppConfigService.get({ tenantId }),
		queryKey: ['AccountUser', tenantId]
	});

	const formHandler = useForm<IFormSaveAccount>({
		defaultValues: defaultValuesAccountUser,
		resolver: yupResolver(accountSchema)
	});

	const { logo } = formHandler.watch();

	const imagePreview = useMemo(() => {
		if (!logo) {
			return undefined;
		}
		return URL.createObjectURL(logo);
	}, [logo]);

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

		if (files.length > 0) {
			const [file] = files;

			formHandler.setValue('logo', file);
		}
	}

	function handleColorChange(e: ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		formHandler.setValue(name as 'primaryColor' | 'secondaryColor', value);
	}

	async function handleSubmit(formValue: IFormSaveAccount): Promise<void> {
		await AppConfigService.save(formValue);
		displayToast({
			anchorOrigin: { horizontal: 'right', vertical: 'top' },
			autoHideDuration: 1500,
			message: 'Se ha guardado correctamente',
			variant: 'success'
		});
	}

	return (
		<Root
			header={
				<div className="p-24">
					<Typography variant="h6">Configuración de reportes.</Typography>
				</div>
			}
			content={
				<div className="p-24 w-full">
					<Card>
						<Stack
							spacing={4}
							p={3}
						>
							<Box>
								<Typography
									variant="h6"
									display="flex"
									alignItems="center"
									gutterBottom
								>
									Logo de la compañía
								</Typography>
								<Box
									display="flex"
									gap={3}
								>
									{isLoading ? (
										<Skeleton
											variant="rectangular"
											width={128}
											height={128}
											sx={{ borderRadius: 1 }}
										/>
									) : (
										<Box
											component="img"
											src={imagePreview ?? data?.logo}
											alt="Company logo"
											sx={{
												width: 128,
												height: 128,
												objectFit: 'cover',
												borderRadius: 1
											}}
										/>
									)}
									<Box>
										<label htmlFor="logo-upload">
											<input
												type="file"
												id="logo-upload"
												hidden
												accept="image/*"
												onChange={handleChangeImage}
												disabled={isLoading}
											/>
											<Button
												variant="outlined"
												component="span"
												disabled={formHandler.formState.isSubmitting || isLoading}
												startIcon={<Upload />}
											>
												Subir nuevo logo
											</Button>
										</label>
										<Typography
											variant="caption"
											display="block"
											mt={1}
										>
											Tamaño recomendado: 300x300px. Tamaño máximo de archivo: 2MB.
										</Typography>
									</Box>
								</Box>
							</Box>

							<Box>
								<Typography
									variant="h6"
									display="flex"
									alignItems="center"
									gutterBottom
								>
									Detalles de la compañía
								</Typography>
								<Stack spacing={2}>
									{isLoading ? (
										<>
											<Skeleton height={56} />
											<Skeleton height={56} />
											<Skeleton height={56} />
										</>
									) : (
										<>
											<TextFieldForm
												disabled={formHandler.formState.isSubmitting}
												control={formHandler.control}
												label="Company Name"
												name="name"
												fullWidth
											/>
											<TextFieldForm
												disabled={formHandler.formState.isSubmitting}
												control={formHandler.control}
												label="Address"
												name="address"
												fullWidth
											/>
											<TextFieldForm
												disabled={formHandler.formState.isSubmitting}
												control={formHandler.control}
												label="Licencia Sanitaria"
												name="licenseSanitary"
												fullWidth
											/>
										</>
									)}
								</Stack>
							</Box>

							<Box>
								<Typography
									variant="h6"
									display="flex"
									alignItems="center"
									gutterBottom
								>
									<Palette sx={{ mr: 1 }} />
									Colores de la empresa
								</Typography>
								<Stack
									direction="row"
									spacing={2}
								>
									{isLoading ? (
										<>
											<Box flex={1}>
												<Typography
													variant="subtitle2"
													gutterBottom
												>
													Color primario
												</Typography>
												<Stack
													direction="row"
													spacing={1}
												>
													<Skeleton
														variant="rectangular"
														width={40}
														height={40}
													/>
													<Skeleton
														height={40}
														width="100%"
													/>
												</Stack>
											</Box>
											<Box flex={1}>
												<Typography
													variant="subtitle2"
													gutterBottom
												>
													Color secundario
												</Typography>
												<Stack
													direction="row"
													spacing={1}
												>
													<Skeleton
														variant="rectangular"
														width={40}
														height={40}
													/>
													<Skeleton
														height={40}
														width="100%"
													/>
												</Stack>
											</Box>
										</>
									) : (
										<>
											<Box flex={1}>
												<Typography
													variant="subtitle2"
													gutterBottom
												>
													Color primario
												</Typography>
												<Stack
													direction="row"
													spacing={1}
												>
													<input
														type="color"
														id="primary-color"
														{...formHandler.register('primaryColor')}
														style={{ width: 40, height: 40, padding: 0, border: 'none' }}
														onChange={handleColorChange}
													/>
													<TextField
														{...formHandler.register('primaryColor')}
														fullWidth
														size="small"
														onChange={handleColorChange}
													/>
												</Stack>
											</Box>
											<Box flex={1}>
												<Typography
													variant="subtitle2"
													gutterBottom
												>
													Color secundario
												</Typography>
												<Stack
													direction="row"
													spacing={1}
												>
													<input
														type="color"
														id="secondary-color"
														{...formHandler.register('secondaryColor')}
														style={{ width: 40, height: 40, padding: 0, border: 'none' }}
														onChange={handleColorChange}
													/>
													<TextField
														{...formHandler.register('secondaryColor')}
														fullWidth
														size="small"
														onChange={handleColorChange}
													/>
												</Stack>
											</Box>
										</>
									)}
								</Stack>
							</Box>
							<Box justifyContent="flex-end">
								<Button
									variant="contained"
									color="primary"
									disabled={
										formHandler.formState.isSubmitting ||
										isLoading ||
										!formHandler.formState.isValid
									}
									onClick={formHandler.handleSubmit(handleSubmit)}
								>
									Guardar
								</Button>
							</Box>
						</Stack>
					</Card>
				</div>
			}
		/>
	);
}

export default ConfigurationReports;
