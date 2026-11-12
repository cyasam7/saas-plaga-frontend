import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { INamedCatalogItem } from 'src/app/requests/catalogs/types';
import { ISaveNamedCatalogPayload } from 'src/app/requests/catalogs/types';
import ServiceTypeDialog from './ServiceTypeDialog';
import { useQueryServiceTypes } from 'src/app/requests/catalogs/useQueryServiceTypes';
import { useMutationSaveServiceType } from 'src/app/requests/catalogs/useMutationSaveServiceType';
import { useMutationDeleteServiceType } from 'src/app/requests/catalogs/useMutationDeleteServiceType';
import { displayToast } from 'app/core/feedback/toast';
import { ServiceTypeCard } from './ServiceTypeCard';
import { ServiceTypesLoading } from './ServiceTypesLoading';
import { ServiceTypesEmpty } from './ServiceTypesEmpty';
import { openDialog as openGlobalDialog } from 'app/shared-components/GlobalDialog/openDialog';

export default function ServiceTypes() {
    const { data: serviceTypes = [], refetch, isLoading } = useQueryServiceTypes()
    const { mutateAsync: saveServiceType } = useMutationSaveServiceType()
    const { mutateAsync: deleteServiceType } = useMutationDeleteServiceType()

    const [openDialog, setOpenDialog] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedService, setSelectedService] = React.useState<INamedCatalogItem | null>(null);

    const handleOpenDialog = (service?: INamedCatalogItem) => {
        if (service) {
            setIsEditing(true);
            setSelectedService(service);
        } else {
            setIsEditing(false);
            setSelectedService(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsEditing(false);
        setSelectedService(null);
    };

    const handleSubmit = async (data: ISaveNamedCatalogPayload) => {
        await saveServiceType(data)
        await refetch()
        displayToast({
            message: isEditing ? 'Tipo de servicio actualizado correctamente' : 'Tipo de servicio creado correctamente',
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            }
        })
        handleCloseDialog();
    };

    const handleDelete = async (service: INamedCatalogItem) => {
        openGlobalDialog({
            title: 'Eliminar Tipo de Servicio',
            text: '¿Estás seguro de querer eliminar este tipo de servicio?',
            onAccept: async () => {
                await deleteServiceType({ id: service.id })
                await refetch()
                displayToast({
                    message: 'Tipo de servicio eliminado correctamente',
                    variant: 'success',
                    autoHideDuration: 3000,
                })
            }
        })
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                {serviceTypes.length > 0 && <Button
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
                    Nuevo Tipo de Servicio
                </Button>}
            </Box>

            {isLoading ? (
                <ServiceTypesLoading />
            ) : serviceTypes.length === 0 ? (
                <ServiceTypesEmpty onAddNew={() => handleOpenDialog()} />
            ) : (
                <Grid container spacing={2}>
                    {serviceTypes.map((service) => (
                        <ServiceTypeCard
                            key={service.id}
                            service={service}
                            onEdit={handleOpenDialog}
                            onDelete={handleDelete}
                        />
                    ))}
                </Grid>
            )}

            <ServiceTypeDialog
                open={openDialog}
                isEditing={isEditing}
                selectedService={selectedService}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />
        </>
    );
} 