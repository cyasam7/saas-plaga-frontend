import React from 'react';
import Button from '@mui/material/Button';
import { useForm, useFieldArray } from 'react-hook-form';
import TextFieldForm from 'app/shared/components/Form/TextFieldForm/TextFieldForm';
import { IconButton, Grid, MenuItem, Stack } from '@mui/material';
import FormDialog from 'app/shared/components/FormDialog/FormDialog';
import FormSection from 'app/shared/components/FormSection/FormSection';
import ScienceIcon from '@mui/icons-material/Science';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { IInsecticideTypesResponse } from 'src/app/requests/catalogs/useQueryInsecticideTypes';
import { ISaveInsecticideTypePayload } from 'src/app/requests/catalogs/useMutationSaveInsecticideType';

interface ProductDialogProps {
    open: boolean;
    isEditing: boolean;
    selectedProduct: IInsecticideTypesResponse[number] | null;
    onClose: () => void;
    onSubmit: (data: ISaveInsecticideTypePayload) => Promise<void> | void;
}

const units = [
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'g', label: 'Gramos (g)' },
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'l', label: 'Litros (l)' }
];

export default function ProductDialog({
    open,
    isEditing,
    selectedProduct,
    onClose,
    onSubmit
}: ProductDialogProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm<ISaveInsecticideTypePayload>({
        defaultValues: {
            id: '',
            commercialName: '',
            chemicalName: '',
            description: '',
            doses: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "doses"
    });

    React.useEffect(() => {
        if (selectedProduct) {
            reset({
                id: selectedProduct.id,
                commercialName: selectedProduct.commercialName || '',
                chemicalName: selectedProduct.chemicalName || '',
                description: selectedProduct.description,
                doses: selectedProduct.doses || []
            });
        } else if (open) {
            reset({
                id: '',
                commercialName: '',
                chemicalName: '',
                description: '',
                doses: []
            });
        } else {
            reset({
                id: '',
                commercialName: '',
                chemicalName: '',
                description: '',
                doses: []
            });
        }
    }, [selectedProduct, reset, open]);

    const handleClose = () => {
        reset({
            id: '',
            commercialName: '',
            chemicalName: '',
            description: '',
            doses: []
        });
        onClose();
    };

    const handleAddDose = () => {
        append({ amount: '', unit: 'ml' });
    };

    return (
        <FormDialog
            open={open}
            onClose={handleClose}
            title={isEditing ? 'Editar producto' : 'Nuevo producto'}
            subtitle={isEditing ? 'Modifica los datos del producto.' : 'Agrega un nuevo producto al catálogo.'}
            onSubmit={handleSubmit(onSubmit)}
            submitLabel={isEditing ? 'Guardar cambios' : 'Crear producto'}
            isSubmitting={isSubmitting}
        >
            <Stack spacing={2}>
                <FormSection
                    icon={<ScienceIcon fontSize="small" />}
                    title="Producto"
                    description="Nombre con el que aparece en las órdenes y en los reportes."
                >
                    <Stack spacing={2}>
                        <TextFieldForm<ISaveInsecticideTypePayload>
                            control={control}
                            name="commercialName"
                            label="Nombre comercial"
                            size="small"
                            fullWidth
                            autoFocus
                        />
                        <TextFieldForm<ISaveInsecticideTypePayload>
                            control={control}
                            name="chemicalName"
                            label="Nombre químico"
                            size="small"
                            fullWidth
                        />
                        <TextFieldForm<ISaveInsecticideTypePayload>
                            control={control}
                            name="description"
                            label="Descripción"
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Stack>
                </FormSection>

                <FormSection
                    icon={<LocalHospitalIcon fontSize="small" />}
                    title="Dosis disponibles"
                    description="Cantidades que el fumigador podrá elegir al registrar el servicio."
                >
                    <Stack spacing={1.5}>
                        {fields.map((field, index) => (
                            <Grid
                                key={field.id}
                                container
                                spacing={1.5}
                                alignItems="center"
                            >
                                <Grid item xs={5}>
                                    <TextFieldForm<ISaveInsecticideTypePayload>
                                        control={control}
                                        name={`doses.${index}.amount`}
                                        label="Cantidad"
                                        size="small"
                                        fullWidth
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextFieldForm<ISaveInsecticideTypePayload>
                                        control={control}
                                        name={`doses.${index}.unit`}
                                        label="Unidad"
                                        size="small"
                                        fullWidth
                                        select
                                        defaultValue="ml"
                                    >
                                        {units.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextFieldForm>
                                </Grid>
                                <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <IconButton
                                        aria-label="Quitar dosis"
                                        onClick={() => remove(index)}
                                        color="error"
                                        size="small"
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleAddDose}
                            variant="text"
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            Agregar dosis
                        </Button>
                    </Stack>
                </FormSection>
            </Stack>
        </FormDialog>
    );
} 
