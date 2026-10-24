# Lab 8: Node.js and MySQL with Docker Compose

**Goal:** Run the Node.js app with MySQL using Compose, health-gated startup, and persistent database and application log volumes.

**Environment:** Ubuntu on WSL 2 with Docker Desktop and Docker Compose (see the [root README](../../README.md)).

## Steps

1. Enter the application directory and create a local environment file.

   ```bash
   cd "Docker/Lab8/app"
   cp .env.example .env
   ```

   Edit `.env` and replace `DOCKERHUB_USERNAME`, `MYSQL_ROOT_PASSWORD`, and `DB_PASSWORD` with your own values. Do not commit this file.

2. Validate the Compose configuration and start the services.

   ```bash
   docker compose config --quiet
   docker compose up --build -d
   docker compose ps
   ```

   Expect both services to start, with MySQL passing its health check before the app starts.

3. Verify the site, database connection, and product data.

   ```bash
   curl http://localhost:3000/
   curl http://localhost:3000/health
   curl http://localhost:3000/api/products
   docker compose logs app mysql
   ```

   Expect the site to load, `/health` to confirm its MySQL connection, and `/api/products` to return the three seeded products.

4. Build and push the app image when you are ready to publish it.

   ```bash
   docker login
   docker compose build app
   docker compose push app
   ```

   Expect the image to use the Docker Hub username configured in `.env`. This lab was verified locally; no image was pushed.

The Compose stack uses network `ivolve-net`, volume `db_data` for MySQL files, and volume `app_logs` for app logs at `/app/logs`. The app runs as the non-root `node` user.

## Result

MySQL became healthy, the app connected successfully, and `/api/products` returned three rows from `ivolve.products`.

<!-- Screenshot placeholder: healthy Compose services -->
<!-- Screenshot placeholder: app page and product API response -->
<!-- Screenshot placeholder: persisted application log volume -->

## Cleanup

Stop and remove the Compose services and network:

```bash
docker compose down
```

The database and log volumes are preserved. Add `-v` only when you intentionally want Compose to remove those persistent volumes too.
