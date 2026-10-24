# Lab 5: Docker Image Vulnerability Scanning with Trivy

**Goal:** Scan the supplied Node.js image, review full and HIGH/CRITICAL findings, remediate findings, and verify the updated image with new reports.

**Environment:** Ubuntu on WSL 2 with Docker Desktop. Trivy 0.76.1 was run as its official Docker image because the native WSL installation was unavailable during this lab.

**Source application:** [TrivyImage on GitHub](https://github.com/Ibrahim-Adel15/TrivyImage).

## Dockerfiles Used

The baseline Dockerfile installs the original app dependencies on Node 18 Bullseye:

```dockerfile
FROM node:18-bullseye

WORKDIR /app
COPY package.json.v1 ./package.json
RUN npm install
COPY app.js ./
EXPOSE 3000
CMD ["npm", "start"]
```

The updated multi-stage Dockerfile installs production dependencies on Node 22 Alpine and runs the application as the non-root `node` user:

```dockerfile
FROM node:22-alpine AS dependencies

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node app.js package.json ./
USER node
EXPOSE 3000
CMD ["node", "app.js"]
```

The updated `package.json` uses Express 4.21.2 and compatible versions of `body-parser` 1.20.9, `path-to-regexp` 0.1.13, and `qs` 6.16.0. The runtime image does not include npm and runs as the `node` user.

## Steps

### Part 1: Build and scan the baseline image

1. Prepared the reports directory and used Trivy 0.76.1 from the official Trivy container. The scanner version was verified before scanning.
2. Built the supplied baseline as `trivy-lab:v1`.
3. Scanned the baseline for vulnerabilities across all severities and reviewed the scan output.
4. Ran a second scan limited to HIGH and CRITICAL findings, then generated and reviewed the HTML report.
5. The saved baseline report records **2,143 HIGH** and **219 CRITICAL** findings. The [HIGH/CRITICAL HTML report](./app/reports/trivy-lab-v1.html) and its [JSON results](./app/reports/trivy-lab-v1-high-critical.json) are preserved.

### Part 2: Remediate and rescan

6. Investigated the baseline findings and updated the base image from Node 18 Bullseye to Node 22 Alpine, then upgraded the affected app dependencies.
7. Rebuilt the updated application image as `ivolve-app:v2`.
8. Re-scanned the updated image across all severities and for HIGH/CRITICAL findings. The saved results contain no vulnerability entries.
9. Generated and reviewed the updated HTML report. See the [updated HTML report](./app/reports/ivolve-app-v2.html), the [HIGH/CRITICAL JSON results](./app/reports/ivolve-app-v2-high-critical.json), and the [all-severity JSON results](./app/reports/ivolve-app-v2-all.json).

## Result and Reports

| Image | Base and application dependencies | HIGH | CRITICAL | Full scan |
| --- | --- | ---: | ---: | --- |
| `trivy-lab:v1` | Node 18 Bullseye, Express 4.18.2 | 2,143 | 219 | Findings recorded in the baseline report |
| `ivolve-app:v2` | Node 22 Alpine, Express 4.21.2, updated transitive packages | 0 | 0 | No vulnerability entries in the saved scan |

Both HTML reports and the available JSON scan results are stored in [`app/reports/`](./app/reports/). The baseline all-severity text table was not retained as a report file.

## Cleanup

The `trivy-lab:v1` and `ivolve-app:v2` image tags can be removed after the reports have been reviewed. The report files are retained in the repository.
