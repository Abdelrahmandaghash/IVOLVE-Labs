# Lab 7: Multi-Network Microservices, Volumes, and Bind Mounts

**Goal:** Build three services, connect them through two isolated bridge networks, and persist service logs and backend message data.

**Environment:** Ubuntu on WSL 2 with Docker Desktop (see the [root README](../../README.md)).

**Source application:** [MicroserviceApp on GitHub](https://github.com/Ibrahim-Adel15/MicroserviceApp).

## Dockerfiles Used

Frontend:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 3000
CMD ["python", "app.py"]
```

Backend:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
RUN mkdir -p /app/data /app/logs
EXPOSE 5000
CMD ["python", "app.py"]
```

Notification service:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
RUN mkdir -p /app/logs
EXPOSE 5001
CMD ["python", "app.py"]
```

## Steps

### Part 1: Build the service images

1. Built separate images for the frontend, backend, and notification services: `lab7-frontend`, `lab7-backend`, and `lab7-notification`.

### Part 2: Create networks and persistent storage

2. Created the `frontend-backend` bridge network with subnet `172.28.0.0/16`.
3. Created the `backend-notification` bridge network with subnet `172.29.0.0/16`.
4. Created the `backend-logs` and `notification-logs` Docker volumes and a host `data/` directory for backend message data.

### Part 3: Start the services in the required network topology

5. Started the notification service on `backend-notification` and mounted `notification-logs` at `/app/logs`.
6. Started the backend on `backend-notification`, configured its notification URL as `http://notification:5001/notify`, and mounted `backend-logs` at `/app/logs`.
7. Connected the backend to `frontend-backend` as well, so it could communicate with both the frontend and notification service. Bind-mounted the host `data/` directory to `/app/data`.
8. Started the frontend on `frontend-backend`, configured its backend URL as `http://backend:5000`, and published the frontend on host port 8080.
9. Opened the frontend, submitted a message, and refreshed the page. Verified that the backend returned the message and stored it in `/app/data/messages.json`; checked that backend and notification logs were available in their mounted paths.

## Result

The frontend, backend, and notification service communicated over the intended isolated networks. A submitted message could be retrieved from the backend, persisted in the host-mounted data directory, and confirmed in the notification log.

| Service | Network(s) | Published port | Persistent mount |
| --- | --- | ---: | --- |
| Frontend | `frontend-backend` | `8080:3000` | — |
| Backend | `frontend-backend`, `backend-notification` | `5000:5000` | `backend-logs:/app/logs`, host `data/` to `/app/data` |
| Notification | `backend-notification` | — | `notification-logs:/app/logs` |
