import { displayToast } from "@fuse/core/FuseMessage/DisplayToast";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AxiosFetcher } from "src/app/shared/fetcher";
import { OrderService } from "src/app/shared/services/OrderService";

export default function ViewReportOrder() {
  const { orderId } = useParams();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await AxiosFetcher({
          url: `/order/fumigation-report/${orderId}`,
          method: 'GET',
          responseType: 'arraybuffer'
        });

        const blob = new Blob([response as any], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        console.log(err);
      }
    };
    fetchPdf();
  }, []);

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
