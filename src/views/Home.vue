<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="8" v-for="tool in tools" :key="tool.path">
        <el-card class="tool-card" @click="navigateTo(tool.path)">
          <template #header>
            <div class="card-header">
              <el-icon><component :is="tool.icon" /></el-icon>
              <span>{{ tool.name }}</span>
            </div>
          </template>
          <div class="card-content">
            {{ tool.description }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { HomeFilled, DataLine, Document } from '@element-plus/icons-vue'

const router = useRouter()

const tools = [
  {
    name: 'Mermaid',
    path: '/mermaid',
    icon: 'DataLine',
    description: '在线 Mermaid 图表编辑器，支持流程图、时序图等多种图表类型'
  },
  {
    name: 'Markdown',
    path: '/markdown',
    icon: 'Document',
    description: 'Markdown 编辑器，支持实时预览和导出'
  }
]

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.tool-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-content {
  color: #666;
  font-size: 14px;
}
</style> 