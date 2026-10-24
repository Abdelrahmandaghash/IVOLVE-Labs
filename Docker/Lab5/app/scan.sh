#!/usr/bin/env sh
set -eu

mkdir -p reports
trivy image --scanners vuln --format table --output reports/trivy-lab-v1-all.txt trivy-lab:v1
trivy image --scanners vuln --severity HIGH,CRITICAL --format table \
  --output reports/trivy-lab-v1-high-critical.txt trivy-lab:v1
trivy image --scanners vuln --severity HIGH,CRITICAL --format template --template "@contrib/html.tpl" \
  --output reports/trivy-lab-v1.html trivy-lab:v1

docker build -f Dockerfile -t ivolve-app:v2 .
trivy image --scanners vuln --format table --output reports/ivolve-app-v2-all.txt ivolve-app:v2
trivy image --scanners vuln --severity HIGH,CRITICAL --format table \
  --output reports/ivolve-app-v2-high-critical.txt ivolve-app:v2
trivy image --scanners vuln --severity HIGH,CRITICAL --format template --template "@contrib/html.tpl" \
  --output reports/ivolve-app-v2.html ivolve-app:v2
