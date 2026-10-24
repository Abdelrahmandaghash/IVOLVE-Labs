# Lab 6: Environment Variables and Resource Management

## Objective

Run a Flask app with values supplied at container runtime, from an environment file, and as Dockerfile defaults. Apply CPU and memory limits to the first run.

## Implementation

The app reads `APP_NAME` and `APP_ENV` and returns them in its JSON response. `app/Dockerfile` uses Python 3.12 slim; `app/Dockerfile.dev` adds development defaults. The example runtime environment file is `app/env.txt`.

## Project Structure

```text
Lab6/
├── README.md
└── app/
    ├── Dockerfile
    ├── Dockerfile.dev
    ├── app.py
    ├── env.txt
    └── requirements.txt
```

## Build and Verify

Run from `Docker/Lab6/app`:

```bash
docker build -t ivolve1 .
docker run -d --name lab6-runtime -p 5000:5000 --cpus=1 --memory=256m \
  -e APP_NAME=iVolveApp1 -e APP_ENV=stg ivolve1
curl http://localhost:5000/
docker exec lab6-runtime printenv APP_NAME APP_ENV
docker stats lab6-runtime

docker run -d --name lab6-env-file -p 5001:5000 --env-file env.txt ivolve1
curl http://localhost:5001/

docker build -f Dockerfile.dev -t ivolve3 .
docker run -d --name lab6-dockerfile-env -p 5002:5000 ivolve3
curl http://localhost:5002/
```

The three runs returned `iVolveApp1/stg`, `iVolveApp2/prod`, and `iVolveApp3/dev`. The first container had a one-CPU limit and 256 MiB memory limit.

<!-- Screenshot placeholder: responses showing the three environment configurations -->
<!-- Screenshot placeholder: Docker resource limits for lab6-runtime -->

## Configuration Notes

`-e` sets runtime values, `--env-file env.txt` loads values from a file, and Dockerfile `ENV` provides image defaults. Host ports 5000, 5001, and 5002 map to container port 5000.

To remove only the containers created above after inspection:

```bash
docker rm -f lab6-runtime lab6-env-file lab6-dockerfile-env
```
