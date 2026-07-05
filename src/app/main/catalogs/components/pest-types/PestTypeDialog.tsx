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
import BugReportIcon from '@mui/icons-material/BugReport';
import { IPestType } from '../types';


interface PestTypeDialogProps {
    open: boolean;
    isEditing: boolean;
    selectedPest: IPestType | null;
    onClose: () => void;
    onSubmit: (data: IPestType) => void;
}

export default function PestTypeDialog({
    open,
    isEditing,
    selectedPest,
    onClose,
    onSubmit
}: PestTypeDialogProps) {
    const theme = useTheme();
    const { control, handleSubmit, reset } = useForm<IPestType>({
        defaultValues: {
            id: '',
            name: '',
            description: ''
        }
    });

    React.useEffect(() => {
        if (selectedPest) {
            reset({
                id: selectedPest.id,
                name: selectedPest.name,
                description: selectedPest.description
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
    }, [selectedPest, reset, open]);

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
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <BugReportIcon />
                <DialogTitle sx={{ p: 0, color: 'inherit' }}>
                    {isEditing ? 'Editar Plaga' : 'Nueva Plaga'}
                </DialogTitle>
            </Box>
            <DialogContent>
                <DialogContentText sx={{ mt: 2 }}>
                    {isEditing
                        ? 'Modifica los datos de la plaga.'
                        : 'Agrega un nuevo tipo de plaga al catálogo.'}
                </DialogContentText>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextFieldForm<IPestType>
                        control={control}
                        name="name"
                        label="Nombre"
                        fullWidth
                        autoFocus
                        margin="dense"
                        sx={{ mt: 2 }}
                    />
                    <TextFieldForm<IPestType>
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
                            color="primary"
                            sx={{ color: theme.palette.primary.contrastText }}
                        >
                            {isEditing ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
} 