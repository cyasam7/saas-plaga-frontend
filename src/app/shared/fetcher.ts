import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';

export async function AxiosFetcher<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const { data } = await axios<T>(config);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const err = error as AxiosError<{ message: string }>;
      displayToast({
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top'
        },
        autoHideDuration: 2000,
        message: err.response.data?.message ?? 'Algo salio mal',
        variant: 'error'
      });
    }
    throw new Error(`Error en el request ${config.url}`);
  }
}
