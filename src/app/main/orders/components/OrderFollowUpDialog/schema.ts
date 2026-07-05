import { Dayjs } from 'dayjs';
import { FIELD_REQUIRED } from 'src/app/shared-constants/yupMessages';
import * as yup from 'yup';

export interface IFollowUpForm {
  description: string;
  date: Dayjs | null;
}

export const followUppSchema = yup.object<IFollowUpForm>({
  description: yup.string().optional(),
  date: yup.mixed().required(FIELD_REQUIRED)
});
