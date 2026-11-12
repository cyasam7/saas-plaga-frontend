import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IDownloadOrderCertificatePayload {
  orderId: string;
  /** Query: `QueryParamsGenerateCertificate` (api/.../orders/infrastructure/OrderDTO.ts). */
  daysValid: number;
}

/** PDF del certificado. */
export type IDownloadOrderCertificateResponse = Blob;

/** `GET /order/certificate/:id`: genera el certificado PDF (se pide bajo demanda, por eso es mutación). */
export const useMutationDownloadOrderCertificate = () => {
  return useMutation<IDownloadOrderCertificateResponse, unknown, IDownloadOrderCertificatePayload>({
    mutationFn: (payload: IDownloadOrderCertificatePayload) =>
      AxiosFetcher<IDownloadOrderCertificateResponse>({
        url: `/order/certificate/${payload.orderId}`,
        method: 'GET',
        params: { daysValid: payload.daysValid },
        responseType: 'blob'
      })
  });
};
