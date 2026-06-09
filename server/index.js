import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import { db, save } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const now = () => new Date().toISOString();

const byCreatedDesc = (a, b) =>
  (b.created_date || "").localeCompare(a.created_date || "");

const applyLimit = (items, limit) => {
  const n = parseInt(limit, 10);
  return Number.isNaN(n) ? items : items.slice(0, n);
};

app.get("/api/health", (_req, res) => res.json({ ok: true }));

/* ----------------------------- PRODUCTS ----------------------------- */
app.get("/api/products", (req, res) => {
  let items = [...db.data.products];
  if (req.query.is_active !== undefined) {
    const want = req.query.is_active === "true";
    items = items.filter((p) => (p.is_active !== false) === want);
  }
  items.sort(byCreatedDesc);
  res.json(applyLimit(items, req.query.limit));
});

app.post("/api/products", (req, res) => {
  const item = { id: randomUUID(), created_date: now(), ...req.body };
  db.data.products.push(item);
  save();
  res.status(201).json(item);
});

app.put("/api/products/:id", (req, res) => {
  const i = db.data.products.findIndex((p) => p.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: "Producto no encontrado" });
  db.data.products[i] = { ...db.data.products[i], ...req.body, id: req.params.id };
  save();
  res.json(db.data.products[i]);
});

app.delete("/api/products/:id", (req, res) => {
  const before = db.data.products.length;
  db.data.products = db.data.products.filter((p) => p.id !== req.params.id);
  if (db.data.products.length === before)
    return res.status(404).json({ error: "Producto no encontrado" });
  save();
  res.json({ ok: true });
});

/* ------------------------------- SALES ------------------------------ */
app.get("/api/sales", (req, res) => {
  const items = [...db.data.sales].sort(byCreatedDesc);
  res.json(applyLimit(items, req.query.limit));
});

app.post("/api/sales", (req, res) => {
  const item = { id: randomUUID(), created_date: now(), ...req.body };
  db.data.sales.push(item);
  save();
  res.status(201).json(item);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}/api`));
