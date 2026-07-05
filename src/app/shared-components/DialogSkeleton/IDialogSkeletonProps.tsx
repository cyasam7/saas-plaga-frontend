import { SxProps } from '@mui/system';
import { ReactNode } from 'react';

export interface IDialogSkeletonProps {
	open: boolean;
	header: ReactNode;
	content: ReactNode;
	maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs';
	sx?: SxProps
}
