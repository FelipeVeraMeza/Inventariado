import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data");
const DB_FILE = join(DATA_DIR, "db.json");

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const now = () => new Date().toISOString();

// Datos de ejemplo para el primer arranque (puedes borrarlos desde la app).
const seedData = () => ({
  products: [
    {
      id: randomUUID(),
      name: "Maní Confitado",
      category: "mani_confitado",
      price_per_gram: 0.05,
      stock_grams: 5000,
      image_url: "",
      description: "Clásico maní confitado dulce.",
      is_active: true,
      created_date: now(),
    },
    {
      id: randomUUID(),
      name: "Maní Enchilado",
      category: "mani_confitado",
      price_per_gram: 0.06,
      stock_grams: 3000,
      image_url: "",
      description: "Maní con chile, picosito.",
      is_active: true,
      created_date: now(),
    },
    {
      id: randomUUID(),
      name: "Nuez de la India",
      category: "frutos_secos",
      price_per_gram: 0.18,
      stock_grams: 2000,
      image_url: "",
      description: "",
      is_active: true,
      created_date: now(),
    },
  ],
  sales: [],
});

export const db = { data: { products: [], sales: [] } };

if (existsSync(DB_FILE)) {
  try {
    db.data = JSON.parse(readFileSync(DB_FILE, "utf-8"));
  } catch {
    db.data = seedData();
    save();
  }
} else {
  db.data = seedData();
  save();
}

export function save() {
  writeFileSync(DB_FILE, JSON.stringify(db.data, null, 2));
}
