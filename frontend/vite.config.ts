import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/get_groups_from_fa": {
        target: "https://ruz.fa.ru/api/search?type=group",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
