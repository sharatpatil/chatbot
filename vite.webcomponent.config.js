import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    lib: {
      entry: "src/webcomponent.jsx",
      name: "ChatBotWebComponent",
      formats: ["es", "umd"],
      fileName: (format) => `webcomponent.${format === "es" ? "es.js" : "umd.js"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
