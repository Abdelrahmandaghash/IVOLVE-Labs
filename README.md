<a id="top"></a>

<div align="center">
  <h1>iVolve DevOps Labs</h1>
  <p><strong>Practical steps from Java builds to containers.</strong></p>
  <p>Hands-on DevOps labs covering Java builds, Docker images, container configuration, microservices, and Docker Compose.</p>
</div>

**Jump to:** [Lab 1 · Maven](#lab1-maven) · [Lab 2 · Gradle](#lab2-gradle) · [Lab 3 · Docker](#lab3-docker) · [Labs 4–8](#labs-4-8) · [Planned areas](#planned-areas)

Documented environment: Ubuntu on WSL 2, Java 17, Maven, Gradle, and Docker Desktop.

---

<a id="lab1-maven"></a>
## Build Tools

### [Lab 1 · Build and test with Maven](./Build%20Tools/Lab1/README.md) — ✅ Completed

Builds and tests a Java console calculator with Maven, packages an executable JAR, and verifies its arithmetic output.

<a id="lab2-gradle"></a>
### [Lab 2 · Build and test with Gradle](./Build%20Tools/Lab2/README.md) — ✅ Completed

Builds and tests the Java console calculator with Gradle, packages an executable JAR, and verifies its arithmetic output.

---

<a id="lab3-docker"></a>
## Docker

### [Lab 3 · Build and compare Docker images](./Docker/Lab3/README.md) — ✅ Completed

Compares building the Java application inside a Maven Docker image with building it locally and copying its JAR into a JRE image, including an image-size comparison.

---

<a id="labs-4-8"></a>
## Docker Labs 4–8

### [Lab 4 · Image optimization](./Docker/Lab4/README.md)

Compares a single-stage Spring Boot image with a multi-stage, non-root runtime image and demonstrates image save/load.

### [Lab 5 · Trivy scanning](./Docker/Lab5/README.md)

Scans a Node.js baseline image and an updated image, with local HTML vulnerability reports.

### [Lab 6 · Environment and resource limits](./Docker/Lab6/README.md)

Runs a Flask application with runtime variables, an env file, Dockerfile defaults, and CPU/memory limits.

### [Lab 7 · Microservice networks and storage](./Docker/Lab7/README.md)

Connects a frontend, backend, and notification service through isolated bridge networks with persistent data and logs.

### [Lab 8 · Node.js and MySQL Compose stack](./Docker/Lab8/README.md)

Builds a Node.js web application with MySQL, health-gated startup, persistent volumes, and a Docker Hub push command.

<a id="planned-areas"></a>
## Planned areas

These topics are not implemented in the repository yet:

- Kubernetes
- Jenkins
- Argo CD
- Ansible

<p align="center"><sub>iVolve training · DevOps lab notes</sub></p>
