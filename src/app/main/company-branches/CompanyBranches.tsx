import { useState } from 'react';
import { Button, Chip, Stack, Typography } from '@mui/material';
import { Add, Delete, Edit, StoreOutlined } from '@mui/icons-material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import PageLayout from 'app/core/page/PageLayout';
import SimpleHeader from 'app/shared/components/SimpleHeader';
import PageContentCard from 'app/shared/components/PageContentCard/PageContentCard';
import EmptyState from 'app/shared/components/EmptyState/EmptyState';
import SearchField from 'app/shared/components/SearchField/SearchField';
import { useGlobalDialog } from 'app/shared/components/GlobalDialog/GlobalDialogContext';
import { displayToast } from 'app/core/feedback/toast';
import { LIST_DATA_GRID_SX } from 'src/app/shared/constants/dataGrid';
import useDebounce from 'src/app/shared/hooks/useDebounce';
import useFilterParams from 'src/app/shared/hooks/useFilterParams';
import useQueryInvalidator from 'src/app/shared/hooks/useQueryInvalidator';
import { companyBranchKeys } from 'src/app/requests/company-branches/keys';
import {
	ICompanyBranchesResponse,
	useQueryCompanyBranches
} from 'src/app/requests/company-branches/useQueryCompanyBranches';
import { useMutationDeleteCompanyBranch } from 'src/app/requests/company-branches/useMutationDeleteCompanyBranch';

import CompanyBranchDialog from './components/CompanyBranchDialog/CompanyBranchDialog';

const COMPANY_BRANCH_FILTER_KEYS = ['search'] as const;
const SEARCH_DEBOUNCE_MS = 400;

function CompanyBranches() {
	const { openDialog } = useGlobalDialog();
	const { invalidate } = useQueryInvalidator();
	const { filters, setFilters } = useFilterParams(COMPANY_BRANCH_FILTER_KEYS);
	const [isCompanyBranchDialogOpen, setIsCompanyBranchDialogOpen] = useState(false);
	// Vacío = alta de sucursal; con id = edición.
	const [editingCompanyBranchId, setEditingCompanyBranchId] = useState('');

	// La búsqueda espera a que se deje de escribir para no pedir al API en cada tecla.
	const { debounceValue: debouncedSearch } = useDebounce(filters.search, SEARCH_DEBOUNCE_MS);
	const search = (debouncedSearch ?? filters.search).trim();

	const { data: companyBranches = [], isLoading } = useQueryCompanyBranches({ search });
	const { mutateAsync: deleteCompanyBranch } = useMutationDeleteCompanyBranch();

	function handleOpenCompanyBranchDialog(companyBranchId: string) {
		setEditingCompanyBranchId(companyBranchId);
		setIsCompanyBranchDialogOpen(true);
	}

	function handleCloseCompanyBranchDialog() {
		setIsCompanyBranchDialogOpen(false);
		setEditingCompanyBranchId('');
	}

	function handleDeleteCompanyBranch(companyBranch: ICompanyBranchesResponse[number]) {
		openDialog({
			title: 'Eliminar sucursal',
			text: `¿Seguro que deseas eliminar la sucursal ${companyBranch.name}? Esta acción no se puede deshacer.`,
			onAccept: async () => {
				await deleteCompanyBranch({ companyBranchId: companyBranch.id });
				invalidate(companyBranchKeys.lists());
				displayToast({
					message: 'Sucursal eliminada correctamente',
					anchorOrigin: { horizontal: 'right', vertical: 'top' },
					variant: 'success'
				});
			}
		});
	}

	const columns: GridColDef<ICompanyBranchesResponse[number]>[] = [
		{
			field: 'name',
			headerName: 'Nombre',
			flex: 1,
			minWidth: 180,
			disableColumnMenu: true,
			renderCell: ({ row: companyBranch }) => (
				<Stack
					direction="row"
					alignItems="center"
					spacing={1}
					sx={{ minWidth: 0, height: '100%' }}
				>
					<Typography
						variant="body2"
						noWrap
					>
						{companyBranch.name}
					</Typography>
					{companyBranch.isMain && (
						<Chip
							label="Matriz"
							size="small"
							color="primary"
							variant="outlined"
						/>
					)}
				</Stack>
			)
		},
		{
			field: 'address',
			headerName: 'Dirección',
			flex: 2,
			minWidth: 240,
			disableColumnMenu: true,
			renderCell: ({ row: companyBranch }) =>
				companyBranch.address || (
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ lineHeight: 'inherit' }}
					>
						Sin dirección
					</Typography>
				)
		},
		{
			field: 'actions',
			headerName: 'Acciones',
			type: 'actions',
			width: 110,
			getActions: ({ row: companyBranch }) => {
				const editAction = (
					<GridActionsCellItem
						key="edit"
						label="Editar"
						icon={<Edit />}
						onClick={() => handleOpenCompanyBranchDialog(companyBranch.id)}
					/>
				);

				// La matriz no se puede eliminar (el API responde 409).
				if (companyBranch.isMain) return [editAction];

				return [
					editAction,
					<GridActionsCellItem
						key="delete"
						label="Eliminar"
						icon={<Delete />}
						onClick={() => handleDeleteCompanyBranch(companyBranch)}
					/>
				];
			}
		}
	];

	const isEmpty = !isLoading && companyBranches.length === 0;

	return (
		<PageLayout
			scroll="content"
			header={
				<SimpleHeader
					title="Sucursales"
					subtitle="Gestiona las sucursales de tu empresa"
					actions={
						<Button
							variant="contained"
							color="primary"
							size="large"
							startIcon={<Add />}
							onClick={() => handleOpenCompanyBranchDialog('')}
							sx={{ fontWeight: 600 }}
						>
							Nueva sucursal
						</Button>
					}
				/>
			}
			content={
				<div className="p-16 sm:p-24 w-full flex flex-col flex-1 min-h-0">
					<CompanyBranchDialog
						open={isCompanyBranchDialogOpen}
						companyBranchId={editingCompanyBranchId}
						onClose={handleCloseCompanyBranchDialog}
					/>
					<PageContentCard
						filters={
							<SearchField
								placeholder="Buscar por nombre o dirección"
								ariaLabel="Buscar sucursales"
								value={filters.search}
								onChange={(nextSearch) => setFilters({ search: nextSearch })}
								sx={{ width: { xs: '100%', sm: 300 } }}
							/>
						}
						footer={
							companyBranches.length > 0 && (
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{companyBranches.length} {companyBranches.length === 1 ? 'sucursal' : 'sucursales'}
								</Typography>
							)
						}
						sx={{ flex: 1, minHeight: 0 }}
					>
						{isEmpty ? (
							<EmptyState
								icon={StoreOutlined}
								title="Sin sucursales"
								description={
									search
										? 'No hay sucursales que coincidan con la búsqueda.'
										: 'Aún no hay sucursales. Crea la primera con "Nueva sucursal".'
								}
							/>
						) : (
							<DataGrid
								autoHeight
								hideFooter
								rows={companyBranches}
								loading={isLoading}
								columns={columns}
								density="comfortable"
								disableRowSelectionOnClick
								sx={LIST_DATA_GRID_SX}
							/>
						)}
					</PageContentCard>
				</div>
			}
		/>
	);
}

export default CompanyBranches;
