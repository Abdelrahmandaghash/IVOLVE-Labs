# Lab 4 - Docker Image Optimization and Export/Load

## What I did

I built the provided Spring Boot image as `image1` and the optimized multi-stage image as `image2`. I compared their sizes, confirmed both returned HTTP 200, checked that `image2` runs as the non-root `app` user, and saved, removed, and reloaded `image2`.

I saved `image2` to `lab-image.tar`, removed the local image, loaded it back, and compared the image ID after reload.

## Code I used

The optimized image builds the JAR in a Maven stage, copies only the JAR into a JRE stage, and runs as an unprivileged account:

```dockerfile
FROM maven:3.9.15-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S -G app app
COPY --from=build --chown=app:app /app/target/demo-0.0.1-SNAPSHOT.jar app.jar
USER app
ENTRYPOINT ["java", "-jar", "app.jar"]
```

This is from [`Dockerfile.optimized`](./Dockerfile.optimized).

## Results

- `image1`: 841 MB
- `image2`: 294 MB
- Size reduction: approximately 65.0%
- Baseline and optimized HTTP checks: HTTP 200, both returned `Hello from Dockerized Spring Boot!`
- Runtime user: `uid=100(app) gid=101(app) groups=101(app)`
- The image ID after loading matched the ID recorded before saving (`sha256:a5e3a7720d51c54ed4c5e93c1e80cf1e8036b64da03abf629e7f22f7b3f51140`).

## Files

The optimized Dockerfile is `Dockerfile.optimized`. The Spring Boot source is in `ImageOptimization-`.
