import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  assetsInclude: ['./src/assets/**/*'],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['color-functions', 'global-builtin', 'import']
      }
    }
  },
  server: {
    // Enable fast refresh
    hmr: false,
    // Use native file watching
    watch: {
      usePolling: false
    },
    port: 3010,
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'LiquidGlass',
      formats: ['es'],
      fileName: 'liquid-glass'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})

