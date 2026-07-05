import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';
import { Box, useTheme } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import { IServiceType } from '../types';



interface ServiceTypeDialogProps {
    open: boolean;
    isEditing: boolean;
    selectedService: IServiceType | null;
    onClose: () => void;
    onSubmit: (data: IServiceType) => void;
}

export default function ServiceTypeDialog({
    open,
    isEditing,
    selectedService,
    onClose,
    onSubmit
}: ServiceTypeDialogProps) {
    const theme = useTheme();
    const { control, handleSubmit, reset } = useForm<IServiceType>({
        defaultValues: {
            id: '',
            name: '',
            description: ''
        }
    });

    React.useEffect(() => {
        if (selectedService) {
            reset({
                id: selectedService.id,
                name: selectedService.name,
                description: selectedService.description
            });
        } else if (open) {
            reset({
                id: '',
                name: '',
                description: ''
            });
        } else {
            reset({
                id: '',
                name: '',
                description: ''
            });
        }
    }, [selectedService, reset, open]);

    const handleClose = () => {
        reset({
            id: '',
            name: '',
            description: ''
        });
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    minWidth: '500px'
                }
            }}
        >
            <Box sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <BuildIcon />
                <DialogTitle sx={{ p: 0, color: 'inherit' }}>
                    {isEditing ? 'Editar Tipo de Servicio' : 'Nuevo Tipo de Servicio'}
                </DialogTitle>
            </Box>
            <DialogContent>
                <DialogContentText sx={{ mt: 2 }}>
                    {isEditing
                        ? 'Modifica los datos del tipo de servicio.'
                        : 'Agrega un nuevo tipo de servicio al catálogo.'}
                </DialogContentText>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextFieldForm<IServiceType>
                        control={control}
                        name="name"
                        label="Nombre"
                        fullWidth
                        autoFocus
                        margin="dense"
                        sx={{ mt: 2 }}
                    />
                    <TextFieldForm<IServiceType>
                        control={control}
                        name="description"
                        label="Descripción"
                        fullWidth
                        multiline
                        rows={4}
                        margin="dense"
                        sx={{ mt: 2 }}
                    />
                    <DialogActions>
                        <Button onClick={handleClose} color="inherit">Cancelar</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            sx={{ color: theme.palette.secondary.contrastText }}
                        >
                            {isEditing ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
} 