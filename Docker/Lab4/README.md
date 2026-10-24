# Lab 4: Docker Image Optimization

**Goal:** Compare a single-stage Spring Boot image with a smaller multi-stage image, then save and reload the optimized image.

**Environment:** Ubuntu on WSL 2 with Docker Desktop (see the [root README](../../README.md)).

## Steps

### Part 1: Build and run the original image

1. Enter the application build context.

   ```bash
   cd "Docker/Lab4/app"
   ```

   Expect to be in the directory containing both Dockerfiles and `pom.xml`.

2. Build the original single-stage image and inspect its size.

   ```bash
   docker build -f Dockerfile.original -t image1 .
   docker image ls image1
   ```

   Expect Docker to build and tag `image1`. Record its size from the `SIZE` column.

3. Run the original application.

   ```bash
   docker run -d --name container1 -p 8080:8080 image1
   curl http://localhost:8080/
   docker stop container1
   docker rm container1
   ```

   Expect the response `Hello from Dockerized Spring Boot!`.

### Part 2: Build and run the optimized image

4. Build and inspect the optimized image.

   ```bash
   docker build -t image2 .
   docker image ls image2
   ```

   Expect Docker to build and tag `image2`. Compare its size with `image1`.

5. Run the optimized application and check its user.

   ```bash
   docker run -d --name container2 -p 8080:8080 image2
   curl http://localhost:8080/
   docker exec container2 id
   docker stop container2
   docker rm container2
   ```

   Expect the same application response and a non-root identity (`uid=100(app)`).

### Part 3: Save and reload the optimized image

6. Save and reload the optimized image.

   ```bash
   docker save -o lab-image.tar image2
   docker image rm image2
   docker load -i lab-image.tar
   docker image inspect image2
   ```

   Expect `image2` to be available again after loading the archive.

## Result

Both images returned the expected application response. The optimized image was smaller:

| Image | Measured size |
| --- | ---: |
| `image1`, original | 671 MB |
| `image2`, multi-stage | 294 MB |

<!-- Screenshot placeholder: image1 and image2 size comparison -->
<!-- Screenshot placeholder: optimized app response and non-root identity -->
<!-- Screenshot placeholder: image2 restored after save and load -->

## Cleanup

Remove the images and archive created by this lab when you no longer need them:

```bash
docker image rm image1 image2
rm -f lab-image.tar
```
