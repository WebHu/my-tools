# Tools + AI - 在线工具集

[中文](README.md) | [English](README-EN.md)

一个使用 Vue 3 和现代 Web 技术构建的实用在线工具集合。

工具列表如下：
 - mermaid
 - markdown

## 功能特点

- **Mermaid 图表编辑器**：创建和编辑图表，实时预览
- **Markdown 编辑器**：编写和预览 Markdown 文档
- **深色/浅色主题**：切换主题以获得舒适的查看体验
- **多语言支持**：支持英文和中文

## 技术栈

- **Vue 3**：核心前端框架，使用组合式 API
- **Vite**：快速、现代的构建工具和开发服务器
- **Pinia**：Vue 应用的状态管理
- **Element Plus**：UI 组件库
- **Tailwind CSS**：实用优先的 CSS 框架
- **Vue Router**：Vue.js 官方路由
- **Vue I18n**：Vue.js 国际化插件
- **Mermaid**：基于 JavaScript 的图表工具
- **Marked**：Markdown 解析器和编译器

## 入门指南

### 前提条件

- Node.js 18.x 或更高版本
- npm 7.x 或更高版本

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/my-tools.git
cd my-tools

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
```

这将在 http://localhost:3000（或其他可用端口）启动开发服务器。

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

构建输出将位于 `dist` 目录中。

## SEO 优化

项目包含 SEO 优化：

```bash
# 生成网站地图
npm run generate-sitemap
```

## 项目结构

```
my-tools/
├── public/          # 静态资源，将按原样提供服务
├── scripts/         # 构建和实用脚本
├── src/
│   ├── assets/      # 将被构建工具处理的资源
│   ├── components/  # Vue 组件
│   ├── i18n/        # 国际化文件
│   ├── layouts/     # 布局组件
│   ├── router/      # Vue Router 配置
│   ├── stores/      # Pinia 存储
│   ├── tools/       # 工具特定组件和逻辑
│   ├── App.vue      # 根组件
│   └── main.ts      # 应用入口点
└── index.html       # HTML 模板
```

## 许可证

本项目采用 MIT 许可证 - 有关详细信息，请参阅 LICENSE 文件。

## 致谢

- 感谢所有使这个项目成为可能的优秀开源库