import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/lms/',
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3001,
    allowedHosts: ['higenlabs.in', 'www.higenlabs.in', 'automazior.in', 'www.automazior.in']
  },
  preview: {
    host: '0.0.0.0',
    port: 3001,
    allowedHosts: ['higenlabs.in', 'www.higenlabs.in', 'automazior.in', 'www.automazior.in']
  }
});

