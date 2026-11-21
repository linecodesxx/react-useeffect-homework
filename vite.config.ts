import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { demoApi } from './server/api.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), demoApi()],
})
