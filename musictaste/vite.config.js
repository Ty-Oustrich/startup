// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

//top is previous version

import { defineConfig } from 'vite';
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});