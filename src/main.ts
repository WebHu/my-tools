import App from '@/App.vue'
import i18n from '@/i18n/index'
import router from '@/router'
import pinia from '@/stores'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 支持主题切换
import { createHead } from '@vueuse/head'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { createApp } from 'vue'
import './styles/main.css'
const app = createApp(App)
const head = createHead()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.use(head)
app.use(i18n)
app.mount('#app')