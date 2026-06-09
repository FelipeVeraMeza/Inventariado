import { motion, AnimatePresence } from "framer-motion";
import { Check, PartyPopper } from "lucide-react";

export default function SuccessOverlay({ show, total, paymentMethod, change }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">¡Venta registrada!</h2>
            <p className="text-lg font-mono font-bold text-primary mb-1">${total?.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground capitalize">
              Pagado con {paymentMethod}
              {paymentMethod === "efectivo" && change > 0 && (
                <span className="block mt-1 text-green-600 font-medium">
                  Cambio: ${change?.toFixed(2)}
                </span>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}