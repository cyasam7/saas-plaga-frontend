import PageLayout from 'app/core/page/PageLayout';
import { Grid, Card, CardContent, Typography } from '@mui/material';
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
				<div className="p-16 sm:p-24 w-full">
					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Card>
								<CardContent>
									<Typography variant="h6">Inspección</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</div>
			}
		/>
	);
}

export default Inspection;
