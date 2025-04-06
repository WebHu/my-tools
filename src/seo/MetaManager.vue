<!-- 用来管理网站SEO元数据的组件。使用@vueuse/head库来动态设置每个页面的HTML<head>内容 -->
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useI18n()

const siteTitle = 'Tools + AI'
const siteDescription = t('home.description')
const siteKeywords = '工具集,Mermaid,Markdown,编辑器,在线工具,online tool'

// 定义 meta 对象的类型
interface PageMeta {
  title: string
  meta: Array<{
    name?: string
    property?: string
    content: string
  }>
}

const meta = computed<PageMeta>(() => {
  const title = route.meta.title 
    ? `${route.meta.title} - ${siteTitle}`
    : siteTitle
  
  const description = route.meta.description || siteDescription
  const keywords = route.meta.keywords || siteKeywords

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  }
})

useHead(meta)
</script>