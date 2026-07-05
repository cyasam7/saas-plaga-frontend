import axios from 'axios';
import { TenantEntity } from '../entities/TenantEntity';

export class TenantService {
	static async getByUserId(userId: string): Promise<TenantEntity[]> {
		const { data } = await axios.get<TenantEntity[]>(`/tenant/user/${userId}`);
		return data;
	}
}
