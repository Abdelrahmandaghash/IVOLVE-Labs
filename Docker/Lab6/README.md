# Lab 6: Environment Variables and Resource Management

**Goal:** Run the Flask app with runtime variables, an environment file, and Dockerfile defaults, then inspect CPU and memory limits.

**Environment:** Ubuntu on WSL 2 with Docker Desktop (see the [root README](../../README.md)).

## Steps

### Part 1: Set runtime variables and resource limits

1. Enter the application directory and build the common image.

   ```bash
   cd "Docker/Lab6/app"
   docker build -t ivolve1 .
   ```

   Expect Docker to build the Flask application image.

2. Supply variables when creating the first container and apply resource limits.

   ```bash
   docker run -d --name lab6-runtime -p 5000:5000 --cpus=1 --memory=256m \
     -e APP_NAME=iVolveApp1 -e APP_ENV=stg ivolve1
   curl http://localhost:5000/
   docker exec lab6-runtime printenv APP_NAME APP_ENV
   docker inspect --format '{{.HostConfig.NanoCpus}} {{.HostConfig.Memory}}' lab6-runtime
   docker stats lab6-runtime
   ```

   Expect the response to contain `iVolveApp1` and `stg`. The inspect output should show `1000000000 268435456`, corresponding to one CPU and 256 MiB.

### Part 2: Load variables from an environment file

3. Load variables from the environment file.

   ```bash
   docker run -d --name lab6-env-file -p 5001:5000 --env-file env.txt ivolve1
   curl http://localhost:5001/
   ```

   Expect the response to contain `iVolveApp2` and `prod`, the values in `env.txt`.

### Part 3: Set defaults in the Dockerfile

4. Build and run the image with Dockerfile defaults.

   ```bash
   docker build -f Dockerfile.dev -t ivolve3 .
   docker run -d --name lab6-dockerfile-env -p 5002:5000 ivolve3
   curl http://localhost:5002/
   ```

   Expect the response to contain `iVolveApp3` and `dev`.

## Result

The three configurations returned `iVolveApp1/stg`, `iVolveApp2/prod`, and `iVolveApp3/dev`. The first container had a one-CPU limit and a 256 MiB memory limit.

<!-- Screenshot placeholder: responses showing all three environment configurations -->
<!-- Screenshot placeholder: resource limits for lab6-runtime -->

## Cleanup

Remove the containers created in these steps when you no longer need them:

```bash
docker rm -f lab6-runtime lab6-env-file lab6-dockerfile-env
```
