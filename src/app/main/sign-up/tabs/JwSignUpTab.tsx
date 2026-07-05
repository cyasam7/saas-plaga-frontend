import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import _ from '@lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	FIELD_EMAIL_VALID,
	FIELD_PASSWORD_MUST_BE_SAME,
	FIELD_PASSWORD_SHORT,
	FIELD_REQUIRED,
	FIELD_TERMS_CONDITIONS
} from 'src/app/shared-constants/yupMessages';
import { AxiosError } from 'axios';
import { SignUpPayload, useAuth } from '../../../auth/AuthRouteProvider';
import { TextFieldPasswordForm } from 'app/shared-components/Form/TextFieldForm/PasswordInputForm';

/**
 * Form Validation Schema
 */
const schema = z
	.object({
		name: z.string().nonempty(FIELD_REQUIRED),
		email: z.string().email(FIELD_EMAIL_VALID).nonempty(FIELD_REQUIRED),
		phone: z.string(),
		password: z.string().nonempty(FIELD_REQUIRED).min(8, FIELD_PASSWORD_SHORT),
		passwordConfirm: z.string().nonempty(FIELD_REQUIRED),
		companyName: z.string().nonempty(FIELD_REQUIRED),
		workspaceName: z.string().nonempty(FIELD_REQUIRED),
		acceptTermsConditions: z.boolean().refine((val) => val === true, FIELD_TERMS_CONDITIONS)
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: FIELD_PASSWORD_MUST_BE_SAME,
		path: ['passwordConfirm']
	});

const defaultValues = {
	name: '',
	email: '',
	password: '',
	phone: '',
	companyName: '',
	workspaceName: '',
	passwordConfirm: '',
	acceptTermsConditions: false
};

function JwtSignUpTab() {
	const { jwtService } = useAuth();

	const { control, formState, handleSubmit, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(formData: SignUpPayload) {
		jwtService
			.signUp({
				...formData
			})
			.then(() => {
				//
			})
			.catch((_errors: AxiosError<{ message: string }>) => {
				const { message } = _errors.response.data;
				if (message === 'Ya existe un usuario con ese teléfono') {
					setError('phone', { message });
				}
				if (message === 'Ya existe un usuario con ese email') {
					setError('email', { message });
				}
				if (message === 'Ya existe tenant con ese nombre') {
					setError('workspaceName', { message: 'Ya existe un espacio de trabajo con ese nombre' });
				}
			});
	}

	return (
		<form
			name="registerForm"
			noValidate
			className="mt-32 flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Nombre completo"
						autoFocus
						type="name"
						error={!!errors.name}
						helperText={errors?.name?.message}
						variant="standard"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Email"
						type="email"
						error={!!errors.email}
						helperText={errors?.email?.message}
						variant="standard"
						required
						fullWidth
					/>
				)}
			/>

			<TextFieldPasswordForm
				control={control}
				name="password"
				className="mb-24"
				label="Contraseña"
				variant="standard"
				required
				fullWidth
			/>


			<TextFieldPasswordForm
				control={control}
				name={"passwordConfirm"}
				className="mb-24"
				label="Contraseña (Confirmar)"
				variant="standard"
				required
				fullWidth
			/>

			<Controller
				name="phone"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Teléfono"
						type="text"
						error={!!errors.phone}
						helperText={errors?.phone?.message}
						variant="standard"
						required
						fullWidth
					/>
				)}
			/>
			
			<Controller
				name="companyName"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Nombre de compañía"
						type="text"
						error={!!errors.companyName}
						helperText={errors?.companyName?.message}
						variant="standard"
						required
						fullWidth
					/>
				)}
			/>
			<Controller
				name="workspaceName"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						onChange={(e) => {
							const value = e.target.value ?? '';
							const formattedValue = value.replace(' ', '-').toLowerCase();
							field.onChange(formattedValue);
						}}
						className="mb-24"
						label="Nombre de espacio de trabajo"
						type="text"
						error={!!errors.workspaceName}
						helperText={errors?.workspaceName?.message}
						variant="standard"
						required
						fullWidth
					/>
				)}
			/>
			<Controller
				name="acceptTermsConditions"
				control={control}
				render={({ field }) => (
					<FormControl
						className="items-center"
						error={!!errors.acceptTermsConditions}
					>
						<FormControlLabel
							label="Acepto los términos y condiciones de la aplicación."
							control={
								<Checkbox
									size="small"
									{...field}
								/>
							}
						/>
						<FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
					</FormControl>
				)}
			/>

			<Button
				variant="contained"
				color="secondary"
				className="mt-24 w-full"
				aria-label="Register"
				disabled={_.isEmpty(dirtyFields) || !isValid}
				type="submit"
				size="large"
			>
				Crea tu cuenta gratis
			</Button>
		</form>
	);
}

export default JwtSignUpTab;
