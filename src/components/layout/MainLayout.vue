<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" class="logo-img">
        <span class="logo-text" v-show="!isCollapse">{{ $t('app.name') }}</span>
      </div>
      <el-menu
        :default-active="route.path"
        class="menu"
        :router="true"
        :collapse="isCollapse"
        :background-color="isDark ? '#1a1a1a' : '#fff'"
        :text-color="isDark ? '#fff' : '#333'"
        :active-text-color="isDark ? '#409EFF' : '#409EFF'"
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <template #title>{{ $t('menu.home') }}</template>
        </el-menu-item>
        <el-sub-menu index="/tools">
          <template #title>
            <el-icon><Tools /></el-icon>
            <span>{{ $t('menu.tools') }}</span>
          </template>
          <el-menu-item 
            v-for="tool in tools" 
            :key="tool.id" 
            :index="`/tools/${tool.id}`"
          >
            <el-icon><component :is="tool.icon" /></el-icon>
            <template #title>{{ $t(`tools.${tool.id}.title`) }}</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-button
            type="text"
            @click="toggleCollapse"
            class="collapse-btn"
          >
            <el-icon :size="20">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
          </el-button>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ currentLang === 'zh' ? '中文' : 'English' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh">中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            type="text"
            @click="toggleTheme"
            class="theme-btn"
          >
            <el-icon :size="20">
              <Sunny v-if="isDark" />
              <Moon v-else />
            </el-icon>
          </el-button>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import tools from '@/config/tools'
import {
  HomeFilled,
  Tools,
  Fold,
  Expand,
  ArrowDown,
  Sunny,
  Moon,
  DataLine,
  Document
} from '@element-plus/icons-vue'

const route = useRoute()
const { locale } = useI18n()
const themeStore = useThemeStore()

const isCollapse = ref(false)
const isDark = computed(() => themeStore.isDark)

const currentLang = computed(() => locale.value)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const handleCommand = (command) => {
  locale.value = command
  localStorage.setItem('locale', command)
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.aside {
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color);
  overflow: hidden;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu {
  border-right: none;
  height: calc(100vh - 60px);
}

.header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn,
.theme-btn {
  padding: 0;
  margin: 0;
}

.main {
  background-color: var(--el-bg-color-page);
  padding: 20px;
  width: 100%;
  height: calc(100vh - 60px);
  overflow: auto;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-9) !important;
}

:deep(.el-menu-item:hover) {
  background-color: var(--el-color-primary-light-9) !important;
}

/* 优化折叠菜单样式 */
:deep(.el-menu--collapse) {
  width: 64px;
}

/* 折叠时隐藏菜单文字，只保留图标 */
:deep(.el-menu--collapse .el-sub-menu__title span) {
  display: none;
}

:deep(.el-menu--collapse .el-sub-menu__icon-arrow) {
  display: none;
}

/* 针对工具编辑器的样式优化 */
:deep(.tool-content) {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

:deep(.tool-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

:deep(.tool-body) {
  display: flex;
  flex: 1;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid var(--el-border-color-light);
}

:deep(.editor-panel), :deep(.preview-panel) {
  flex: 1;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

:deep(.editor-panel) {
  border-right: 1px solid var(--el-border-color-light);
}

:deep(.panel-header) {
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color);
  font-weight: bold;
}

:deep(.panel-content) {
  flex: 1;
  padding: 16px;
  overflow: auto;
}

:deep(.editor-content) {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  resize: none;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  background-color: var(--el-bg-color-dark);
  color: var(--el-text-color-primary);
  padding: 16px;
}

:deep(.preview-content) {
  padding: 16px;
  background-color: var(--el-bg-color);
}

/* 响应式布局优化 */
@media screen and (max-width: 768px) {
  .aside {
    position: absolute;
    z-index: 10;
    height: 100vh;
  }
  
  .main {
    padding: 16px;
  }
  
  :deep(.tool-body) {
    flex-direction: column;
  }
  
  :deep(.editor-panel), :deep(.preview-panel) {
    height: 50%;
  }
  
  :deep(.editor-panel) {
    border-right: none;
    border-bottom: 1px solid var(--el-border-color-light);
  }
}
</style>