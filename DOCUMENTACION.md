# 📚 Documentación — Inventariado (POS "Maní & Más")

Sistema de **Punto de Venta (POS)** para una tienda que vende productos **a granel por peso**
(maní, frutos secos, especias). Permite vender pesando producto, llevar catálogo,
ver historial de ventas y un dashboard con métricas.

Originalmente fue generado con **Base44**, pero se migró para usar un **backend propio**
(Express + JSON). La app entra directo al POS **sin login** (modo actual).

---

## 1. Stack tecnológico

| Capa        | Tecnología                                                                 |
|-------------|----------------------------------------------------------------------------|
| Frontend    | React 18 + Vite 6                                                          |
| Estilos     | Tailwind CSS 3 + componentes **shadcn/ui** (Radix UI)                      |
| Estado/datos| TanStack Query (`@tanstack/react-query`)                                   |
| Routing     | React Router DOM 6                                                         |
| Gráficas    | Recharts                                                                   |
| Fechas      | date-fns                                                                   |
| Notificac.  | sonner (toasts)                                                            |
| Iconos      | lucide-react                                                               |
| Backend     | Node + Express 4 (ESM), almacenamiento en archivo **JSON**                |

---

## 2. Arquitectura general

```
┌──────────────────────────────┐         HTTP / JSON          ┌───────────────────────────┐
│        FRONTEND (Vite)        │  ─────────────────────────▶  │      BACKEND (Express)      │
│        localhost:5173         │   GET/POST/PUT/DELETE /api    │      localhost:4000         │
│                               │  ◀─────────────────────────  │                             │
│  Pages → base44.entities.*    │                              │  /api/products  /api/sales  │
│        → src/api (capa REST)  │                              │       ↓                     │
└──────────────────────────────┘                              │   server/data/db.json       │
                                                               └───────────────────────────┘
```

- El **frontend** nunca habla directo con `fetch` desde las páginas. Usa una **capa de API**
  (`src/api/`) que expone `base44.entities.Product` y `base44.entities.Sale`.
- Esa capa traduce cada método (`list`, `filter`, `create`, `update`, `delete`) a una
  llamada REST al backend.
- El **backend** guarda todo en un único archivo `server/data/db.json`.

> **Por qué esta estructura:** las páginas siguen escribiendo `base44.entities.Product.list()`
> igual que cuando era Base44. Solo cambiamos qué hay "detrás" de `base44`. Así migramos el
> backend **sin tocar ninguna página ni componente**.

---

## 3. Estructura de carpetas

```
Invetariado/
├── index.html                 # HTML raíz, monta /src/main.jsx
├── package.json               # Frontend: deps y scripts (dev, build)
├── vite.config.js             # Config de Vite (+ plugin base44, inofensivo)
├── tailwind.config.js         # Tema de Tailwind (colores vía variables CSS)
├── jsconfig.json              # Alias @/* → ./src/*
├── components.json            # Config de shadcn/ui
│
├── server/                    # 🖥️  BACKEND PROPIO
│   ├── index.js               # Servidor Express + rutas
│   ├── db.js                  # Carga/guarda db.json (+ datos de ejemplo)
│   ├── package.json           # Backend: express, cors
│   ├── data/db.json           # (se crea solo) "base de datos"
│   └── README.md              # Doc del backend
│
└── src/                       # 🎨  FRONTEND
    ├── main.jsx               # Punto de entrada React
    ├── App.jsx                # Providers + rutas
    ├── index.css             # Tailwind + variables de tema (colores)
    │
    ├── api/                   # 🔌 CAPA DE API (lo que reemplazó a Base44)
    │   ├── config.js          # API_BASE_URL (local/producción)
    │   ├── http.js            # wrapper de fetch
    │   ├── entities.js        # Product / Sale (list, filter, create, update, delete)
    │   └── base44Client.js    # objeto `base44` = { entities, auth }
    │
    ├── lib/                   # Utilidades / contexto
    │   ├── AuthContext.jsx     # Auth (ahora: modo sin login)
    │   ├── utils.js           # cn() para clases de Tailwind
    │   ├── query-client.js    # instancia de TanStack Query
    │   ├── PageNotFound.jsx    # 404
    │   └── app-params.js       # (legado de Base44, ya no se usa)
    │
    ├── hooks/
    │   └── use-mobile.jsx      # hook para detectar pantalla móvil
    │
    ├── pages/                 # 📄 PÁGINAS (una por ruta)
    │   ├── POS.jsx            # Punto de venta (pantalla principal)
    │   ├── Products.jsx        # CRUD de catálogo
    │   ├── SalesHistory.jsx    # Historial de ventas por día
    │   ├── Dashboard.jsx       # Métricas y gráficas
    │   ├── AppSettings.jsx     # Info / ayuda
    │   └── Login / Register / ForgotPassword / ResetPassword  # (auth, inactivas)
    │
    ├── components/
    │   ├── layout/            # AppLayout, Sidebar, MobileNav
    │   ├── pos/               # Componentes del POS (ver abajo)
    │   ├── products/          # ProductFormDialog (form de producto)
    │   ├── ui/                # 49 componentes shadcn/ui (button, dialog, etc.)
    │   ├── ProtectedRoute.jsx  # Guard de rutas (con auth desactivada deja pasar)
    │   └── ...                 # AuthLayout, GoogleIcon, ScrollToTop, etc.
    │
    └── utils/
        └── index.ts           # createPageUrl()
```

---

## 4. Modelo de datos

### Product (Producto)

| Campo           | Tipo            | Descripción                                              |
|-----------------|-----------------|----------------------------------------------------------|
| `id`            | string (UUID)   | Generado por el backend                                  |
| `name`          | string          | Nombre del producto *(requerido)*                        |
| `category`      | string (enum)   | `mani_confitado` · `especias` · `frutos_secos` · `mezclas` · `otros` |
| `price_per_gram`| number          | Precio por gramo *(requerido)*                           |
| `stock_grams`   | number \| null  | Stock en gramos (opcional)                               |
| `image_url`     | string          | URL de imagen (opcional)                                 |
| `description`   | string          | Descripción (opcional)                                   |
| `is_active`     | boolean         | Si aparece en el POS                                     |
| `created_date`  | string (ISO)    | Generado por el backend; se usa para ordenar             |

### Sale (Venta)

| Campo           | Tipo            | Descripción                                              |
|-----------------|-----------------|----------------------------------------------------------|
| `id`            | string (UUID)   | Generado por el backend                                  |
| `total`         | number          | Total de la venta                                        |
| `payment_method`| string          | `efectivo` · `tarjeta`                                   |
| `cash_received` | number \| null  | Efectivo recibido (solo si pagó en efectivo)             |
| `change_given`  | number \| null  | Cambio entregado                                         |
| `sale_date`     | string (ISO)    | Fecha de la venta                                        |
| `items`         | array           | Líneas de la venta (ver abajo)                           |
| `created_date`  | string (ISO)    | Generado por el backend                                  |

**`items[]`** (cada producto pesado en la venta):

| Campo           | Tipo    | Descripción                          |
|-----------------|---------|--------------------------------------|
| `product_id`    | string  | ID del producto                      |
| `product_name`  | string  | Nombre (copiado al momento de vender)|
| `weight_grams`  | number  | Gramos vendidos                      |
| `price_per_gram`| number  | Precio por gramo aplicado            |
| `subtotal`      | number  | `weight_grams × price_per_gram`      |

---

## 5. El backend (`server/`)

### `server/index.js` — el servidor
Servidor Express con CORS habilitado. Expone estos endpoints:

| Método | Ruta                | Qué hace                                                     |
|--------|---------------------|--------------------------------------------------------------|
| GET    | `/api/health`       | `{ ok: true }` — para comprobar que vive                     |
| GET    | `/api/products`     | Lista productos. Filtros: `?is_active=true`, `?limit=N`      |
| POST   | `/api/products`     | Crea producto (asigna `id` y `created_date`)                 |
| PUT    | `/api/products/:id` | Actualiza producto                                           |
| DELETE | `/api/products/:id` | Elimina producto                                             |
| GET    | `/api/sales`        | Lista ventas (más recientes primero). `?limit=N`             |
| POST   | `/api/sales`        | Crea venta                                                   |

Detalles:
- Las listas se ordenan por `created_date` **descendente** (más nuevo primero).
- `applyLimit()` recorta a los primeros N si llega `?limit=`.
- Cada `create` genera `id` (UUID) y `created_date` (ISO) automáticamente.

### `server/db.js` — la "base de datos"
- Lee/escribe un único archivo `server/data/db.json`.
- En el primer arranque, si no existe, lo crea con **3 productos de ejemplo** (`seedData()`).
- `save()` reescribe el archivo completo en cada cambio.
- Es **JSON plano** (sin SQL): suficiente para empezar; en producción conviene migrar a Postgres.

> Para empezar de cero: borra `server/data/db.json` y reinicia el backend.

---

## 6. La capa de API del frontend (`src/api/`)

Este es el corazón de la migración. Cuatro archivos:

### `config.js` — a dónde apunta el frontend
```js
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
```
- En **local** usa `localhost:4000`.
- En **producción** descomenta la línea con `IP_PUBLICA` (tu URL de Railway) o define
  `VITE_API_BASE_URL` en un `.env.local`.

### `http.js` — wrapper de `fetch`
Función `apiFetch(path, { method, body, params })` que:
- Arma la URL con query params.
- Pone `Content-Type: application/json` cuando hay body.
- Lanza un `Error` con `.status` si la respuesta no es OK.
- Devuelve el JSON ya parseado.

### `entities.js` — las entidades
Una **fábrica** `createEntity(resource)` que arma un objeto con los métodos que usan las páginas:

```js
Product.list("-created_date")          → GET  /api/products
Product.filter({ is_active: true })    → GET  /api/products?is_active=true
Product.create(data)                   → POST /api/products
Product.update(id, data)               → PUT  /api/products/:id
Product.delete(id)                     → DELETE /api/products/:id
Sale.list("-created_date", 200)        → GET  /api/sales?limit=200
Sale.create(data)                      → POST /api/sales
```

### `base44Client.js` — el objeto `base44`
Reúne todo en un objeto con la **misma forma** que tenía el SDK de Base44:
```js
export const base44 = {
  entities: { Product, Sale },
  auth: { me, logout, login..., ... }  // auth: stubs (deshabilitada)
};
```
Las páginas hacen `import { base44 } from "@/api/base44Client"` y siguen igual que antes.
`auth.me()` devuelve un usuario local fijo; los métodos de login lanzan error si se llaman.

---

## 7. Autenticación (estado actual: SIN login)

`src/lib/AuthContext.jsx` provee un contexto que **siempre** reporta:
- `isAuthenticated: true`
- `isLoadingAuth: false`
- `authError: null`
- `user`: un usuario local fijo (`role: "admin"`)

Por eso `ProtectedRoute` deja pasar directo y la app abre en el POS sin pedir login.
Las páginas `Login`, `Register`, etc. existen y compilan, pero **no se usan** en este modo.

> Para activar login real más adelante: volver a conectar `AuthContext` y `base44.auth`
> con endpoints `/api/auth/*` de tu backend. (Ver sección 11.)

---

## 8. Frontend: flujo de arranque y rutas

```
index.html
  └─ src/main.jsx          → ReactDOM.createRoot(<App />)
       └─ src/App.jsx
            ├─ AuthProvider               (contexto de auth)
            ├─ QueryClientProvider        (TanStack Query)
            └─ Router (react-router-dom)
                 └─ ProtectedRoute        (deja pasar: auth desactivada)
                      └─ AppLayout        (Sidebar + contenido)
                           ├─ "/"               → POS
                           ├─ "/products"       → Products
                           ├─ "/sales-history"  → SalesHistory
                           ├─ "/dashboard"      → Dashboard
                           └─ "/settings"       → AppSettings
```

**Layout** (`components/layout/`):
- `AppLayout.jsx` — estructura: `Sidebar` (escritorio) + `MobileNav` (móvil) + `<Outlet/>`.
- `Sidebar.jsx` — navegación lateral colapsable.
- `MobileNav.jsx` — menú hamburguesa para móvil.

---

## 9. Las páginas en detalle

### `POS.jsx` — Punto de Venta (pantalla principal)
La más importante. Flujo:
1. Carga productos activos: `Product.filter({ is_active: true })`.
2. `CategoryFilter` filtra por categoría.
3. `ProductGrid` muestra los productos; al hacer clic se selecciona uno.
4. `WeightInput` — ingresas **precio por kilo** y **peso en gramos**; calcula el subtotal en vivo
   y agrega un ítem al carrito.
5. `Cart` — lista los ítems, calcula el total, botón "Cobrar".
6. `CheckoutDialog` — eliges efectivo/tarjeta, calcula el cambio, confirma.
7. Al confirmar: `Sale.create(saleData)` → `SuccessOverlay` (animación de éxito) → limpia carrito.

> Nota: el precio se ingresa **por kilo** en la UI (más intuitivo) pero se guarda
> **por gramo** (`price_per_gram = precio_kilo / 1000`).

Componentes en `components/pos/`:
| Componente          | Rol                                                       |
|---------------------|-----------------------------------------------------------|
| `ProductGrid`       | Grilla de productos seleccionables                        |
| `CategoryFilter`    | Chips de categorías                                       |
| `WeightInput`       | Ingreso de peso + precio, cálculo del subtotal            |
| `Cart`              | Carrito / ticket con total y botón cobrar                 |
| `CheckoutDialog`    | Modal de pago (efectivo/tarjeta, cambio)                  |
| `SuccessOverlay`    | Animación de "venta exitosa"                              |

### `Products.jsx` — Catálogo (CRUD)
- Tabla con todos los productos: `Product.list("-created_date")`.
- Botón "Nuevo producto" abre `ProductFormDialog`.
- Menú por fila: Editar, Activar/Desactivar, Eliminar.
- Usa **mutaciones** de TanStack Query (`create`, `update`, `delete`) que invalidan las
  queries `["all-products"]` y `["products"]` para refrescar la UI automáticamente.

### `SalesHistory.jsx` — Historial
- Carga ventas: `Sale.list("-created_date", 200)`.
- Filtra por **fecha** (selector de día).
- Tarjetas resumen: total del día, efectivo, tarjeta.
- Cada venta es un acordeón (`Collapsible`) que muestra sus ítems.

### `Dashboard.jsx` — Métricas
- Carga ventas (500) y productos.
- KPIs del día: venta total, # ventas, efectivo, tarjeta.
- Gráfica de barras: **últimos 7 días** (Recharts).
- Gráfica de pastel: método de pago de hoy.
- Top 5 productos más vendidos (todo el tiempo).

### `AppSettings.jsx` — Ayuda
- Página informativa: explica cómo usar el sistema paso a paso. Sin lógica de datos.

---

## 10. Cómo correr el proyecto

Necesitas **dos terminales** (backend + frontend).

**Terminal 1 — Backend:**
```bash
cd server
npm install      # solo la primera vez
npm run dev      # http://localhost:4000/api  (recarga al guardar)
```

**Terminal 2 — Frontend:**
```bash
npm install      # solo la primera vez
npm run dev      # http://localhost:5173
```

Luego abre **http://localhost:5173**.

Scripts útiles del frontend (`package.json`):
- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción (a `dist/`)
- `npm run preview` — previsualiza el build
- `npm run lint` — ESLint

---

## 11. Cómo extender el proyecto (recetas)

### ➕ Agregar un campo a Producto (ej: `marca`)
1. **Frontend** — añade el input en `components/products/ProductFormDialog.jsx`.
2. Listo: el backend guarda cualquier campo que reciba (no valida esquema). El nuevo campo
   viajará en el `POST/PUT` y se guardará en `db.json`.
3. (Opcional) Muéstralo donde quieras (tabla de `Products.jsx`, etc.).

### ➕ Agregar una entidad nueva (ej: `Customer`)
1. **Backend** (`server/index.js`): copia el bloque de `products` y cambia a `customers`.
   Agrega `customers: []` en `seedData()` de `db.js`.
2. **Frontend** (`src/api/entities.js`):
   ```js
   export const Customer = createEntity("customers");
   ```
   y exponla en `base44Client.js`: `entities: { Product, Sale, Customer }`.
3. Úsala en cualquier página: `base44.entities.Customer.list()`.

### 🔐 Activar login real
1. **Backend**: crear rutas `/api/auth/login`, `/api/auth/me`, etc. (con JWT).
2. **Frontend**: reescribir `src/lib/AuthContext.jsx` para llamar a esos endpoints y guardar
   el token; y `base44Client.js` `auth.*` para que apunten ahí.
3. `ProtectedRoute` ya está listo para redirigir si no hay sesión.

---

## 12. Despliegue (resumen)

- **Frontend** → Vercel / Netlify. Antes, en `src/api/config.js` apunta `API_BASE_URL`
  a la URL pública del backend (o define `VITE_API_BASE_URL`).
- **Backend** → Railway. Corre `npm start`, usa la variable `PORT` (ya soportada).
  ⚠️ El disco de Railway es **efímero**: `db.json` se puede perder al redeploy. Para datos
  persistentes, migrar a Postgres.

---

## 13. Notas y deuda técnica

- **Almacenamiento JSON**: simple pero no apto para alto volumen ni concurrencia real.
  Siguiente paso natural: SQLite o Postgres.
- **Sin validación de esquema** en el backend: confía en lo que envía el frontend.
- **`src/lib/app-params.js`** es legado de Base44 y ya no se usa; se puede borrar.
- **Páginas de auth** (`Login`, `Register`, …) están inactivas en el modo actual.
- El plugin `@base44/vite-plugin` sigue en `vite.config.js`; es inofensivo (solo inyecta
  notificadores de HMR). Se puede quitar si quieres limpiar.
```
