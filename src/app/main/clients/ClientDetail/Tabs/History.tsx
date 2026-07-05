import { CalendarMonth } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Typography } from "@mui/material"



export const HistoryTab = () => {
  return <Box sx={{ p: 2, textAlign: 'center' }}>
    <CalendarMonth sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
    <Typography variant="h6" color="success.main" gutterBottom>
      Historial de Servicios
    </Typography>
    <Typography color="text.secondary">
      Aquí se mostrará el historial de servicios y mantenimientos
    </Typography>
  </Box>
}