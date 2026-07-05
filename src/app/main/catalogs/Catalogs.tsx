import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';

import TabPanel from './components/TabPanel';
import ApplicationTypes from './components/application-types/ApplicationTypes';
import { Container, Stack } from '@mui/material';
import ServiceTypes from './components/service-types/ServiceTypes';
import Products from './components/products/Products';
import PestTypes from './components/pest-types/PestTypes';
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


export default function CatalogsV2() {
	const [tabValue, setTabValue] = React.useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<Root
			header={
				<FusePageSimpleHeader
					header={
						<SimpleHeader
							title="Catálogos"
							subtitle="Gestiona los catálogos del sistema: tipos de servicio, tipos de aplicación, productos y plagas"
						/>
					}
				/>
			}
			content={
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Paper elevation={1} sx={{ borderRadius: 2, height: 'calc(100vh - 240px) !important' }}>
						<Box pt={2}>
							<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
								<Tabs value={tabValue} onChange={handleTabChange} aria-label="catálogos tabs">
									<Tab label="Tipos de Servicio" />
									<Tab label="Tipos de Aplicación" />
									<Tab label="Productos y Dosis" />
									<Tab label="Tipos de Plagas" />
								</Tabs>
							</Box>
							<Box>
								<TabPanel value={tabValue} index={0}>
									<ServiceTypes />
								</TabPanel>
								<TabPanel value={tabValue} index={1}>
									<ApplicationTypes />
								</TabPanel>
								<TabPanel value={tabValue} index={2}>
									<Products />
								</TabPanel>
								<TabPanel value={tabValue} index={3}>
									<PestTypes />
								</TabPanel>
							</Box>
						</Box>
					</Paper>
				</Container>
			}
		/>
	);
}
