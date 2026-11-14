import dayjs, { Dayjs } from 'dayjs';
import { FIELD_REQUIRED } from 'src/app/shared/constants/yupMessages';
import * as yup from 'yup';

export interface IFollowUpForm {
  description: string;
  date: Dayjs | null;
}

export const followUppSchema = yup.object<IFollowUpForm>({
  description: yup.string().optional(),
  date: yup
    .mixed<Dayjs>()
    .required(FIELD_REQUIRED)
    // El picker bloquea lo pasado, pero una hora escrita a mano puede saltarse ese límite.
    .test('not-in-the-past', 'La fecha y hora no pueden ser anteriores a este momento', (date) => !date || !dayjs(date).isBefore(dayjs(), 'minute'))
});
