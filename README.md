<a id="top"></a>

<div align="center">
  <h1>iVolve DevOps Labs</h1>
  <p><strong>Step-by-step records of the build and container labs.</strong></p>
  <p>Hands-on DevOps labs covering Java builds, Docker images, container configuration, microservices, and Docker Compose.</p>
</div>

**Jump to:** [Lab 1 · Maven](#lab1-maven) · [Lab 2 · Gradle](#lab2-gradle) · [Lab 3 · Docker](#lab3-docker) · [Labs 4–8](#labs-4-8) · [Planned areas](#planned-areas)

Each lab page records the PDF requirements, the work completed in order, the configuration used, and the observed result. Lab pages retain the Dockerfiles or Compose configuration where those were part of the work; the steps are written as explanations rather than shell-command scripts.

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

### [Lab 4 · Image optimization](./Docker/Lab4/README.md) — ✅ Completed

Compares a single-stage Spring Boot image with a multi-stage, non-root runtime image and demonstrates image save/load.

### [Lab 5 · Trivy scanning](./Docker/Lab5/README.md) — ✅ Completed

Scans a Node.js baseline image and an updated image, with local HTML and JSON vulnerability reports. The baseline recorded 2,143 HIGH and 219 CRITICAL findings; the updated scans report no vulnerability entries. [Baseline report](./Docker/Lab5/app/reports/trivy-lab-v1.html) · [Updated report](./Docker/Lab5/app/reports/ivolve-app-v2.html).

### [Lab 6 · Environment and resource limits](./Docker/Lab6/README.md) — ✅ Completed

Runs a Flask application with runtime variables, an env file, Dockerfile defaults, and CPU/memory limits.

### [Lab 7 · Microservice networks and storage](./Docker/Lab7/README.md) — ✅ Completed

Connects a frontend, backend, and notification service through isolated bridge networks with persistent data and logs.

### [Lab 8 · Node.js and MySQL Compose stack](./Docker/Lab8/README.md) — ✅ Completed

Builds and verifies a Node.js web application with MySQL, health-gated startup, and persistent volumes. The Docker Hub push remains to be completed.

<a id="planned-areas"></a>
## Planned areas

These topics are not implemented in the repository yet:

- Kubernetes
- Jenkins
- Argo CD
- Ansible

<p align="center"><sub>iVolve training · DevOps lab notes</sub></p>
