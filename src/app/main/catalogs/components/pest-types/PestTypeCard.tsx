import { Box, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IPestType } from '../types';

interface PestTypeCardProps {
  pest: IPestType;
  onEdit: (pest: IPestType) => void;
  onDelete: (pest: IPestType) => void;
}

export const PestTypeCard = ({ pest, onEdit, onDelete }: PestTypeCardProps) => {
  return (
    <Grid item xs={12} sm={6} md={4} key={pest.id}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3
          }
        }}
      >
        <CardHeader
          avatar={
            <BugReportIcon
              color="primary"
              sx={{
                fontSize: 32,
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                borderRadius: '50%',
                p: 0.5
              }}
            />
          }
          title={
            <Typography variant="h6" component="div">
              {pest.name}
            </Typography>
          }
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <DescriptionIcon
              fontSize="small"
              color="action"
              sx={{
                mt: 0.5,
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderRadius: '50%',
                p: 0.5
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {pest.description}
            </Typography>
          </Box>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: 'flex-end',
            borderTop: 1,
            borderColor: 'divider',
            px: 2,
            py: 1,
            gap: 1
          }}
        >
          <Tooltip title="Editar tipo de plaga" arrow>
            <IconButton
              aria-label="editar"
              onClick={() => onEdit(pest)}
              color="primary"
              size="small"
              sx={{
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar tipo de plaga" arrow>
            <IconButton
              aria-label="eliminar"
              color="error"
              size="small"
              onClick={() => onDelete(pest)}
              sx={{
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.main',
                  color: 'error.contrastText',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Grid>
  );
}; 