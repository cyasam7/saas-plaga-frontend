/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { FIELD_PHONE_ERROR_MESSAGE, FIELD_REQUIRED } from 'src/app/shared-constants/yupMessages';
import { yupPhoneProperty } from 'src/app/shared-constants/yupPhone';
import * as yup from 'yup';
import { EBusinessMode, EClientType } from './FormOrderProps';

export const createOrderSchema = yup.object().shape({
	price: yup.string().min(1, 'Valor mínimo de 1 peso').required(FIELD_REQUIRED),
	clientType: yup.string().required(FIELD_REQUIRED),
	businessMode: yup.string(),
	// For an existing business client the id is required (the client + location are selected).
	clientId: yup.string().when(['clientType', 'businessMode'], {
		is: (clientType: EClientType, businessMode: EBusinessMode) =>
			clientType === EClientType.BUSINESS && businessMode === EBusinessMode.EXISTING,
		then: (s) => s.required(FIELD_REQUIRED),
		otherwise: (s) => s.optional()
	}),
	clientAddress: yup.string().required(FIELD_REQUIRED),
	clientName: yup.string().required(FIELD_REQUIRED),
	// Phone is not required for an existing business client (it comes from the location).
	clientPhone: yup.string().when(['clientType', 'businessMode'], {
		is: (clientType: EClientType, businessMode: EBusinessMode) =>
			clientType === EClientType.BUSINESS && businessMode === EBusinessMode.EXISTING,
		then: (s) => s.optional(),
		otherwise: () => yupPhoneProperty(FIELD_PHONE_ERROR_MESSAGE)
	}),
	date: yup.mixed().nonNullable().typeError(FIELD_REQUIRED)
});
