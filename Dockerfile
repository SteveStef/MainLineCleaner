# Use the official Node.js 20 Alpine image as the base
FROM node:20-alpine AS base

# -------------------------
# Dependencies (prod only)
# -------------------------
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev; \
  else echo "Lockfile not found." && exit 1; \
  fi

# -------------------------
# Builder (all deps)
# -------------------------
FROM base AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build arguments for NEXT_PUBLIC_ variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_API_KEY
ARG NEXT_PUBLIC_APPLICATION_FEE
ARG NEXT_PUBLIC_PARTIAL_REFUND
ARG NEXT_PUBLIC_FULL_REFUND
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID

# Set as environment variables for the build process
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_API_KEY=$NEXT_PUBLIC_GOOGLE_API_KEY
ENV NEXT_PUBLIC_APPLICATION_FEE=$NEXT_PUBLIC_APPLICATION_FEE
ENV NEXT_PUBLIC_PARTIAL_REFUND=$NEXT_PUBLIC_PARTIAL_REFUND
ENV NEXT_PUBLIC_FULL_REFUND=$NEXT_PUBLIC_FULL_REFUND
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=$NEXT_PUBLIC_PAYPAL_CLIENT_ID

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# -------------------------
# Runner
# -------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Prerender cache dir
RUN mkdir .next \
  && chown nextjs:nodejs .next

# Standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
