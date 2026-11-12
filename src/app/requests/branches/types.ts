/**
 * `form` de una sucursal: lo devuelve GET /branch/:id/form y lo reciben, con la misma estructura,
 * PUT /branch/:id y POST /branch/form. Espejo de `BranchFormDTO` (api/.../branch/infrastructure/BranchDto.ts).
 * Un área sin `id` es nueva; las que no se envían se eliminan.
 */
export interface IBranchForm {
  name: string;
  address: string;
  contactPhone: string;
  contactPerson: string | null;
  notes: string | null;
  areas: {
    id?: string;
    name: string;
    description: string | null;
  }[];
}
