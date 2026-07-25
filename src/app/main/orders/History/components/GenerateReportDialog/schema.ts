import { FIELD_REQUIRED } from 'src/app/shared-constants/yupMessages';
import * as yup from 'yup';

export enum TypeReport {
  CERTIFICATE = 'CERTIFICATE',
  SERVICE_ORDER = 'SERVICE_ORDER'
}

export interface IGenerateReportForm {
  typeReport: TypeReport;
  months: number | null;
}

export const generateReportSchema = yup.object<IGenerateReportForm>({
  typeReport: yup.string().required(FIELD_REQUIRED),
  months: yup.number().typeError('Debe ser valor numerico').nullable()
});
