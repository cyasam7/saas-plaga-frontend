import { SxProps } from '@mui/system';
import { ReactNode } from 'react';

export interface IDialogSkeletonProps {
	open: boolean;
	/** A string renders the standard title (+ `subtitle` and a close button); any other node is rendered as-is. */
	header: ReactNode;
	subtitle?: string;
	content: ReactNode;
	/** Botones del pie del diálogo (se renderizan en `DialogActions`). */
	actions?: ReactNode;
	/** Cierre por Esc o clic fuera del diálogo. */
	onClose?: () => void;
	maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs';
	sx?: SxProps
}
