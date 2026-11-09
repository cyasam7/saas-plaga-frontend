import Box from '@mui/material/Box';

/**
 * Shown while the auth session is being restored.
 * Styled by `#fuse-splash-screen` / `#spinner` in index.html (same markup as the pre-React splash).
 */
function SplashScreen() {
  return (
    <div id="fuse-splash-screen">
      <div className="logo">
        <img
          width="128"
          src="assets/images/logo/logo.svg"
          alt="logo"
        />
      </div>
      <Box
        id="spinner"
        sx={{ '& > div': { backgroundColor: 'secondary.main' } }}
      >
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </Box>
    </div>
  );
}

export default SplashScreen;
