# JRE only, no Maven and no JDK
FROM eclipse-temurin:17-jre

RUN useradd -m appuser
WORKDIR /app

# Copy only the JAR built locally
COPY --chown=appuser:appuser target/calculator.jar app.jar
USER appuser

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
