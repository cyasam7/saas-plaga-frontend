import { lazy } from 'react';
import { IRouteConfig } from 'app/core/routing/types';

const CompanyBranches = lazy(() => import('./CompanyBranches'));

const CompanyBranchesConfig: IRouteConfig = {
	auth: ['staff', 'admin'],
	routes: [
		{
			path: 'company-branches',
			element: <CompanyBranches />
		}
	]
};

export default CompanyBranchesConfig;
