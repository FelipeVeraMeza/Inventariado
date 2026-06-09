import { cn } from "@/lib/utils";
import { Nut, Leaf, Cherry, Blend, Box, LayoutGrid } from "lucide-react";

const categories = [
  { value: "all", label: "Todos", icon: LayoutGrid },
  { value: "mani_confitado", label: "Maní", icon: Nut },
  { value: "especias", label: "Especias", icon: Leaf },
  { value: "frutos_secos", label: "Frutos Secos", icon: Cherry },
  { value: "mezclas", label: "Mezclas", icon: Blend },
  { value: "otros", label: "Otros", icon: Box },
];

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => {
        const isActive = value === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}