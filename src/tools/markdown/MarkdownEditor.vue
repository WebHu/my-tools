<template>
  <div class="markdown-editor">
    <el-row :gutter="20" class="editor-container">
      <el-col :span="12">
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
      <el-col :span="12">
        <el-card class="preview-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('tools.markdown.preview') }}</span>
            </div>
          </template>
          <div class="preview-container prose dark:prose-invert max-w-none" v-html="renderedContent"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'
import { marked } from 'marked'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const markdownContent = ref<string>(`# ${t('tools.markdown.example.title')}

${t('tools.markdown.example.description')}

## ${t('tools.markdown.example.features')}

- ${t('tools.markdown.example.feature1')}
- ${t('tools.markdown.example.feature2')}
- ${t('tools.markdown.example.feature3')}
- ${t('tools.markdown.example.feature4')}

## ${t('tools.markdown.example.code')}

\`\`\`javascript
function hello() {
  console.log('Hello, Markdown!');
}
\`\`\`

## ${t('tools.markdown.example.table')}

| ${t('tools.markdown.example.feature')} | ${t('tools.markdown.example.description')} |
|------|------|
| ${t('tools.markdown.example.preview')} | ${t('tools.markdown.example.previewDesc')} |
| ${t('tools.markdown.example.export')} | ${t('tools.markdown.example.exportDesc')} |

## ${t('tools.markdown.example.image')}

![${t('tools.markdown.example.imageAlt')}](https://via.placeholder.com/150)

> ${t('tools.markdown.example.quote')}
`)

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
</script>

<style scoped>
.markdown-editor {
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
  height: calc(100% - 20px);
}

.preview-container {
  height: calc(100% - 40px);
  overflow: auto;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
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