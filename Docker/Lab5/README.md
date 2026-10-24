# Lab 5 — Docker Image Vulnerability Scanning with Trivy

## Overview

This lab scans a Node.js baseline image with Trivy, reviews HIGH and CRITICAL findings, updates the image and dependencies, and retains reports for comparison.

**Environment:** Ubuntu on WSL 2 with Docker Desktop. Trivy 0.76.1 was run as its official Docker image.

**Source application:** [TrivyImage on GitHub](https://github.com/Ibrahim-Adel15/TrivyImage).

**Objectives**

- Build and scan the baseline Node.js image.
- Review vulnerability findings across severities.
- Build and rescan the updated Node.js image.
- Preserve scan reports for both versions.

## Architecture

| Image | Base and dependencies | Purpose |
| --- | --- | --- |
| `trivy-lab:v1` | Node 18 Bullseye, Express 4.18.2 | Baseline image |
| `ivolve-app:v2` | Node 22 Alpine, Express 4.21.2 and updated transitive packages | Updated image |

Trivy runs in a container and scans images available through the Docker daemon socket.

### Request flow

1. Build the image from its Dockerfile and application files.
2. Run Trivy against the local image.
3. Review the all-severity scan and HIGH/CRITICAL findings.
4. Compare the updated image scan reports with the baseline.

## Project Structure

```text
Lab5/
├── README.md
├── screenshots/                 # Optional visual evidence
└── app/
    ├── Dockerfile
    ├── Dockerfile.v1
    ├── app.js
    ├── package.json
    ├── package.json.v1
    └── reports/
```

`Dockerfile.v1` and `package.json.v1` preserve the Node 18 Bullseye baseline. The current Dockerfile uses Node 22 Alpine, production dependencies, and the non-root `node` user.

## Implementation

### 1. Build the Baseline Image

Run from the lab root:

```bash
docker build -f app/Dockerfile.v1 -t trivy-lab:v1 app
```

### 2. Scan the Baseline

The saved reports are preserved under `app/reports/`.

```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:0.76.1 image trivy-lab:v1
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:0.76.1 image --severity HIGH,CRITICAL trivy-lab:v1
```

### 3. Build and Scan the Updated Image

```bash
docker build -t ivolve-app:v2 app
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:0.76.1 image ivolve-app:v2
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:0.76.1 image --severity HIGH,CRITICAL ivolve-app:v2
```

## Verification

Review the baseline [HIGH/CRITICAL HTML report](./app/reports/trivy-lab-v1.html) and [JSON results](./app/reports/trivy-lab-v1-high-critical.json). They record 2,143 HIGH and 219 CRITICAL findings.

Review the updated [HTML report](./app/reports/ivolve-app-v2.html), [all-severity JSON results](./app/reports/ivolve-app-v2-all.json), and [HIGH/CRITICAL JSON results](./app/reports/ivolve-app-v2-high-critical.json). The saved updated scan results contain no vulnerability entries.

| Image | HIGH | CRITICAL |
| --- | ---: | ---: |
| `trivy-lab:v1` | 2,143 | 219 |
| `ivolve-app:v2` | 0 | 0 |

The baseline all-severity text table was not saved as a report. The HTML reports and available JSON results are retained in `app/reports/`.

<!-- Screenshot: Trivy 0.76.1 baseline scan and HIGH/CRITICAL findings -->
<!-- Screenshot: Updated image scan and report results -->

## Cleanup

Remove the lab image tags after reviewing the reports, if desired:

```bash
docker rmi trivy-lab:v1 ivolve-app:v2
```

## Key Takeaways

- Image scanning helps identify vulnerabilities in operating-system packages and application dependencies.
- Rescan after updating the base image and dependencies.
- Retaining structured reports makes the before-and-after results reviewable.
