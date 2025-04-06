<template>
  <div class="mermaid-editor">
    <el-row :gutter="20" class="editor-container">
      <el-col :span="12">
        <el-card class="editor-card">
          <template #header>
            <div class="card-header">
              <span>编辑区</span>
              <el-button-group>
                <el-button type="primary" @click="updatePreview">
                  <el-icon><Refresh /></el-icon>
                  更新预览
                </el-button>
                <el-button type="success" @click="downloadSource">
                  <el-icon><Download /></el-icon>
                  下载源码
                </el-button>
                <el-button type="warning" @click="downloadImage">
                  <el-icon><Picture /></el-icon>
                  下载图片
                </el-button>
              </el-button-group>
            </div>
          </template>
          <el-input
            v-model="mermaidCode"
            type="textarea"
            :rows="20"
            placeholder="在此输入 Mermaid 代码"
            @input="debouncedUpdate"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="preview-card">
          <template #header>
            <div class="card-header">
              <span>预览区</span>
            </div>
          </template>
          <div class="preview-container" ref="previewContainer"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import mermaid from 'mermaid'
import { Refresh, Download, Picture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const mermaidCode = ref(`graph TD
    A[开始] --> B{判断}
    B -->|是| C[执行操作1]
    B -->|否| D[执行操作2]
    C --> E[结束]
    D --> E`)

const previewContainer = ref(null)
let debounceTimer = null

// 初始化 Mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
    curve: 'basis'
  }
})

// 更新预览
const updatePreview = async () => {
  if (!previewContainer.value) return
  
  try {
    const { svg } = await mermaid.render('mermaid-svg', mermaidCode.value)
    previewContainer.value.innerHTML = svg
  } catch (error) {
    ElMessage.error('渲染失败：' + error.message)
  }
}

// 防抖更新
const debouncedUpdate = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(updatePreview, 500)
}

// 下载源码
const downloadSource = () => {
  const blob = new Blob([mermaidCode.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mermaid-diagram.mmd'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 下载图片
const downloadImage = async () => {
  try {
    const svgElement = previewContainer.value.querySelector('svg')
    if (!svgElement) {
      ElMessage.warning('请先生成预览图')
      return
    }

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const pngUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = pngUrl
      a.download = 'mermaid-diagram.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  } catch (error) {
    ElMessage.error('下载图片失败：' + error.message)
  }
}

onMounted(() => {
  updatePreview()
})

onUnmounted(() => {
  clearTimeout(debounceTimer)
})
</script>

<style scoped>
.mermaid-editor {
  padding: 20px;
}

.editor-container {
  height: calc(100vh - 100px);
}

.editor-card,
.preview-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-container {
  height: calc(100% - 40px);
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  padding: 20px;
}

.preview-container svg {
  max-width: 100%;
  max-height: 100%;
}
</style> 