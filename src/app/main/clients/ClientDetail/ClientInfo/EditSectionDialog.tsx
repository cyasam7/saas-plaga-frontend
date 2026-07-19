import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  MenuItem,
} from "@mui/material"
import { useEffect } from "react"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import TextFieldForm from "app/shared-components/Form/TextFieldForm/TextFieldForm"
import PhoneInputForm from "app/shared-components/Form/PhoneInputForm/PhoneInputForm"
import CheckboxForm from "app/shared-components/Form/CheckboxForm/CheckboxForm"
import { Client } from "../../types"
import { FormClientValues, baseClientObject } from "../../Forms/NewClientForm/types"
import { clientToFormValues } from "../../Forms/NewClientForm/mapper"

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"
const pressFeedback = {
  transition: `transform 160ms ${EASE_OUT}`,
  "&:active": { transform: "scale(0.97)" },
}

export type ClientSection = "general" | "fiscal" | "business" | "contact"

// Per-section validation schemas derived from the base client object. Each one
// validates only its own fields so that editing one section never trips
// cross-section requirements (e.g. an individual's fiscal edit shouldn't demand
// their phone). Values are normalized here (empty -> undefined) before merge.
const sectionSchemas: Record<ClientSection, z.ZodTypeAny> = {
  general: baseClientObject.pick({ name: true }),
  fiscal: baseClientObject.pick({ legalName: true, rfc: true, taxpayerType: true }),
  business: baseClientObject.pick({ businessActivity: true, requiresCompliance: true }),
  contact: baseClientObject
    .pick({ phone: true, email: true, ownerName: true, propertyType: true })
    .superRefine((data, ctx) => {
      if (!data.phone || data.phone.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingrese un número de teléfono válido",
          path: ["phone"],
        })
      }
    }),
}

const SECTION_TITLES: Record<ClientSection, string> = {
  general: "Editar información general",
  fiscal: "Editar información fiscal",
  business: "Editar detalles de la empresa",
  contact: "Editar información de contacto",
}

interface EditSectionDialogProps {
  open: boolean
  section: ClientSection | null
  client: Client
  onClose: () => void
  onSave: (values: FormClientValues) => Promise<void> | void
}

export function EditSectionDialog({ open, section, client, onClose, onSave }: EditSectionDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormClientValues>({
    resolver: section
      ? (zodResolver(sectionSchemas[section]) as unknown as Resolver<FormClientValues>)
      : undefined,
    defaultValues: clientToFormValues(client),
  })

  // Re-seed the form each time the dialog opens or targets a different section,
  // so it always reflects the latest persisted client data.
  useEffect(() => {
    if (open) {
      reset(clientToFormValues(client))
    }
  }, [open, section, client, reset])

  if (!section) return null

  // The section resolver strips `values` down to the edited fields (normalized).
  // Merge them over the full baseline so the POST carries the complete client —
  // preserving `locations` so the backend's branch re-sync stays lossless.
  async function onSubmit(values: FormClientValues) {
    await onSave({ ...clientToFormValues(client), ...values })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {SECTION_TITLES[section]}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <form id="edit-section-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ pt: 0.5 }}>
            {section === "general" && (
              <Grid item xs={12}>
                <TextFieldForm
                  control={control}
                  name="name"
                  label="Nombre"
                  required
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />
              </Grid>
            )}

            {section === "fiscal" && (
              <>
                <Grid item xs={12}>
                  <TextFieldForm
                    control={control}
                    name="legalName"
                    label="Razón social"
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextFieldForm
                    control={control}
                    name="rfc"
                    label="RFC"
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextFieldForm
                    control={control}
                    name="taxpayerType"
                    label="Tipo de persona"
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                    select
                  >
                    <MenuItem value="">Sin especificar</MenuItem>
                    <MenuItem value="fisica">Física</MenuItem>
                    <MenuItem value="moral">Moral</MenuItem>
                  </TextFieldForm>
                </Grid>
              </>
            )}

            {section === "business" && (
              <>
                <Grid item xs={12}>
                  <TextFieldForm
                    control={control}
                    name="businessActivity"
                    label="Giro"
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CheckboxForm
                    control={control}
                    name="requiresCompliance"
                    label="Requiere cumplimiento normativo"
                    disabled={isSubmitting}
                  />
                </Grid>
              </>
            )}

            {section === "contact" && (
              <>
                <Grid item xs={12} sm={6}>
                  <PhoneInputForm
                    control={control}
                    name="phone"
                    label="Teléfono"
                    required
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextFieldForm
                    control={control}
                    name="email"
                    label="Correo electrónico"
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextFieldForm
                    control={control}
                    name="ownerName"
                    label="Nombre del dueño de la propiedad"
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextFieldForm
                    control={control}
                    name="propertyType"
                    label="Tipo de propiedad"
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                    select
                  >
                    <MenuItem value="">Sin especificar</MenuItem>
                    <MenuItem value="house">Casa</MenuItem>
                    <MenuItem value="apartment">Departamento</MenuItem>
                  </TextFieldForm>
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting} sx={pressFeedback}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="edit-section-form"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={pressFeedback}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditSectionDialog
