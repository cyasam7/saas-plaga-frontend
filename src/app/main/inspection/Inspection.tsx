import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import FusePageSimpleHeader from '@fuse/core/FusePageSimple/FusePageSimpleHeader';
import SimpleHeader from 'app/shared-components/SimpleHeader';

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

function Inspection() {


	return (
		<Root
			header={
				<FusePageSimpleHeader
					header={
						<SimpleHeader
							title="Inspección"
							subtitle="Gestiona las inspecciones"
						/>
					}
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
