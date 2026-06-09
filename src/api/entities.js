import { apiFetch } from "./http";

// Fábrica de entidades con la misma interfaz que usaba el SDK de Base44
// (list / filter / create / update / delete), pero apuntando a tu backend.
//
// Nota: `orderBy` se acepta por compatibilidad pero el backend ya ordena
// por created_date descendente.
function createEntity(resource) {
  return {
    list: (_orderBy, limit) => apiFetch(`/${resource}`, { params: { limit } }),
    filter: (criteria = {}, _orderBy, limit) =>
      apiFetch(`/${resource}`, { params: { ...criteria, limit } }),
    create: (data) => apiFetch(`/${resource}`, { method: "POST", body: data }),
    update: (id, data) =>
      apiFetch(`/${resource}/${id}`, { method: "PUT", body: data }),
    delete: (id) => apiFetch(`/${resource}/${id}`, { method: "DELETE" }),
  };
}

export const Product = createEntity("products");
export const Sale = createEntity("sales");
