import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/charts-lab",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        "404": "404.html",
        index: "index.html",
      },
    },
  },
});
