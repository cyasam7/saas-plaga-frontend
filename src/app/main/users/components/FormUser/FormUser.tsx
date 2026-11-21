import { CircularProgress, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { Business, Lock, Person } from '@mui/icons-material';
import FormSection from 'app/shared/components/FormSection/FormSection';
import { useAuth } from 'src/app/core/auth/AuthRouteProvider';
import { useEffect } from 'react';
import TextFieldForm from 'app/shared/components/Form/TextFieldForm/TextFieldForm';
import PhoneInputForm from 'app/shared/components/Form/PhoneInputForm/PhoneInputForm';
import { TextFieldPasswordForm } from 'app/shared/components/Form/TextFieldForm/PasswordInputForm';
import { useQueryTenantsByUser } from 'src/app/requests/tenants/useQueryTenantsByUser';
import { ERoleCode } from 'src/app/requests/users/types';
import { IFormUserProps } from './IFormUser';
import { ROLE_CATALOG } from './constant';

function FormUser(props: IFormUserProps) {
	const { hook, isEditing, loading } = props;

	const { user } = useAuth();
	const isStaff = user.role === 'staff';

	const { data: tenants = [] } = useQueryTenantsByUser({ userId: user.uid }, !!user.uid);

	useEffect(() => {
		if (isStaff && tenants.length) {
			hook.setValue('tenantId', tenants[0].id);
		}
	}, [tenants, isStaff]);

	if (loading) {
		return (
			<Stack
				alignItems="center"
				justifyContent="center"
				minHeight={280}
			>
				<CircularProgress aria-label="Cargando usuario" />
			</Stack>
		);
	}

	return (
		<Stack spacing={2}>
			<FormSection
				icon={<Person />}
				title="Información personal"
				description="Nombre y datos de contacto."
			>
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						xs={12}
					>
						<TextFieldForm
							name="name"
							control={hook.control}
							label="Nombre completo"
							autoComplete="off"
							autoFocus={!isEditing}
							size="small"
							fullWidth
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
					>
						<TextFieldForm
							name="email"
							control={hook.control}
							label="Correo"
							type="email"
							autoComplete="off"
							size="small"
							fullWidth
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
					>
						<PhoneInputForm
							name="phone"
							control={hook.control}
							label="Teléfono"
							size="small"
							fullWidth
						/>
					</Grid>
				</Grid>
			</FormSection>

			<FormSection
				icon={<Business />}
				title="Organización"
				description="Rol y compañía a la que pertenece."
			>
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						xs={12}
						sm={6}
					>
						<TextFieldForm
							name="roleId"
							control={hook.control}
							label="Rol"
							size="small"
							fullWidth
							select
						>
							{ROLE_CATALOG.filter((role) => role.value !== ERoleCode.SUPER_ADMIN).map((role) => (
								<MenuItem
									key={role.value}
									value={role.value}
								>
									{role.name}
								</MenuItem>
							))}
						</TextFieldForm>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
					>
						<TextFieldForm
							disabled={isStaff}
							name="tenantId"
							control={hook.control}
							label="Compañía"
							size="small"
							fullWidth
							select
						>
							{tenants.map((tenant) => (
								<MenuItem
									key={tenant.id}
									value={tenant.id}
								>
									{tenant.companyName}
								</MenuItem>
							))}
						</TextFieldForm>
					</Grid>
				</Grid>
			</FormSection>

			{isEditing ? (
				<Typography
					variant="caption"
					color="text.secondary"
				>
					Para cambiar la contraseña usa «Cambiar contraseña» en el menú de acciones del usuario.
				</Typography>
			) : (
				<FormSection
					icon={<Lock />}
					title="Acceso"
					description="Contraseña para iniciar sesión. Mínimo 8 caracteres."
				>
					<Grid
						container
						spacing={2}
					>
						<Grid
							item
							xs={12}
							sm={6}
						>
							<TextFieldPasswordForm
								name="password"
								control={hook.control}
								label="Contraseña"
								autoComplete="new-password"
								size="small"
							fullWidth
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
						>
							<TextFieldPasswordForm
								name="confirmPassword"
								control={hook.control}
								label="Confirmar contraseña"
								autoComplete="new-password"
								size="small"
							fullWidth
							/>
						</Grid>
					</Grid>
				</FormSection>
			)}
		</Stack>
	);
}

export default FormUser;
