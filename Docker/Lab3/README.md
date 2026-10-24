# Lab 3: Creating and Comparing Docker Images for a Java Application

**Goal:** Build and compare the calculator image built inside Docker with an image built locally.

**Environment:** Ubuntu on WSL 2 with Java 17, Maven, and Docker Desktop (see the [root README](../../README.md)).

**Source application:** [CalculatorMavenApp on GitHub](https://github.com/Ibrahim-Adel15/CalculatorMavenApp).

## Part 1: Build the application inside Docker

The first image uses Maven and Java 17 to compile the source and run the resulting JAR. The Dockerfile creates a non-root user and runs the application as that user.

```dockerfile
FROM maven:3.9-eclipse-temurin-17

RUN useradd -m appuser
ENV MAVEN_CONFIG=/home/appuser/.m2
WORKDIR /app
RUN chown appuser:appuser /app

COPY --chown=appuser:appuser . .
USER appuser
RUN mvn package

EXPOSE 8080
CMD ["java", "-jar", "target/calculator.jar"]
```

1. Used the Part 1 build context, where this Dockerfile and the calculator source are available.
2. Built the image and tagged it `app1`.
3. Checked the local image listing and recorded the image size as **814 MB**.
4. Started `container1` with interactive input and entered `2` and `3`. The calculator printed the expected arithmetic results.
5. Checked the container logs to confirm the application output.

## Part 2: Build the application locally

The second image contains only a Java 17 JRE and the JAR built by Maven on the host. It also runs as a non-root user.

```dockerfile
FROM eclipse-temurin:17-jre

RUN useradd -m appuser
WORKDIR /app

COPY --chown=appuser:appuser target/calculator.jar app.jar
USER appuser

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

1. Ran the Maven tests and packaged the calculator locally in the Part 2 project directory.
2. Built the image and tagged it `app2`.
3. Checked the local image listing and recorded the image size as **427 MB**.
4. Started `container2` with interactive input and entered `2` and `3`. The calculator printed the same results as in Part 1.
5. Checked the container logs and removed the lab containers and images after verifying both approaches.

## Result

Both images ran the calculator successfully. The locally built image was smaller because it contains the JRE and application JAR, not Maven, the JDK, source code, or the Maven build cache.

| Image | Build approach | Measured size |
| --- | --- | ---: |
| `app1` | Maven build inside a Maven/Java image | 814 MB |
| `app2` | Local Maven build, JAR copied into a JRE image | 427 MB |

Building inside Docker avoids relying on the host build environment and is more reproducible. Building locally produces the smaller runtime image, with fewer build tools and a smaller attack surface.

![Part 1 Docker build](./screenshots/03-part1-image-build.png)
*Shows the Part 1 image build.*

![Part 1 image size](./screenshots/04-app1-size.png)
*Shows the measured `app1` image size.*

![Part 1 container output](./screenshots/05-container1-run.png)
*Shows `container1` running the calculator.*

![Part 2 Maven package](./screenshots/07-part2-maven-package.png)
*Shows the local Maven package step.*

![Part 2 image size](./screenshots/10-app2-size.png)
*Shows the measured `app2` image size.*

![Part 2 container output](./screenshots/11-container2-run.png)
*Shows `container2` running the calculator.*

![Docker cleanup](./screenshots/12-cleanup.png)
*Shows cleanup of the lab containers and images.*
