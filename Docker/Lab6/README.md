# Lab 6 — Docker Environment Variables and Resource Management

## Overview

This lab configures a Flask application using runtime environment variables, an environment file, and Dockerfile defaults, then limits and monitors container resources.

**Environment:** Ubuntu on WSL 2 with Docker Desktop (see the [root README](../../README.md)).

**Source application:** [PythonApp on GitHub](https://github.com/Ibrahim-Adel15/PythonApp).

**Objectives**

- Configure app settings from multiple environment-variable sources.
- Apply CPU and memory limits to a container.
- Inspect the running container's resource usage and configuration.

## Architecture

| Container | Configuration source | App name | Environment | Host port |
| --- | --- | --- | --- | ---: |
| `lab6-runtime` | Runtime variables | `iVolveApp1` | `stg` | 5000 |
| `lab6-env-file` | `app/env.txt` | `iVolveApp2` | `prod` | 5001 |
| `lab6-dockerfile-env` | Dockerfile defaults | `iVolveApp3` | `dev` | 5002 |

### Request flow

1. A browser or HTTP client requests the Flask app on the selected host port.
2. Docker forwards the request to port 5000 in the container.
3. The app returns its configured application name and environment.

## Project Structure

```text
Lab6/
├── README.md
├── screenshots/                 # Optional visual evidence
└── app/
    ├── Dockerfile
    ├── Dockerfile.dev
    ├── app.py
    ├── env.txt
    └── requirements.txt
```

The default Dockerfile installs the Python dependencies and application. `Dockerfile.dev` sets `APP_NAME=iVolveApp3` and `APP_ENV=dev`. `env.txt` contains `APP_NAME=iVolveApp2` and `APP_ENV=prod`.

## Implementation

### 1. Dockerfiles

The common Dockerfile installs the Flask dependencies and app:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 5000
CMD ["python", "app.py"]
```

The development Dockerfile uses the same app image setup and adds default environment values:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
ENV APP_NAME=iVolveApp3 \
    APP_ENV=dev
EXPOSE 5000
CMD ["python", "app.py"]
```

### 2. Build the Common Image

Run from the lab root:

```bash
docker build -t ivolve1 app
```

### 3. Start with Runtime Variables and Resource Limits

```bash
docker run -d --name lab6-runtime -p 5000:5000 \
  --cpus=1 --memory=256m \
  -e APP_NAME=iVolveApp1 -e APP_ENV=stg ivolve1
```

### 4. Start with an Environment File

```bash
docker run -d --name lab6-env-file -p 5001:5000 \
  --env-file app/env.txt ivolve1
```

### 5. Build and Start with Dockerfile Defaults

```bash
docker build -f app/Dockerfile.dev -t ivolve3 app
docker run -d --name lab6-dockerfile-env -p 5002:5000 ivolve3
```

## Verification

Check each app response and inspect the resource-limited container:

```bash
curl http://localhost:5000/
curl http://localhost:5001/
curl http://localhost:5002/
docker inspect lab6-runtime --format '{{.HostConfig.NanoCpus}} {{.HostConfig.Memory}}'
docker stats --no-stream lab6-runtime
```

The responses should identify, respectively, `iVolveApp1`/`stg`, `iVolveApp2`/`prod`, and `iVolveApp3`/`dev`. The first container is limited to one CPU and 256 MiB of memory.

<!-- Screenshot: Runtime-variable response and CPU/memory limits -->
<!-- Screenshot: Environment-file and Dockerfile-default responses -->

## Cleanup

Remove only the lab containers and images:

```bash
docker rm -f lab6-runtime lab6-env-file lab6-dockerfile-env
docker rmi ivolve1 ivolve3
```

## Key Takeaways

- Runtime variables, environment files, and Dockerfile defaults can configure containerized apps.
- Resource limits can be set when a container is started.
- `docker inspect` and `docker stats` help verify resource settings and usage.
