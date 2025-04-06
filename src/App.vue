<template>
  <el-container class="layout-container">
    <el-aside width="150px" class="aside-container">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical"
        @select="handleSelect"
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/mermaid">
          <el-icon><DataLine /></el-icon>
          <span>Mermaid</span>
        </el-menu-item>
        <el-menu-item index="/markdown">
          <el-icon><Document /></el-icon>
          <span>Markdown</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header-container">
        <h2>我的工具集</h2>
        <div class="header-right">
          <el-button circle @click="toggleTheme">
            <el-icon>
              <component :is="themeStore.isDark ? Sunny : Moon" />
            </el-icon>
          </el-button>
        </div>
      </el-header>
      <el-main class="main-container">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HomeFilled, DataLine, Document, Sunny, Moon } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const route = useRoute()
const activeIndex = ref(route.path)
const themeStore = useThemeStore()

const handleSelect = (key: string): void => {
  router.push(key)
}

const toggleTheme = (): void => {
  themeStore.toggleTheme()
  console.log('主题已切换，当前状态:', themeStore.isDark ? 'dark' : 'light')
  console.log('HTML 类名:', document.documentElement.className)
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside-container {
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
}

.header-container {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main-container {
  background-color: var(--el-bg-color-page);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

/* 添加暗黑模式样式覆盖 */
html.dark .aside-container,
html.dark .header-container {
  background-color: #1a1a1a;
  color: #ffffff;
}

html.dark .main-container {
  background-color: #121212;
  color: #ffffff;
}
</style>