import { useSyncExternalStore } from 'react';
import { amber, blue, green } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import { getToastState, hideToast, subscribeToToast, ToastVariant } from './toast';

const iconsByVariant: Record<ToastVariant, typeof InfoIcon> = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorOutlineIcon,
  info: InfoIcon
};

const backgroundColorsByVariant: Record<ToastVariant, (theme: Theme) => string> = {
  success: () => green[600],
  warning: () => amber[600],
  error: (theme) => theme.palette.error.dark,
  info: () => blue[600]
};

/**
 * Renders the toast triggered with displayToast(). Mount it once at the app root.
 */
function Toaster() {
  const { isOpen, options } = useSyncExternalStore(subscribeToToast, getToastState);
  const VariantIcon = iconsByVariant[options.variant];

  return (
    <Snackbar
      open={isOpen}
      anchorOrigin={options.anchorOrigin}
      autoHideDuration={options.autoHideDuration}
      onClose={hideToast}
      sx={{ zIndex: 99999 }}
    >
      <SnackbarContent
        sx={{ backgroundColor: backgroundColorsByVariant[options.variant], color: '#FFFFFF' }}
        message={
          <div className="flex items-center">
            <VariantIcon color="inherit" />
            <Typography className="mx-8">{options.message}</Typography>
          </div>
        }
        action={
          <IconButton
            aria-label="Cerrar"
            color="inherit"
            onClick={hideToast}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        }
      />
    </Snackbar>
  );
}

export default Toaster;
