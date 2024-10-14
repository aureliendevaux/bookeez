FROM node:20.18-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable; \
    corepack prepare pnpm@latest --activate; \
    pnpm add -g pnpm npm-check-updates;

USER node

WORKDIR /home/node/app
