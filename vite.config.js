import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/olevel-math-gps/', // Add this line matching your exact repository name!
})
