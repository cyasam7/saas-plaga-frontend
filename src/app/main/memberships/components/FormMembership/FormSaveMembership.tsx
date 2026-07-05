import React, { useEffect } from 'react';
import { Grid, MenuItem, Divider, Typography } from '@mui/material';
import TextFieldForm from 'app/shared-components/Form/TextFieldForm/TextFieldForm';
import { IFormSaveMembershipData, IFormSaveMembershipProps } from './FormMembershipProps';
import { DatePickerForm } from 'app/shared-components/DatePicker/DatePicker';
import PhoneInputForm from 'app/shared-components/Form/PhoneInputForm/PhoneInputForm';
import { EMembershipType } from 'src/app/shared/entities/Memberships';
import { TextFieldPasswordForm } from 'app/shared-components/Form/TextFieldForm/PasswordInputForm';

export const defaultValuesFormMembership = {
  id: undefined,
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  workspaceName: '',
  companyName: '',
  membershipType: EMembershipType.BASIC,
  dueDate: null
}


const FormSaveMembership: React.FC<IFormSaveMembershipProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  formHandler
}) => {
  const { control, handleSubmit, formState: { isSubmitting } } = formHandler;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} ><Typography variant="body1">Datos del usuario</Typography></Grid>
      <Grid item xs={12} sm={6}>
        <TextFieldForm<IFormSaveMembershipData>
          name="name"
          size='small'
          control={control}
          label="Nombre"
          fullWidth
          disabled={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PhoneInputForm
          name="phone"
          size='small'
          control={control}
          label="Teléfono"
          fullWidth
          disabled={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextFieldForm<IFormSaveMembershipData>
          name="email"
          size='small'
          control={control}
          label="Correo electrónico"
          type="email"
          fullWidth
          disabled={isLoading}
        />
      </Grid>
      <Grid container item xs={12} spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextFieldPasswordForm<IFormSaveMembershipData>
            name="password"
            size='small'
            control={control}
            label="Contraseña"
            type="password"
            fullWidth
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextFieldPasswordForm<IFormSaveMembershipData>
            name="confirmPassword"
            size='small'
            control={control}
            label="Contraseña"
            type="password"
            fullWidth
            disabled={isLoading}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} ><Divider /></Grid>
      <Grid item xs={12} ><Typography variant="body1">Datos de la empresa</Typography></Grid>
      <Grid item xs={12} sm={6}>
        <TextFieldForm<IFormSaveMembershipData>
          name="workspaceName"
          size='small'
          control={control}
          label="Nombre del espacio de trabajo"
          fullWidth
          disabled={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextFieldForm<IFormSaveMembershipData>
          name="companyName"
          size='small'
          control={control}
          label="Nombre de la empresa"
          fullWidth
          disabled={isLoading}
        />
      </Grid>
      <Grid item xs={12} ><Divider /></Grid>
      <Grid item xs={12} ><Typography variant="body1">Datos de la membresía</Typography></Grid>
      <Grid item xs={12} sm={6}>
        <TextFieldForm<IFormSaveMembershipData>
          name="membershipType"
          control={control}
          label="Tipo de membresía"
          size='small'
          fullWidth
          select
          disabled={isLoading}
        >
          <MenuItem value={EMembershipType.BASIC}>Básica</MenuItem>
          <MenuItem value={EMembershipType.PREMIUM}>Premium</MenuItem>
          <MenuItem value={EMembershipType.ENTERPRISE}>Empresarial</MenuItem>
        </TextFieldForm>
      </Grid>
      <Grid item xs={12} sm={6}>
        <DatePickerForm
          name="dueDate"
          control={control}
          label="Fecha de expiración"
          fullWidth
          disabled={isLoading}
        />
      </Grid>
    </Grid>
  );
};

export default FormSaveMembership;