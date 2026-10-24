# Lab 4: Docker Image Optimization and Export/Load

**Goal:** Compare the provided Spring Boot image with a smaller multi-stage image, verify non-root execution, and save and restore the optimized image.

**Environment:** Ubuntu on WSL 2 with Docker Desktop (see the [root README](../../README.md)).

**Source application:** [ImageOptimization- on GitHub](https://github.com/Ibrahim-Adel15/ImageOptimization-).

## Dockerfiles Used

The original single-stage Dockerfile builds and runs the application in the Maven image:

```dockerfile
FROM maven:3.9.15-eclipse-temurin-17-alpine

WORKDIR /app
COPY . .
RUN mvn package

EXPOSE 8080
CMD ["java", "-jar", "target/demo-0.0.1-SNAPSHOT.jar"]
```

The optimized Dockerfile compiles in a build stage, then copies only the JAR into a Java runtime image. The final container runs as the non-root `app` user:

```dockerfile
FROM maven:3.9.15-eclipse-temurin-17-alpine AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-alpine
RUN addgroup -S app && adduser -S -G app app
WORKDIR /app
COPY --from=build --chown=app:app /build/target/demo-0.0.1-SNAPSHOT.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Steps

### Part 1: Build and verify the original image

1. Used the supplied Spring Boot application and original Dockerfile in the lab app directory.
2. Built the image as `image1` and checked its local image size. The measured size was **671 MB**.
3. Started a container named `container1` and checked the application at port 8080. It returned `Hello from Dockerized Spring Boot!`.
4. Stopped and removed `container1` after the check.

### Part 2: Build and verify the optimized image

5. Built the multi-stage Dockerfile as `image2` and compared the image sizes. The measured size was **294 MB**, which is 377 MB smaller than `image1`.
6. Started `container2`, checked that it returned the same application response, and inspected its identity. It ran as `uid=100(app)`, confirming it was not running as root.
7. Stopped and removed `container2` after verification.

### Part 3: Save, remove, and restore the optimized image

8. Saved `image2` to the archive `lab-image.tar`, removed the local image tag, then loaded the archive back into Docker.
9. Inspected the restored image and confirmed the `image2` tag was available locally.

The PDF names `lab-image.tar` as the required archive but later refers to `image2.tar`. This lab used the required `lab-image.tar` name consistently.

## Result

| Check | Observed result |
| --- | --- |
| Original image | `image1`, 671 MB |
| Optimized image | `image2`, 294 MB |
| Application response | Both images returned `Hello from Dockerized Spring Boot!` |
| Optimized runtime identity | `uid=100(app)` |
| Save and restore | `image2` was loaded from `lab-image.tar` |

The multi-stage build reduced the image by **377 MB** by leaving Maven, the JDK, and source code out of the runtime image.

## Cleanup

The images and the `lab-image.tar` archive can be removed after the restored image has been verified and is no longer needed.
