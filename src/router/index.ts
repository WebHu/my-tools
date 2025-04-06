import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/mermaid',
    name: 'Mermaid',
    component: () => import('@/tools/mermaid/MermaidEditor.vue')
  },
  {
    path: '/markdown',
    name: 'Markdown',
    component: () => import('@/tools/markdown/MarkdownEditor.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router