import { Box, Grid, Skeleton } from '@mui/material';

export const ProductsLoading = () => {
  return (
    <Grid container spacing={2}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              bgcolor: 'background.paper',
              p: 2,
              boxShadow: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="70%" height={20} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
              <Skeleton variant="circular" width={24} height={24} sx={{ mt: 0.5 }} />
              <Skeleton variant="text" width="100%" height={60} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}; 