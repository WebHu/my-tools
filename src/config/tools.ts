import { DataLine, Document } from '@element-plus/icons-vue'

export interface Tool {
  id: string;
  icon: string;
  component: () => Promise<any>;
  meta: {
    keepAlive?: boolean;
  };
}

const tools: Tool[] = [
  {
    id: 'mermaid',
    icon: 'DataLine',
    component: () => import('@/tools/mermaid/MermaidEditor.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    id: 'markdown',
    icon: 'Document',
    component: () => import('@/tools/markdown/MarkdownEditor.vue'),
    meta: {
      keepAlive: false
    }
  }
]

export default tools