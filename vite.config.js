import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    lib: {
      entry: "src/lib-entry.jsx",
      name: "ChatBot",
      formats: ["es"],
      fileName: () => "chatbot.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "ReactJsxRuntime",
        },
      },
    },
  },
});


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   define: {
//     "process.env.NODE_ENV": JSON.stringify("production"),
//   },
//   build: {
//     lib: {
//       entry: "src/webcomponent.jsx",
//       name: "Chatbot",
//       fileName: () => "chatbot.js",
//       formats: ["umd"],
//     },
//   },
// });