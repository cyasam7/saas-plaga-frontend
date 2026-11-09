import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import clsx from 'clsx';

type LoadingProps = {
  className?: string;
};

/**
 * Full-area loading indicator (route suspense, auth guard, `/loading` route).
 * The bounce animation is styled by `#spinner` in index.html.
 */
function Loading(props: LoadingProps) {
  const { className } = props;

  return (
    <div className={clsx(className, 'flex h-full w-full flex-1 flex-col items-center justify-center self-center p-24')}>
      <Typography
        className="-mb-16 text-13 font-medium sm:text-20"
        color="text.secondary"
      >
        Cargando
      </Typography>
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

export default Loading;
