## Node.js Express Application

### Installing Dependencies

To ensure that you have all the necessary packages for the application, clear any existing node modules and install dependencies fresh:

```
rm -rf node_modules && npm i
```

### Starting the Database Locally

#### PostgreSQL

**Please note**: Use `podman-compose` commands unless you have a Docker license.

```
## start container
podman-compose -f docker-compose.postgres.yml up -d
docker-compose -f docker-compose.postgres.yml up -d

## stop container
podman-compose -f docker-compose.postgres.yml down
docker-compose -f docker-compose.postgres.yml down
```

#### MongoDB

```
## start container
podman-compose -f docker-compose.mongodb.yml up -d
docker-compose -f docker-compose.mongodb.yml up -d

## stop container

podman-compose -f docker-compose.mongodb.yml down
docker-compose -f docker-compose.mongodb.yml down
```

### Starting the Development Server

Run the server in development mode with hot reload capabilities:

```
npm run start:dev
```

### Running Tests

Please note that this command wll automatically start and stop server, no need to run `npm run start:dev` before.

```
npm test
```