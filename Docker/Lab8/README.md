# Lab 8: Containerized Node.js and MySQL Stack Using Docker Compose

**Goal:** Run the Node.js application with MySQL through Docker Compose, using a custom network, health-gated startup, and persistent logs and database data.

**Environment:** Ubuntu on WSL 2 with Docker Desktop and Docker Compose (see the [root README](../../README.md)).

**Source application:** [iVolveApp on GitHub](https://github.com/Ibrahim-Adel15/iVolveApp).

## Dockerfile Used

```dockerfile
FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --chown=node:node . .
RUN mkdir -p /app/logs && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

## Compose File Used

```yaml
services:
  app:
    build: .
    image: ${DOCKERHUB_USERNAME:-your-dockerhub-username}/ivolve-app:latest
    ports:
      - "3000:3000"
    environment:
      DB_HOST: mysql
      DB_USER: ivolve
      DB_PASSWORD: ${DB_PASSWORD:?Set DB_PASSWORD in .env}
      DB_NAME: ivolve
    volumes:
      - app_logs:/app/logs
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - ivolve-net

  mysql:
    image: mysql:8.4
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:?Set MYSQL_ROOT_PASSWORD in .env}
      MYSQL_DATABASE: ivolve
      MYSQL_USER: ivolve
      MYSQL_PASSWORD: ${DB_PASSWORD:?Set DB_PASSWORD in .env}
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h 127.0.0.1 -uroot -p\"$${MYSQL_ROOT_PASSWORD}\" --silent"]
      interval: 5s
      timeout: 5s
      retries: 20
      start_period: 20s
    networks:
      - ivolve-net

networks:
  ivolve-net:
    name: ivolve-net
    driver: bridge

volumes:
  app_logs:
  db_data:
    name: db_data
```

The local `.env` file is created from `.env.example` and kept out of Git. It supplies values for these settings:

| Variable | Used by |
| --- | --- |
| `DOCKERHUB_USERNAME` | App image tag |
| `MYSQL_ROOT_PASSWORD` | MySQL root account |
| `DB_PASSWORD` | MySQL app user and Node app connection |

## Steps

### Part 1: Configure and start the stack

1. Created a local `.env` file from `.env.example` and set the Docker Hub username, MySQL root password, and app database password.
2. Validated the Compose configuration and started the app and MySQL services.
3. Confirmed that MySQL became healthy before the app started. The app and database communicate over the custom bridge network `ivolve-net`.

### Part 2: Verify the app and database

4. Checked the app page, health endpoint, products API, and service logs.
5. Confirmed that the health endpoint connected to MySQL and that the products API returned the three seeded rows from the `ivolve.products` table.
6. Verified that the app runs as the non-root `node` user and that its `/app/logs` directory is backed by the `app_logs` volume. The MySQL data directory is backed by `db_data`.

### Part 3: Prepare the Docker Hub image

7. Configured the app image tag as `DOCKERHUB_USERNAME/ivolve-app:latest` and built it locally.
8. Pushed the image to Docker Hub as [`adaghash/ivolve-app:latest`](https://hub.docker.com/r/adaghash/ivolve-app/tags).

## Result

| Requirement | Implementation / observed result |
| --- | --- |
| App port | Host `3000` to container `3000` |
| Database | MySQL 8.4, database `ivolve`, service name `mysql` |
| Service network | Custom bridge network `ivolve-net` |
| Database persistence | `db_data:/var/lib/mysql` |
| App log persistence | `app_logs:/app/logs` |
| Startup order | App waits for the MySQL health check |
| App verification | Health endpoint connected; products API returned three seeded products |
| Registry publish | `adaghash/ivolve-app:latest` pushed successfully |
