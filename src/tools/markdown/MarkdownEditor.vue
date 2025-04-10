<template>
  <div class="markdown-editor">
    <el-row :gutter="20" class="editor-container" :class="{ 'fullscreen-mode': isFullscreen }">
      <el-col :span="isFullscreen ? 0 : 12" v-show="!isFullscreen">
        <el-card class="editor-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('tools.markdown.editor') }}</span>
              <div class="button-group">
                <el-button size="small" type="success" @click="downloadMarkdown">
                  <el-icon>
                    <Download />
                  </el-icon>
                  {{ $t('tools.markdown.downloadMarkdown') }}
                </el-button>
              </div>
            </div>
          </template>
          <el-input
            v-model="markdownContent"
            type="textarea"
            :rows="30"
            :placeholder="$t('tools.markdown.placeholder')"
            class="code-editor"
          />
        </el-card>
      </el-col>
      <el-col :span="isFullscreen ? 24 : 12">
        <el-card class="preview-card" :class="{ 'fullscreen-card': isFullscreen }">
          <template #header>
            <div class="card-header">
              <span>{{ $t('tools.markdown.preview') }}</span>
              <div class="button-group">
                <el-button 
                  v-if="isFullscreen" 
                  size="small" 
                  type="primary" 
                  @click="exitFullscreen"
                >
                  <el-icon><FullScreen /></el-icon>
                  {{ $t('tools.markdown.exitFullscreen') }}
                </el-button>
                <el-button 
                  v-else 
                  size="small" 
                  type="primary" 
                  @click="enterFullscreen"
                >
                  <el-icon><FullScreen /></el-icon>
                  {{ $t('tools.markdown.enterFullscreen') }}
                </el-button>
              </div>
            </div>
          </template>
          <div class="preview-container prose dark:prose-invert max-w-none" v-html="renderedContent"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Download, FullScreen } from '@element-plus/icons-vue'
import { marked } from 'marked'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const markdownContent = ref<string>(`# ${t('tools.markdown.title')}

${t('tools.markdown.description')}

## ${t('tools.markdown.features')}

- ${t('tools.markdown.feature1')}
- ${t('tools.markdown.feature2')}
- ${t('tools.markdown.feature3')}
- ${t('tools.markdown.feature4')}

## ${t('tools.markdown.code')}

\`\`\`javascript
function hello() {
  console.log('Hello, Markdown!');
}
\`\`\`

## ${t('tools.markdown.table')}

| ${t('tools.markdown.feature')} | ${t('tools.markdown.description')} |
|------|------|
| ${t('tools.markdown.preview')} | ${t('tools.markdown.previewDesc')} |
| ${t('tools.markdown.export')} | ${t('tools.markdown.exportDesc')} |

## ${t('tools.markdown.image')}

![${t('tools.markdown.imageAlt')}](https://via.placeholder.com/150)

> ${t('tools.markdown.quote')}
`)

// 添加全屏状态控制
const isFullscreen = ref<boolean>(false)

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
})

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  return marked.parse(markdownContent.value)
})

// 下载 Markdown 文件
const downloadMarkdown = (): void => {
  const blob = new Blob([markdownContent.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'markdown-document.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 进入全屏模式
const enterFullscreen = (): void => {
  isFullscreen.value = true
}

// 退出全屏模式
const exitFullscreen = (): void => {
  isFullscreen.value = false
}
</script>

<style scoped>
.markdown-editor {
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
  height: calc(100% - 20px);
}

.preview-container {
  height: calc(100% - 40px);
  overflow: auto;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.fullscreen-card .preview-container {
  height: calc(100vh - 60px);
  border-radius: 0;
}

/* 暗黑模式样式 */
html.dark .preview-container {
  background-color: #1e1e1e;
  color: #ddd;
}

/* 确保预览区在暗黑模式下可读性良好 */
.prose.dark\:prose-invert :deep(pre) {
  background-color: #282c34;
  color: #abb2bf;
}

.prose.dark\:prose-invert :deep(code) {
  color: #c678dd;
}

.prose.dark\:prose-invert :deep(a) {
  color: #61afef;
}

.prose.dark\:prose-invert :deep(blockquote) {
  border-left-color: #4b5563;
  color: #9ca3af;
}

.prose.dark\:prose-invert :deep(h1),
.prose.dark\:prose-invert :deep(h2),
.prose.dark\:prose-invert :deep(h3),
.prose.dark\:prose-invert :deep(h4),
.prose.dark\:prose-invert :deep(h5),
.prose.dark\:prose-invert :deep(h6) {
  color: #e5e7eb;
}

.prose.dark\:prose-invert :deep(hr) {
  border-color: #4b5563;
}

.prose.dark\:prose-invert :deep(table) {
  border-color: #4b5563;
}

.prose.dark\:prose-invert :deep(th),
.prose.dark\:prose-invert :deep(td) {
  border-color: #4b5563;
}
</style>