import { Grid, Stack, TextField } from '@mui/material';
import DialogSkeleton from 'app/shared-components/DialogSkeleton/DialogSkeleton';
import HeaderDialog from 'app/shared-components/DialogSkeleton/HeaderDialog/HeaderDialog';

function DialogReport() {
	return (
		<DialogSkeleton
			open={false}
			maxWidth="xl"
			header={
				<HeaderDialog
					title="Generación de reporte"
					onClickPrimaryButton={() => {}}
					onClickSecondaryButton={() => {}}
				/>
			}
			content={
				<Stack sx={{ height: '80vh' }}>
					<Grid
						container
						height="100%"
					>
						<Grid
							item
							xs={9}
							height="100%"
						>
							{/* <PDFViewer style={{ width: '100%', height: '100%' }}>
								<ServiceOrder />
							</PDFViewer> */}
						</Grid>
						<Grid
							item
							xs={3}
						>
							<Stack
								sx={{ width: '100%' }}
								spacing={2}
								paddingInline={2}
							>
								<TextField
									label="Nombre de la empresa"
									variant="outlined"
								/>
							</Stack>
						</Grid>
					</Grid>
				</Stack>
			}
		/>
	);
}

export default DialogReport;
