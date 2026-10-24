# Lab 6: Docker Environment Variables and Resource Management

**Goal:** Configure a Flask application using runtime variables, an environment file, and Dockerfile defaults, while limiting and monitoring container resources.

**Environment:** Ubuntu on WSL 2 with Docker Desktop (see the [root README](../../README.md)).

**Source application:** [PythonApp on GitHub](https://github.com/Ibrahim-Adel15/PythonApp).

## Dockerfiles and Environment File

The common Dockerfile used for the runtime-variable and environment-file runs:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 5000
CMD ["python", "app.py"]
```

The second Dockerfile sets development defaults in the image:

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

The `env.txt` file used for the environment-file run:

```dotenv
APP_NAME=iVolveApp2
APP_ENV=prod
```

## Steps

### Part 1: Build the common image and set runtime variables

1. Used the Python 3.12 slim base image, installed the Flask app dependencies, copied in the application, and exposed port 5000.
2. Built the image as `ivolve1`.
3. Started `lab6-runtime` with `APP_NAME=iVolveApp1` and `APP_ENV=stg`, limited to one CPU and 256 MB of memory.
4. Opened the app on host port 5000 and verified that its response contained the configured app name and environment.
5. Inspected the container environment and monitored its resource usage. The resource configuration was confirmed as one CPU and 256 MiB.

Example response:

```json
{"application":"iVolveApp1","environment":"stg","message":"Welcome to the Docker Env & Resource Management Lab!"}
```

### Part 2: Load values from `env.txt`

6. Started `lab6-env-file` from `ivolve1`, using `env.txt` for its environment.
7. Verified on a separate host port that the response and container environment contained `iVolveApp2` and `prod`.

### Part 3: Use Dockerfile defaults

8. Built the development image as `ivolve3` from the second Dockerfile and started `lab6-dockerfile-env`.
9. Verified on a separate host port that the response and container environment contained `iVolveApp3` and `dev`.

The PDF reuses `container2` and host port 5000 for the last two runs. This lab used distinct container names and host ports 5000, 5001, and 5002 so all three configurations could run without collisions; each host port maps to the app's port 5000.

## Result

| Container | Image | Configuration source | App name | Environment | Host port |
| --- | --- | --- | --- | --- | ---: |
| `lab6-runtime` | `ivolve1` | Runtime environment variables | `iVolveApp1` | `stg` | 5000 |
| `lab6-env-file` | `ivolve1` | `env.txt` | `iVolveApp2` | `prod` | 5001 |
| `lab6-dockerfile-env` | `ivolve3` | Dockerfile defaults | `iVolveApp3` | `dev` | 5002 |

The application returned the expected configuration in all three runs. The first container was limited to one CPU and 256 MiB of memory.
