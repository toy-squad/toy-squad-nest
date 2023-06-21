# 프로젝트 빌드
FROM node:16-buster AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
ENV NODE_ENV production

COPY . .
RUN npm run build

# Production 런타임 - nginx
FROM nginxinc/nginx-unprivileged:1.23 AS runner
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .

EXPOSE 3001
CMD ["npm", "start"]
