# Revuu web app for Cloud Run. Build from the repo root.
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /repo

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
COPY packages/ui/package.json packages/ui/
COPY packages/config/package.json packages/config/
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY packages/config packages/config
COPY packages/ui packages/ui
COPY apps/web apps/web
ENV NEXT_STANDALONE=1 NODE_ENV=production
RUN pnpm --filter web build

FROM node:22-slim AS run
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=8080
WORKDIR /app
COPY --from=build --chown=node:node /repo/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/web/.next/static ./apps/web/.next/static
USER node
EXPOSE 8080
CMD ["node", "apps/web/server.js"]
