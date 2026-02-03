import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  define: {
    // Permite que o código use process.env no navegador de forma segura
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || ''),
      SUPABASE_URL: JSON.stringify(process.env.SUPABASE_URL || ''),
      SUPABASE_ANON_KEY: JSON.stringify(process.env.SUPABASE_ANON_KEY || '')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});