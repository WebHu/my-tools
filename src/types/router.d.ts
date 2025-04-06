import 'vue-router'
//  声明对 vue-router 模块的类型扩展，为路由添加新的类型定义。(用于seo)
declare module 'vue-router' {
    // 扩展 RouteMeta 接口，定义路由元信息（meta）的字段类型。这些字段可以在路由配置中通过 meta 属性使用
  interface RouteMeta {
    title?: string
    description?: string
    keywords?: string
    requiresAuth?: boolean
    keepAlive?: boolean
  }
}