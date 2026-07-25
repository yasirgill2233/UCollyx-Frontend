import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5180,
    // Dynamic preview host allow kar do
    allowedHosts: [
      'preview.ucollyx.com',
      '.ucollyx.com', // Wildcard subdomains allow karne ke liye
    ],
    // Ya agar aap har kisi host ko allow karna chahte hain Sandbox environment main:
    // allowedHosts: true
  }
})
