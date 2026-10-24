# Lab 7: Multi-Network Microservices

**Goal:** Connect the frontend, backend, and notification services through two bridge networks, with persistent logs and message data.

**Environment:** Ubuntu on WSL 2 with Docker Desktop and Bash (see the [root README](../../README.md)).

## Steps

### Part 1: Build the service images

1. Enter the application directory and build the three service images.

   ```bash
   cd "Docker/Lab7/app"
   docker build -t lab7-frontend ./frontend
   docker build -t lab7-backend ./backend
   docker build -t lab7-notification ./notification
   ```

   Expect one image for each service.

### Part 2: Create the networks and start the services

2. Create the lab networks and log volumes.

   ```bash
   docker network create --driver bridge --subnet 172.28.0.0/16 frontend-backend
   docker network create --driver bridge --subnet 172.29.0.0/16 backend-notification
   docker volume create backend-logs
   docker volume create notification-logs
   mkdir -p data
   ```

   Expect two bridge networks and two named log volumes. The backend will join both networks; each other service joins one.

3. Start notification, backend, and frontend containers.

   ```bash
   docker run -d --name notification --network backend-notification \
     -v notification-logs:/app/logs lab7-notification
   docker run -d --name backend --network backend-notification -p 5000:5000 \
     -e NOTIFICATION_URL=http://notification:5001/notify \
     -v backend-logs:/app/logs -v "$(pwd)/data:/app/data" lab7-backend
   docker network connect frontend-backend backend
   docker run -d --name frontend --network frontend-backend -p 8080:3000 \
     -e BACKEND_URL=http://backend:5000 lab7-frontend
   ```

   Expect the frontend at `http://localhost:8080/` and the backend verification endpoint at `http://localhost:5000/messages`.

### Part 3: Send a message and verify persistence

4. Send a message in the frontend form, then verify storage and logs.

   ```bash
   curl http://localhost:5000/messages
   docker exec backend cat /app/data/messages.json
   docker exec backend cat /app/logs/backend.log
   docker exec notification cat /app/logs/notification.log
   ```

   Expect the submitted message in the backend response and data file, and an entry in the notification log.

The host directory `app/data/` is bind-mounted at `/app/data`. The backend log volume is mounted at `/app/logs`; the notification log volume is mounted at the same path in its container.

## Result

The frontend successfully submitted a message, the backend returned it, and the notification log recorded it. Network inspection confirmed frontend/backend on `frontend-backend` and backend/notification on `backend-notification`.

<!-- Screenshot placeholder: frontend message submission -->
<!-- Screenshot placeholder: backend message data and notification log -->
<!-- Screenshot placeholder: service membership in the two networks -->

## Cleanup

Run this only for the containers, networks, and volumes created by this lab:

```bash
docker rm -f frontend backend notification
docker network rm frontend-backend backend-notification
docker volume rm backend-logs notification-logs
```
