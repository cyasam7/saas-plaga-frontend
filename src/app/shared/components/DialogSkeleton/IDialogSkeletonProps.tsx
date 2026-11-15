import { SxProps } from '@mui/system';
import { ReactNode } from 'react';

export interface IDialogSkeletonProps {
	open: boolean;
	header: ReactNode;
	content: ReactNode;
	/** Botones del pie del diálogo (se renderizan en `DialogActions`). */
	actions?: ReactNode;
	/** Cierre por Esc o clic fuera del diálogo. */
	onClose?: () => void;
	maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs';
	sx?: SxProps
}
