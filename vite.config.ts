import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-404",
      closeBundle: () => {
        try {
          const sourceFile = path.resolve(__dirname, "404.html");
          const targetFile = path.resolve(__dirname, "dist/404.html");

          console.log("Copying 404.html:");
          console.log("From:", sourceFile);
          console.log("To:", targetFile);

          if (!fs.existsSync(sourceFile)) {
            console.error("Source 404.html not found at:", sourceFile);
            return;
          }

          fs.copyFileSync(sourceFile, targetFile);
          console.log("404.html copied successfully");
        } catch (error) {
          console.error("Error copying 404.html:", error);
        }
      },
    },
  ],
  base: "/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
});
