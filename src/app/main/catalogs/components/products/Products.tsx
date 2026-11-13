import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { IInsecticideTypesResponse } from 'src/app/requests/catalogs/useQueryInsecticideTypes';
import { ISaveInsecticideTypePayload } from 'src/app/requests/catalogs/useMutationSaveInsecticideType';
import ProductDialog from './ProductDialog';
import { useQueryInsecticideTypes } from 'src/app/requests/catalogs/useQueryInsecticideTypes';
import { useMutationSaveInsecticideType } from 'src/app/requests/catalogs/useMutationSaveInsecticideType';
import { useMutationDeleteInsecticideType } from 'src/app/requests/catalogs/useMutationDeleteInsecticideType';
import { displayToast } from 'app/core/feedback/toast';
import { ProductCard } from './ProductCard';
import { ProductsLoading } from './ProductsLoading';
import { ProductsEmpty } from './ProductsEmpty';
import { useGlobalDialog } from 'app/shared/components/GlobalDialog/GlobalDialogContext';

export default function Products() {
    const { openDialog: openGlobalDialog } = useGlobalDialog();
    const { data: products = [], refetch, isLoading } = useQueryInsecticideTypes()
    const { mutateAsync: saveInsecticideType } = useMutationSaveInsecticideType()
    const { mutateAsync: deleteInsecticideType } = useMutationDeleteInsecticideType()
    const [openDialog, setOpenDialog] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<IInsecticideTypesResponse[number] | null>(null);

    const handleOpenDialog = (product?: IInsecticideTypesResponse[number]) => {
        if (product) {
            setIsEditing(true);
            setSelectedProduct(product);
        } else {
            setIsEditing(false);
            setSelectedProduct(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsEditing(false);
        setSelectedProduct(null);
    };

    const handleSubmit = async (data: ISaveInsecticideTypePayload) => {
        await saveInsecticideType(data)
        await refetch()
        displayToast({
            message: isEditing ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
            variant: 'success',
            autoHideDuration: 3000,
        })
        handleCloseDialog();
    };

    const handleDelete = async (product: IInsecticideTypesResponse[number]) => {
        openGlobalDialog({
            title: 'Eliminar Producto',
            text: '¿Estás seguro de querer eliminar este producto?',
            onAccept: async () => {
                await deleteInsecticideType({ id: product.id })
                await refetch()
                displayToast({
                    message: 'Producto eliminado correctamente',
                    variant: 'success',
                    autoHideDuration: 3000,
                })
            }
        });
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                {products.length > 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            boxShadow: 2,
                            '&:hover': {
                                boxShadow: 4,
                                transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        Nuevo Producto
                    </Button>
                )}
            </Box>

            {isLoading ? (
                <ProductsLoading />
            ) : products.length === 0 ? (
                <ProductsEmpty onAddNew={() => handleOpenDialog()} />
            ) : (
                <Grid container spacing={2}>
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={handleOpenDialog}
                            onDelete={handleDelete}
                        />
                    ))}
                </Grid>
            )}

            <ProductDialog
                open={openDialog}
                isEditing={isEditing}
                selectedProduct={selectedProduct}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />
        </>
    );
} 