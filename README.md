# 🥜 Inventariado — POS "Maní & Más"

Sistema de **Punto de Venta (POS)** para una tienda que vende productos **a granel por peso**
(maní, frutos secos, especias). Permite vender pesando producto, administrar el catálogo,
ver el historial de ventas y un dashboard con métricas.

- **Frontend:** React 18 + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Node + Express (almacenamiento en archivo JSON)
- **Sin autenticación** (modo local): la app entra directo al POS

> 📖 Documentación detallada del código en [DOCUMENTACION.md](DOCUMENTACION.md).

---

## 🚀 Cómo correrlo en local

### 1. Requisitos
- [Node.js](https://nodejs.org/) 18 o superior

### 2. Instalar dependencias
```bash
# Dependencias del frontend
npm install

# Dependencias del backend
npm --prefix server install
```

### 3. Levantar todo (backend + frontend a la vez)
```bash
npm run start:all
```

Esto inicia:
- 🔵 **Backend** → http://localhost:4000/api
- 🟢 **Frontend** → http://localhost:5173

Abre **http://localhost:5173** en el navegador. Para detener todo: `Ctrl + C`.

---

## 📜 Scripts disponibles

| Comando              | Qué hace                                  |
|----------------------|-------------------------------------------|
| `npm run start:all`  | Backend + frontend a la vez (recomendado) |
| `npm run dev`        | Solo el frontend                          |
| `npm run backend`    | Solo el backend                           |
| `npm run build`      | Build de producción del frontend          |
| `npm run preview`    | Previsualiza el build                     |
| `npm run lint`       | Linter (ESLint)                           |

---

## 🗂️ Estructura

```
Invetariado/
├── server/          # Backend Express (API + db.json)
│   ├── index.js     # Rutas /api/products y /api/sales
│   └── db.js        # Almacenamiento JSON (se crea solo en data/)
└── src/             # Frontend React
    ├── api/         # Capa de datos (config, cliente, entidades)
    ├── pages/       # POS, Products, SalesHistory, Dashboard, AppSettings
    ├── components/  # Layout, POS, productos y UI (shadcn)
    ├── lib/ hooks/  # Utilidades
    └── App.jsx      # Rutas
```

---

## 🌐 Local vs. Producción

La URL del backend se configura en [src/api/config.js](src/api/config.js):

```js
const IP_PUBLICA = "vsv-contadores-production.up.railway.app";

// Local (activo):
export const API_BASE_URL = "http://localhost:4000/api";
// Producción (descomenta para usar el backend desplegado):
// export const API_BASE_URL = `https://${IP_PUBLICA}/api`;
```

Para apuntar a producción, invierte los comentarios (activa la línea de Railway y comenta
la de localhost).

---

## ⚠️ Notas

- `node_modules/` y `server/data/` **no** están en el repo (ver `.gitignore`).
  Se regeneran solos: `node_modules` con `npm install`, y la base de datos JSON al arrancar
  el backend (incluye 3 productos de ejemplo en el primer arranque).
- El almacenamiento es un archivo JSON: simple para empezar; en producción conviene
  migrar a una base de datos real (Postgres) y agregar autenticación.
