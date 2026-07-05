import { Box, Typography, Button } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import AddIcon from '@mui/icons-material/Add';

interface PestTypesEmptyProps {
  onAddNew: () => void;
}

export const PestTypesEmpty = ({ onAddNew }: PestTypesEmptyProps) => {
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
      <BugReportIcon
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
        No hay tipos de plaga
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400 }}
      >
        Comienza creando tu primer tipo de plaga para organizar mejor tus registros
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
        Crear primer tipo de plaga
      </Button>
    </Box>
  );
}; 