import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-static-deps",
      closeBundle: () => {
        fs.copyFileSync("404.html", "dist/404.html");
      },
    },
  ],
  base: "/",
});
