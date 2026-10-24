# Lab 7 - Multi-Network Microservices, Volumes, and Bind Mounts

## What I did

I built separate frontend, backend, and notification images. I created the `frontend-backend` and `backend-notification` networks and the `backend-logs` and `notification-logs` volumes. I started the notification and backend services, attached the backend to both networks, then started the frontend on the frontend network.

I submitted `Lab7-verified-20261024` through the frontend and verified it appeared in the frontend response, the backend response, and the host-side `backend-data/messages.json`. The pre-existing `Lab7-evidence` entry was preserved. I also checked the notification and backend logs, in-network health, volume mounts, and network membership.

## Code I used

The backend writes message data through a temporary file and atomically replaces the stored JSON file:

```python
def save_messages(messages):
    temporary_file = DATA_FILE + ".tmp"
    with open(temporary_file, "w") as file:
        json.dump(messages, file, indent=2)
    os.replace(temporary_file, DATA_FILE)
```

After saving, the backend sends the message to the notification service:

```python
response = requests.post(
    NOTIFICATION_URL,
    json={"message": message},
    timeout=3
)
response.raise_for_status()
```

These excerpts are from [`backend/app.py`](./MicroserviceApp/backend/app.py).

## Files

The service source is in `MicroserviceApp`. The three service Dockerfiles are in this lab folder. The `backend-data/` directory holds the bind-mounted message data.
