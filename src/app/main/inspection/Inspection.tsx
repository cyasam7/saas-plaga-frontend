import PageLayout from 'app/core/page/PageLayout';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import SimpleHeader from 'app/shared/components/SimpleHeader';

function Inspection() {


	return (
		<PageLayout
			header={
				<SimpleHeader
					title="Inspección"
					subtitle="Gestiona las inspecciones"
				/>
			}
			content={
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Card>
								<CardContent>
									<Typography variant="h6">Inspección</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Container>
			}
		/>
	);
}

export default Inspection;
