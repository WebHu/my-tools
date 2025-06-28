<template>
  <div class="mermaid-editor">
    <el-row :gutter="20" class="editor-container" :class="{ 'fullscreen-mode': isFullscreen }">
      <el-col :span="isFullscreen ? 0 : 12" v-show="!isFullscreen">
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
      <el-col :span="isFullscreen ? 24 : 12">
        <el-card class="preview-card" :class="{ 'fullscreen-card': isFullscreen }">
          <template #header>
            <div class="card-header">
              <span>{{ $t('tools.mermaid.preview') }}</span>
              <div class="button-group">
                <el-button 
                  v-if="isFullscreen" 
                  size="small" 
                  type="primary" 
                  @click="exitFullscreen"
                >
                  <el-icon><FullScreen /></el-icon>
                  {{ $t('tools.mermaid.exitFullscreen') }}
                </el-button>
                <el-button 
                  v-else 
                  size="small" 
                  type="primary" 
                  @click="enterFullscreen"
                >
                  <el-icon><FullScreen /></el-icon>
                  {{ $t('tools.mermaid.enterFullscreen') }}
                </el-button>
              </div>
            </div>
          </template>
          <div class="preview-container" ref="previewContainer"></div>
          <div v-if="isFullscreen" class="zoom-controls">
            <el-button-group>
              <el-button size="small" @click="zoomIn" :title="$t('tools.mermaid.zoomIn')">
                <el-icon><ZoomIn /></el-icon>
              </el-button>
              <el-button size="small" disabled class="zoom-level">
                {{ Math.round(zoomLevel * 100) }}%
              </el-button>
              <el-button size="small" @click="zoomOut" :title="$t('tools.mermaid.zoomOut')">
                <el-icon><ZoomOut /></el-icon>
              </el-button>
              <el-button size="small" @click="resetZoom" :title="$t('tools.mermaid.resetZoom')">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </el-button-group>
            <!-- <div class="drag-tip">
              <el-icon><InfoFilled /></el-icon> {{ $t('tools.mermaid.dragTip') }}
            </div> -->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Download, FullScreen, Picture, Refresh, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
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
const isFullscreen = ref<boolean>(false)
const zoomLevel = ref<number>(1)
const isPanning = ref<boolean>(false)
const panPosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })
const startPanPosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })

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
    applyZoom()
  } catch (error: any) {
    ElMessage.error(t('tools.mermaid.renderError') + error.message)
  }
}

// 应用缩放和平移
const applyZoom = (): void => {
  const svgElement = previewContainer.value?.querySelector('svg')
  if (svgElement) {
    svgElement.style.transform = `scale(${zoomLevel.value}) translate(${panPosition.value.x}px, ${panPosition.value.y}px)`
    svgElement.style.transformOrigin = 'center center'
    svgElement.style.transition = isPanning.value ? 'none' : 'transform 0.3s ease'
  }
}

// 开始平移
const startPan = (event: MouseEvent): void => {
  if (!isFullscreen.value || event.button !== 0) return
  
  isPanning.value = true
  startPanPosition.value = {
    x: event.clientX - panPosition.value.x,
    y: event.clientY - panPosition.value.y
  }
  
  // 改变鼠标样式
  if (previewContainer.value) {
    previewContainer.value.style.cursor = 'grabbing'
  }
}

// 平移中
const pan = (event: MouseEvent): void => {
  if (!isPanning.value) return
  
  panPosition.value = {
    x: (event.clientX - startPanPosition.value.x) / zoomLevel.value,
    y: (event.clientY - startPanPosition.value.y) / zoomLevel.value
  }
  
  applyZoom()
}

// 结束平移
const endPan = (): void => {
  isPanning.value = false
  
  // 恢复鼠标样式
  if (previewContainer.value) {
    previewContainer.value.style.cursor = 'grab'
  }
}

// 放大
const zoomIn = (): void => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.1, 3)
  applyZoom()
}

// 缩小
const zoomOut = (): void => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
  applyZoom()
}

// 重置缩放
const resetZoom = (): void => {
  zoomLevel.value = 1
  applyZoom()
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

// 鼠标滚轮缩放
const handleWheel = (event: WheelEvent): void => {
  if (!isFullscreen.value) return
  
  event.preventDefault()
  
  // 确定缩放方向
  const delta = event.deltaY || event.detail || 0
  
  if (delta > 0) {
    // 向下滚动，缩小
    zoomOut()
  } else {
    // 向上滚动，放大
    zoomIn()
  }
}

// 进入全屏模式
const enterFullscreen = (): void => {
  isFullscreen.value = true
  // 重置平移位置
  panPosition.value = { x: 0, y: 0 }
  // 延迟重新渲染图表以适应新尺寸
  setTimeout(() => {
    updatePreview()
    // 添加平移事件监听
    if (previewContainer.value) {
      previewContainer.value.style.cursor = 'grab'
      previewContainer.value.addEventListener('mousedown', startPan)
      previewContainer.value.addEventListener('wheel', handleWheel, { passive: false })
      window.addEventListener('mousemove', pan)
      window.addEventListener('mouseup', endPan)
    }
  }, 300)
}

// 退出全屏模式
const exitFullscreen = (): void => {
  isFullscreen.value = false
  // 重置缩放
  zoomLevel.value = 1
  // 重置平移位置
  panPosition.value = { x: 0, y: 0 }
  // 移除平移事件监听
  if (previewContainer.value) {
    previewContainer.value.style.cursor = ''
    previewContainer.value.removeEventListener('mousedown', startPan)
    previewContainer.value.removeEventListener('wheel', handleWheel)
    window.removeEventListener('mousemove', pan)
    window.removeEventListener('mouseup', endPan)
  }
  // 延迟重新渲染图表以适应新尺寸
  setTimeout(updatePreview, 300)
}

onMounted(() => {
  updatePreview()
})

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  // 清理事件监听
  window.removeEventListener('mousemove', pan)
  window.removeEventListener('mouseup', endPan)
  if (previewContainer.value) {
    previewContainer.value.removeEventListener('mousedown', startPan)
    previewContainer.value.removeEventListener('wheel', handleWheel)
  }
})
</script>

<style scoped>
.mermaid-editor {
  padding: 20px;
}

.editor-container {
  height: calc(100vh - 100px);
}

.editor-container.fullscreen-mode {
  height: 100vh;
}

.editor-card,
.preview-card {
  height: 100%;
}

.fullscreen-card {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  margin: 0;
  border-radius: 0;
  width: 100%;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 12px;
}

.button-group .el-button {
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: none;
  padding: 8px 16px;
  font-weight: 500;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
}

.button-group .el-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.button-group .el-button:hover::before {
  opacity: 1;
}

.button-group .el-button:active {
  transform: scale(0.96);
}

.button-group .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.button-group .el-button--success {
  background: linear-gradient(135deg, #42d392, #34b37c);
  border-color: transparent;
}

.button-group .el-button--warning {
  background: linear-gradient(135deg, #ffbe2e, #ff9e2c);
  border-color: transparent;
}

.button-group .el-button--primary {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border-color: transparent;
}

.button-group .el-icon {
  margin-right: 6px;
  font-size: 16px;
  vertical-align: middle;
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

.fullscreen-card .preview-container {
  height: calc(100vh - 60px);
  border-radius: 0;
}

.preview-container svg {
  max-width: 100%;
  max-height: 100%;
}

.zoom-controls {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10000;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.zoom-controls:hover {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.zoom-controls .el-button-group {
  display: flex;
  align-items: center;
}

.zoom-controls .el-button {
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  border: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.zoom-controls .el-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.zoom-controls .el-button:hover::before {
  opacity: 1;
}

.zoom-controls .el-button:active {
  transform: scale(0.96);
}

.zoom-controls .el-button:hover:not(.zoom-level) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.zoom-level {
  min-width: 60px;
  cursor: default;
  font-weight: bold;
  background: linear-gradient(to bottom, #f8f9fa, #ebeef5);
  color: #606266;
  border-color: transparent;
}

.drag-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 4px;
  background-color: rgba(144, 147, 153, 0.1);
}

.drag-tip .el-icon {
  color: #409eff;
  font-size: 14px;
}
</style>