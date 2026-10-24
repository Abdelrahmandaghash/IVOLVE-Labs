# Lab 5: Docker Image Vulnerability Scanning

## Objective

Scan a baseline Node.js image with Trivy, update its runtime and dependencies, then compare the scan results.

## Implementation

`app/Dockerfile.v1` and `app/package.json.v1` preserve the Node 18 Bullseye / Express 4.18.2 baseline. The current `app/Dockerfile` builds `ivolve-app:v2` with Node 22 Alpine, production dependencies, and the non-root `node` user. `app/package.json` updates Express and the affected `body-parser`, `path-to-regexp`, and `qs` dependencies.

## Project Structure

```text
Lab5/
├── README.md
└── app/
    ├── Dockerfile[.v1]
    ├── package.json[.v1]
    ├── app.js
    ├── scan.sh
    └── reports/                 # generated scan output, ignored by Git
```

## Build and Verify

Run from `Docker/Lab5/app` with Docker and Trivy available:

```bash
docker build -f Dockerfile.v1 -t trivy-lab:v1 .
docker build -t ivolve-app:v2 .
sh scan.sh
```

Open `reports/trivy-lab-v1.html` and `reports/ivolve-app-v2.html`. The script also saves JSON and text scan output under `reports/`; generated reports are ignored by Git.

<!-- Screenshot placeholder: baseline Trivy findings -->
<!-- Screenshot placeholder: updated Trivy report and zero-vulnerability summary -->

## Results

With Trivy 0.76.1, the baseline scan reported 2,143 HIGH and 219 CRITICAL findings. The updated image scan reported zero vulnerabilities across severities. Its `/health` endpoint returned `{"status":"UP"}`. Existing scan reports are preserved in `app/reports/`.
