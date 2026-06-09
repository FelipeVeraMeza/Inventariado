# Backend — Inventariado (POS Maní & Más)

API REST simple en Express con almacenamiento en archivo JSON (`data/db.json`).
Sin dependencias nativas, lista para correr en local o desplegar en Railway.

## Correr en local

```bash
cd server
npm install
npm run dev      # http://localhost:4000/api  (recarga al guardar)
```

## Endpoints

| Método | Ruta                 | Descripción                                  |
|--------|----------------------|----------------------------------------------|
| GET    | `/api/health`        | Estado del servidor                          |
| GET    | `/api/products`      | Lista productos (`?is_active=true`, `?limit=`)|
| POST   | `/api/products`      | Crea producto                                |
| PUT    | `/api/products/:id`  | Actualiza producto                           |
| DELETE | `/api/products/:id`  | Elimina producto                             |
| GET    | `/api/sales`         | Lista ventas (`?limit=`)                      |
| POST   | `/api/sales`         | Crea venta                                   |

## Desplegar en Railway

1. Crea un proyecto nuevo apuntando a este repo (carpeta `server/`).
2. Railway detecta Node y corre `npm start`.
3. Usa la variable `PORT` que Railway inyecta (ya soportada).
4. En el frontend, cambia `src/api/config.js` para apuntar a la URL pública.

> Nota: el almacenamiento es un archivo JSON. En Railway el disco es efímero;
> para datos persistentes en producción conviene migrar a Postgres más adelante.
