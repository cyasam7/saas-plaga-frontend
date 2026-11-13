import { displayToast } from "app/core/feedback/toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useMutationDownloadFumigationReport } from "src/app/requests/orders/useMutationDownloadFumigationReport";

export default function ViewReportOrder() {
  const { orderId } = useParams();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { mutateAsync: downloadFumigationReport } = useMutationDownloadFumigationReport();

  useEffect(() => {
    let reportUrl: string | null = null;

    downloadFumigationReport({ orderId })
      .then((fumigationReportPdf) => {
        reportUrl = URL.createObjectURL(new Blob([fumigationReportPdf], { type: "application/pdf" }));
        setPdfUrl(reportUrl);
      })
      .catch(() => {
        // AxiosFetcher ya mostró el error.
      });

    return () => {
      if (reportUrl) URL.revokeObjectURL(reportUrl);
    };
  }, [orderId]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {pdfUrl ? (
        <embed
          src={pdfUrl}
          type="application/pdf"
          width="100%"
          height="100%"
        />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
}
