/**
 * Elemento de los catálogos con nombre (plagas, servicios, tipos de aplicación). Espejo de
 * `IGetPlagueTypesByQueryResponse`, `IGetServiceTypesByQueryResponse` e `IGetApplicationTypesByQueryResponse`.
 */
export interface INamedCatalogItem {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
}

/** Cuerpo del POST de esos catálogos (`Create*DTO` del API). Con `id` actualiza. */
export interface ISaveNamedCatalogPayload {
  id?: string;
  name: string;
  description?: string;
}
