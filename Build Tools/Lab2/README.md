# Lab 2 — Building and Packaging the Calculator with Gradle

## Overview

This lab builds and tests the Java console calculator with Gradle, packages it as an executable JAR, and runs it with sample inputs.

**Environment:** Ubuntu on WSL 2 with Java 17 and Gradle (see the [root README](../../README.md)).

**Source application:** [CalculatorGradleApp on GitHub](https://github.com/Ibrahim-Adel15/CalculatorGradleApp).

> The PDF labels this a Go application, but the supplied project and completed work are Java.

**Objectives**

- Run the calculator unit tests with Gradle.
- Build the application and create an executable JAR.
- Run the JAR and verify its arithmetic output.

## Architecture

| Component | Responsibility |
| --- | --- |
| `Main` | Reads two numbers and prints each operation |
| `Calculator` | Implements arithmetic operations |
| Gradle | Runs tests and builds the executable JAR |

### Request flow

1. The user enters two numbers in the console.
2. `Main` calls the calculator operations.
3. The results are printed to the console.

```text
Console input -> Main -> Calculator -> Console output
```

## Project Structure

```text
Lab2/
├── README.md
├── screenshots/                 # Optional visual evidence
└── app/
    └── CalculatorGradleApp/
        ├── build.gradle
        ├── settings.gradle
        └── src/
```

## Implementation

### 1. Run the Unit Tests

From the lab root, change to the Gradle project and run its tests. The Gradle executable must be available in the environment, for example through SDKMAN.

```bash
cd app/CalculatorGradleApp
gradle test
```

### 2. Build the Application

```bash
gradle build
```

Gradle creates `build/libs/calculator.jar`.

### 3. Run the Calculator

```bash
java -jar build/libs/calculator.jar
```

When prompted, enter `2` and `3`.

## Verification

Confirm the test task succeeds and the calculator reports sum `5.0`, difference `-1.0`, product `6.0`, and quotient approximately `0.6667`.

<!-- Screenshot: Gradle test results -->
<!-- Screenshot: Gradle creating the executable calculator JAR -->
<!-- Screenshot: Calculator output for inputs 2 and 3 -->

## Cleanup

Remove generated Gradle build output when it is no longer needed:

```bash
rm -rf build
```

## Key Takeaways

- Gradle can test and build a Java application.
- The executable JAR can be run independently after building.
- Sample inputs and expected outputs provide a quick functional check.
