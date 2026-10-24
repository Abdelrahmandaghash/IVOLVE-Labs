# Lab 8 - Node.js and MySQL with Docker Compose

## What I did

I used the existing local `.env` configuration, validated the Compose file, built the app image, and started the Node.js and MySQL services. I waited for the MySQL health check, checked that both services were healthy, verified the app's `/health` endpoint and home page, and confirmed the selected database was `ivolve`.

I did not attempt to push the tagged app image because the active Docker Hub login did not match the username configured in `.env`. The image is built locally; publishing it remains incomplete until Docker Hub is logged in with write access to the target repository.

## Code I used

Compose waits for the MySQL health check before starting the app and stores database files in a named volume:

```yaml
depends_on:
  db:
    condition: service_healthy
volumes:
  - db_data:/var/lib/mysql
```

I added an app health check using Node's built-in HTTP client so `docker compose ps` reports the app as healthy only after `/health` returns HTTP 200. The app also retries MySQL connections during startup. These excerpts are in [`docker-compose.yml`](./docker-compose.yml), [`db.js`](./iVolveApp/db.js), and [`server.js`](./iVolveApp/server.js).

I configured the app health check with Node's built-in HTTP client:

```yaml
healthcheck:
  test:
    - CMD
    - node
    - -e
    - 'require("http").get("http://127.0.0.1:3000/health",r=>process.exit(r.statusCode==200?0:1)).on("error",()=>process.exit(1))'
```

## Files

The application source is in `iVolveApp`. Compose configuration is in `docker-compose.yml`; `.env` is local configuration and must stay private. I do not include its secret values in this README.
