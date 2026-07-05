import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from 'src/app/shared-constants/dateFormat';
import { useQuery } from 'react-query';
import { formatCurrency } from 'src/app/shared-constants/formatCurrency';
import { OrderService } from '../../../../shared/services/OrderService';
import { IOrderDetailDialogProps } from './IOrderDetailDialogProps';

function OrderDetailDialog(props: IOrderDetailDialogProps) {
	const { onClose, open, id } = props;

	const { data: order, isLoading } = useQuery({
		queryKey: ['get-order-detail-by-id', id],
		queryFn: () => OrderService.getById(id),
		enabled: Boolean(id)
	});

	const isFollowUp = !!order?.isFollowUp;

	function handleClose(): void {
		onClose();
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
		>
			<DialogTitle>Información del orden de servicio</DialogTitle>
			<DialogContent>
				{!isLoading && (
					<Stack
						spacing={2}
						minWidth={{ sx: 200, md: 500 }}
					>
						<Typography>Información del cliente</Typography>
						<Stack>
							<Typography variant="subtitle2">{`${order?.clientName}. Tel. (${order?.clientPhone})`}</Typography>
							<Typography variant="body2">{`${order?.clientAddress}`}</Typography>
						</Stack>
						<Divider />
						<Typography>Información del servicio</Typography>
						<Stack>
							<Stack
								direction="row"
								alignItems="center"
								spacing={0.2}
							>
								<Typography variant="subtitle2">Fecha:</Typography>
								<Typography variant="body2">{`${dayjs(order?.date).format(DATE_FORMAT)}`}</Typography>
							</Stack>
							<Stack
								direction="row"
								alignItems="center"
								spacing={0.2}
							>
								<Typography variant="subtitle2">Hora:</Typography>
								<Typography variant="body2">{`${dayjs(order?.date).format(TIME_FORMAT)}`}</Typography>
							</Stack>
						</Stack>
						<Stack>
							<Stack
								direction="row"
								alignItems="center"
								spacing={0.2}
							>
								<Typography variant="subtitle2">¿Tuvo seguimiento?:</Typography>
								<Typography variant="body2">{`${isFollowUp ? 'Si' : 'No'}`}</Typography>
							</Stack>
							{isFollowUp && (
								<Stack
									direction="row"
									alignItems="center"
									spacing={0.2}
								>
									<Typography variant="subtitle2">Fecha:</Typography>
									<Typography variant="body2">{`${dayjs(order?.date).format(
										DATE_TIME_FORMAT
									)}`}</Typography>
								</Stack>
							)}
						</Stack>
						{/* 			<Stack>
							<Stack
								direction="row"
								alignItems="center"
								spacing={0.2}
							>
								<Typography variant="subtitle2">Tipo de servicio: </Typography>
								<Typography variant="body2">{`${order?.typeService
									.map((i) => i.name)
									.join(', ')}`}</Typography>
							</Stack>
						</Stack>
						<Stack>
							<Stack
								direction="row"
								alignItems="center"
								spacing={0.2}
							>
								<Typography variant="subtitle2">Frecuencia de servicios: </Typography>
								<Typography variant="body2">{`${order?.frequency.map((i) => i.name).join(', ')}`}</Typography>
							</Stack>
						</Stack>
						<Stack>
							<Stack
								direction="row"
								alignItems="center"
								spacing={0.2}
							>
								<Typography variant="subtitle2">Plagas que se atendieron: </Typography>
								<Typography variant="body2">{`${order?.typePlague.map((i) => i.name).join(', ')}`}</Typography>
							</Stack>
						</Stack>
						<Stack spacing={0.2}>
							<Typography variant="subtitle2">Observaciones:</Typography>
							<Typography variant="body2">{order?.observations}</Typography>
						</Stack> */}
						<Stack spacing={0.2}>
							<Typography variant="subtitle2">Costo:</Typography>
							<Typography variant="body2">{`$ ${formatCurrency(order?.price)}`}</Typography>
						</Stack>
					</Stack>
				)}
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					color="primary"
					onClick={handleClose}
				>
					Cerrar
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default OrderDetailDialog;
