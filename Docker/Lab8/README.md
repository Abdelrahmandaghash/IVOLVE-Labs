# Lab 8: Node.js and MySQL with Docker Compose

## Objective

Run the Node.js site and MySQL together with Compose, health-gated startup, and persistent database and application log volumes.

## Implementation

Compose builds the app from `app/Dockerfile` and connects it to the `mysql` service on `ivolve-net`. MySQL initializes database `ivolve` and the app user from local environment values. The Node app creates and seeds its products table, and its health and product endpoints query MySQL.

## Project Structure

```text
Lab8/
├── README.md
└── app/
    ├── Dockerfile
    ├── docker-compose.yml
    ├── .env.example
    ├── server.js
    ├── db.js
    └── frontend/
```

## Configure and Run

Run from `Docker/Lab8/app` in Bash. Copy the example file and replace the placeholder values locally:

```bash
cp .env.example .env
# Set DOCKERHUB_USERNAME, MYSQL_ROOT_PASSWORD, and DB_PASSWORD in .env.
docker compose up --build -d
docker compose ps
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/api/products
docker compose logs app mysql
```

The stack reached healthy status, `/health` confirmed the database connection, and `/api/products` returned three seeded rows from `ivolve.products`. The app ran as user `node` with `/app/logs` mounted.

<!-- Screenshot placeholder: healthy Compose services -->
<!-- Screenshot placeholder: application page and product API -->
<!-- Screenshot placeholder: persisted app logs and database volume -->

## Build and Publish

To publish the app image, authenticate with Docker Hub and use the username configured in `.env`:

```bash
docker login
docker compose build app
docker compose push app
```

No image was pushed during verification. `.env` is ignored by Git; `.env.example` contains placeholders only. The image tag is `DOCKERHUB_USERNAME/ivolve-app:latest`.

## Configuration Notes

The Compose network is `ivolve-net`. `db_data` persists MySQL data at `/var/lib/mysql`, and `app_logs` persists application logs at `/app/logs`. Use `docker compose down` to stop and remove the stack; `docker compose down -v` also removes its persistent volumes.
