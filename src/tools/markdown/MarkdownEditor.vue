 <template>
  <div class="p-4">
    <el-row :gutter="20" class="h-[calc(100vh-100px)]">
      <el-col :span="12">
        <el-card class="h-full bg-white dark:bg-gray-800">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">编辑区</span>
              <el-button-group>
                <el-button type="success" @click="downloadMarkdown">
                  <el-icon><Download /></el-icon>
                  下载 Markdown
                </el-button>
              </el-button-group>
            </div>
          </template>
          <el-input
            v-model="markdownContent"
            type="textarea"
            :rows="20"
            placeholder="在此输入 Markdown 内容"
            @input="updatePreview"
            class="h-[calc(100%-60px)]"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="h-full bg-white dark:bg-gray-800">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">预览区</span>
            </div>
          </template>
          <div class="preview-container prose dark:prose-invert max-w-none" v-html="renderedContent"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'
import { Download, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const markdownContent = ref(`# Markdown 编辑器

这是一个简单的 Markdown 编辑器示例。

## 功能特点

- 实时预览
- 支持 Markdown 语法
- 可以下载 Markdown 源码
- 可以下载 HTML 文件

## 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, Markdown!');
}
\`\`\`

## 表格示例

| 功能 | 描述 |
|------|------|
| 实时预览 | 输入时自动更新预览 |
| 下载功能 | 支持多种格式导出 |

## 图片示例

![示例图片](https://via.placeholder.com/150)

> 提示：这是一个引用示例
`)

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
})

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  return marked(markdownContent.value)
})

// 更新预览
const updatePreview = () => {
  // 实时预览通过 computed 属性自动处理
}

// 下载 Markdown 文件
const downloadMarkdown = () => {
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
.preview-container {
  height: calc(100% - 40px);
  overflow: auto;
  padding: 20px;
}
</style>