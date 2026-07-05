import DialogSkeleton from 'app/shared-components/DialogSkeleton/DialogSkeleton'
import FormSaveMembership, { defaultValuesFormMembership } from '../FormMembership/FormSaveMembership'
import { IDialogMembershipProps } from './DialogMembershipProps';
import { IFormSaveMembershipData, schemaSaveMembership } from '../FormMembership/FormMembershipProps';
import { MembershipService } from 'src/app/shared/services/MembershipService';
import { displayToast } from '@fuse/core/FuseMessage/DisplayToast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CreateMembershipDTO } from 'src/app/shared/entities/Memberships';

const DialogMembership = (props: IDialogMembershipProps) => {
  const { open, onClose, membershipId, onSubmit } = props;
  const formHandler = useForm<IFormSaveMembershipData>({
    resolver: yupResolver(schemaSaveMembership),
    defaultValues: defaultValuesFormMembership
  });
  const { data: membership } = useQuery({
    queryKey: ['membership', membershipId],
    queryFn: () => MembershipService.getById(membershipId),
    enabled: !!membershipId
  });

  useEffect(() => {
    formHandler.reset(!!membership ? membership : defaultValuesFormMembership);
    return () => {
      formHandler.reset(defaultValuesFormMembership);
    }
  }, [membership]);

  const handleSubmit = async (data: IFormSaveMembershipData) => {
    try {
      if (data.password !== data.confirmPassword) {
        formHandler.setError('confirmPassword', {
          message: 'Las contraseñas no coinciden'
        });
        return;
      }

      const formattedValuesForm: CreateMembershipDTO = {
        ...data,
        membershipType: data.membershipType,
        dueDate: data.dueDate.toDate(),
      }
      await MembershipService.create(formattedValuesForm);
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
            membershipId={membershipId}
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