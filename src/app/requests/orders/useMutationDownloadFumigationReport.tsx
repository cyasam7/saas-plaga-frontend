import { useMutation } from 'react-query';

import { AxiosFetcher } from 'src/app/shared/fetcher';

export interface IDownloadFumigationReportPayload {
  orderId: string;
}

/** PDF de la orden de servicio. */
export type IDownloadFumigationReportResponse = Blob;

/** `GET /order/fumigation-report/:orderId`: genera la orden de servicio en PDF (bajo demanda, por eso es mutación). */
export const useMutationDownloadFumigationReport = () => {
  return useMutation<IDownloadFumigationReportResponse, unknown, IDownloadFumigationReportPayload>({
    mutationFn: (payload: IDownloadFumigationReportPayload) =>
      AxiosFetcher<IDownloadFumigationReportResponse>({
        url: `/order/fumigation-report/${payload.orderId}`,
        method: 'GET',
        responseType: 'blob'
      })
  });
};
