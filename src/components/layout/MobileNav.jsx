import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Package, BarChart3, History, Settings, Nut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Punto de Venta", icon: ShoppingCart },
  { path: "/products", label: "Productos", icon: Package },
  { path: "/sales-history", label: "Historial", icon: History },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/settings", label: "Configuración", icon: Settings },
];

export default function MobileNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 h-14 border-b border-border bg-card">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Nut className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-base">Maní & Más</span>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0">
          <div className="px-4 py-4 border-b border-border">
            <h2 className="font-display font-bold">Navegación</h2>
          </div>
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}