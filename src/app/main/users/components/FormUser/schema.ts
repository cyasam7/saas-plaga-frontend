import { FIELD_EMAIL_VALID, FIELD_REQUIRED } from 'src/app/shared-constants/yupMessages';
import * as yup from 'yup';

export const userSchema = yup.object().shape({
	name: yup.string().required(FIELD_REQUIRED),
	email: yup.string().email(FIELD_EMAIL_VALID).required(FIELD_REQUIRED),
	phone: yup.string().required(FIELD_REQUIRED),
	roleId: yup.string().required(FIELD_REQUIRED),
	tenantId: yup.string()
});
