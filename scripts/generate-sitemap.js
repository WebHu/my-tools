import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';

// 导入你的路由配置或手动定义路由
const routes = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/mermaid', changefreq: 'weekly', priority: 0.8 },
  { path: '/markdown', changefreq: 'weekly', priority: 0.8 }
];

// 创建 sitemap
const sitemap = new SitemapStream({ hostname: 'https://aifindbest.com' });

// 将路由添加到 sitemap
routes.forEach(route => {
  sitemap.write({
    url: route.path,
    changefreq: route.changefreq,
    priority: route.priority,
    lastmod: new Date().toISOString()
  });
});

// 结束 sitemap
sitemap.end();

// 将 sitemap 写入文件
streamToPromise(sitemap)
  .then(sm => {
    // 写入到 public 目录
    const writeStream = createWriteStream(resolve('./public/sitemap.xml'));
    writeStream.write(sm.toString());
    writeStream.end();
    console.log('Sitemap generated successfully!');
  })
  .catch(error => {
    console.error('Error generating sitemap:', error);
  });