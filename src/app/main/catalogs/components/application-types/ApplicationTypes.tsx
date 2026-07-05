import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import ApplicationTypeDialog from './ApplicationTypeDialog';
import { IApplicationType } from '../types';
import { ApplicationTypeService } from 'src/app/shared/services/Catalogs/ApplicationTypeService';
import { useQuery } from 'react-query';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { ApplicationTypeCard } from './ApplicationTypeCard';
import { ApplicationTypesLoading } from './ApplicationTypesLoading';
import { ApplicationTypesEmpty } from './ApplicationTypesEmpty';
import { openDialog as openGlobalDialog } from 'app/shared-components/GlobalDialog/openDialog';

export default function ApplicationTypes() {
    const { data: applicationTypes = [], refetch, isLoading } = useQuery({
        queryKey: ['applicationTypes'],
        queryFn: () => ApplicationTypeService.byQuery("")
    })
    const [isOpenDialog, setIsOpenDialog] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedApplication, setSelectedApplication] = React.useState<IApplicationType | null>(null);

    const handleOpenDialog = (application?: IApplicationType) => {
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

    const handleSubmit = async (data: IApplicationType) => {
        await ApplicationTypeService.save(data)
        await refetch()
        displayToast({
            message: isEditing ? 'Tipo de aplicación actualizado correctamente' : 'Tipo de aplicación creado correctamente',
            variant: 'success',
            autoHideDuration: 3000,
        })
        handleCloseDialog();
    };

    const handleDelete = async (application: IApplicationType) => {
        openGlobalDialog({
            title: 'Eliminar Tipo de Aplicación',
            text: '¿Estás seguro de querer eliminar este tipo de aplicación?',
            onAccept: async () => {
                await ApplicationTypeService.delete(application.id)
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