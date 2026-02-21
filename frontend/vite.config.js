import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        // Rewrite `/api/Users/index` -> `/gym-management-system/public/index.php?url=Users/index`
        rewrite: (path) => path.replace(/^\/api\/?(.*)/, (_match, p1) => {
          if (p1 && p1.length) return `/gym-management-system/public/index.php?url=${p1}`;
          return '/gym-management-system/public/index.php';
        }),
      }
    }
  }
})
