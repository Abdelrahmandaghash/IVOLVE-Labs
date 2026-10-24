# Lab 5: Docker Image Vulnerability Scanning

**Goal:** Scan a baseline Node.js image with Trivy, update its runtime and dependencies, and compare the findings.

**Environment:** Ubuntu on WSL 2 with Docker Desktop and Trivy installed (see the [root README](../../README.md)).

## Steps

### Part 1: Prepare the baseline image

1. Enter the application directory and check Trivy.

   ```bash
   cd "Docker/Lab5/app"
   trivy --version
   ```

   Expect Trivy to print its version. The scan script requires the `trivy` command to be available in this shell.

2. Build the baseline image.

   ```bash
   docker build -f Dockerfile.v1 -t trivy-lab:v1 .
   docker image ls trivy-lab:v1
   ```

   Expect the image to use the preserved Node 18 Bullseye and Express 4.18.2 baseline.

### Part 2: Build the updated image and compare scan results

3. Scan the baseline and updated images.

   ```bash
   sh scan.sh
   ```

   The script scans `trivy-lab:v1`, builds `ivolve-app:v2` from the current Dockerfile, and scans the updated image. Expect HTML, JSON, and text reports under `reports/`.

4. Review the HTML reports.

   Open `reports/trivy-lab-v1.html` and `reports/ivolve-app-v2.html`. The baseline scan reported 2,143 HIGH and 219 CRITICAL findings; the updated scan reported zero vulnerabilities across severities.

The updated image uses Node 22 Alpine, production dependencies, compatible fixes for the reported Express dependency findings, and the non-root `node` user. Generated reports are ignored by Git and remain in `app/reports/`.

## Result

Trivy 0.76.1 reported the baseline and updated findings described above. The updated app also returned `{"status":"UP"}` from its `/health` endpoint.

<!-- Screenshot placeholder: baseline Trivy findings -->
<!-- Screenshot placeholder: updated Trivy report and zero-vulnerability summary -->

## Cleanup

Remove only the image tags created for this lab if you no longer need them. The local reports are preserved:

```bash
docker image rm trivy-lab:v1 ivolve-app:v2
```
