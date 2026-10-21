# Lab 2: Gradle

**Goal:** Test, build, and run the Java calculator with Gradle.

**Environment:** Ubuntu on WSL 2 (see the [root README](../../README.md)).

> The slide says “Go Application,” but this project is Java.

## Steps

1. Install Java 17 and the tools required by SDKMAN.

   ```bash
   sudo apt update
   sudo apt install -y openjdk-17-jdk git curl zip unzip
   curl -s "https://get.sdkman.io" | bash
   source "$HOME/.sdkman/bin/sdkman-init.sh"
   sdk install gradle
   java -version
   gradle --version
   ```

   Expect Java 17 and Gradle version details.

2. Enter the Gradle project and load SDKMAN.

   ```bash
   source "$HOME/.sdkman/bin/sdkman-init.sh"
   cd "Build Tools/Lab2/CalculatorGradleApp"
   ```

   Expect to be in the directory containing `build.gradle`.

3. Run the tests.

   ```bash
   gradle test
   ```

   Expect `BUILD SUCCESSFUL` with no failed tests.

4. Build the application.

   ```bash
   gradle build
   ls -lh build/libs/calculator.jar
   ```

   Expect `BUILD SUCCESSFUL` and the JAR file to be listed.

5. Run the calculator.

   ```bash
   java -jar build/libs/calculator.jar
   ```

   Expect the console app to prompt for two numbers.

6. Verify with sample input.

   ```bash
   printf '2\n3\n' | java -jar build/libs/calculator.jar
   ```

   Expect Sum `5.0`, Subtract `-1.0`, Multiply `6.0`, and Divide `0.666...`.

## Result

The Gradle tests and build passed, and the packaged calculator produced the expected results.

![Gradle test results](./screenshots/03-unit-tests.png)
*Proves the Gradle tests passed.*

![Gradle build result](./screenshots/04-build.png)
*Proves Gradle built the executable calculator JAR.*

![Gradle calculator output](./screenshots/05-run-and-verify.png)
*Proves the calculator returned the expected results for 2 and 3.*

## Cleanup

Remove generated output from the project directory.

```bash
rm -rf build
```
