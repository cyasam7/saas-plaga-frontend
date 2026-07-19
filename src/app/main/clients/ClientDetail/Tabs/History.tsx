import { CalendarMonth, Visibility } from "@mui/icons-material"
import {
  Box,
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useQuery } from "react-query"
import dayjs from "dayjs"
import { DATE_FORMAT } from "src/app/shared-constants/dateFormat"
import ChipOrder from "src/app/main/orders/components/ChipOrder/ChipOrder"
import { ClientService } from "src/app/shared/services/ClientService"
import { ClientOrderHistoryResponse } from "src/app/shared/entities/ClientOrderHistory"
import { OrderHistoryDetailDialog } from "./OrderHistoryDetailDialog"

interface HistoryTabProps {
  clientId?: string
}

function EmptyState() {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <CalendarMonth sx={{ fontSize: 48, color: "success.main", mb: 1 }} />
      <Typography variant="h6" color="success.main" gutterBottom>
        Historial de Servicios
      </Typography>
      <Typography color="text.secondary">Este cliente no tiene órdenes registradas.</Typography>
    </Box>
  )
}

function LoadingRows() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <TableRow key={i}>
          {[1, 2, 3, 4, 5].map((j) => (
            <TableCell key={j}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export const HistoryTab = ({ clientId }: HistoryTabProps) => {
  const [selectedOrder, setSelectedOrder] = useState<ClientOrderHistoryResponse | null>(null)

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["client-orders-history", clientId],
    queryFn: () => ClientService.getOrdersHistory(clientId as string),
    enabled: Boolean(clientId),
  })

  if (!isLoading && orders.length === 0) {
    return <EmptyState />
  }

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Folio</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Fumigador</TableCell>
              <TableCell>Estatus</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <LoadingRows />
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.folioNumber || "—"}</TableCell>
                  <TableCell>{dayjs(order.date).format(DATE_FORMAT)}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={order.assigned?.name ? "text.primary" : "text.secondary"}
                    >
                      {order.assigned?.name || "Sin asignar"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ChipOrder status={order.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<Visibility fontSize="small" />}
                      onClick={() => setSelectedOrder(order)}
                    >
                      Ver más
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <OrderHistoryDetailDialog
        open={Boolean(selectedOrder)}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </Box>
  )
}
