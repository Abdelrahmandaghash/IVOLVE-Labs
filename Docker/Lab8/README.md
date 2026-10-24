# Lab 8 — Containerized Node.js and MySQL Stack Using Docker Compose

## Overview

This lab runs a Node.js web application with MySQL through Docker Compose. A custom bridge network connects the services, a health check gates app startup, and named volumes persist database data and application logs.

**Environment:** Ubuntu on WSL 2 with Docker Desktop and Docker Compose (see the [root README](../../README.md)).

**Source application:** [iVolveApp on GitHub](https://github.com/Ibrahim-Adel15/iVolveApp).

**Objectives**

- Configure and start the app and MySQL services with Compose.
- Use a health check to gate application startup.
- Verify the app's database-backed endpoints and seeded products.
- Persist the database data and app logs with named volumes.
- Build and publish the application image.

## Architecture

| Service | Container port | Network | Persistent storage |
| --- | ---: | --- | --- |
| Node.js app | 3000 | `ivolve-net` | `app_logs:/app/logs` |
| MySQL | 3306 | `ivolve-net` | `db_data:/var/lib/mysql` |

Compose waits for MySQL to become healthy before starting the app. The app connects to the database using the Compose service name `mysql`.

### Request flow

1. The browser or client requests the Node.js app on host port `3000`.
2. The app handles the request and queries MySQL over `ivolve-net`.
3. The response contains the app status or database-backed product data.

## Project Structure

```text
Lab8/
├── README.md
├── screenshots/                 # Optional visual evidence
└── app/
    ├── .env.example
    ├── Dockerfile
    ├── docker-compose.yml
    ├── db.js
    ├── package.json
    ├── server.js
    └── frontend/
```

## Implementation

### 1. Application Dockerfile

The Dockerfile installs production dependencies, copies the application, creates the log directory, and runs the service as the non-root `node` user:

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

### 2. Docker Compose Configuration

The Compose file builds the app from this directory, waits for MySQL's health check, and puts both services on the `ivolve-net` bridge network. Named volumes persist the app logs and database files:

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

### 3. Configure Environment Variables

Create a local `.env` file from `.env.example` and set the values locally. Do not commit the resulting `.env` file.

| Variable | Used by |
| --- | --- |
| `DOCKERHUB_USERNAME` | App image tag |
| `MYSQL_ROOT_PASSWORD` | MySQL root account |
| `DB_PASSWORD` | MySQL application user and Node.js connection |

### 4. Validate and Start the Compose Stack

Run from the lab root:

```bash
cd app
cp .env.example .env
# Edit .env and set the three values described above.
docker compose config
docker compose up -d --build
docker compose ps
```

Compose requires both database passwords. Wait until MySQL is healthy and the app is running.

### 5. Build and Publish the App Image

The Compose image name uses `DOCKERHUB_USERNAME/ivolve-app:latest`. Authenticate with Docker Hub and set `DOCKERHUB_USERNAME` to the account that owns the target repository before pushing.

```bash
docker compose build app
docker compose push app
```

The recorded published image is [`adaghash/ivolve-app:latest`](https://hub.docker.com/r/adaghash/ivolve-app/tags).

## Verification

Run from `app/` while the stack is up:

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/ready
curl http://localhost:3000/api/products
docker compose logs app mysql
```

The health endpoint confirms the app can query MySQL. The products API should return the three seeded rows from the `ivolve.products` table. Open <http://localhost:3000/> to view the frontend.

The Node.js app runs as the non-root `node` user. Its access log at `/app/logs/access.log` is backed by `app_logs`; MySQL data is backed by `db_data`.

| Check | Implementation / observed result |
| --- | --- |
| App port | Host `3000` to container `3000` |
| Database | MySQL 8.4, database `ivolve`, service `mysql` |
| Network | Custom bridge network `ivolve-net` |
| Database persistence | `db_data:/var/lib/mysql` |
| App log persistence | `app_logs:/app/logs` |
| Startup order | App waits for MySQL health check |
| App verification | Health endpoint connected; products API returned three seeded products |
| Registry publish | `adaghash/ivolve-app:latest` was pushed |

<!-- Screenshot: Compose services and MySQL health status -->
<!-- Screenshot: Application page, database-backed health check, and products API -->
<!-- Screenshot: Persistent named volumes and Docker Hub image -->

## Cleanup

Run from `app/` to stop and remove the containers and network while preserving named-volume data:

```bash
docker compose down
```

Do not use `docker compose down -v` if you need to preserve database and log data.

## Key Takeaways

- Docker Compose defines and runs connected application services.
- Health checks can gate dependent service startup.
- Named volumes persist database and log data beyond container lifecycles.
- A custom bridge network allows the app to reach MySQL by service name.
