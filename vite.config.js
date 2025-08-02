import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/Yalla_Dorababu",
  server: {
    proxy: {
      '/api': 'https://0d3d3f66cf63.ngrok-free.app',
    },
  },
});
