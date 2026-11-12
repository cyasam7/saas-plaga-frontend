import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { FileDownloadOutlined } from '@mui/icons-material';

import { DatagridRowOrder } from 'src/app/shared/entities/OrderEntity';
import { validateIfOrderIsPending } from '../../utils';
import { primaryButtonSx, secondaryButtonSx } from '../utils';

interface OrderActionsProps {
	order: DatagridRowOrder;
	onAssign: (orderId: string) => void;
	onGenerateReport: (orderId: string) => void;
	/** Mobile: botones a todo lo ancho con etiqueta en el reporte. */
	isFullWidth?: boolean;
}

const REPORT_DISABLED_HINT = 'El reporte está disponible cuando la orden está terminada';

function OrderActions({ order, onAssign, onGenerateReport, isFullWidth = false }: OrderActionsProps) {
	const isPending = validateIfOrderIsPending(order.status);
	const isAssigned = Boolean(order.assignedId);
	const assignButtonSx = isAssigned ? secondaryButtonSx : primaryButtonSx;
	const sizeSx = isFullWidth ? { flex: 1, height: 44 } : { height: 32, px: 1.5 };

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: isFullWidth ? 1 : 0.5 }}>
			{isPending && (
				<Button
					variant="text"
					disableElevation
					onClick={() => onAssign(order.id)}
					sx={{ ...assignButtonSx, ...sizeSx }}
				>
					{isAssigned ? 'Reasignar' : 'Asignar'}
				</Button>
			)}

			{isFullWidth ? (
				<Tooltip title={isPending ? REPORT_DISABLED_HINT : ''}>
					<Box sx={{ flex: 1, display: 'flex' }}>
						<Button
							variant="text"
							disabled={isPending}
							startIcon={<FileDownloadOutlined />}
							onClick={() => onGenerateReport(order.id)}
							sx={{ ...secondaryButtonSx, ...sizeSx }}
						>
							Reporte
						</Button>
					</Box>
				</Tooltip>
			) : (
				<Tooltip title={isPending ? REPORT_DISABLED_HINT : 'Descargar reporte (PDF)'}>
					<span>
						<IconButton
							aria-label="Descargar reporte"
							disabled={isPending}
							onClick={() => onGenerateReport(order.id)}
							sx={{
								width: 32,
								height: 32,
								borderRadius: 'var(--radius-sm)',
								color: 'var(--fg-2)',
								'&:hover': { bgcolor: 'var(--surface-sunken)', color: 'var(--fg-1)' }
							}}
						>
							<FileDownloadOutlined fontSize="small" />
						</IconButton>
					</span>
				</Tooltip>
			)}
		</Box>
	);
}

export default OrderActions;
