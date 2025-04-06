import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
// 支持主题切换
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import { Component, createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import './style.css';
import './styles/main.css';
const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue) as [string, Component][]) {
  app.component(key, component)
}

app.use(router)
app.use(pinia)
app.use(ElementPlus)

app.mount('#app')