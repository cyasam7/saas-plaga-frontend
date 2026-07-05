import type React from "react"
import { useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography } from "@mui/material"
import { BranchFormProps, FormBranchValues, formSchema } from "./types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import TextFieldForm from "src/app/shared-components/Form/TextFieldForm/TextFieldForm"
import PhoneInputForm from "src/app/shared-components/Form/PhoneInputForm/PhoneInputForm"

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"
const pressFeedback = {
  transition: `transform 160ms ${EASE_OUT}`,
  "&:active": { transform: "scale(0.97)" },
}

const defaultValues: FormBranchValues = {
  id: "",
  clientId: "",
  name: "",
  address: "",
  contactPerson: "",
  contactPhone: "",
  notes: "",
}

export function BranchForm({ open, onClose, onSave, branch, isEditing, clientId }: BranchFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormBranchValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        branch
          ? {
            id: branch.id,
            name: branch.name,
            address: branch.address,
            contactPerson: branch.contactPerson || "",
            contactPhone: branch.contactPhone,
            notes: branch.notes || "",
            clientId: clientId,
          }
          : { ...defaultValues, clientId }
      )
    }
    return () => {
      reset(defaultValues)
    }
  }, [branch, open, reset, clientId])

  function onFormSubmit(data: FormBranchValues) {
    const branchData = {
      id: data?.id || "",
      clientId: clientId,
      name: data.name,
      address: data.address,
      contactPerson: data.contactPerson || "",
      contactPhone: data.contactPhone,
      notes: data.notes || "",
    }
    onSave(branchData)
    reset(defaultValues)
  }

  const handleClose = () => {
    reset(defaultValues)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditing ? "Editar Sucursal" : "Agregar Nueva Sucursal"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEditing
            ? "Modifique los campos para actualizar la información de la sucursal."
            : "Complete los campos para registrar una nueva sucursal en el sistema."}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <form id="branch-form" onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextFieldForm<FormBranchValues>
                name="name"
                control={control}
                label="Nombre (Ej: Sucursal centro)"
                required
                fullWidth
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <TextFieldForm<FormBranchValues>
                name="address"
                control={control}
                label="Dirección completa"
                required
                fullWidth
                size="small"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextFieldForm<FormBranchValues>
                name="contactPerson"
                control={control}
                label="Responsable en sitio"
                fullWidth
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            <Grid item xs={12}>
              <TextFieldForm<FormBranchValues>
                name="notes"
                control={control}
                label="Referencias"
                fullWidth
                size="small"
                multiline
                rows={3}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} sx={pressFeedback}>
          Cancelar
        </Button>
        <Button type="submit" form="branch-form" variant="contained" color="primary" sx={pressFeedback}>
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
