<a id="top"></a>

# iVolve DevOps Labs
*Build it. Ship it. Learn by doing.* 🚀<br>
Hands-on DevOps labs from the iVolve training, starting with Java builds and containers.<br>
The journey continues toward Kubernetes, CI/CD, GitOps, and automation.<br>
**Jump to:** [Environment](#environment) · [Repo map](#repo-map) · [Build Tools](#build-tools) · [Docker](#docker) · [Kubernetes](#kubernetes) · [Jenkins](#jenkins) · [ArgoCD](#argocd) · [Ansible](#ansible)

<a id="environment"></a>

## Environment
All labs were run in Ubuntu on WSL 2 (Windows Subsystem for Linux) with Docker Desktop's WSL integration.<br>
That means these are real Linux commands in an Ubuntu shell, not Windows PowerShell.

| Operating system | Java | Build tools | Container engine |
| --- | --- | --- | --- |
| Ubuntu on WSL 2 | Java 17 | Maven · Gradle | Docker Desktop |
[⬆️ Back to top](#top)

<a id="repo-map"></a>

## Repo map
```text
IVOLVE-Labs/
├── Build Tools/             # Java build-tool labs
│   ├── Lab1/                # Maven
│   └── Lab2/                # Gradle
├── Docker/                  # Container labs
│   └── Lab3/                # Build and compare Docker images
├── (coming soon) Kubernetes, Jenkins, ArgoCD, Ansible
└── README.md                # This landing page
```
[⬆️ Back to top](#top)

<a id="build-tools"></a>

## Build Tools 🛠️
Maven and Gradle help build, test, and package Java applications reliably.
<!-- To add a new lab: copy a row and update the lab name, description, status and link -->

| Lab | What it covers | Status |
| --- | --- | --- |
| [Lab 1: Maven](./Build%20Tools/Lab1/README.md) | Building, testing, and packaging a Java app with Maven. | ✅ Done |
| [Lab 2: Gradle](./Build%20Tools/Lab2/README.md) | Building, testing, and packaging a Java app with Gradle. | ✅ Done |
[⬆️ Back to top](#top)

<a id="docker"></a>

## Docker 🐳
Docker packages an application and its runtime so it can run consistently across environments.
<!-- To add a new lab: copy a row and update the lab name, description, status and link -->

| Lab | What it covers | Status |
| --- | --- | --- |
| [Lab 3](./Docker/Lab3/README.md) | Building a Java image inside Docker vs. building locally, plus an image-size comparison bonus. | ✅ Done |
[⬆️ Back to top](#top)

<a id="kubernetes"></a>

## Kubernetes ☸️
Kubernetes runs and manages containers at scale.<br>
🚧 Coming soon<br>[⬆️ Back to top](#top)

<a id="jenkins"></a>

## Jenkins ⚙️
Jenkins automates CI/CD pipelines that build, test, and ship software.<br>
🚧 Coming soon<br>[⬆️ Back to top](#top)

<a id="argocd"></a>

## ArgoCD
ArgoCD brings GitOps to Kubernetes by deploying applications straight from Git.<br>
🚧 Coming soon<br>[⬆️ Back to top](#top)

<a id="ansible"></a>

## Ansible
Ansible automates configuration management across systems.<br>
🚧 Coming soon<br>[⬆️ Back to top](#top)
