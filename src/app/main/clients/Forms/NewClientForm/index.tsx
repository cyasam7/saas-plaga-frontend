import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  MenuItem,
  Paper,
  Box,
  IconButton,
  Stack,
  alpha,
} from "@mui/material"
import {
  Add,
  DeleteOutline,
  AddCircleOutline,
  BusinessRounded,
  HomeRounded,
  PlaceOutlined,
  CheckCircleRounded,
} from "@mui/icons-material"
import { useForm, useFieldArray, Control, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormClientValues, NewClientFormProps, formSchema } from "./types"
import { useEffect } from "react"
import PhoneInputForm from "app/shared-components/Form/PhoneInputForm/PhoneInputForm"
import TextFieldForm from "app/shared-components/Form/TextFieldForm/TextFieldForm"
import CheckboxForm from "app/shared-components/Form/CheckboxForm/CheckboxForm"

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"

// Subtle entrance for dynamically added rows/cards. Movement is removed under
// reduced-motion; opacity stays to keep the appearance comprehensible.
const enterAnimation = {
  animation: `clientFadeInUp 240ms ${EASE_OUT}`,
  "@keyframes clientFadeInUp": {
    from: { opacity: 0, transform: "translateY(8px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@media (prefers-reduced-motion: reduce)": {
    animation: "clientFade 200ms ease",
    "@keyframes clientFade": { from: { opacity: 0 }, to: { opacity: 1 } },
  },
}

const pressFeedback = {
  transition: `transform 160ms ${EASE_OUT}`,
  "&:active": { transform: "scale(0.97)" },
}

const resetValues: FormClientValues = {
  type: "individual",
  name: "",
  legalName: "",
  taxpayerType: undefined,
  rfc: "",
  businessActivity: "",
  requiresCompliance: false,
  locations: [],
  email: undefined,
  phone: "",
  ownerName: "",
  propertyType: undefined,
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {children}
      </Typography>
      {action}
    </Box>
  )
}

const TYPE_OPTIONS = [
  {
    value: "business" as const,
    title: "Empresa (B2B)",
    description: "Con ubicaciones y áreas",
    Icon: BusinessRounded,
  },
  {
    value: "individual" as const,
    title: "Residencial",
    description: "Casa o departamento",
    Icon: HomeRounded,
  },
]

function ClientTypeSelector({ control, disabled }: { control: Control<FormClientValues>; disabled?: boolean }) {
  return (
    <Controller
      control={control}
      name="type"
      render={({ field }) => (
        <Grid container spacing={2}>
          {TYPE_OPTIONS.map(({ value, title, description, Icon }) => {
            const selected = field.value === value
            return (
              <Grid item xs={6} key={value}>
                <Paper
                  variant="outlined"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={disabled ? -1 : 0}
                  onClick={() => !disabled && field.onChange(value)}
                  onKeyDown={(e) => {
                    if (!disabled && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault()
                      field.onChange(value)
                    }
                  }}
                  sx={{
                    position: "relative",
                    p: 2,
                    cursor: disabled ? "default" : "pointer",
                    borderWidth: 2,
                    borderColor: selected ? "primary.main" : "divider",
                    bgcolor: (theme) => (selected ? alpha(theme.palette.primary.main, 0.06) : "background.paper"),
                    transition: `border-color 200ms ${EASE_OUT}, background-color 200ms ${EASE_OUT}, transform 160ms ${EASE_OUT}`,
                    "&:active": { transform: disabled ? "none" : "scale(0.985)" },
                    "@media (hover: hover) and (pointer: fine)": {
                      "&:hover": { borderColor: selected ? "primary.main" : "text.disabled" },
                    },
                  }}
                >
                  {selected && (
                    <CheckCircleRounded
                      color="primary"
                      sx={{ position: "absolute", top: 8, right: 8, fontSize: 20 }}
                    />
                  )}
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Icon sx={{ fontSize: 28, color: selected ? "primary.main" : "text.secondary" }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                        {title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      )}
    />
  )
}

function AreasFieldArray({ control, locationIndex }: { control: Control<FormClientValues>; locationIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `locations.${locationIndex}.areas`,
  })

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>
        Áreas
      </Typography>
      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
          Sin áreas registradas.
        </Typography>
      )}
      <Stack spacing={1} sx={{ mt: 1 }}>
        {fields.map((field, areaIndex) => (
          <Box key={field.id} sx={{ display: "flex", alignItems: "center", gap: 1, ...enterAnimation }}>
            <TextFieldForm<FormClientValues>
              control={control}
              name={`locations.${locationIndex}.areas.${areaIndex}.name`}
              label="Nombre del área"
              fullWidth
              size="small"
            />
            <IconButton color="error" size="small" sx={pressFeedback} onClick={() => remove(areaIndex)}>
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>
      <Button
        startIcon={<AddCircleOutline />}
        size="small"
        sx={{ mt: 1, ...pressFeedback }}
        onClick={() => append({ name: "", description: "" })}
      >
        Agregar área
      </Button>
    </Box>
  )
}

function LocationsFieldArray({ control, disabled }: { control: Control<FormClientValues>; disabled?: boolean }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "locations",
  })

  const addLocation = () =>
    append({ name: "", address: "", contactPhone: "", contactPerson: "", references: "", areas: [] })

  return (
    <Box>
      <SectionTitle
        action={
          fields.length > 0 ? (
            <Button startIcon={<Add />} variant="outlined" size="small" sx={pressFeedback} onClick={addLocation}>
              Agregar ubicación
            </Button>
          ) : undefined
        }
      >
        Ubicaciones
      </SectionTitle>

      {fields.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderStyle: "dashed",
            bgcolor: "background.default",
          }}
        >
          <PlaceOutlined sx={{ fontSize: 36, color: "text.disabled", mb: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Aún no has agregado ubicaciones. Cada empresa necesita al menos una.
          </Typography>
          <Button startIcon={<Add />} variant="contained" size="small" sx={pressFeedback} onClick={addLocation}>
            Agregar ubicación
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {fields.map((field, index) => (
            <Paper key={field.id} variant="outlined" sx={{ p: 2.5, ...enterAnimation }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Ubicación {index + 1}
                </Typography>
                <IconButton color="error" size="small" sx={pressFeedback} onClick={() => remove(index)}>
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextFieldForm<FormClientValues>
                    control={control}
                    name={`locations.${index}.name`}
                    label="Nombre (Ej: Sucursal centro)"
                    required
                    fullWidth
                    size="small"
                    disabled={disabled}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextFieldForm<FormClientValues>
                    control={control}
                    name={`locations.${index}.address`}
                    label="Dirección completa"
                    required
                    fullWidth
                    size="small"
                    disabled={disabled}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PhoneInputForm
                    control={control}
                    name={`locations.${index}.contactPhone`}
                    label="Teléfono del responsable"
                    required
                    fullWidth
                    size="small"
                    disabled={disabled}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextFieldForm<FormClientValues>
                    control={control}
                    name={`locations.${index}.contactPerson`}
                    label="Responsable en sitio"
                    fullWidth
                    size="small"
                    disabled={disabled}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextFieldForm<FormClientValues>
                    control={control}
                    name={`locations.${index}.references`}
                    label="Referencias"
                    fullWidth
                    size="small"
                    multiline
                    disabled={disabled}
                  />
                </Grid>
                <Grid item xs={12}>
                  <AreasFieldArray control={control} locationIndex={index} />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export function NewClientForm({ open, onClose, onSubmit, defaultValues }: NewClientFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<FormClientValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || resetValues,
  })

  useEffect(() => {
    if (open) {
      reset({ ...resetValues, ...defaultValues })
    }
  }, [defaultValues, open, reset])

  const clientType = watch("type")
  const isBusiness = clientType === "business"

  function onFormSubmit(data: FormClientValues) {
    if (onSubmit) {
      onSubmit(data)
    }
    reset(resetValues)
  }

  const handleClose = () => {
    reset(resetValues)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {defaultValues ? "Editar cliente" : "Agregar nuevo cliente"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {defaultValues
            ? "Modifique los campos para actualizar la información del cliente."
            : "Complete los campos para registrar un nuevo cliente en el sistema."}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <form id="new-client-form" onSubmit={handleSubmit(onFormSubmit)}>
          <Stack spacing={3.5}>
            <Box>
              <SectionTitle>Tipo de cliente</SectionTitle>
              <ClientTypeSelector control={control} disabled={isSubmitting} />
            </Box>

            <Box>
              <SectionTitle>Información fiscal</SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextFieldForm
                    control={control}
                    name="name"
                    label={isBusiness ? "Nombre de la empresa" : "Nombre completo"}
                    required
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextFieldForm
                    control={control}
                    name="legalName"
                    label="Razón social"
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
                  <TextFieldForm
                    control={control}
                    name="rfc"
                    label="RFC"
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>
            </Box>

            {isBusiness ? (
              <>
                <Box>
                  <SectionTitle>Detalles de la empresa</SectionTitle>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <TextFieldForm
                        control={control}
                        name="businessActivity"
                        label="Giro"
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CheckboxForm
                        control={control}
                        name="requiresCompliance"
                        label="Requiere cumplimiento normativo"
                        disabled={isSubmitting}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <LocationsFieldArray control={control} disabled={isSubmitting} />
              </>
            ) : (
              <Box>
                <SectionTitle>Información de contacto</SectionTitle>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
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
                  <Grid item xs={12} md={6}>
                    <TextFieldForm
                      control={control}
                      name="email"
                      label="Correo electrónico"
                      fullWidth
                      size="small"
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextFieldForm
                      control={control}
                      name="ownerName"
                      label="Nombre del dueño de la propiedad"
                      fullWidth
                      size="small"
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                </Grid>
              </Box>
            )}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} sx={pressFeedback}>
          Cancelar
        </Button>
        <Button type="submit" form="new-client-form" variant="contained" color="primary" sx={pressFeedback}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
