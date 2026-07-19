import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Divider,
  Box,
  Chip,
} from "@mui/material"
import dayjs from "dayjs"
import { DATE_TIME_FORMAT, DATE_FORMAT } from "src/app/shared-constants/dateFormat"
import { formatCurrency } from "src/app/shared-constants/formatCurrency"
import ChipOrder from "src/app/main/orders/components/ChipOrder/ChipOrder"
import {
  ClientOrderHistoryResponse,
  ClientOrderHistorySimpleCatalog,
} from "src/app/shared/entities/ClientOrderHistory"

interface OrderHistoryDetailDialogProps {
  open: boolean
  order: ClientOrderHistoryResponse | null
  onClose: () => void
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === undefined || value === null || value === "") return null
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography variant="body2">{value}</Typography>
      ) : (
        value
      )}
    </Stack>
  )
}

function CatalogChips({ items }: { items?: ClientOrderHistorySimpleCatalog[] }) {
  if (!items || items.length === 0) return null
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
      {items.map((item) => (
        <Chip key={item.id} label={item.label} size="small" variant="outlined" />
      ))}
    </Box>
  )
}

export function OrderHistoryDetailDialog({ open, order, onClose }: OrderHistoryDetailDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Detalle de la orden
          </Typography>
          {order && <ChipOrder status={order.status} />}
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {order && (
          <Stack spacing={2}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Field label="Folio" value={order.folioNumber || "Sin folio"} />
              <Field label="Fumigador" value={order.assigned?.name || "Sin asignar"} />
              <Field label="Fecha" value={dayjs(order.date).format(DATE_TIME_FORMAT)} />
              <Field label="Costo" value={`$ ${formatCurrency(order.price)}`} />
            </Box>

            <Divider />

            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Información del cliente
            </Typography>
            <Stack spacing={0.25}>
              <Typography variant="body2">{order.clientName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {order.clientAddress}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tel. {order.clientPhone}
              </Typography>
            </Stack>

            {(order.servicesType?.length || order.applicationsType?.length || order.pests?.length) ? (
              <>
                <Divider />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Información del servicio
                </Typography>
                <Field label="Tipos de servicio" value={<CatalogChips items={order.servicesType} />} />
                <Field label="Tipos de aplicación" value={<CatalogChips items={order.applicationsType} />} />
                <Field label="Plagas atendidas" value={<CatalogChips items={order.pests} />} />
              </>
            ) : null}

            {order.productsApplied && order.productsApplied.length > 0 && (
              <>
                <Divider />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Productos aplicados
                </Typography>
                <Stack spacing={1}>
                  {order.productsApplied.map((product) => (
                    <Box key={product.id}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.productName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.chemicalName} · Dosis: {product.productDose}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </>
            )}

            <Divider />
            <Field
              label="¿Tuvo seguimiento?"
              value={order.isFollowUp ? "Sí" : "No"}
            />
            {order.dateFollowUp && (
              <Field label="Fecha de seguimiento" value={dayjs(order.dateFollowUp).format(DATE_FORMAT)} />
            )}
            <Field label="Observaciones" value={order.observations} />
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderHistoryDetailDialog
