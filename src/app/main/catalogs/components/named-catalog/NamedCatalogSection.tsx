import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { SvgIconComponent } from '@mui/icons-material';
import { displayToast } from 'app/core/feedback/toast';
import { useGlobalDialog } from 'app/shared/components/GlobalDialog/GlobalDialogContext';
import { INamedCatalogItem, ISaveNamedCatalogPayload } from 'src/app/requests/catalogs/types';
import { NamedCatalogCard } from './NamedCatalogCard';
import { NamedCatalogDialog } from './NamedCatalogDialog';
import { NamedCatalogEmpty } from './NamedCatalogEmpty';
import { NamedCatalogLoading } from './NamedCatalogLoading';
import { INamedCatalogLabels, NamedCatalogAccentColor } from './types';

/**
 * List + create/edit/delete flow shared by the named catalogs (pest, service and application types).
 * Each tab calls its own request hooks and passes the data and mutations in.
 */
type NamedCatalogSectionProps = {
	catalogItems: INamedCatalogItem[];
	isLoading: boolean;
	labels: INamedCatalogLabels;
	Icon: SvgIconComponent;
	accentColor: NamedCatalogAccentColor;
	saveCatalogItem: (catalogItemForm: ISaveNamedCatalogPayload) => Promise<unknown>;
	deleteCatalogItem: (catalogItemId: string) => Promise<unknown>;
	refetchCatalogItems: () => Promise<unknown>;
};

export function NamedCatalogSection({
	catalogItems,
	isLoading,
	labels,
	Icon,
	accentColor,
	saveCatalogItem,
	deleteCatalogItem,
	refetchCatalogItems
}: NamedCatalogSectionProps) {
	const { openDialog: openGlobalDialog } = useGlobalDialog();
	const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
	const [selectedCatalogItem, setSelectedCatalogItem] = useState<INamedCatalogItem | null>(null);

	function handleOpenFormDialog(catalogItem?: INamedCatalogItem) {
		setSelectedCatalogItem(catalogItem ?? null);
		setIsFormDialogOpen(true);
	}

	function handleCloseFormDialog() {
		setIsFormDialogOpen(false);
		setSelectedCatalogItem(null);
	}

	async function handleSubmit(catalogItemForm: ISaveNamedCatalogPayload) {
		const isEditing = selectedCatalogItem !== null;
		await saveCatalogItem(catalogItemForm);
		await refetchCatalogItems();
		displayToast({
			message: `${labels.singularTitle} ${isEditing ? 'actualizado' : 'creado'} correctamente`,
			variant: 'success',
			autoHideDuration: 3000,
			anchorOrigin: { vertical: 'top', horizontal: 'right' }
		});
		handleCloseFormDialog();
	}

	function handleDelete(catalogItem: INamedCatalogItem) {
		openGlobalDialog({
			title: `Eliminar ${labels.singularTitle}`,
			text: `¿Estás seguro de querer eliminar este ${labels.singular}?`,
			onAccept: async () => {
				await deleteCatalogItem(catalogItem.id);
				await refetchCatalogItems();
				displayToast({
					message: `${labels.singularTitle} eliminado correctamente`,
					variant: 'success',
					autoHideDuration: 3000,
					anchorOrigin: { vertical: 'top', horizontal: 'right' }
				});
			}
		});
	}

	function renderCatalogItems() {
		if (isLoading) {
			return <NamedCatalogLoading />;
		}

		if (catalogItems.length === 0) {
			return (
				<NamedCatalogEmpty
					labels={labels}
					Icon={Icon}
					onAddNew={() => handleOpenFormDialog()}
				/>
			);
		}

		return (
			<Grid
				container
				spacing={2}
			>
				{catalogItems.map((catalogItem) => (
					<NamedCatalogCard
						key={catalogItem.id}
						catalogItem={catalogItem}
						labels={labels}
						Icon={Icon}
						onEdit={handleOpenFormDialog}
						onDelete={handleDelete}
					/>
				))}
			</Grid>
		);
	}

	return (
		<>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
				{catalogItems.length > 0 && (
					<Button
						variant="contained"
						color="primary"
						startIcon={<AddIcon />}
						onClick={() => handleOpenFormDialog()}
						sx={{
							borderRadius: 2,
							textTransform: 'none',
							px: 3,
							py: 1,
							boxShadow: 2,
							'&:hover': {
								boxShadow: 4,
								transform: 'translateY(-1px)'
							},
							transition: 'all 0.2s ease-in-out'
						}}
					>
						Nuevo {labels.singularTitle}
					</Button>
				)}
			</Box>

			{renderCatalogItems()}

			<NamedCatalogDialog
				open={isFormDialogOpen}
				selectedCatalogItem={selectedCatalogItem}
				labels={labels}
				Icon={Icon}
				accentColor={accentColor}
				onClose={handleCloseFormDialog}
				onSubmit={handleSubmit}
			/>
		</>
	);
}
