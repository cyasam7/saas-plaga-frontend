/** `form` de GET /company-branch/:id/form y body de PUT /company-branch (`SaveCompanyBranchDTO` del API). */
export interface ICompanyBranchForm {
  /** Sin id crea una sucursal nueva. */
  id?: string;
  name: string;
  address: string;
}
