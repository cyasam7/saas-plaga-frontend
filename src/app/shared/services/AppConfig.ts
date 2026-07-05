import { HEADER_TENANT_NAME } from 'src/app/shared-constants/headers';
import { AxiosFetcher } from '../fetcher';
import { IResponseGetConfigAccount, ISaveAccountConfig } from '../entities/AppConfig';

export class AppConfigService {
	static async save(data: ISaveAccountConfig): Promise<void> {
		const form = new FormData();
		form.append('logo', data.logo);
		form.append('address', data.address.toString());
		form.append('name', data.name.toString());
		form.append('primaryColor', data.primaryColor.toString());
		form.append('secondaryColor', data.secondaryColor.toString());
		form.append('licenseSanitary', data.licenseSanitary.toString());

		return AxiosFetcher<void>({
			method: 'POST',
			url: '/app-config/account',
			headers: {
				'Content-Type': 'multipart/form-data'
			},
			data: form
		});
	}

	static async get({ tenantId }: { tenantId: string }): Promise<IResponseGetConfigAccount> {
		return AxiosFetcher<IResponseGetConfigAccount>({
			method: 'GET',
			url: '/app-config/account',
			headers: {
				[HEADER_TENANT_NAME]: tenantId
			}
		});
	}
}
