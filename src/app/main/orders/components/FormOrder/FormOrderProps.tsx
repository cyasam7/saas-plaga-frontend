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
	/** Editing an existing order: show the stored client fields (read-only) instead of the creation selectors. */
	isUpdating?: boolean;
	disableSpecificField?: {
		dateField?: boolean;
		priceField?: boolean;
		clientNameField?: boolean;
		clientPhoneField?: boolean;
		clientAddressField?: boolean;
		descriptionField?: boolean;
		clientTypeField?: boolean;
	};
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
