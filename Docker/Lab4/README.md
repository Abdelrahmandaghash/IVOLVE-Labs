# Lab 4 — Docker Image Optimization and Export/Load

## Overview

This lab compares the supplied Spring Boot image with a multi-stage optimized image, verifies non-root execution, and saves and restores the optimized image.

**Environment:** Ubuntu on WSL 2 with Docker Desktop (see the [root README](../../README.md)).

**Source application:** [ImageOptimization- on GitHub](https://github.com/Ibrahim-Adel15/ImageOptimization-).

**Objectives**

- Compare single-stage and multi-stage Docker images.
- Verify that the optimized image runs as a non-root user.
- Save, remove, and restore the optimized image.

## Architecture

| Image | Build/runtime approach | Runtime identity |
| --- | --- | --- |
| `image1` | Maven build and application runtime in one image | Default image user |
| `image2` | Maven build stage plus JRE runtime stage | Non-root `app` user |

### Request flow

1. A client makes an HTTP request to the Spring Boot app on port 8080.
2. The app responds with `Hello from Dockerized Spring Boot!`.

## Project Structure

```text
Lab4/
├── README.md
├── screenshots/                 # Optional visual evidence
└── app/
    ├── Dockerfile                # Multi-stage optimized image
    ├── Dockerfile.original       # Original single-stage image
    ├── pom.xml
    └── src/
```

Both images use `app/` as their build context.

## Implementation

### 1. Build the Original Image

From the lab root:

```bash
docker build -f app/Dockerfile.original -t image1 app
docker image inspect image1 --format '{{.Size}}'
```

### 2. Build the Optimized Image

```bash
docker build -t image2 app
docker image inspect image2 --format '{{.Size}}'
```

### 3. Save and Restore the Optimized Image

```bash
docker save -o lab-image.tar image2
docker rmi image2
docker load -i lab-image.tar
docker image inspect image2
```

Keep `lab-image.tar` until the restored image has been verified. This lab uses the required archive name consistently.

## Verification

Run each image and check its response:

```bash
docker run -d --name container1 -p 8080:8080 image1
curl http://localhost:8080/
docker rm -f container1

docker run -d --name container2 -p 8080:8080 image2
curl http://localhost:8080/
docker exec container2 id
docker rm -f container2
```

Both images should return `Hello from Dockerized Spring Boot!`; the optimized container should run as `uid=100(app)`.

| Check | Recorded result |
| --- | --- |
| Original image | `image1`, 671 MB |
| Optimized image | `image2`, 294 MB |
| Application response | Both images returned the expected greeting |
| Runtime identity | Optimized image ran as `uid=100(app)` |
| Save and restore | `image2` was restored from `lab-image.tar` |

The multi-stage image was 377 MB smaller by excluding build tools and source from the runtime image.

<!-- Screenshot: Original and optimized image sizes -->
<!-- Screenshot: Application response and optimized non-root identity -->
<!-- Screenshot: Saving, removing, and restoring image2 -->

## Cleanup

Remove the lab images and archive after verification if they are no longer needed:

```bash
docker rmi image1 image2
rm lab-image.tar
```

## Key Takeaways

- Multi-stage builds keep build tooling out of the runtime image.
- Non-root execution can be checked from inside a running container.
- `docker save` and `docker load` support transferring image archives.
