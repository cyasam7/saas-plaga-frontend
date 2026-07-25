import { Dayjs } from 'dayjs';
import { UseFormReturn } from 'react-hook-form';
import { EClientType } from 'src/app/shared/entities/OrderEntity';

export { EClientType };

export enum EBusinessMode {
	EXISTING = 'existing',
	NEW = 'new'
}

export interface IFormOrderProps {
	formHandler: UseFormReturn<IFormCreatePest>;
	disabled?: boolean;
}

export interface IFormCreatePest {
	date: Dayjs | null;
	price: string;
	clientName: string;
	clientPhone: string;
	clientAddress: string;
	clientId: string;
	clientType: EClientType;
	/** Only relevant when clientType === BUSINESS: pick an existing client or create a new one. */
	businessMode: EBusinessMode;
	description: string;
}
