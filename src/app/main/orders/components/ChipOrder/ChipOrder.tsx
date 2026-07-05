import { Chip, Typography } from '@mui/material';
import React from 'react';
import { EStatusOrder } from 'src/app/shared/entities/OrderEntity';
import { statusColor, statusLabel } from '../../utils';


export const getEstatusColor = (estatus: keyof typeof EStatusOrder) => {
	switch (estatus) {
		case "CREATED": // Creada
			return { background: "#3B82F6", text: "#FFFFFF" } // Azul claro
		case "ASSIGNED": // Asignada
			return { background: "#2563EB", text: "#FFFFFF" } // Azul medio
		case "IN_REVIEW": // En revisión
			return { background: "#FACC15", text: "#1F2937" } // Amarillo
		case "REVIEWED": // Revisada
			return { background: "#F59E0B", text: "#1F2937" } // Ámbar / naranja
		case "IN_PROGRESS": // En progreso
			return { background: "#06B6D4", text: "#FFFFFF" } // Cyan / azul verdoso
		case "DONE": // Hecha
			return { background: "#10B981", text: "#FFFFFF" } // Verde medio
		case "FINISHED": // Terminada
			return { background: "#047857", text: "#FFFFFF" } // Verde oscuro
		case "CANCELED": // Cancelada
			return { background: "#DC2626", text: "#FFFFFF" } // Rojo
		default:
			return { background: "#9CA3AF", text: "#FFFFFF" } // Gris neutro
	}
}

export interface IChipOrderProps {
	status: EStatusOrder;
}

function ChipOrder({ status }: IChipOrderProps) {
	const { background, text } = getEstatusColor(status)
	return (
		<Typography style={{
			backgroundColor: background,
			color: text,
			fontWeight: 500,
		}} className='rounded-full px-8 py-4'>
			{statusLabel[status]}
		</Typography>
	);
}

export default ChipOrder;
