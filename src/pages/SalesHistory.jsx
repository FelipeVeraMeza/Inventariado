import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { format, startOfDay, endOfDay, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DollarSign, Banknote, CreditCard, ChevronDown, Search, Calendar, Receipt,
} from "lucide-react";

export default function SalesHistory() {
  const [searchDate, setSearchDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: () => api.entities.Sale.list("-created_date", 200),
  });

  // Filter by date
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.sale_date || sale.created_date);
    const filterDate = new Date(searchDate);
    return (
      saleDate.getFullYear() === filterDate.getFullYear() &&
      saleDate.getMonth() === filterDate.getMonth() &&
      saleDate.getDate() === filterDate.getDate()
    );
  });

  const totalDay = filteredSales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalCash = filteredSales.filter((s) => s.payment_method === "efectivo").reduce((sum, s) => sum + (s.total || 0), 0);
  const totalCard = filteredSales.filter((s) => s.payment_method === "tarjeta").reduce((sum, s) => sum + (s.total || 0), 0);

  const formatSaleDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) return `Hoy, ${format(date, "HH:mm")}`;
    if (isYesterday(date)) return `Ayer, ${format(date, "HH:mm")}`;
    return format(date, "dd MMM yyyy, HH:mm", { locale: es });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Historial de Ventas</h2>
        <p className="text-sm text-muted-foreground">Consulta las ventas por día</p>
      </div>

      {/* Date filter */}
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-muted-foreground" />
        <Input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="w-auto"
        />
        <Button variant="outline" size="sm" onClick={() => setSearchDate(format(new Date(), "yyyy-MM-dd"))}>
          Hoy
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total del día</p>
              <p className="text-2xl font-display font-bold">${totalDay.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Banknote className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Efectivo</p>
              <p className="text-2xl font-display font-bold">${totalCash.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Tarjeta</p>
              <p className="text-2xl font-display font-bold">${totalCard.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales list */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Ventas ({filteredSales.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSales.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay ventas en esta fecha</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredSales.map((sale) => (
                <Collapsible key={sale.id}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-5 py-3 hover:bg-muted/30 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        sale.payment_method === "efectivo" ? "bg-green-100" : "bg-blue-100"
                      }`}>
                        {sale.payment_method === "efectivo" ? (
                          <Banknote className="w-4 h-4 text-green-600" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {sale.items?.length || 0} producto{(sale.items?.length || 0) !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatSaleDate(sale.sale_date || sale.created_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-mono font-bold">${sale.total?.toFixed(2)}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-5 pb-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Producto</TableHead>
                            <TableHead className="text-xs text-right">Peso</TableHead>
                            <TableHead className="text-xs text-right">$/g</TableHead>
                            <TableHead className="text-xs text-right">Subtotal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sale.items?.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="text-sm">{item.product_name}</TableCell>
                              <TableCell className="text-sm text-right font-mono">{item.weight_grams}g</TableCell>
                              <TableCell className="text-sm text-right font-mono">${item.price_per_gram?.toFixed(2)}</TableCell>
                              <TableCell className="text-sm text-right font-mono font-semibold">${item.subtotal?.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {sale.payment_method === "efectivo" && sale.cash_received && (
                        <div className="mt-2 text-xs text-muted-foreground flex gap-4 justify-end">
                          <span>Recibido: ${sale.cash_received?.toFixed(2)}</span>
                          <span>Cambio: ${sale.change_given?.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}