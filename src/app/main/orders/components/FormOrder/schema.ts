/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { FIELD_PHONE_ERROR_MESSAGE, FIELD_REQUIRED } from 'src/app/shared/constants/yupMessages';
import { yupPhoneProperty } from 'src/app/shared/constants/yupPhone';
import * as yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import { EBusinessMode, EClientType } from './FormOrderProps';

export const createOrderSchema = yup.object().shape({
	price: yup
		.string()
		.required(FIELD_REQUIRED)
		.test('min-price', 'Valor mínimo de 1 peso', (value) => Number(value) >= 1)
		.test('whole-pesos', 'El precio debe ser en pesos enteros, sin centavos', (value) => /^\d+$/.test(value ?? '')),
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
	date: yup
		.mixed<Dayjs>()
		.nonNullable(FIELD_REQUIRED)
		.typeError(FIELD_REQUIRED)
		// El picker bloquea lo pasado, pero una hora escrita a mano puede saltarse ese límite. Por minuto:
		// elegir el minuto actual es válido.
		.test('not-in-the-past', 'La fecha y hora no pueden ser anteriores a este momento', (date) => !date || !dayjs(date).isBefore(dayjs(), 'minute'))
});
