import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-404",
      closeBundle: () => {
        fs.copyFileSync(
          path.join(process.cwd(), "404.html"),
          path.join(process.cwd(), "dist", "404.html")
        );
      },
    },
  ],
  base: "/",
});
