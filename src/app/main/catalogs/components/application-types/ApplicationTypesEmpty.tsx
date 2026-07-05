import { Box, Typography, Button } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AddIcon from '@mui/icons-material/Add';

interface ApplicationTypesEmptyProps {
  onAddNew: () => void;
}

export const ApplicationTypesEmpty = ({ onAddNew }: ApplicationTypesEmptyProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center'
      }}
    >
      <WaterDropIcon
        sx={{
          fontSize: 64,
          color: 'text.secondary',
          mb: 2
        }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        No hay tipos de aplicación
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400 }}
      >
        Comienza creando tu primer tipo de aplicación para organizar mejor tus servicios
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddNew}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          px: 3,
          py: 1,
          boxShadow: 2,
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out'
        }}
      >
        Crear primer tipo de aplicación
      </Button>
    </Box>
  );
}; 