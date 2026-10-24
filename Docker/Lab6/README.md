# Lab 6 - Docker Environment Variables and Resource Management

## What I did

I built the Flask image `ivolve1`. First, I started `container1` with `APP_NAME=iVolveApp1` and `APP_ENV=stg` passed through Docker flags, limited it to one CPU and 256 MB of memory, and checked its HTTP response, environment, runtime statistics, and configured limits.

Next, I loaded `APP_NAME=iVolveApp2` and `APP_ENV=prod` from `env.txt`, started `container2` with the same resource limits, and verified the returned values and limits. Finally, I built `ivolve3` with Dockerfile environment defaults, ran it as `container2` without runtime variables, and confirmed the `iVolveApp3` / `dev` response.

## Code I used

The hardcoded image sets defaults in the Dockerfile:

```dockerfile
ENV APP_NAME=iVolveApp3 \
    APP_ENV=dev
```

The Flask app reads the values from the container environment and returns them as JSON:

```python
APP_NAME = os.getenv("APP_NAME")
APP_ENV = os.getenv("APP_ENV")

@app.route("/")
def home():
    return jsonify({
        "application": APP_NAME,
        "environment": APP_ENV,
        "message": "Welcome to the Docker Env & Resource Management Lab!"
    })
```

These excerpts are from [`Dockerfile.hardcoded`](./Dockerfile.hardcoded) and [`PythonApp/app.py`](./PythonApp/app.py).

## Results

Docker inspect reported `NanoCpus=1000000000` and `Memory=268435456` for all three limited runs. The Flask endpoint returned the expected response for each configuration. `docker stats --no-stream` showed 22.57 MiB, 22.48 MiB, and 22.98 MiB of memory usage for the respective runs, all below the 256 MiB limit.

## Files

The Flask application is in `PythonApp`. The lab Dockerfiles are `Dockerfile` and `Dockerfile.hardcoded`; `PythonApp/env.txt` contains the lab's non-secret environment values.
