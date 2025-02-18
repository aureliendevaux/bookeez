FROM node:lts-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g corepack@latest; \
    corepack enable; \
    corepack prepare pnpm@latest --activate; \
    pnpm self-update; \
    pnpm add -g npm-check-updates;

USER node

WORKDIR /home/node/app
