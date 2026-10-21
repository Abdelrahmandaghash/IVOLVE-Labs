# Lab 1: Maven

**Goal:** Test, package, and run the Java calculator with Maven.

**Environment:** Ubuntu on WSL 2 (see the [root README](../../README.md)).

## Steps

1. Install Java 17, Maven, and Git.

   ```bash
   sudo apt update
   sudo apt install -y openjdk-17-jdk maven git
   java -version
   mvn -version
   ```

   Expect Java 17 and Maven version details.

2. Enter the Maven project.

   ```bash
   cd "Build Tools/Lab1/CalculatorMavenApp"
   ```

   Expect to be in the directory containing `pom.xml`.

3. Run the tests.

   ```bash
   mvn test
   ```

   Expect 5 tests to pass with no failures and `BUILD SUCCESS`.

4. Package the application.

   ```bash
   mvn package
   ls -lh target/calculator.jar
   ```

   Expect `BUILD SUCCESS` and the JAR file to be listed.

5. Run the calculator.

   ```bash
   java -jar target/calculator.jar
   ```

   Expect the console app to prompt for two numbers.

6. Verify with sample input.

   ```bash
   printf '2\n3\n' | java -jar target/calculator.jar
   ```

   Expect Sum `5.0`, Subtract `-1.0`, Multiply `6.0`, and Divide `0.666...`.

## Result

The Maven tests passed, and the packaged calculator produced the expected results.

![Maven test results](./screenshots/03-unit-tests.png)
*Proves that all five Maven tests passed.*

![Maven package result](./screenshots/04-package.png)
*Proves Maven packaged the calculator JAR successfully.*

![Maven calculator output](./screenshots/05-run-and-verify.png)
*Proves the calculator returned the expected results for 2 and 3.*

## Cleanup

Remove generated output from the project directory.

```bash
rm -rf target
```
