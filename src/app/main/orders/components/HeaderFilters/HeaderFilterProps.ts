import { Dayjs } from 'dayjs';
import { EStatusOrder } from 'src/app/shared/entities/OrderEntity';

export enum ETabsPlagues {
  ALL,
  TODAY,
  TOMORROW,
  PENDING
}

export interface IHeaderFiltersProps {
  onChangeDay?: (value?: ETabsPlagues) => void;
  onChangeDate?: (value?: Dayjs) => void;
  onChangeStatus?: (value?: EStatusOrder) => void;
}
