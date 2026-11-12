import { ReactNode } from 'react';

export interface ICustomHeaderBackProps {
	backText?: string;
	title: string;
	subtitle: string;
	rightComponent?: ReactNode;
}
