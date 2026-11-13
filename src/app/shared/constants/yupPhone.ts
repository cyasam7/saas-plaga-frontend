import * as yup from 'yup';

import { PhoneNumberUtil } from 'google-libphonenumber';
import { FIELD_PHONE_ERROR_MESSAGE } from './yupMessages';

const phoneUtil = PhoneNumberUtil.getInstance();

export const isPhoneValid = (phone: string) => {
	try {
		return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
	} catch (e) {
		return false;
	}
};

export function yupPhoneProperty(errorMessage?: string) {
	return yup.string().test('phone', FIELD_PHONE_ERROR_MESSAGE ?? errorMessage, (value) => {
		return isPhoneValid(value);
	});
}
