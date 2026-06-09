import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Nut, Leaf, Cherry, Blend, Box } from "lucide-react";

const categoryIcons = {
  mani_confitado: Nut,
  especias: Leaf,
  frutos_secos: Cherry,
  mezclas: Blend,
  otros: Box,
};

const categoryLabels = {
  mani_confitado: "Maní Confitado",
  especias: "Especias",
  frutos_secos: "Frutos Secos",
  mezclas: "Mezclas",
  otros: "Otros",
};

export default function ProductGrid({ products, selectedProduct, onSelectProduct, categoryFilter }) {
  const filtered = categoryFilter === "all" 
    ? products 
    : products.filter(p => p.category === categoryFilter);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Package className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-sm">No hay productos en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {filtered.map((product) => {
        const isSelected = selectedProduct?.id === product.id;
        const Icon = categoryIcons[product.category] || Box;
        
        return (
          <button
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className={cn(
              "group relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 text-left",
              isSelected
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
                : "border-transparent bg-card hover:border-primary/30 hover:shadow-md"
            )}
          >
            {/* Product image or icon */}
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-colors",
              isSelected ? "bg-primary/15" : "bg-muted group-hover:bg-primary/10"
            )}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <Icon className={cn(
                  "w-6 h-6 transition-colors",
                  isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )} />
              )}
            </div>

            {/* Product info */}
            <h3 className="text-sm font-semibold text-center leading-tight mb-1 line-clamp-2">
              {product.name}
            </h3>
            <Badge variant="secondary" className="text-xs font-mono">
              ${product.price_per_gram.toFixed(2)}/g
            </Badge>
            
            {/* Category label */}
            <span className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wide">
              {categoryLabels[product.category]}
            </span>

            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function Package({ className }) {
  return <Box className={className} />;
}