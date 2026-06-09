import { Product, Sale } from "./entities";

// Cliente de datos de la app: agrupa las entidades que hablan con el backend.
// La URL del backend se configura en src/api/config.js.
export const api = {
  entities: { Product, Sale },
};
