import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/Yalla_Dorababu",
  server: {
    proxy: {
      '/api': 'https://must-selective-invention-haiti.trycloudflare.com',
    },
  },
});
