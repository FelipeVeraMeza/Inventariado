import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { toast } from "sonner";
import ProductGrid from "@/components/pos/ProductGrid";
import WeightInput from "@/components/pos/WeightInput";
import Cart from "@/components/pos/Cart";
import CheckoutDialog from "@/components/pos/CheckoutDialog";
import CategoryFilter from "@/components/pos/CategoryFilter";
import SuccessOverlay from "@/components/pos/SuccessOverlay";

export default function POS() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [successInfo, setSuccessInfo] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.entities.Product.filter({ is_active: true }),
  });

  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setSelectedProduct(null);
    toast.success(`${item.product_name} agregado`, {
      description: `${item.weight_grams}g — $${item.subtotal.toFixed(2)}`,
    });
  };

  const handleRemoveItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setSelectedProduct(null);
  };

  const handleCheckout = (total) => {
    setCheckoutTotal(total);
    setCheckoutOpen(true);
  };

  const handleConfirmSale = async (saleData) => {
    await api.entities.Sale.create(saleData);
    setCheckoutOpen(false);
    setSuccessInfo({
      total: saleData.total,
      paymentMethod: saleData.payment_method,
      change: saleData.change_given || 0,
    });
    setTimeout(() => {
      setSuccessInfo(null);
      setCartItems([]);
      setSelectedProduct(null);
    }, 2500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left: Products */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="mb-5">
            <h2 className="font-display text-2xl font-bold mb-1">Punto de Venta</h2>
            <p className="text-sm text-muted-foreground">Selecciona un producto y registra el peso</p>
          </div>
          <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
          <div className="mt-4">
            <ProductGrid
              products={products}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
              categoryFilter={categoryFilter}
            />
          </div>
        </div>

        {/* Right: Weight + Cart */}
        <div className="w-full lg:w-[420px] border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col">
          {/* Weight input section */}
          <div className="p-4 lg:p-5 border-b border-border">
            <WeightInput product={selectedProduct} onAddToCart={handleAddToCart} />
          </div>

          {/* Cart section */}
          <div className="flex-1 p-4 lg:p-5 overflow-auto">
            <Cart
              items={cartItems}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* Checkout dialog */}
      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        total={checkoutTotal}
        items={cartItems}
        onConfirmSale={handleConfirmSale}
      />

      {/* Success overlay */}
      <SuccessOverlay
        show={!!successInfo}
        total={successInfo?.total}
        paymentMethod={successInfo?.paymentMethod}
        change={successInfo?.change}
      />
    </div>
  );
}