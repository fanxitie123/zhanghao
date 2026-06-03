FROM nginx:alpine

# 复制构建文件到 nginx 目录
COPY dist /usr/share/nginx/html

# 复制自定义配置（如果需要）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
