# Lab 7: Multi-Network Microservices

## Objective

Connect frontend, backend, and notification services through two isolated bridge networks, persist logs in named volumes, and keep message data in a host bind mount.

## Architecture

The frontend and backend share `frontend-backend`. The backend and notification service share `backend-notification`; the backend is the only service attached to both networks. Message data is stored in `app/data/` on the host and mounted at `/app/data` in the backend.

## Project Structure

```text
Lab7/
├── README.md
└── app/
    ├── frontend/{Dockerfile,app.py,requirements.txt}
    ├── backend/{Dockerfile,app.py,requirements.txt}
    ├── notification/{Dockerfile,app.py,requirements.txt}
    └── data/.gitkeep
```

## Build and Run

Run from `Docker/Lab7/app` in Bash:

```bash
docker build -t lab7-frontend ./frontend
docker build -t lab7-backend ./backend
docker build -t lab7-notification ./notification

docker network create --driver bridge --subnet 172.28.0.0/16 frontend-backend
docker network create --driver bridge --subnet 172.29.0.0/16 backend-notification
docker volume create backend-logs
docker volume create notification-logs
mkdir -p data

docker run -d --name notification --network backend-notification \
  -v notification-logs:/app/logs lab7-notification
docker run -d --name backend --network backend-notification -p 5000:5000 \
  -e NOTIFICATION_URL=http://notification:5001/notify \
  -v backend-logs:/app/logs -v "$(pwd)/data:/app/data" lab7-backend
docker network connect frontend-backend backend
docker run -d --name frontend --network frontend-backend -p 8080:3000 \
  -e BACKEND_URL=http://backend:5000 lab7-frontend
```

Open `http://localhost:8080/` and submit a message. Verify the backend and notification logs and stored message:

```bash
curl http://localhost:5000/messages
docker exec backend cat /app/data/messages.json
docker exec backend cat /app/logs/backend.log
docker exec notification cat /app/logs/notification.log
```

The frontend successfully submitted a message, the backend returned it, and the notification log recorded it. The inspected network memberships matched the topology above.

<!-- Screenshot placeholder: frontend message submission -->
<!-- Screenshot placeholder: backend and notification records -->
<!-- Screenshot placeholder: two-network container membership -->

## Configuration Notes

The networks use `172.28.0.0/16` and `172.29.0.0/16`. Named volumes `backend-logs` and `notification-logs` persist service logs. Container names and resource names are listed here to make the lab setup easy to inspect.
