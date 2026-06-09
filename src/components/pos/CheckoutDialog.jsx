import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Banknote, CreditCard, Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CheckoutDialog({ open, onClose, total, items, onConfirmSale }) {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cashReceived, setCashReceived] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const cashNum = parseFloat(cashReceived) || 0;
  const change = cashNum - total;

  const handleConfirm = async () => {
    setIsProcessing(true);
    await onConfirmSale({
      items,
      total: Math.round(total * 100) / 100,
      payment_method: paymentMethod,
      cash_received: paymentMethod === "efectivo" ? cashNum : null,
      change_given: paymentMethod === "efectivo" ? Math.max(0, Math.round(change * 100) / 100) : null,
      sale_date: new Date().toISOString(),
    });
    setIsProcessing(false);
    setPaymentMethod(null);
    setCashReceived("");
  };

  const canConfirm = paymentMethod === "tarjeta" || (paymentMethod === "efectivo" && cashNum >= total);

  const handleClose = () => {
    setPaymentMethod(null);
    setCashReceived("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Cobrar venta</DialogTitle>
        </DialogHeader>

        {/* Total display */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total a cobrar</p>
          <p className="text-4xl font-display font-bold text-primary">${total.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">{items.length} productos</p>
        </div>

        {/* Payment method selection */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Método de pago
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setPaymentMethod("efectivo"); setCashReceived(""); }}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                paymentMethod === "efectivo"
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/30"
              )}
            >
              <Banknote className={cn(
                "w-8 h-8",
                paymentMethod === "efectivo" ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-sm font-semibold">Efectivo</span>
            </button>
            <button
              onClick={() => setPaymentMethod("tarjeta")}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                paymentMethod === "tarjeta"
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/30"
              )}
            >
              <CreditCard className={cn(
                "w-8 h-8",
                paymentMethod === "tarjeta" ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-sm font-semibold">Tarjeta</span>
            </button>
          </div>
        </div>

        {/* Cash input */}
        {paymentMethod === "efectivo" && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Efectivo recibido
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">$</span>
              <Input
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="0.00"
                className="pl-8 h-14 text-2xl font-mono font-bold text-center border-2"
                autoFocus
                min="0"
                step="0.01"
              />
            </div>

            {/* Quick cash amounts */}
            <div className="flex flex-wrap gap-2">
              {[Math.ceil(total), Math.ceil(total / 10) * 10, Math.ceil(total / 50) * 50, Math.ceil(total / 100) * 100].filter((v, i, arr) => arr.indexOf(v) === i && v >= total).slice(0, 4).map((amount) => (
                <button
                  key={amount}
                  onClick={() => setCashReceived(amount.toString())}
                  className="px-3 py-1.5 text-sm font-mono font-medium rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  ${amount}
                </button>
              ))}
            </div>

            {cashNum >= total && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-xs text-green-600 mb-0.5">Cambio a entregar</p>
                <p className="text-2xl font-display font-bold text-green-700">
                  ${change.toFixed(2)}
                </p>
              </div>
            )}

            {cashNum > 0 && cashNum < total && (
              <p className="text-sm text-destructive text-center font-medium">
                Faltan ${(total - cashNum).toFixed(2)}
              </p>
            )}
          </div>
        )}

        {/* Tarjeta info */}
        {paymentMethod === "tarjeta" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center animate-in slide-in-from-top-2 duration-200">
            <CreditCard className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-700">
              Cobra ${total.toFixed(2)} con la terminal
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Confirma cuando el pago haya sido procesado
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm || isProcessing}
            className="flex-1 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Confirmar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}