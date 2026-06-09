import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Nut, Info, Store, Scale, Printer } from "lucide-react";

export default function AppSettings() {
  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Configuración</h2>
        <p className="text-sm text-muted-foreground">Información del sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="w-4 h-4" />
            Acerca del negocio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Nut className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Maní & Más</h3>
              <p className="text-sm text-muted-foreground">Sistema Punto de Venta</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4" />
            Cómo funciona
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <Badge className="bg-primary/10 text-primary border-none mt-0.5">1</Badge>
            <p>Ve a <strong>Punto de Venta</strong> y selecciona el producto que el cliente quiere.</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-primary/10 text-primary border-none mt-0.5">2</Badge>
            <p>Ingresa el peso en gramos (usa la báscula para pesar). El precio se calcula automáticamente.</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-primary/10 text-primary border-none mt-0.5">3</Badge>
            <p>Agrega al carrito. Puedes agregar múltiples productos a la misma venta.</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-primary/10 text-primary border-none mt-0.5">4</Badge>
            <p>Presiona <strong>Cobrar</strong> y selecciona el método de pago (efectivo o tarjeta).</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-primary/10 text-primary border-none mt-0.5">5</Badge>
            <p>Si es efectivo, ingresa cuánto recibiste y el sistema calcula el cambio. Si es tarjeta, cobra con tu terminal y confirma.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Administra tus productos desde la sección <strong>Productos</strong>.</p>
          <p>• Consulta tus ventas del día en <strong>Historial</strong>.</p>
          <p>• El <strong>Dashboard</strong> muestra el resumen general con gráficas.</p>
          <p>• Puedes usar botones de peso rápido (50g, 100g, etc.) o escribir el peso exacto.</p>
        </CardContent>
      </Card>
    </div>
  );
}