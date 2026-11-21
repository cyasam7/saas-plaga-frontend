import FormDialog from 'app/shared/components/FormDialog/FormDialog'
import FormSaveMembership, { defaultValuesFormMembership } from '../FormMembership/FormSaveMembership'
import { IDialogMembershipProps } from './DialogMembershipProps';
import { IFormSaveMembershipData, schemaSaveMembership } from '../FormMembership/FormMembershipProps';
import { ICreateMembershipPayload, useMutationCreateMembership } from 'src/app/requests/memberships/useMutationCreateMembership';
import { displayToast } from 'app/core/feedback/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

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
      handleCancel();
    } catch {
    }
  }

  const handleCancel = () => {
    formHandler.reset(defaultValuesFormMembership);
    onClose();
  }


  return (
    <FormDialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      title="Nueva membresía"
      subtitle="Crea la compañía, su espacio de trabajo y el usuario administrador."
      onSubmit={formHandler.handleSubmit(handleSubmit)}
      submitLabel="Crear membresía"
      isSubmitting={formHandler.formState.isSubmitting}
    >
      <FormSaveMembership
        formHandler={formHandler}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </FormDialog>
  )
}

export default DialogMembership