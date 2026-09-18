import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), "index.html"),
        zitie: resolve(process.cwd(), "zitie.html"),
        copybook: resolve(process.cwd(), "copybook.html")
      }
    }
  }
});
