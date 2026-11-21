import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PageContentCard from 'app/shared/components/PageContentCard/PageContentCard';
import PageLayout from 'app/core/page/PageLayout';

import TabPanel from './components/TabPanel';
import ApplicationTypes from './components/ApplicationTypes';
import ServiceTypes from './components/ServiceTypes';
import Products from './components/products/Products';
import PestTypes from './components/PestTypes';
import SimpleHeader from 'app/shared/components/SimpleHeader';


export default function CatalogsV2() {
	const [tabValue, setTabValue] = React.useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<PageLayout
			header={
				<SimpleHeader
					title="Catálogos"
					subtitle="Gestiona los catálogos del sistema: tipos de servicio, tipos de aplicación, productos y plagas"
				/>
			}
			content={
				<div className="p-16 sm:p-24 w-full">
					<PageContentCard
						filters={
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								variant="scrollable"
								scrollButtons={false}
								aria-label="catálogos tabs"
							>
								<Tab label="Tipos de Servicio" />
								<Tab label="Tipos de Aplicación" />
								<Tab label="Productos y Dosis" />
								<Tab label="Tipos de Plagas" />
							</Tabs>
						}
						sx={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }}
					>
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
					</PageContentCard>
				</div>
			}
		/>
	);
}
