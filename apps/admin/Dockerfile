FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/admin/package.json apps/admin/package.json
COPY apps/website/package.json apps/website/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY apps ./apps
RUN npm --workspace apps/admin run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/admin/.next ./apps/admin/.next
COPY --from=build /app/apps/admin/app ./apps/admin/app
COPY --from=build /app/apps/admin/public ./apps/admin/public
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/admin/next.config.ts ./apps/admin/next.config.ts
COPY apps/admin/tsconfig.json ./apps/admin/tsconfig.json
COPY apps/admin/next-env.d.ts ./apps/admin/next-env.d.ts
COPY package.json package-lock.json ./
EXPOSE 3001
CMD ["npm", "--workspace", "apps/admin", "run", "start"]
