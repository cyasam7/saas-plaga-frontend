import { Grid, MenuItem } from '@mui/material';
import React, { useEffect } from 'react';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';
import PhoneInputForm from 'app/shared-components/Form/PhoneInputForm/PhoneInputForm';
import { selectUser, selectUserRole } from 'src/app/auth/user/store/userSlice';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { TenantService } from 'src/app/shared/services/TenantService';
import { ERoleCode } from 'src/app/shared/entities/UserEntity';
import { IFormUserProps } from './IFormUser';
import { ROLE_CATALOG } from './constant';
import { TextFieldPasswordForm } from 'app/shared-components/Form/TextFieldForm/PasswordInputForm';

function FormUser(props: IFormUserProps) {
	const { hook, isEditing, } = props;

	const role = useSelector(selectUserRole);
	const user = useSelector(selectUser);

	const { data: tenants = [] } = useQuery({
		queryFn: () => TenantService.getByUserId(user.uid),
		queryKey: [user.uid],
		enabled: !!user.uid
	});

	useEffect(() => {
		if (role === 'staff' && tenants.length) {
			hook.setValue('tenantId', tenants[0].id);
		}
	}, [tenants, role]);

	return (
		<Grid
			container
			spacing={2}
		>
			<Grid
				item
				xs={12}
				md={6}
			>
				<TextFieldForm
					name="name"
					control={hook.control}
					label="Nombre"
					fullWidth
				/>
			</Grid>
			<Grid
				item
				xs={12}
				md={6}
			>
				<TextFieldForm
					name="email"
					control={hook.control}
					label="Correo"
					fullWidth
				/>
			</Grid>
			<Grid
				item
				xs={12}
				md={6}
			>
				<PhoneInputForm
					name="phone"
					control={hook.control}
					label="Teléfono"
					fullWidth
				/>
			</Grid>
			<Grid
				item
				xs={12}
				md={6}
			>
				<TextFieldForm
					name="roleId"
					control={hook.control}
					label="Rol"
					fullWidth
					select
				>
					{ROLE_CATALOG.filter((i) => i.value !== ERoleCode.SUPER_ADMIN).map((i, index) => (
						<MenuItem
							value={i.value}
							key={index}
						>
							{i.name}
						</MenuItem>
					))}
				</TextFieldForm>
			</Grid>
			<Grid
				item
				xs={12}
				md={6}
			>
				<TextFieldForm
					disabled={role === 'staff'}
					name="tenantId"
					control={hook.control}
					label="Compañía"
					fullWidth
					select
				>
					{tenants.map((i) => (
						<MenuItem
							key={i.id}
							value={i.id}
						>
							{i.companyName}
						</MenuItem>
					))}
				</TextFieldForm>
			</Grid>
			{!isEditing && (
				<>
					<Grid
						item
						xs={12}
						pt={3}
					/>
					<Grid
						item
						xs={12}
						md={6}
					>
						<TextFieldPasswordForm
							name="password"
							control={hook.control}
							label="Contraseña"
							fullWidth
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
					>
						<TextFieldPasswordForm
							name="confirmPassword"
							control={hook.control}
							label="Confirmar contraseña"
							fullWidth
						/>
					</Grid>
				</>
			)}
		</Grid>
	);
}

export default FormUser;
