import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias "@/..." → "src/..." (antes lo proveía el plugin de Base44).
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
