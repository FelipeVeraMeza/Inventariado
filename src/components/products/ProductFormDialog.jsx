import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";

const categories = [
  { value: "mani_confitado", label: "Maní Confitado" },
  { value: "especias", label: "Especias" },
  { value: "frutos_secos", label: "Frutos Secos" },
  { value: "mezclas", label: "Mezclas" },
  { value: "otros", label: "Otros" },
];

export default function ProductFormDialog({ open, onClose, product, onSave }) {
  const isEdit = !!product;
  const [form, setForm] = useState(
    product || {
      name: "",
      category: "mani_confitado",
      price_per_gram: "",
      description: "",
      image_url: "",
      is_active: true,
      stock_grams: "",
    }
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      price_per_gram: parseFloat(form.price_per_gram) || 0,
      stock_grams: form.stock_grams ? parseFloat(form.stock_grams) : null,
    };
    await onSave(data);
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Nombre del producto *</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ej: Maní Enchilado"
                required
              />
            </div>
            <div>
              <Label>Categoría *</Label>
              <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Precio por gramo ($) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.price_per_gram}
                onChange={(e) => handleChange("price_per_gram", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label>Stock (gramos)</Label>
              <Input
                type="number"
                min="0"
                value={form.stock_grams || ""}
                onChange={(e) => handleChange("stock_grams", e.target.value)}
                placeholder="Opcional"
              />
            </div>
            <div>
              <Label>URL de imagen</Label>
              <Input
                value={form.image_url || ""}
                onChange={(e) => handleChange("image_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2">
              <Label>Descripción</Label>
              <Textarea
                value={form.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Descripción opcional del producto"
                rows={2}
              />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <Switch
                checked={form.is_active !== false}
                onCheckedChange={(v) => handleChange("is_active", v)}
              />
              <Label className="mb-0">Producto activo</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving || !form.name || !form.price_per_gram}>
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEdit ? "Guardar cambios" : "Crear producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}