FROM node:14-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /kanban-fe
COPY package.json package-lock.json ./ 
RUN npm ci

FROM node:16-alpine AS builder
WORKDIR /kanban-fe
COPY --from=deps /kanban-fe/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /kanban-fe

ENV NODE_ENV production
ENV DOCKER_API api

ENV NEXT_TELEMETRY_DISABLED 1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /kanban-fe/next.config.js ./
# COPY --from=builder /kanban-fe/public ./public
# COPY --from=builder /kanban-fe/package.json ./package.json
COPY --from=builder /kanban-fe/public ./public
COPY --from=builder /kanban-fe/.next ./.next
COPY --from=builder /kanban-fe/node_modules ./node_modules
COPY --from=builder /kanban-fe/package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /kanban-fe/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /kanban-fe/.next/static ./.next/static

# USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "start"]
