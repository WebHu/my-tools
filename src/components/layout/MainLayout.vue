 <template>
  <el-container class="layout-container">
    <el-aside width="150px">
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
      <el-header>
        <h2>我的工具集</h2>
        <div class="header-right">
          <el-button
            :icon="isDark ? 'Sunny' : 'Moon'"
            circle
            @click="toggleTheme"
          />
              <div class="mt-4 p-4 bg-white dark:bg-black text-black dark:text-white border rounded">
      当前主题: {{ themeStore.isDark ? '暗色' : '亮色' }}
    </div>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HomeFilled, DataLine, Document, Sunny, Moon } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const route = useRoute()
const activeIndex = ref(route.path)
const themeStore = useThemeStore()
const isDark = ref(themeStore.isDark)

const handleSelect = (key) => {
  router.push(key)
}

const toggleTheme = () => {
  themeStore.toggleTheme()
  isDark.value = themeStore.isDark
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.el-aside {
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}
</style>