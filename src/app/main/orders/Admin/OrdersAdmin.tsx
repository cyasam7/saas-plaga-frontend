import { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Button, ButtonBase, Drawer, InputAdornment, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Add, Search, TuneOutlined } from '@mui/icons-material';

import PageLayout from 'app/core/page/PageLayout';
import OrderDialog from '../components/SaveOrderOrderDialog/OrderDialog';
import AssignOrderDialog from '../components/AssignOrderDialog/AssignOrderDialog';
import GenerateReportDialog from '../components/GenerateReportDialog/GenerateReportDialog';
import useOrdersAdmin from './hooks/useOrdersAdmin';
import OrdersTabs from './components/OrdersTabs';
import OrdersFilterFields from './components/OrdersFilterFields';
import OrdersTable from './components/OrdersTable';
import OrderCard from './components/OrderCard';
import { fieldSx, primaryButtonSx } from './utils';
import './ordersAdmin.css';

function OrdersAdmin() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
	const [assigningOrderId, setAssigningOrderId] = useState('');
	const [reportOrderId, setReportOrderId] = useState('');

	const {
		urlFilters,
		setUrlFilter,
		adminFilters,
		setAdminFilter,
		clearFilters,
		activeFilterCount,
		hasFilters,
		visibleOrders,
		stats,
		clientNames,
		isLoading,
		refetch
	} = useOrdersAdmin();

	const todayLabel = dayjs().format('dddd, D [de] MMMM YYYY');
	const hasNoVisibleOrders = !isLoading && visibleOrders.length === 0;

	const filterFields = (
		<OrdersFilterFields
			filters={adminFilters}
			onFilterChange={setAdminFilter}
			fumigatorId={urlFilters.fumigatorId}
			onFumigatorChange={(fumigatorId) => setUrlFilter('fumigatorId', fumigatorId)}
			clientNames={clientNames}
			isStacked={isMobile}
		/>
	);

	const clearFiltersButton = (
		<ButtonBase
			onClick={clearFilters}
			sx={{ height: 40, px: 1.25, font: 'var(--text-label)', color: 'var(--accent-primary)', '&:hover': { color: 'var(--accent-primary-hover)' } }}
		>
			Limpiar filtros
		</ButtonBase>
	);

	const searchField = (
		<TextField
			size="small"
			placeholder={isMobile ? 'Buscar folio, cliente, teléfono' : 'Buscar folio, cliente, dirección, teléfono'}
			value={adminFilters.search}
			onChange={(event) => setAdminFilter('search', event.target.value)}
			inputProps={{ 'aria-label': 'Buscar órdenes' }}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<Search fontSize="small" sx={{ color: 'var(--fg-3)' }} />
					</InputAdornment>
				)
			}}
			sx={{ ...fieldSx, flex: '1 1 260px', minWidth: isMobile ? 0 : 220 }}
		/>
	);

	return (
		<PageLayout
			scroll="content"
			content={
				<Box
					className="orders-admin"
					sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2.5 } }}
				>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
						<Box>
							<Typography component="h1" sx={{ font: { xs: 'var(--text-h2)', md: 'var(--text-h1)' }, color: 'var(--fg-1)' }}>
								Órdenes
							</Typography>
							<Typography sx={{ font: { xs: 'var(--text-caption)', md: 'var(--text-body-sm)' }, color: { xs: 'var(--fg-3)', md: 'var(--fg-2)' }, '&::first-letter': { textTransform: 'uppercase' } }}>
								{isMobile ? `${visibleOrders.length} mostradas` : `${todayLabel} · ${stats.total} órdenes en el sistema`}
							</Typography>
						</Box>
						<Button
							variant="text"
							startIcon={<Add />}
							onClick={() => setIsCreateDialogOpen(true)}
							sx={{ ...primaryButtonSx, height: { xs: 44, md: 40 } }}
						>
							{isMobile ? 'Nueva' : 'Nueva orden'}
						</Button>
					</Box>

					{isMobile ? (
						<>
							{searchField}
							<Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mx: -2, px: 2, scrollbarWidth: 'none' }}>
								<ButtonBase
									onClick={() => setIsFiltersDrawerOpen(true)}
									sx={{ flexShrink: 0, gap: 0.75, height: 36, px: 1.5, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)', bgcolor: 'var(--surface-card)', font: 'var(--text-label)', color: 'var(--fg-1)' }}
								>
									<TuneOutlined sx={{ fontSize: 15 }} />
									Filtros
									{activeFilterCount > 0 && (
										<Box component="span" sx={{ font: 'var(--text-caption)', px: 0.75, borderRadius: 'var(--radius-pill)', bgcolor: 'var(--accent-primary)', color: '#fff' }}>
											{activeFilterCount}
										</Box>
									)}
								</ButtonBase>
								<OrdersTabs
									selectedDayFilter={urlFilters.dayFilter}
									stats={stats}
									onChange={(dayFilter) => setUrlFilter('dayFilter', dayFilter)}
									isPill
								/>
							</Box>
						</>
					) : (
						<>
							<OrdersTabs
								selectedDayFilter={urlFilters.dayFilter}
								stats={stats}
								onChange={(dayFilter) => setUrlFilter('dayFilter', dayFilter)}
							/>
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, alignItems: 'center' }}>
								{searchField}
								{filterFields}
								{hasFilters && clearFiltersButton}
							</Box>
						</>
					)}

					<Box
						sx={
							isMobile
								? { display: 'flex', flexDirection: 'column', gap: 1.25 }
								: { bgcolor: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }
						}
					>
						{isMobile ? (
							visibleOrders.map((order) => (
								<OrderCard key={order.id} order={order} onAssign={setAssigningOrderId} onGenerateReport={setReportOrderId} />
							))
						) : (
							<OrdersTable orders={visibleOrders} onAssign={setAssigningOrderId} onGenerateReport={setReportOrderId} />
						)}

						{isLoading && (
							<Typography sx={{ py: 7, textAlign: 'center', font: 'var(--text-body-sm)', color: 'var(--fg-2)' }}>
								Cargando órdenes…
							</Typography>
						)}

						{hasNoVisibleOrders && (
							<Box sx={{ py: { xs: 5, md: 7 }, px: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center' }}>
								<Typography sx={{ font: 'var(--text-h3)', color: 'var(--fg-1)' }}>
									{hasFilters ? 'Ninguna orden coincide con los filtros' : 'Sin órdenes'}
								</Typography>
								{hasFilters && (
									<>
										<Typography sx={{ font: 'var(--text-body-sm)', color: 'var(--fg-2)' }}>
											Prueba un rango de fechas más amplio o limpia los filtros.
										</Typography>
										{clearFiltersButton}
									</>
								)}
							</Box>
						)}

						{!isMobile && (
							<Typography sx={{ px: 2.5, py: 1.5, font: 'var(--text-caption)', color: 'var(--fg-3)' }}>
								Mostrando {visibleOrders.length} de {stats.total} órdenes
							</Typography>
						)}
					</Box>

					<Drawer
						anchor="bottom"
						open={isMobile && isFiltersDrawerOpen}
						onClose={() => setIsFiltersDrawerOpen(false)}
						PaperProps={{ className: 'orders-admin', sx: { borderRadius: '20px 20px 0 0', px: 2, pt: 1, pb: 2.5, display: 'flex', flexDirection: 'column', gap: 1.75 } }}
					>
						<Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: 'var(--gray-300)', alignSelf: 'center' }} />
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Typography sx={{ font: 'var(--text-h3)', color: 'var(--fg-1)' }}>Filtros</Typography>
							<ButtonBase onClick={clearFilters} sx={{ height: 44, font: 'var(--text-label)', color: 'var(--accent-primary)' }}>
								Restablecer
							</ButtonBase>
						</Box>
						{filterFields}
						<Button
							variant="text"
							onClick={() => setIsFiltersDrawerOpen(false)}
							sx={{ ...primaryButtonSx, width: '100%', height: 48, font: 'var(--text-body)', fontWeight: 600 }}
						>
							Mostrar {visibleOrders.length} órdenes
						</Button>
					</Drawer>

					<OrderDialog
						open={isCreateDialogOpen}
						shouldOpenDialogAssign
						onCancel={() => setIsCreateDialogOpen(false)}
						onSubmit={async (createdOrderId, shouldOpenDialogAssign) => {
							await refetch();

							if (shouldOpenDialogAssign) setAssigningOrderId(createdOrderId);
						}}
					/>
					<AssignOrderDialog
						orderId={assigningOrderId}
						open={Boolean(assigningOrderId)}
						onClose={() => setAssigningOrderId('')}
					/>
					<GenerateReportDialog
						id={reportOrderId}
						open={Boolean(reportOrderId)}
						onClose={() => setReportOrderId('')}
					/>
				</Box>
			}
		/>
	);
}

export default OrdersAdmin;
