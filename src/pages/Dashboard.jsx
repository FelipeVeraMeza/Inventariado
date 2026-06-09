import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { format, subDays, isToday, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, TrendingUp, ShoppingCart, Package, Banknote, CreditCard, Scale,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["hsl(28, 80%, 52%)", "hsl(16, 60%, 48%)", "hsl(45, 80%, 55%)", "hsl(150, 40%, 45%)", "hsl(200, 50%, 50%)"];

export default function Dashboard() {
  const { data: sales = [], isLoading: loadingSales } = useQuery({
    queryKey: ["all-sales"],
    queryFn: () => api.entities.Sale.list("-created_date", 500),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => api.entities.Product.list(),
  });

  // Today's sales
  const todaySales = sales.filter((s) => {
    const d = new Date(s.sale_date || s.created_date);
    return isToday(d);
  });

  const todayTotal = todaySales.reduce((sum, s) => sum + (s.total || 0), 0);
  const todayCash = todaySales.filter((s) => s.payment_method === "efectivo").reduce((sum, s) => sum + (s.total || 0), 0);
  const todayCard = todaySales.filter((s) => s.payment_method === "tarjeta").reduce((sum, s) => sum + (s.total || 0), 0);
  const totalItems = todaySales.reduce((sum, s) => sum + (s.items?.length || 0), 0);

  // Last 7 days chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const daySales = sales.filter((s) => {
      const d = new Date(s.sale_date || s.created_date);
      return d.toDateString() === date.toDateString();
    });
    return {
      name: format(date, "EEE", { locale: es }),
      total: daySales.reduce((sum, s) => sum + (s.total || 0), 0),
      ventas: daySales.length,
    };
  });

  // Top products
  const productSalesMap = {};
  sales.forEach((sale) => {
    sale.items?.forEach((item) => {
      if (!productSalesMap[item.product_name]) {
        productSalesMap[item.product_name] = { total: 0, grams: 0, count: 0 };
      }
      productSalesMap[item.product_name].total += item.subtotal || 0;
      productSalesMap[item.product_name].grams += item.weight_grams || 0;
      productSalesMap[item.product_name].count += 1;
    });
  });

  const topProducts = Object.entries(productSalesMap)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5)
    .map(([name, data]) => ({ name, ...data }));

  // Payment method pie
  const paymentData = [
    { name: "Efectivo", value: todayCash },
    { name: "Tarjeta", value: todayCard },
  ].filter((d) => d.value > 0);

  if (loadingSales) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Resumen de tu negocio • {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Venta hoy</p>
                <p className="text-xl font-display font-bold">${todayTotal.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ventas hoy</p>
                <p className="text-xl font-display font-bold">{todaySales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Efectivo</p>
                <p className="text-xl font-display font-bold">${todayCash.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tarjeta</p>
                <p className="text-xl font-display font-bold">${todayCard.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart - Last 7 days */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Últimos 7 días
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    formatter={(value) => [`$${value.toFixed(2)}`, "Total"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                    }}
                  />
                  <Bar dataKey="total" fill="hsl(28, 80%, 52%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie chart - Payment methods */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Método de pago (hoy)</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentData.length > 0 ? (
              <div className="h-[250px] flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {paymentData.map((_, idx) => (
                        <Cell key={idx} fill={idx === 0 ? "#22c55e" : "#3b82f6"} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Efectivo
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Tarjeta
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                Sin ventas hoy
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top products */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-4 h-4" />
            Productos más vendidos (todo el tiempo)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Sin datos aún</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background: `${COLORS[idx]}20`, color: COLORS[idx] }}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.count} ventas • {product.grams.toFixed(0)}g vendidos
                    </p>
                  </div>
                  <span className="font-mono font-bold text-sm">${product.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}