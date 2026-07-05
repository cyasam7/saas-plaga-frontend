import { UseFormReturn } from 'react-hook-form';

export interface IFormUser {
	name: string;
	email: string;
	phone: string;
	roleId: string;
	tenantId: string;
	password: string;
	confirmPassword: string;
}

export interface IFormUserProps {
	hook: UseFormReturn<IFormUser>;
	loading?: boolean;
	isEditing?: boolean;
}
