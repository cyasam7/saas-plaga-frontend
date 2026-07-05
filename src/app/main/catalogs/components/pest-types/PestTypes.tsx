import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { IPestType } from '../types';
import PestTypeDialog from './PestTypeDialog';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { useQuery } from 'react-query';
import { PestTypeCard } from './PestTypeCard';
import { PestTypesLoading } from './PestTypesLoading';
import { PestTypesEmpty } from './PestTypesEmpty';
import { openDialog as openGlobalDialog } from 'app/shared-components/GlobalDialog/openDialog';
import { PestTypeService } from 'src/app/shared/services/Catalogs/PestTypeService';

export default function PestTypes() {
    const { data: pestTypes = [], refetch, isLoading } = useQuery({
        queryKey: ['pestTypes'],
        queryFn: () => PestTypeService.byQuery("")
    })
    const [openDialog, setOpenDialog] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedPest, setSelectedPest] = React.useState<IPestType | null>(null);

    const handleOpenDialog = (pest?: IPestType) => {
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

    const handleSubmit = async (data: IPestType) => {
        await PestTypeService.save(data)
        await refetch()
        displayToast({
            message: isEditing ? 'Tipo de plaga actualizado correctamente' : 'Tipo de plaga creado correctamente',
            variant: 'success',
            autoHideDuration: 3000,
        })
        handleCloseDialog();
    };

    const handleDelete = async (pest: IPestType) => {
        openGlobalDialog({
            title: 'Eliminar Tipo de Plaga',
            text: '¿Estás seguro de querer eliminar este tipo de plaga?',
            onAccept: async () => {
                await PestTypeService.delete(pest.id)
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