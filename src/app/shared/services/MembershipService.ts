import { CreateMembershipDTO } from '../entities/Memberships';
import { Membership } from '../entities/Memberships';
import { IDataGridMembership } from '../entities/Memberships';
import { AxiosFetcher } from '../fetcher';

export class MembershipService {
  private static readonly baseUrl = 'membership';

  static async getAll(): Promise<IDataGridMembership[]> {
    return AxiosFetcher<IDataGridMembership[]>({
      url: `${this.baseUrl}`,
      method: 'GET'
    });
  }

  static async getById(id: string): Promise<Membership> {
    return AxiosFetcher<Membership>({
      url: `${this.baseUrl}/${id}`,
      method: 'GET'
    });
  }

  static async create(membership: CreateMembershipDTO): Promise<void> {
    await AxiosFetcher({
      url: this.baseUrl,
      method: 'POST',
      data: membership
    });
  }

  static async extendDueDate(id: string, dueDate: Date, tenantId: string): Promise<void> {
    await AxiosFetcher({
      url: `${this.baseUrl}/extend-due-date/${id}`,
      method: 'PATCH',
      data: { dueDate, tenantId }
    });
  }
  static async changeIsActive(id: string, isActive: boolean, tenantId: string): Promise<void> {
    await AxiosFetcher({
      url: `${this.baseUrl}/is-active/${id}`,
      method: 'PATCH',
      data: { isActive, tenantId }
    });
  }
}
