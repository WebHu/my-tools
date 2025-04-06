# Tools + AI - Online Utility Suite

[English](README.md) | [中文](README.zh-CN.md)

A collection of practical online tools built with Vue 3 and modern web technologies.


The tool list is as follows:
 - mermaid
 - markdown

## Features

- **Mermaid Diagram Editor**: Create and edit diagrams with real-time preview
- **Markdown Editor**: Write and preview Markdown documents
- **Dark/Light Theme**: Switch between themes for comfortable viewing
- **Multilingual Support**: Available in English and Chinese

## Tech Stack

- **Vue 3**: Core frontend framework with Composition API
- **Vite**: Fast, modern build tool and development server
- **Pinia**: State management for Vue applications
- **Element Plus**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **Vue Router**: Official router for Vue.js
- **Vue I18n**: Internationalization plugin for Vue.js
- **Mermaid**: JavaScript based diagramming and charting tool
- **Marked**: Markdown parser and compiler

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 7.x or later

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/my-tools.git
cd my-tools

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

This will start the development server at http://localhost:3000 (or another available port).

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist` directory.

## SEO Optimization

The project includes SEO optimization with:

```bash
# Generate sitemap
npm run generate-sitemap
```

## Project Structure

```
my-tools/
├── public/          # Static assets that will be served as-is
├── scripts/         # Build and utility scripts
├── src/
│   ├── assets/      # Assets that will be processed by the build tools
│   ├── components/  # Vue components
│   ├── i18n/        # Internationalization files
│   ├── layouts/     # Layout components
│   ├── router/      # Vue Router configuration
│   ├── stores/      # Pinia stores
│   ├── tools/       # Tool-specific components and logic
│   ├── App.vue      # Root component
│   └── main.ts      # Application entry point
└── index.html       # HTML template
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the amazing open-source libraries that made this project possible