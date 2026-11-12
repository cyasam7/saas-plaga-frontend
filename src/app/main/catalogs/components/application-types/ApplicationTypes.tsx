import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import ApplicationTypeDialog from './ApplicationTypeDialog';
import { INamedCatalogItem } from 'src/app/requests/catalogs/types';
import { ISaveNamedCatalogPayload } from 'src/app/requests/catalogs/types';
import { useQueryApplicationTypes } from 'src/app/requests/catalogs/useQueryApplicationTypes';
import { useMutationSaveApplicationType } from 'src/app/requests/catalogs/useMutationSaveApplicationType';
import { useMutationDeleteApplicationType } from 'src/app/requests/catalogs/useMutationDeleteApplicationType';
import { displayToast } from 'app/core/feedback/toast';
import { ApplicationTypeCard } from './ApplicationTypeCard';
import { ApplicationTypesLoading } from './ApplicationTypesLoading';
import { ApplicationTypesEmpty } from './ApplicationTypesEmpty';
import { useGlobalDialog } from 'app/shared/components/GlobalDialog/GlobalDialogContext';

export default function ApplicationTypes() {
    const { openDialog: openGlobalDialog } = useGlobalDialog();
    const { data: applicationTypes = [], refetch, isLoading } = useQueryApplicationTypes()
    const { mutateAsync: saveApplicationType } = useMutationSaveApplicationType()
    const { mutateAsync: deleteApplicationType } = useMutationDeleteApplicationType()
    const [isOpenDialog, setIsOpenDialog] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedApplication, setSelectedApplication] = React.useState<INamedCatalogItem | null>(null);

    const handleOpenDialog = (application?: INamedCatalogItem) => {
        if (application) {
            setIsEditing(true);
            setSelectedApplication(application);
        } else {
            setIsEditing(false);
            setSelectedApplication(null);
        }
        setIsOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setIsOpenDialog(false);
        setIsEditing(false);
        setSelectedApplication(null);
    };

    const handleSubmit = async (data: ISaveNamedCatalogPayload) => {
        await saveApplicationType(data)
        await refetch()
        displayToast({
            message: isEditing ? 'Tipo de aplicación actualizado correctamente' : 'Tipo de aplicación creado correctamente',
            variant: 'success',
            autoHideDuration: 3000,
        })
        handleCloseDialog();
    };

    const handleDelete = async (application: INamedCatalogItem) => {
        openGlobalDialog({
            title: 'Eliminar Tipo de Aplicación',
            text: '¿Estás seguro de querer eliminar este tipo de aplicación?',
            onAccept: async () => {
                await deleteApplicationType({ id: application.id })
                await refetch()
                displayToast({
                    message: 'Tipo de aplicación eliminado correctamente',
                    variant: 'success',
                    autoHideDuration: 3000,
                })
            }
        });
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                {applicationTypes.length > 0 && <Button
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
                    Nuevo Tipo de Aplicación
                </Button>}
            </Box>

            {isLoading ? (
                <ApplicationTypesLoading />
            ) : applicationTypes.length === 0 ? (
                <ApplicationTypesEmpty onAddNew={() => handleOpenDialog()} />
            ) : (
                <Grid container spacing={2}>
                    {applicationTypes.map((application) => (
                        <ApplicationTypeCard
                            key={application.id}
                            application={application}
                            onEdit={handleOpenDialog}
                            onDelete={handleDelete}
                        />
                    ))}
                </Grid>
            )}

            <ApplicationTypeDialog
                open={isOpenDialog}
                isEditing={isEditing}
                selectedApplication={selectedApplication}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />
        </>
    );
} 