FROM node:22-alpine AS dependencies

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node app.js package.json ./
USER node
EXPOSE 3000
CMD ["node", "app.js"]
