import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/Yalla_Dorababu",
  server: {
    proxy: {
      '/api': 'https://fe3fe2d1b8b1.ngrok-free.app', // Updated to use new ngrok URL
    },
  },
});
