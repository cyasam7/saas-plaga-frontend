import {
	FIELD_EMAIL_VALID,
	FIELD_PASSWORD_MUST_BE_SAME,
	FIELD_PASSWORD_SHORT,
	FIELD_REQUIRED
} from 'src/app/shared/constants/yupMessages';
import * as yup from 'yup';

/** La contraseña solo se captura al crear: el form recibe `{ isEditing }` como contexto (`$isEditing`). */
export const userSchema = yup.object().shape({
	name: yup.string().required(FIELD_REQUIRED),
	email: yup.string().email(FIELD_EMAIL_VALID).required(FIELD_REQUIRED),
	phone: yup.string().required(FIELD_REQUIRED),
	roleId: yup.string().required(FIELD_REQUIRED),
	tenantId: yup.string(),
	password: yup.string().when('$isEditing', {
		is: true,
		then: (passwordSchema) => passwordSchema.notRequired(),
		otherwise: (passwordSchema) => passwordSchema.required(FIELD_REQUIRED).min(8, FIELD_PASSWORD_SHORT)
	}),
	confirmPassword: yup.string().when('$isEditing', {
		is: true,
		then: (confirmPasswordSchema) => confirmPasswordSchema.notRequired(),
		otherwise: (confirmPasswordSchema) =>
			confirmPasswordSchema.required(FIELD_REQUIRED).oneOf([yup.ref('password')], FIELD_PASSWORD_MUST_BE_SAME)
	})
});
