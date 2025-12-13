import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // or use '0.0.0.0'
    port: 5173,
    https: false, // Set to true if you have SSL certificates, or use a tool like mkcert
    // For Facebook login, you may need HTTPS. Install mkcert and run:
    // mkcert -install
    // mkcert localhost 127.0.0.1
    // Then set https: true and configure cert/key paths
  },
});
