<a id="top"></a>

<div align="center">
  <h1>iVolve DevOps Labs</h1>
  <p><strong>Practical steps from application builds to container workflows.</strong></p>
  <p>Hands-on labs covering Java builds and Docker.</p>
</div>

**Jump to:** [Lab 1 · Maven](#lab1-maven) · [Lab 2 · Gradle](#lab2-gradle) · [Lab 3 · Docker](#lab3-docker) · [Lab 4 · Image optimization](#lab4-image-optimization) · [Lab 5 · Trivy scanning](#lab5-trivy-scanning) · [Lab 6 · Environment and resources](#lab6-environment-and-resources) · [Lab 7 · Microservices](#lab7-microservices) · [Lab 8 · Docker Compose](#lab8-docker-compose)

Documented environment: Ubuntu on WSL 2, Java 17, Maven, Gradle, Docker Desktop with Docker Compose, Node.js/npm, Python, and Trivy.

---

## Build Tools

<a id="lab1-maven"></a>
### [Lab 1 · Build and test with Maven](./Build%20Tools/Lab1/README.md) — Completed

Builds and tests a Java console calculator with Maven, packages an executable JAR, and verifies its arithmetic output.

<a id="lab2-gradle"></a>
### [Lab 2 · Build and test with Gradle](./Build%20Tools/Lab2/README.md) — Completed

Builds and tests the Java console calculator with Gradle, packages an executable JAR, and verifies its arithmetic output.

---

## Docker

<a id="lab3-docker"></a>
### [Lab 3 · Build and compare Docker images](./Docker/Lab3/README.md) — Completed

Compares building the Java application inside a Maven Docker image with building it locally and copying its JAR into a JRE image, including an image-size comparison.

<a id="lab4-image-optimization"></a>
### [Lab 4 · Docker Image Optimization and Export/Load](./Docker/Lab4/README.md) — Ready to run

Compares the supplied Spring Boot image with a multi-stage, non-root image, then saves and reloads the optimized image.

<a id="lab5-trivy-scanning"></a>
### [Lab 5 · Docker Image Vulnerability Scanning with Trivy](./Docker/Lab5/README.md) — Ready to run

Scans a Node.js image for vulnerabilities, generates an HTML report, and documents remediation and rescanning.

<a id="lab6-environment-and-resources"></a>
### [Lab 6 · Docker Environment Variables and Resource Management](./Docker/Lab6/README.md) — Ready to run

Configures a Flask container with command-line variables, an environment file, and Dockerfile defaults, with CPU and memory limits.

<a id="lab7-microservices"></a>
### [Lab 7 · Multi-Network Microservices, Volumes, and Bind Mounts](./Docker/Lab7/README.md) — Ready to run

Builds a three-service application, connects it over two bridge networks, and persists backend data and service logs.

<a id="lab8-docker-compose"></a>
### [Lab 8 · Containerized Node.js and MySQL Stack Using Docker Compose](./Docker/Lab8/README.md) — Ready to run

Runs the Node.js app with MySQL, a custom Compose network, persistent volumes, and a Docker Hub image push workflow.

<p align="center"><sub>iVolve training · DevOps lab notes</sub></p>
