# 部署指南

## 项目概述
赣州市纪委监委大模型应用平台 - 智能问答系统

## 部署方式

### 方式一：Vercel 部署（推荐）

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
cd d:\znwda
vercel --prod
```

### 方式二：Nginx 部署

1. **构建项目**
```bash
npm run build
```

2. **复制构建文件到服务器**
```bash
# 使用 scp 或 ftp 将 dist 目录上传到服务器
scp -r dist/* user@your-server:/var/www/znwda/dist
```

3. **配置 Nginx**
- 将 `nginx.conf` 复制到 `/etc/nginx/sites-available/znwda`
- 创建软链接：
```bash
ln -s /etc/nginx/sites-available/znwda /etc/nginx/sites-enabled/
```

4. **重启 Nginx**
```bash
sudo systemctl restart nginx
```

### 方式三：Docker 部署

1. **创建 Dockerfile**
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **构建镜像**
```bash
docker build -t znwda .
```

3. **运行容器**
```bash
docker run -d -p 80:80 --name znwda znwda
```

### 方式四：静态文件托管

直接将 `dist` 目录部署到以下平台：
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3

## 环境变量

项目当前为纯前端项目，无需后端环境变量。如需连接后端 API，可在 `src/store/` 中配置 API 地址。

## 构建命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
dist/
├── assets/
│   ├── index-*.css
│   └── index-*.js
├── favicon.svg
└── index.html
```

## 注意事项

1. 确保 Node.js 版本 >= 18.x
2. 构建前确保依赖已安装：`npm install`
3. 如果部署到子目录，需修改 `vite.config.ts` 中的 `base` 配置
