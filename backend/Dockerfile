# ---- Build stage ----
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Create certs in src/main/resources so Maven packages them
RUN mkdir -p src/main/resources/certs && \
    openssl genrsa -out src/main/resources/certs/keypair.pem 2048 && \
    openssl rsa -in src/main/resources/certs/keypair.pem -pubout -out src/main/resources/certs/public.pem && \
    openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in src/main/resources/certs/keypair.pem -out src/main/resources/certs/private.pem && \
    rm src/main/resources/certs/keypair.pem

# Copy source code and build WAR
COPY src ./src
RUN mvn clean package -DskipTests

# ---- Run stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy WAR from build stage
COPY --from=build /app/target/*.war /app/app.war

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.war"]
