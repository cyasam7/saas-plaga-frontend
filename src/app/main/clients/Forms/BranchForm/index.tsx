import { useEffect } from "react"
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { AddCircleOutline, DeleteOutline } from "@mui/icons-material"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import TextFieldForm from "src/app/shared-components/Form/TextFieldForm/TextFieldForm"
import PhoneInputForm from "src/app/shared-components/Form/PhoneInputForm/PhoneInputForm"
import { IBranchForm } from "src/app/requests/branches/types"
import { useQueryGetBranchForm } from "src/app/requests/branches/useQueryGetBranchForm"
import { useMutationCreateBranchForm } from "src/app/requests/branches/useMutationCreateBranchForm"
import { useMutationUpdateBranchForm } from "src/app/requests/branches/useMutationUpdateBranchForm"
import { BranchFormProps, branchFormSchema } from "./types"

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"
const pressFeedback = {
  transition: `transform 160ms ${EASE_OUT}`,
  "&:active": { transform: "scale(0.97)" },
}

const emptyForm: IBranchForm = {
  name: "",
  address: "",
  contactPhone: "",
  contactPerson: null,
  notes: null,
  areas: [],
}

/** Una sucursal nueva nace con estas áreas (igual que en el alta de cliente); se pueden editar. */
const newBranchForm: IBranchForm = {
  ...emptyForm,
  areas: [
    { name: "Exterior", description: null },
    { name: "Interior", description: null },
  ],
}

/**
 * Alta y edición de una ubicación con sus áreas, con el mismo `form`:
 * - Alta (`branchId` vacío): POST /branch/form.
 * - Edición: carga GET /branch/:id/form y envía el `form` completo a PUT /branch/:id
 *   (las áreas quitadas se eliminan en el API).
 */
export function BranchForm({ open, clientId, branchId, onClose, onSaved }: BranchFormProps) {
  const isEditing = Boolean(branchId)

  const { data: branchFormResponse, isLoading: isLoadingForm } = useQueryGetBranchForm({ branchId }, open && isEditing)
  const { mutateAsync: createBranchForm } = useMutationCreateBranchForm()
  const { mutateAsync: updateBranchForm } = useMutationUpdateBranchForm()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<IBranchForm>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: emptyForm,
  })

  const { fields: areaFields, append: appendArea, remove: removeArea } = useFieldArray({ control, name: "areas" })
  const areasErrorMessage = errors.areas?.root?.message ?? errors.areas?.message

  useEffect(() => {
    if (!open) return

    if (!isEditing) reset(newBranchForm)
    else if (branchFormResponse) reset(branchFormResponse.form)
  }, [open, isEditing, branchFormResponse, reset])

  async function handleSaveBranchForm(branchForm: IBranchForm) {
    try {
      if (isEditing) await updateBranchForm({ branchId, form: branchForm })
      else await createBranchForm({ clientId, form: branchForm })

      await onSaved()
      handleClose()
    } catch {
      // AxiosFetcher ya mostró el mensaje del API (p. ej. un área con dispositivos); el diálogo sigue abierto.
    }
  }

  function handleClose() {
    reset(emptyForm)
    onClose()
  }

  const isFormDisabled = isSubmitting || isLoadingForm

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditing ? "Editar Sucursal" : "Agregar Nueva Sucursal"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEditing
            ? "Modifique la información de la sucursal y sus áreas."
            : "Complete los campos y las áreas para registrar una nueva sucursal."}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {isLoadingForm ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <form id="branch-form" onSubmit={handleSubmit(handleSaveBranchForm)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextFieldForm<IBranchForm>
                  name="name"
                  control={control}
                  label="Nombre (Ej: Sucursal centro)"
                  required
                  fullWidth
                  size="small"
                  disabled={isFormDisabled}
                />
              </Grid>

              <Grid item xs={12}>
                <TextFieldForm<IBranchForm>
                  name="address"
                  control={control}
                  label="Dirección completa"
                  required
                  fullWidth
                  size="small"
                  disabled={isFormDisabled}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <PhoneInputForm
                  name="contactPhone"
                  control={control}
                  label="Teléfono del responsable"
                  required
                  fullWidth
                  size="small"
                  disabled={isFormDisabled}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="contactPerson"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ""}
                      label="Responsable en sitio"
                      fullWidth
                      size="small"
                      disabled={isFormDisabled}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ""}
                      label="Referencias"
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      disabled={isFormDisabled}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}
                >
                  Áreas
                </Typography>
                {areasErrorMessage && (
                  <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                    {areasErrorMessage}
                  </Typography>
                )}
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {areaFields.map((areaField, areaIndex) => (
                    <Box key={areaField.id} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <TextFieldForm<IBranchForm>
                        control={control}
                        name={`areas.${areaIndex}.name`}
                        label="Nombre del área"
                        fullWidth
                        size="small"
                        disabled={isFormDisabled}
                      />
                      <Controller
                        name={`areas.${areaIndex}.description`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            value={field.value ?? ""}
                            label="Descripción"
                            fullWidth
                            size="small"
                            disabled={isFormDisabled}
                          />
                        )}
                      />
                      <IconButton
                        aria-label={`Eliminar área ${areaIndex + 1}`}
                        color="error"
                        size="small"
                        sx={{ mt: 0.5, ...pressFeedback }}
                        disabled={isFormDisabled}
                        onClick={() => removeArea(areaIndex)}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
                <Button
                  startIcon={<AddCircleOutline />}
                  size="small"
                  sx={{ mt: 1, ...pressFeedback }}
                  disabled={isFormDisabled}
                  onClick={() => appendArea({ name: "", description: null })}
                >
                  Agregar área
                </Button>
                {isEditing && (
                  <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.5 }}>
                    Un área con dispositivos instalados no se puede eliminar.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </form>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} sx={pressFeedback}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="branch-form"
          variant="contained"
          color="primary"
          disabled={isFormDisabled}
          sx={pressFeedback}
        >
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
