import tools from '@/config/tools'
import i18n from '@/i18n'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainLayout from '../components/layout/MainLayout.vue'

const { t } = i18n.global

// 构建工具路由
const toolRoutes = tools.map(tool => ({
  path: `tools/${tool.id}`,
  name: tool.id.charAt(0).toUpperCase() + tool.id.slice(1),
  component: tool.component,
  meta: {
    title: t(`tools.${tool.id}.title`),
    description: t(`tools.${tool.id}.description`),
    keywords: t(`tools.${tool.id}.keywords`),
    keepAlive: tool.keepAlive
  }
}))

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: t('home.title'),
          description: t('home.description'),
          keywords: t('home.keywords')
        }
      },
      ...toolRoutes
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由变化时更新页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${t('app.name')}`
  }
  next()
})

export default router