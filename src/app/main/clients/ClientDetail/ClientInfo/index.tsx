import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Skeleton,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  alpha,
} from "@mui/material"
import {
  Business,
  Person,
  LocationOn,
  Email,
  Phone,
  Badge,
  AccountBalance,
  Work,
  VerifiedUser,
  HomeWork,
  Edit,
} from "@mui/icons-material"
import { useState } from "react"
import { Client, CLIENT_TYPE_LABELS, PROPERTY_TYPE_LABELS, TAXPAYER_TYPE_LABELS } from "../../types"
import { FormClientValues } from "../../Forms/NewClientForm/types"
import { EditSectionDialog, ClientSection } from "./EditSectionDialog"

interface ClientInfoProps {
  client: Client | null
  loading: boolean
  onSave?: (values: FormClientValues) => Promise<void> | void
}

type Accent = "primary" | "secondary"

function InfoItem({
  icon,
  primary,
  secondary,
  accent,
}: {
  icon: React.ReactNode
  primary?: React.ReactNode
  secondary: string
  accent: Accent
}) {
  if (primary === undefined || primary === null || primary === "") return null
  return (
    <ListItem disableGutters sx={{ py: 0.5 }}>
      <ListItemIcon sx={{ minWidth: 36, color: `${accent}.main` }}>{icon}</ListItemIcon>
      <ListItemText
        primary={primary}
        secondary={secondary}
        primaryTypographyProps={{ variant: "body2", sx: { fontWeight: 500 } }}
        secondaryTypographyProps={{ variant: "caption", sx: { opacity: 0.8 } }}
      />
    </ListItem>
  )
}

function InfoCard({
  title,
  icon,
  accent,
  action,
  children,
}: {
  title: string
  icon: React.ReactNode
  accent: Accent
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600, color: `${accent}.main` }}
          >
            {icon}
            {title}
          </Typography>
          {action}
        </Box>
        <List dense disablePadding>
          {children}
        </List>
      </CardContent>
    </Card>
  )
}

function EditButton({ onClick, accent, label }: { onClick: () => void; accent: Accent; label: string }) {
  return (
    <Tooltip title={label}>
      <IconButton
        size="small"
        color={accent}
        onClick={onClick}
        aria-label={label}
        sx={{ transition: "transform 160ms cubic-bezier(0.23, 1, 0.32, 1)", "&:active": { transform: "scale(0.92)" } }}
      >
        <Edit fontSize="small" />
      </IconButton>
    </Tooltip>
  )
}

function ClientInfoSkeleton() {
  return (
    <Box>
      <Paper sx={{ p: 2.5, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={220} height={32} />
            <Skeleton variant="rounded" width={120} height={22} sx={{ mt: 0.5 }} />
          </Box>
        </Box>
      </Paper>
      <Grid container spacing={3}>
        {[1, 2].map((i) => (
          <Grid item xs={12} md={6} key={i}>
            <Card variant="outlined">
              <CardContent>
                <Skeleton variant="text" width="50%" height={28} sx={{ mb: 1 }} />
                {[1, 2, 3].map((j) => (
                  <Box key={j} sx={{ display: "flex", alignItems: "center", gap: 2, py: 0.75 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="70%" />
                      <Skeleton variant="text" width="35%" />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export function ClientInfo({ client, loading, onSave }: ClientInfoProps) {
  const [editingSection, setEditingSection] = useState<ClientSection | null>(null)

  if (loading || !client) {
    return <ClientInfoSkeleton />
  }

  const isBusiness = client.type === "business"
  const accent: Accent = isBusiness ? "primary" : "secondary"
  const canEdit = Boolean(onSave)

  return (
    <Box paddingBottom={2}>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2,
          color: "common.white",
          borderRadius: 1,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette[accent].main}, ${theme.palette[accent].dark})`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              p: 1,
              borderRadius: "50%",
              bgcolor: (theme) => alpha(theme.palette.common.white, 0.15),
            }}
          >
            {isBusiness ? <Business sx={{ fontSize: 32 }} /> : <Person sx={{ fontSize: 32 }} />}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {client.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75 }}>
              <Chip
                label={CLIENT_TYPE_LABELS[client.type]}
                size="small"
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.common.white, 0.18),
                  color: "common.white",
                  height: 24,
                  fontWeight: 500,
                  "& .MuiChip-label": { px: 1 },
                }}
              />
            </Box>
          </Box>
          {canEdit && (
            <Tooltip title="Editar información general">
              <IconButton
                aria-label="Editar información general"
                onClick={() => setEditingSection("general")}
                sx={{
                  color: "common.white",
                  bgcolor: (theme) => alpha(theme.palette.common.white, 0.15),
                  transition: "transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background-color 200ms ease",
                  "&:hover": { bgcolor: (theme) => alpha(theme.palette.common.white, 0.28) },
                  "&:active": { transform: "scale(0.92)" },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InfoCard
            title="Información fiscal"
            icon={<Badge fontSize="small" />}
            accent={accent}
            action={canEdit && <EditButton accent={accent} label="Editar información fiscal" onClick={() => setEditingSection("fiscal")} />}
          >
            <InfoItem accent={accent} icon={<Business fontSize="small" />} primary={client.legalName} secondary="Razón social" />
            <InfoItem accent={accent} icon={<AccountBalance fontSize="small" />} primary={client.rfc} secondary="RFC" />
            <InfoItem
              accent={accent}
              icon={<Person fontSize="small" />}
              primary={client.taxpayerType ? TAXPAYER_TYPE_LABELS[client.taxpayerType] : undefined}
              secondary="Tipo de persona"
            />
            {!client.legalName && !client.rfc && !client.taxpayerType && (
              <Typography variant="body2" color="text.secondary">
                Sin información fiscal registrada.
              </Typography>
            )}
          </InfoCard>
        </Grid>

        <Grid item xs={12} md={6}>
          {isBusiness ? (
            <InfoCard
              title="Detalles de la empresa"
              icon={<Business fontSize="small" />}
              accent={accent}
              action={canEdit && <EditButton accent={accent} label="Editar detalles de la empresa" onClick={() => setEditingSection("business")} />}
            >
              <InfoItem accent={accent} icon={<Work fontSize="small" />} primary={client.businessActivity} secondary="Giro" />
              <InfoItem
                accent={accent}
                icon={<VerifiedUser fontSize="small" />}
                primary={client.requiresCompliance ? "Sí" : "No"}
                secondary="Requiere cumplimiento normativo"
              />
            </InfoCard>
          ) : (
            <InfoCard
              title="Información de contacto"
              icon={<LocationOn fontSize="small" />}
              accent={accent}
              action={canEdit && <EditButton accent={accent} label="Editar información de contacto" onClick={() => setEditingSection("contact")} />}
            >
              <InfoItem accent={accent} icon={<Phone fontSize="small" />} primary={client.phone} secondary="Teléfono" />
              <InfoItem accent={accent} icon={<Email fontSize="small" />} primary={client.email} secondary="Correo electrónico" />
              <InfoItem accent={accent} icon={<Person fontSize="small" />} primary={client.ownerName || "No especificado"} secondary="Dueño de la propiedad" />
              <InfoItem
                accent={accent}
                icon={<HomeWork fontSize="small" />}
                primary={client.propertyType ? PROPERTY_TYPE_LABELS[client.propertyType] : "No especificado"}
                secondary="Tipo de propiedad"
              />
            </InfoCard>
          )}
        </Grid>
      </Grid>

      {onSave && (
        <EditSectionDialog
          open={editingSection !== null}
          section={editingSection}
          client={client}
          onClose={() => setEditingSection(null)}
          onSave={onSave}
        />
      )}
    </Box>
  )
}

export default ClientInfo
