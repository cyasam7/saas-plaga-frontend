import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { INamedCatalogItem } from 'src/app/requests/catalogs/types';
import { ISaveNamedCatalogPayload } from 'src/app/requests/catalogs/types';
import PestTypeDialog from './PestTypeDialog';
import { displayToast } from 'app/core/feedback/toast';
import { PestTypeCard } from './PestTypeCard';
import { PestTypesLoading } from './PestTypesLoading';
import { PestTypesEmpty } from './PestTypesEmpty';
import { useGlobalDialog } from 'app/shared/components/GlobalDialog/GlobalDialogContext';
import { useQueryPestTypes } from 'src/app/requests/catalogs/useQueryPestTypes';
import { useMutationSavePestType } from 'src/app/requests/catalogs/useMutationSavePestType';
import { useMutationDeletePestType } from 'src/app/requests/catalogs/useMutationDeletePestType';

export default function PestTypes() {
    const { openDialog: openGlobalDialog } = useGlobalDialog();
    const { data: pestTypes = [], refetch, isLoading } = useQueryPestTypes()
    const { mutateAsync: savePestType } = useMutationSavePestType()
    const { mutateAsync: deletePestType } = useMutationDeletePestType()
    const [openDialog, setOpenDialog] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedPest, setSelectedPest] = React.useState<INamedCatalogItem | null>(null);

    const handleOpenDialog = (pest?: INamedCatalogItem) => {
        if (pest) {
            setIsEditing(true);
            setSelectedPest(pest);
        } else {
            setIsEditing(false);
            setSelectedPest(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsEditing(false);
        setSelectedPest(null);
    };

    const handleSubmit = async (data: ISaveNamedCatalogPayload) => {
        await savePestType(data)
        await refetch()
        displayToast({
            message: isEditing ? 'Tipo de plaga actualizado correctamente' : 'Tipo de plaga creado correctamente',
            variant: 'success',
            autoHideDuration: 3000,
        })
        handleCloseDialog();
    };

    const handleDelete = async (pest: INamedCatalogItem) => {
        openGlobalDialog({
            title: 'Eliminar Tipo de Plaga',
            text: '¿Estás seguro de querer eliminar este tipo de plaga?',
            onAccept: async () => {
                await deletePestType({ id: pest.id })
                await refetch()
                displayToast({
                    message: 'Tipo de plaga eliminado correctamente',
                    variant: 'success',
                    autoHideDuration: 3000,
                })
            }
        });
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                {pestTypes.length > 0 && (
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
                        Nuevo Tipo de Plaga
                    </Button>
                )}
            </Box>

            {isLoading ? (
                <PestTypesLoading />
            ) : pestTypes.length === 0 ? (
                <PestTypesEmpty onAddNew={() => handleOpenDialog()} />
            ) : (
                <Grid container spacing={2}>
                    {pestTypes.map((pest) => (
                        <PestTypeCard
                            key={pest.id}
                            pest={pest}
                            onEdit={handleOpenDialog}
                            onDelete={handleDelete}
                        />
                    ))}
                </Grid>
            )}

            <PestTypeDialog
                open={openDialog}
                isEditing={isEditing}
                selectedPest={selectedPest}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />
        </>
    );
} 