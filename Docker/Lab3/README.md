# Lab 3 — Creating and Comparing Docker Images for a Java Application

## Overview

This lab builds the same Java calculator two ways: compile it inside a Docker build, then compare that image with a runtime image assembled from a JAR built locally.

**Environment:** Ubuntu on WSL 2 with Java 17, Maven, and Docker Desktop (see the [root README](../../README.md)).

**Source application:** [CalculatorMavenApp on GitHub](https://github.com/Ibrahim-Adel15/CalculatorMavenApp).

**Objectives**

- Build and run an image that compiles the app inside Docker.
- Build and run an image that uses a locally built JAR.
- Compare image sizes and calculator output.

## Architecture

| Image | Build approach | Runtime contents |
| --- | --- | --- |
| `app1` | Maven compiles the source during image build | Maven/Java image and calculator |
| `app2` | Maven builds on the host before Docker build | Java 17 JRE and calculator JAR |

### Request flow

1. The user provides two values to the interactive calculator container.
2. The calculator performs the arithmetic operations.
3. The results are printed to the container terminal.

## Project Structure

```text
Lab3/
├── README.md
├── screenshots/                 # Optional visual evidence
└── app/
    ├── part1-build-inside-docker/
    └── part2-build-locally/
```

Each part is a separate Docker build context containing its Dockerfile and calculator project files.

## Implementation

### 1. Dockerfiles

The Part 1 Dockerfile builds the application in a Maven and Java 17 image and runs it as the non-root `appuser`:

```dockerfile
# Image with Maven + Java 17
FROM maven:3.9-eclipse-temurin-17

# Non-root user and a working directory it owns
RUN useradd -m appuser
ENV MAVEN_CONFIG=/home/appuser/.m2
WORKDIR /app
RUN chown appuser:appuser /app

# Copy the source and build the app
COPY --chown=appuser:appuser . .
USER appuser
RUN mvn package

EXPOSE 8080
CMD ["java", "-jar", "target/calculator.jar"]
```

The Part 2 Dockerfile packages the locally built JAR into a Java 17 JRE image:

```dockerfile
# JRE only, no Maven and no JDK
FROM eclipse-temurin:17-jre

RUN useradd -m appuser
WORKDIR /app

# Copy only the JAR built locally
COPY --chown=appuser:appuser target/calculator.jar app.jar
USER appuser

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

### 2. Build the Application Inside Docker

Run from the lab root. The Dockerfile builds with Maven and Java 17 and runs as the non-root `appuser`.

```bash
docker build -t app1 ./app/part1-build-inside-docker
docker images app1
docker run -it --name container1 app1
```

Enter `2` and `3` when prompted.

### 3. Build the Application Locally

The second Dockerfile copies `target/calculator.jar` into a Java 17 JRE image. Build from that project directory:

```bash
cd app/part2-build-locally
mvn test
mvn package
docker build -t app2 .
docker images app2
docker run -it --name container2 app2
```

Enter `2` and `3` when prompted.

## Verification

Check the container output and recorded image sizes:

```bash
docker logs container1
docker logs container2
docker image inspect app1 --format '{{.Size}}'
docker image inspect app2 --format '{{.Size}}'
```

Both images should produce sum `5.0`, difference `-1.0`, product `6.0`, and quotient approximately `0.6667`.

| Image | Build approach | Recorded size |
| --- | --- | ---: |
| `app1` | Maven build inside a Maven/Java image | 814 MB |
| `app2` | Local Maven build, JAR copied into a JRE image | 427 MB |

The JRE image is smaller because it excludes Maven, the JDK, source code, and the Maven build cache.

<!-- Screenshot: Part 1 image build and image size -->
<!-- Screenshot: Part 1 container calculator output -->
<!-- Screenshot: Part 2 Maven package, image size, and container output -->
<!-- Screenshot: Lab container and image cleanup -->

## Cleanup

Remove only this lab's containers and images when finished:

```bash
docker rm -f container1 container2
docker rmi app1 app2
```

## Key Takeaways

- A multi-tool build image can compile the application inside Docker.
- A JRE-only image can reduce runtime image size when the artifact is built separately.
- The runtime behavior should be verified in both images before comparing them.
