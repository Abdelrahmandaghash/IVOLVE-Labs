# Lab 1 — Building and Packaging a Java Application with Maven

## Overview

This lab builds and tests a Java console calculator with Maven, packages it as an executable JAR, and runs it with sample inputs.

**Environment:** Ubuntu on WSL 2 with Java 17 and Maven (see the [root README](../../README.md)).

**Objectives**

- Run the calculator unit tests with Maven.
- Package the application as an executable JAR.
- Run the JAR and verify its arithmetic output.

## Architecture

| Component | Responsibility |
| --- | --- |
| `Main` | Reads two numbers and prints each operation |
| `Calculator` | Implements arithmetic operations |
| Maven | Runs tests and packages the executable JAR |

### Request flow

1. The user enters two numbers in the console.
2. `Main` calls the calculator operations.
3. The results are printed to the console.

```text
Console input -> Main -> Calculator -> Console output
```

## Project Structure

```text
Lab1/
├── README.md
├── screenshots/                 # Optional visual evidence
└── app/
    └── CalculatorMavenApp/
        ├── pom.xml
        └── src/
```

## Implementation

### 1. Run the Unit Tests

From the lab root, change to the Maven project and run its tests:

```bash
cd app/CalculatorMavenApp
mvn test
```

### 2. Package the Application

```bash
mvn package
```

Maven creates the executable `target/calculator.jar`.

### 3. Run the Calculator

```bash
java -jar target/calculator.jar
```

When prompted, enter `2` and `3`.

## Verification

Confirm all five tests pass and that the calculator reports sum `5.0`, difference `-1.0`, product `6.0`, and quotient approximately `0.6667`.

<!-- Screenshot: Maven test results showing all five tests passing -->
<!-- Screenshot: Maven packaging the calculator JAR -->
<!-- Screenshot: Calculator output for inputs 2 and 3 -->

## Cleanup

Remove generated Maven build output when it is no longer needed:

```bash
rm -rf target
```

## Key Takeaways

- Maven can run tests and package an executable Java application.
- The packaged JAR can be verified independently of the Maven build command.
- Sample inputs and expected outputs provide a quick functional check.
