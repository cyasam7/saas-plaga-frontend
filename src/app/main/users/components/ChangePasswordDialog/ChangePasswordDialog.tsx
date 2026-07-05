import React from 'react'
import { Button, Stack } from '@mui/material';
import DialogSkeleton from 'app/shared-components/DialogSkeleton/DialogSkeleton'
import { TextFieldPasswordForm } from 'app/shared-components/Form/TextFieldForm/PasswordInputForm';
import { useForm } from 'react-hook-form';
import { FormChangePassword, IChangePasswordDialog } from './IChangePasswordDialog';
import { UserService } from 'src/app/shared/services/UserService';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { useQueryClient } from 'react-query';

const ChangePasswordDialog = (props: IChangePasswordDialog) => {
  const { onClose, open, userId } = props;
  const queryClient = useQueryClient()

  const formHandler = useForm<FormChangePassword>({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });


  function handleClose() {
    formHandler.reset({ password: '', confirmPassword: '' });
    onClose();
  }

  async function onSubmit(data: FormChangePassword): Promise<void> {
    if (data.password !== data.confirmPassword) {
      formHandler.setError('confirmPassword', {
        message: 'Las contraseñas no coinciden'
      });
      return;
    }
    await UserService.changePassword(
      userId,
      data.password
    )
    queryClient.invalidateQueries('users-registered')
    displayToast({
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top'
      },
      message: 'Se actualizo correctamente la contraseña',
      variant: 'success'
    })
    handleClose();
  }

  return (
    <DialogSkeleton
      open={open}
      maxWidth="xs"
      header="Escribe la nueva contraseña"
      content={
        <Stack spacing={2}>
          <TextFieldPasswordForm
            name="password"
            label="Contraseña"
            control={formHandler.control}
          />
          <TextFieldPasswordForm
            name="confirmPassword"
            label="Confirmar contraseña"
            control={formHandler.control}
          />
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant='outlined' color='secondary' onClick={() => onClose()}>Cancelar</Button>
            <Button variant='contained' color='primary' onClick={formHandler.handleSubmit(onSubmit)}>Guardar</Button>
          </Stack>
        </Stack>
      }

    />
  )
}

export default ChangePasswordDialog