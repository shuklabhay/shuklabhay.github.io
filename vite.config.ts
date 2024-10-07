import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

function copyDirectory(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-static-deps",
      closeBundle: () => {
        fs.copyFileSync("404.html", "dist/404.html");

        const srcDir = path.resolve(__dirname, "src/static");
        const destDir = path.resolve(__dirname, "dist/static");

        copyDirectory(srcDir, destDir);
      },
    },
  ],
  base: "/",
});
