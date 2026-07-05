import { EBusinessMode, EClientType } from './FormOrderProps';

export const defaultValuesOrder = {
  clientId: '',
  clientAddress: '',
  clientName: '',
  clientPhone: '',
  clientType: EClientType.INDIVIDUAL,
  businessMode: EBusinessMode.EXISTING,
  price: '',
  date: null,
  description: ''
};
