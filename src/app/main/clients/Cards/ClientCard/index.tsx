import React from "react"
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
} from "@mui/material"
import {
  Business,
  Person,
  MoreVert,
  Email,
  Phone,
  LocationOn,
  Work,
  HomeWork,
  Badge,
  ArrowForward,
} from "@mui/icons-material"
import { ClientCardProps } from "./types"
import { PROPERTY_TYPE_LABELS } from "../../types"
import { useNavigate } from "react-router"

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"

const InfoRow = ({
  icon,
  primary,
  secondary,
  color,
}: {
  icon: React.ReactNode
  primary?: React.ReactNode
  secondary?: string
  color: "primary" | "secondary"
}) => {
  if (!primary) return null
  return (
    <ListItem disableGutters sx={{ py: 0.25 }}>
      <ListItemIcon sx={{ minWidth: 32 }}>{icon}</ListItemIcon>
      <ListItemText
        primary={primary}
        secondary={secondary}
        primaryTypographyProps={{ variant: "body2", sx: { fontWeight: 500 } }}
        secondaryTypographyProps={{ variant: "caption" }}
      />
    </ListItem>
  )
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onMenuOpen }) => {
  const isBusiness = client.type === "business"
  const navigate = useNavigate()
  const accent = isBusiness ? "primary" : "secondary"

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        transition: `box-shadow 220ms ${EASE_OUT}, transform 220ms ${EASE_OUT}`,
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          bgcolor: `${accent}.main`,
        },
        "@media (hover: hover) and (pointer: fine)": {
          "&:hover": {
            boxShadow: 6,
            transform: "translateY(-4px)",
          },
        },
      }}
    >
      <CardHeader
        sx={{ pb: 0 }}
        avatar={
          <Box sx={{ color: `${accent}.main`, display: "flex" }}>
            {isBusiness ? <Business sx={{ fontSize: 36 }} /> : <Person sx={{ fontSize: 36 }} />}
          </Box>
        }
        action={
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Chip
              label={isBusiness ? "Empresa (B2B)" : "Residencial"}
              size="small"
              color={accent}
              variant="outlined"
              sx={{ height: 24, "& .MuiChip-label": { px: 1, fontWeight: 500 } }}
            />
            <IconButton size="small" onClick={(e) => onMenuOpen(e, client.id)} color={accent}>
              <MoreVert />
            </IconButton>
          </Stack>
        }
        title={
          <Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 1 }}>
            {client.name}
          </Typography>
        }
        subheader={
          client.legalName ? (
            <Typography variant="caption" color="text.secondary">
              {client.legalName}
            </Typography>
          ) : null
        }
      />
      <CardContent sx={{ flexGrow: 1, pt: 1, pb: 1 }}>
        <List dense disablePadding>
          <InfoRow
            color={accent}
            icon={<Badge fontSize="small" color={accent} />}
            primary={client.rfc}
            secondary="RFC"
          />
          {isBusiness && (
            <InfoRow
              color={accent}
              icon={<Work fontSize="small" color={accent} />}
              primary={client.businessActivity}
              secondary="Giro"
            />
          )}
          {!isBusiness && (
            <>
              <InfoRow
                color={accent}
                icon={<Person fontSize="small" color={accent} />}
                primary={client.ownerName}
                secondary="Dueño de la propiedad"
              />
              <InfoRow
                color={accent}
                icon={<HomeWork fontSize="small" color={accent} />}
                primary={client.propertyType ? PROPERTY_TYPE_LABELS[client.propertyType] : undefined}
                secondary="Tipo de propiedad"
              />
            </>
          )}

          {(client.email || client.phone || client.address) && <Divider sx={{ my: 1 }} />}

          <InfoRow color={accent} icon={<Email fontSize="small" color={accent} />} primary={client.email} />
          <InfoRow color={accent} icon={<Phone fontSize="small" color={accent} />} primary={client.phone} />
          <InfoRow color={accent} icon={<LocationOn fontSize="small" color={accent} />} primary={client.address} />
        </List>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          endIcon={<ArrowForward />}
          onClick={() => navigate(`/clients/${client.id}`)}
          color={accent}
          variant="contained"
          fullWidth
          sx={{
            transition: `transform 160ms ${EASE_OUT}`,
            "&:active": { transform: "scale(0.97)" },
          }}
        >
          {isBusiness ? "Ver Sucursales" : "Ver Detalles"}
        </Button>
      </CardActions>
    </Card>
  )
}
