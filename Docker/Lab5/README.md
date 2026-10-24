# Lab 5 - Docker Image Vulnerability Scanning with Trivy

## What I did

I built and ran the original Node.js image, then checked its home and health endpoints. I used Trivy 0.64.1 to scan `trivy-lab:v1` and saved the full results as an HTML report. I upgraded Express to 5.3.0, rebuilt with the remediated Dockerfile on Node 24, verified the endpoints again, and saved a second scan report.

Trivy ran from its official Docker image because it was not installed on the Windows host; the scanner used the local Docker socket and a persistent vulnerability database cache.

## Code I used

The rebuilt image installs locked production dependencies and switches to Node's unprivileged user:

```dockerfile
FROM node:24-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --chown=node:node app.js ./
USER node
EXPOSE 3000
CMD ["npm", "start"]
```

This is from [`Dockerfile.remediated`](./Dockerfile.remediated).

## Results

With Trivy 0.64.1 and the database used for this run, `trivy-lab:v1` reported 12,692 vulnerabilities: 319 UNKNOWN, 3,006 LOW, 6,997 MEDIUM, 2,150 HIGH, and 220 CRITICAL. The remediated image reported 242: 2 UNKNOWN, 84 LOW, 95 MEDIUM, 60 HIGH, and 1 CRITICAL. The updated image therefore still has 61 HIGH/CRITICAL findings; this scan is not clean. Counts can change with the image and Trivy database versions, so use the saved reports for package-level review.

## Scan reports

- [Initial scan report](reports/trivy-report-v1.html)
- [Updated image scan report](reports/trivy-report-v2.html)

## Files

The app source is in `TrivyImage`; the updated image definition is `Dockerfile.remediated`. Scan reports are stored separately under `reports/`.
