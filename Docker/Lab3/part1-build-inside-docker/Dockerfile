# Image with Maven + Java 17
FROM maven:3.9-eclipse-temurin-17

# Non-root user and a working directory it owns
RUN useradd -m appuser
ENV MAVEN_CONFIG=/home/appuser/.m2
WORKDIR /app
RUN chown appuser:appuser /app

# Copy the source and build the app
COPY --chown=appuser:appuser . .
USER appuser
RUN mvn package

EXPOSE 8080
CMD ["java", "-jar", "target/calculator.jar"]
