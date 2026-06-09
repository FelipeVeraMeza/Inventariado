import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShoppingCart, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Cart({ items, onRemoveItem, onClearCart, onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ShoppingCart className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-sm font-medium">Carrito vacío</p>
        <p className="text-xs mt-1">Agrega productos para iniciar</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Ticket de venta</h3>
          <Badge variant="secondary" className="text-xs">{items.length}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearCart} className="text-destructive hover:text-destructive text-xs h-7">
          Limpiar
        </Button>
      </div>

      {/* Items list */}
      <div className="flex-1 space-y-2 overflow-auto pr-1">
        {items.map((item, index) => (
          <div
            key={index}
            className="group flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-transparent hover:border-border transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.product_name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground font-mono">
                  {item.weight_grams}g × ${item.price_per_gram.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono whitespace-nowrap">
                ${item.subtotal.toFixed(2)}
              </span>
              <button
                onClick={() => onRemoveItem(index)}
                className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:bg-destructive/10 rounded transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-border my-4" />

      {/* Total */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">Total ({items.length} productos)</span>
          <span className="text-3xl font-display font-bold text-foreground">
            ${total.toFixed(2)}
          </span>
        </div>

        <Button
          onClick={() => onCheckout(total)}
          className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 transition-all hover:scale-[1.01]"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cobrar
        </Button>
      </div>
    </div>
  );
}