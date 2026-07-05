import { FormChangePassword } from 'src/app/main/users/components/ChangePasswordDialog/IChangePasswordDialog';
import { IUserEntity, IUserCreator, IDataGridUserRow, ISaveSignUser, IQueryUser } from '../entities/UserEntity';
import { AxiosFetcher } from '../fetcher';

export class UserService {
  static async save(values: IUserCreator): Promise<void> {
    await AxiosFetcher({ url: `/user`, data: values, method: 'PUT' });
  }

  static async getById(id: string): Promise<IDataGridUserRow> {
    return AxiosFetcher<IDataGridUserRow>({ url: `/user/${id}`, method: 'GET' });
  }

  static async saveSign(data: ISaveSignUser): Promise<void> {
    const form = new FormData();
    form.append('file', data.sign, `${data.userId}-sign.png`);
    form.append('userId', data.userId);
    await AxiosFetcher<void>({
      url: `/user/sign`,
      method: 'POST',
      data: form,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  static async getUsersDatagrid(userId: string): Promise<IDataGridUserRow[]> {
    return AxiosFetcher<IDataGridUserRow[]>({ url: `/user/datagrid`, method: 'GET', params: { userId } });
  }

  static async remove(id: string): Promise<void> {
    await AxiosFetcher<IUserEntity>({ url: `/user/${id}`, method: 'DELETE' });
  }

  static async changePassword(userId: string, password: string): Promise<void> {
    await AxiosFetcher<IUserEntity>({
      url: `/user/change-password/${userId}`,
      method: 'PATCH',
      data: { password }
    });
  }
}
