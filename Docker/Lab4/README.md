# Lab 4: Docker Image Optimization

## Objective

Compare a single-stage Spring Boot image with a multi-stage Java 17 image, then save and reload the optimized image.

## Implementation

`app/Dockerfile.original` builds and runs the sample with Maven. `app/Dockerfile` builds the same JAR in a Maven stage, copies only the JAR into a Java 17 JRE runtime, and runs it as non-root user `app`.

## Project Structure

```text
Lab4/
├── README.md
└── app/
    ├── .dockerignore
    ├── Dockerfile
    ├── Dockerfile.original
    ├── pom.xml
    └── src/main/java/com/example/demo/DemoApplication.java
```

## Build and Verify

Run from `Docker/Lab4/app`:

```bash
docker build -f Dockerfile.original -t image1 .
docker image ls image1
docker run -d --name container1 -p 8080:8080 image1
curl http://localhost:8080/
docker stop container1 && docker rm container1

docker build -t image2 .
docker image ls image2
docker run -d --name container2 -p 8080:8080 image2
curl http://localhost:8080/
docker exec container2 id
docker stop container2 && docker rm container2

docker save -o lab-image.tar image2
docker image rm image2
docker load -i lab-image.tar
docker image inspect image2
```

The measured image sizes were 671 MB for `image1` and 294 MB for `image2`.

<!-- Screenshot placeholder: original and optimized image sizes -->
<!-- Screenshot placeholder: optimized app response and non-root identity -->

## Results

Both images returned `Hello from Dockerized Spring Boot!`. The optimized container ran as `uid=100(app)`. Saving, removing, and loading `image2` restored its local image tag.
