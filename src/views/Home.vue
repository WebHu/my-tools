<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="8" v-for="tool in tools" :key="tool.id">
        <el-card class="tool-card" @click="navigateTo(`/tools/${tool.id}`)">
          <template #header>
            <div class="card-header">
              <el-icon><component :is="tool.icon" /></el-icon>
              <span>{{ $t(`tools.${tool.id}.title`) }}</span>
            </div>
          </template>
          <div class="card-content">
            {{ $t(`tools.${tool.id}.description`) }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import tools from '@/config/tools'

const router = useRouter()

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