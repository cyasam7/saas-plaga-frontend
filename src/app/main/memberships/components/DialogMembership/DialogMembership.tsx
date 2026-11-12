import DialogSkeleton from 'app/shared/components/DialogSkeleton/DialogSkeleton'
import FormSaveMembership, { defaultValuesFormMembership } from '../FormMembership/FormSaveMembership'
import { IDialogMembershipProps } from './DialogMembershipProps';
import { IFormSaveMembershipData, schemaSaveMembership } from '../FormMembership/FormMembershipProps';
import { ICreateMembershipPayload, useMutationCreateMembership } from 'src/app/requests/memberships/useMutationCreateMembership';
import { displayToast } from 'app/core/feedback/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const DialogMembership = (props: IDialogMembershipProps) => {
  const { open, onClose, onSubmit } = props;
  const formHandler = useForm<IFormSaveMembershipData>({
    resolver: yupResolver(schemaSaveMembership),
    defaultValues: defaultValuesFormMembership
  });
  const { mutateAsync: createMembership } = useMutationCreateMembership();

  const handleSubmit = async (data: IFormSaveMembershipData) => {
    try {
      if (data.password !== data.confirmPassword) {
        formHandler.setError('confirmPassword', {
          message: 'Las contraseñas no coinciden'
        });
        return;
      }

      const createMembershipPayload: ICreateMembershipPayload = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: data.password,
        workspaceName: data.workspaceName,
        companyName: data.companyName,
        membershipType: data.membershipType,
        dueDate: data.dueDate.toISOString(),
      }
      await createMembership(createMembershipPayload);
      displayToast({
        message: 'Membresía creada correctamente',
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      })
      onSubmit(data);
      onClose();
    } catch {
    }
  }

  const handleCancel = () => {
    formHandler.reset(defaultValuesFormMembership);
    onClose();
  }


  return (
    <DialogSkeleton
      header="Crear membresía"
      content={
        <Stack>
          <FormSaveMembership
            formHandler={formHandler}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCancel}
              disabled={formHandler.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={formHandler.formState.isSubmitting}
              onClick={formHandler.handleSubmit(handleSubmit)}
            >
              Guardar
            </LoadingButton>
          </Box>
        </Stack>
      }
      open={open}
      maxWidth='md'
    />
  )
}

export default DialogMembership