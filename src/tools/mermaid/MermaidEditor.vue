<template>
  <div class="mermaid-editor">
    <el-row :gutter="20" class="editor-container">
      <el-col :span="12">
        <el-card class="editor-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('tools.mermaid.editor') }}</span>
              <div class="button-group">
                <el-button size="small" type="success" @click="downloadSource">
                  <el-icon><Download /></el-icon>
                  {{ $t('tools.mermaid.downloadSource') }}
                </el-button>
                <el-button size="small" type="warning" @click="downloadImage">
                  <el-icon><Picture /></el-icon>
                  {{ $t('tools.mermaid.downloadImage') }}
                </el-button>
              </div>
            </div>
          </template>
          <el-input
            v-model="mermaidCode"
            type="textarea"
            :rows="30"
            :placeholder="$t('tools.mermaid.placeholder')"
            @input="debouncedUpdate"
            class="code-editor"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="preview-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('tools.mermaid.preview') }}</span>
            </div>
          </template>
          <div class="preview-container" ref="previewContainer"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Download, Picture, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import mermaid from 'mermaid'
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const mermaidCode = ref<string>(`graph TD
    A[开始] --> B{判断}
    B -->|是| C[执行操作1]
    B -->|否| D[执行操作2]
    C --> E[结束]
    D --> E`)

const previewContainer = ref<HTMLElement | null>(null)
let debounceTimer: number | null = null

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
const updatePreview = async (): Promise<void> => {
  if (!previewContainer.value) return
  
  try {
    const { svg } = await mermaid.render('mermaid-svg', mermaidCode.value)
    previewContainer.value.innerHTML = svg
  } catch (error: any) {
    ElMessage.error(t('tools.mermaid.renderError') + error.message)
  }
}

// 防抖更新
const debouncedUpdate = (): void => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(updatePreview, 500)
}

// 下载源码
const downloadSource = (): void => {
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
const downloadImage = async (): Promise<void> => {
  try {
    const svgElement = previewContainer.value?.querySelector('svg')
    if (!svgElement) {
      ElMessage.warning(t('tools.mermaid.generatePreviewFirst'))
      return
    }

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      ElMessage.error(t('tools.mermaid.canvasError'))
      return
    }
    
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
  } catch (error: any) {
    ElMessage.error(t('tools.mermaid.downloadError') + error.message)
  }
}

onMounted(() => {
  updatePreview()
})

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
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

.button-group {
  display: flex;
  gap: 3px;
}

.code-editor :deep(.el-textarea__inner) {
  font-family: 'Fira Code', Monaco, Consolas, 'Courier New', monospace;
  line-height: 1.6;
  padding: 12px;
  font-size: 14px;
  background-color: #282c34;
  color: #abb2bf;
  border-radius: 4px;
  tab-size: 2;
}

.preview-container {
  height: calc(100% - 40px);
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
}

.preview-container svg {
  max-width: 100%;
  max-height: 100%;
}
</style>