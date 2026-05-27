FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/website/package.json apps/website/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY apps ./apps
RUN npm --workspace apps/website run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/website/.next ./apps/website/.next
COPY --from=build /app/apps/website/app ./apps/website/app
COPY --from=build /app/apps/website/public ./apps/website/public
COPY apps/website/package.json ./apps/website/package.json
COPY apps/website/next.config.ts ./apps/website/next.config.ts
COPY apps/website/tsconfig.json ./apps/website/tsconfig.json
COPY apps/website/next-env.d.ts ./apps/website/next-env.d.ts
COPY package.json package-lock.json ./
EXPOSE 3000
CMD ["npm", "--workspace", "apps/website", "run", "start"]
