import { Card, CardHeader, CardContent, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Box, Chip, Stack } from "@mui/material"
import { MoreVert, Phone, LocationOn, Person, Store } from "@mui/icons-material"
import { BranchCardProps } from "./types"

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"

export function BranchCard({ branch, onMenuClick }: BranchCardProps) {
  return (
    <Card sx={{
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
        bgcolor: "primary.main",
      },
      "@media (hover: hover) and (pointer: fine)": {
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      },
    }}>
      <CardHeader
        sx={{ pb: 0 }}
        avatar={
          <Box sx={{ color: "primary.main", display: "flex" }}>
            <Store sx={{ fontSize: 36 }} />
          </Box>
        }
        action={
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Chip
              label="Ubicación"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ height: 24, "& .MuiChip-label": { px: 1, fontWeight: 500 } }}
            />
            <IconButton
              size="small"
              onClick={(event) => onMenuClick(event, branch.id)}
              color="primary"
            >
              <MoreVert />
            </IconButton>
          </Stack>
        }
        title={
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {branch.name}
          </Typography>
        }
      />
      <CardContent sx={{ flexGrow: 1, pt: 1, pb: 1 }}>
        <List dense disablePadding>
          {branch.address && (
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <LocationOn fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary={branch.address} primaryTypographyProps={{ variant: "body2", sx: { fontWeight: 500 } }} />
            </ListItem>
          )}
          {branch.contactPerson && (
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Person fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={branch.contactPerson}
                secondary="Responsable"
                primaryTypographyProps={{ variant: "body2", sx: { fontWeight: 500 } }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>
          )}
          {branch.contactPhone && (
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Phone fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary={branch.contactPhone} primaryTypographyProps={{ variant: "body2", sx: { fontWeight: 500 } }} />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  )
}

