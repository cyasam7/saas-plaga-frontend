import { Card, CardContent, Stack, Box, Typography, IconButton, Tooltip } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import { FileDownload, Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import { openDialog } from 'app/shared-components/GlobalDialog/openDialog';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { DatagridRowOrder, EStatusOrder } from '../../../../shared/entities/OrderEntity';
import ChipOrder from '../ChipOrder/ChipOrder';

interface MobileCardProps {
	order: DatagridRowOrder;
	onView: (id: string) => void;
	onEdit: (id: string) => void;
	onAssign: (id: string) => void;
	onFollow: (id: string) => void;
	onDownloadCertificate: (id: string) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
}

export function MobileCard({
	order,
	onView,
	onEdit,
	onAssign,
	onFollow,
	onDownloadCertificate,
	onDelete
}: MobileCardProps) {
	return (
		<Box key={order.id}>
			<Card sx={{ mb: 2, width: '100%' }}>
				<CardContent>
					<Stack spacing={1}>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography
								variant="h6"
								color="primary"
							>
								{order.client.name}
							</Typography>
							<ChipOrder status={order.status} />
						</Box>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							{order.client.address}
						</Typography>
						<Typography variant="body2">
							<strong>Fecha:</strong> {dayjs(order.date).format('DD/MM/YYYY HH:mm')}
						</Typography>
						<Typography variant="body2">
							<strong>Teléfono:</strong> {order.client.phone}
						</Typography>
						<Typography variant="body2">
							<strong>Asignado a:</strong> {order.assignedName || 'No asignado'}
						</Typography>
						<Box
							display="flex"
							gap={1}
							mt={1}
						>
							<Tooltip title="Ver">
								<IconButton
									size="small"
									aria-label="Ver"
									onClick={() => onView(order.id)}
								>
									<RemoveRedEyeIcon fontSize="small" />
								</IconButton>
							</Tooltip>
							<Tooltip title="Modificar">
								<span>
									<IconButton
										size="small"
										aria-label="Modificar"
										onClick={() => onEdit(order.id)}
										disabled={[EStatusOrder.FINISHED, EStatusOrder.CANCELED].includes(order.status)}
									>
										<NoteAltIcon fontSize="small" />
									</IconButton>
								</span>
							</Tooltip>
							<Tooltip title="Asignar">
								<span>
									<IconButton
										size="small"
										aria-label="Asignar"
										onClick={() => onAssign(order.id)}
										disabled={[EStatusOrder.DONE, EStatusOrder.FINISHED, EStatusOrder.CANCELED].includes(
											order.status
										)}
									>
										<AssignmentIndIcon fontSize="small" />
									</IconButton>
								</span>
							</Tooltip>
							<Tooltip title="Crear seguimiento">
								<IconButton
									size="small"
									aria-label="Crear seguimiento"
									onClick={() => onFollow(order.id)}
								>
									<MoveUpIcon fontSize="small" />
								</IconButton>
							</Tooltip>
							<Tooltip title="Generar reporte">
								<span>
									<IconButton
										size="small"
										aria-label="Generar reporte"
										disabled={![EStatusOrder.DONE, EStatusOrder.FINISHED].includes(order.status)}
										onClick={() => onDownloadCertificate(order.id)}
									>
										<FileDownload fontSize="small" />
									</IconButton>
								</span>
							</Tooltip>
							<Tooltip title="Eliminar">
								<IconButton
									size="small"
									aria-label="Eliminar"
									onClick={() => {
										openDialog({
											title: 'Advertencia',
											text: '¿Estas seguro que deseas eliminar la orden de servicio?',
											onAccept: async () => {
												await onDelete(order.id);
												displayToast({
													message: 'Se ha eliminado correctamente',
													variant: 'success',
													autoHideDuration: 1000,
													anchorOrigin: {
														horizontal: 'right',
														vertical: 'top'
													}
												});
											}
										});
									}}
								>
									<Delete fontSize="small" />
								</IconButton>
							</Tooltip>
						</Box>
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}
