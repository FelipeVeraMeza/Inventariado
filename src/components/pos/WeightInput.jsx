import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Scale, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const quickWeights = [50, 100, 150, 200, 250, 500, 1000];

export default function WeightInput({ product, onAddToCart }) {
  const [weight, setWeight] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");

  // When product changes, pre-fill price per kg from its price_per_gram
  useEffect(() => {
    if (product) {
      setPricePerKg(product.price_per_gram ? (product.price_per_gram * 1000).toFixed(0) : "");
      setWeight("");
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Scale className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-sm font-medium">Selecciona un producto</p>
        <p className="text-xs mt-1">para registrar la venta</p>
      </div>
    );
  }

  const weightNum = parseFloat(weight) || 0;
  const priceKgNum = parseFloat(pricePerKg) || 0;
  const pricePerGram = priceKgNum / 1000;
  const subtotal = weightNum * pricePerGram;

  const handleAdd = () => {
    if (weightNum <= 0 || priceKgNum <= 0) return;
    onAddToCart({
      product_id: product.id,
      product_name: product.name,
      weight_grams: weightNum,
      price_per_gram: pricePerGram,
      subtotal: Math.round(subtotal * 100) / 100,
    });
    setWeight("");
  };

  return (
    <div className="space-y-4">
      {/* Selected product header */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Producto</p>
        <h3 className="font-display text-lg font-bold text-foreground leading-tight">{product.name}</h3>
      </div>

      {/* Price per KG */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
          Precio por kilo ($)
        </label>
        <Input
          type="number"
          value={pricePerKg}
          onChange={(e) => setPricePerKg(e.target.value)}
          placeholder="Ej: 800"
          className="h-12 text-xl font-mono font-bold text-center border-2 focus:border-primary"
          min="0"
          step="1"
        />
      </div>

      {/* Weight input */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
          Peso (gramos)
        </label>
        <div className="relative">
          <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0"
            className="pl-11 pr-10 h-12 text-xl font-mono font-bold text-center border-2 focus:border-primary"
            min="0"
            step="1"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">g</span>
        </div>

        {/* Quick weight buttons */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {quickWeights.map((g) => (
            <button
              key={g}
              onClick={() => setWeight(g.toString())}
              className={cn(
                "px-2.5 py-1 text-xs font-mono font-medium rounded-lg border transition-all",
                parseFloat(weight) === g
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              {g >= 1000 ? `${g / 1000}kg` : `${g}g`}
            </button>
          ))}
        </div>
      </div>

      {/* Live total */}
      {weightNum > 0 && priceKgNum > 0 && (
        <div className="bg-primary/5 border-2 border-primary/30 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">
            {weightNum}g × ${priceKgNum}/kg
          </p>
          <p className="text-4xl font-display font-bold text-primary">
            ${subtotal.toFixed(2)}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => { setWeight(""); setPricePerKg(""); }}
          className="flex-shrink-0"
          disabled={!weight && !pricePerKg}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleAdd}
          disabled={weightNum <= 0 || priceKgNum <= 0}
          className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar al carrito
        </Button>
      </div>
    </div>
  );
}