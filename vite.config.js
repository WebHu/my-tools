import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
//支持在 <script setup> 中定义组件名
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
//自动导入 Vue 相关 API
import AutoImport from 'unplugin-auto-import/vite'
// 生产环境 gzip 压缩
import viteCompression from 'vite-plugin-compression'
// Vue 开发工具
import VueDevTools from "vite-plugin-vue-devtools"

// 路径解析
const pathResolve = (dir) => resolve(__dirname, dir)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [
      vue(),
      vueSetupExtend(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: './auto-imports.d.ts',
      }),
      viteCompression({
        deleteOriginFile: false,
      }),
      VueDevTools(),
    ],
    resolve: {
      alias: {
        '@': pathResolve('./src'),
        '/@': pathResolve('./src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      }
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT || 3000),
      open: env.VITE_OPEN === 'true',
      hmr: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    build: {
      sourcemap: false,
      outDir: 'dist',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
          }
        }
      }
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        '@element-plus/icons-vue',
        'vue-i18n'
      ]
    },
    define: {
      __VUE_I18N_LEGACY_API__: JSON.stringify(false),
      __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
      __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
    }
  }
})