# Lab 3, Part 1: Build Inside Docker

Build the Java application inside the Maven/Java 17 image, then run it as a console application.

## Build and run

Run these commands from this directory:

```bash
docker build -t ivolve-lab3-app1 .
docker images ivolve-lab3-app1
printf '2\n3\n' | docker run --name ivolve-lab3-container1 -i ivolve-lab3-app1
docker logs ivolve-lab3-container1
```

The calculator should print `Sum: 5.0`, `Subtract: -1.0`, `Multiply: 6.0`, and `Divide: 0.666...`. The image includes Maven, the JDK, build output, and the application.

## WSL evidence

See the [Lab 3 screenshot folder](../screenshots/).

![Part 1 Docker image build](../screenshots/03-part1-image-build.png)

![Part 1 calculator container output and logs](../screenshots/05-container1-run.png)

![Part 1 measured image size](../screenshots/04-app1-size.png)
