import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {  
    // Ya agar aap har kisi host ko allow karna chahte hain Sandbox environment main:
    allowedHosts: true
  }
})
