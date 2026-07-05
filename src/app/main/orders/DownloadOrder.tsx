import React from 'react'
import { useParams } from 'react-router';

const DownloadOrder = () => {
  const { orderId } = useParams();


  return (
    <div>descargar orden de servicio {orderId}</div>
  )
}

export default DownloadOrder