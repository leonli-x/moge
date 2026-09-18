import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), "home.html"),
        learning: resolve(process.cwd(), "index.html"),
        copybook: resolve(process.cwd(), "copybook.html")
      }
    }
  }
});
