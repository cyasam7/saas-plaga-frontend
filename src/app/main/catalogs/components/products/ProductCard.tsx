import { Box, Card, CardActions, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import DescriptionIcon from '@mui/icons-material/Description';
import ScaleIcon from '@mui/icons-material/Scale';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IProduct } from '../types';

interface ProductCardProps {
  product: IProduct;
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  return (
    <Grid item xs={12} sm={6} md={4} key={product.id}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          borderRadius: 2,
          bgcolor: 'background.paper',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3
          }
        }}
      >
        <Box sx={{ p: 2, pb: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <LocalPharmacyIcon
              color="primary"
              sx={{
                fontSize: 32,
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                borderRadius: '50%',
                p: 0.5
              }}
            />
            <Box>
              <Typography variant="h6" component="div">
                {product.commercialName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.chemicalName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ScaleIcon
              fontSize="small"
              sx={{
                color: 'text.secondary',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderRadius: '50%',
                p: 0.5
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Dosis: {product.doses?.map(dose => `${dose.amount} ${dose.unit}`).join(', ')}
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1, pt: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
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
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                flex: 1,
                minHeight: 40,
                lineHeight: 1.5
              }}
            >
              {product.description}
            </Typography>
          </Box>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: 'flex-end',
            borderTop: '1px solid',
            borderColor: 'divider',
            px: 2,
            py: 1,
            gap: 1,
            bgcolor: 'background.default'
          }}
        >
          <Tooltip title="Editar producto" arrow>
            <IconButton
              aria-label="editar"
              onClick={() => onEdit(product)}
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
          <Tooltip title="Eliminar producto" arrow>
            <IconButton
              aria-label="eliminar"
              color="error"
              size="small"
              onClick={() => onDelete(product)}
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