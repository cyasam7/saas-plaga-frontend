import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Box, Button, Card, Chip, Divider, Stack, Typography } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useConfigurationReports } from './useConfigurationReports';
import LogoSection from './components/LogoSection/LogoSection';
import CompanySection from './components/CompanySection/CompanySection';
import ColorsSection from './components/ColorsSection/ColorsSection';
import ReportPreviewDialog from './components/ReportPreviewDialog/ReportPreviewDialog';

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

function ConfigurationReports() {
	const {
		formHandler,
		isLoading,
		isSubmitting,
		isDirty,
		isValid,
		logoError,
		logoUrl,
		reportType,
		previewOpen,
		setPreviewOpen,
		handleChangeImage,
		handleChangeReportType,
		onSubmit,
		previewValues
	} = useConfigurationReports();

	return (
		<Root
			scroll="content"
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
				</Stack>
			}
			content={
				<Stack
					alignItems="center"
					className="p-24 w-full"
				>
					<Card sx={{ width: '100%', maxWidth: 720 }}>
						<Stack
							spacing={3}
							p={3}
							divider={<Divider flexItem />}
						>
							<LogoSection
								logoUrl={logoUrl}
								logoError={logoError}
								isLoading={isLoading}
								isSubmitting={isSubmitting}
								onChangeImage={handleChangeImage}
							/>

							<CompanySection
								control={formHandler.control}
								isLoading={isLoading}
								isSubmitting={isSubmitting}
							/>

							<ColorsSection
								control={formHandler.control}
								isLoading={isLoading}
								isSubmitting={isSubmitting}
							/>

							<Stack
								direction="row"
								justifyContent="flex-end"
								alignItems="center"
								spacing={1}
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
									variant="outlined"
									color="primary"
									startIcon={<Visibility />}
									disabled={isLoading}
									onClick={() => setPreviewOpen(true)}
								>
									Vista previa
								</Button>
								<Button
									variant="contained"
									color="primary"
									disabled={isSubmitting || isLoading || !isValid || !isDirty}
									onClick={onSubmit}
								>
									Guardar
								</Button>
							</Stack>
						</Stack>
					</Card>

					<ReportPreviewDialog
						open={previewOpen}
						onClose={() => setPreviewOpen(false)}
						reportType={reportType}
						onChangeReportType={handleChangeReportType}
						previewValues={previewValues}
					/>
				</Stack>
			}
		/>
	);
}

export default ConfigurationReports;
