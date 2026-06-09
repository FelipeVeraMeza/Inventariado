import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "@/lib/PageNotFound";
import AppLayout from "@/components/layout/AppLayout";
import POS from "@/pages/POS";
import Products from "@/pages/Products";
import SalesHistory from "@/pages/SalesHistory";
import Dashboard from "@/pages/Dashboard";
import AppSettings from "@/pages/AppSettings";

// App local sin autenticación: entra directo al Punto de Venta.
function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<POS />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales-history" element={<SalesHistory />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<AppSettings />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
