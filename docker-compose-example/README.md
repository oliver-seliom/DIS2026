# Docker Compose Teaching Example: Task Manager App

A comprehensive example project designed to teach Docker Compose fundamentals through a practical multi-service application.

## Architecture Overview

This project demonstrates a simple 3-tier web application:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Frontend   │ ───> │   Backend   │ ───> │  Database   │
│  (Node.js)  │      │   (Flask)   │      │ (PostgreSQL)│
│  Port 3000  │      │  Port 4000  │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
       │                     │                     │
       │                     │                     │
   frontend-network     (both networks)    backend-network
```

### Services

1. **Frontend** - Node.js/Express server

   - Serves HTML interface
   - Proxies API requests to backend
   - Runs on port 3000

2. **Backend** - Python/Flask REST API

   - Handles business logic
   - CRUD operations for tasks
   - Runs on port 4000

3. **Database** - PostgreSQL
   - Persistent data storage
   - Initialized with sample data
   - Internal port 5432

## Key Docker Compose Concepts Demonstrated

### 1. Service Dependencies

```yaml
depends_on:
  database:
    condition: service_healthy
```

- Services start in the correct order
- Health checks ensure services are ready before dependent services start
- Backend waits for database to be healthy
- Frontend waits for backend to be healthy

### 2. Networks

Two separate networks demonstrate network isolation:

- **frontend-network**: Connects frontend ↔ backend
- **backend-network**: Connects backend ↔ database

The frontend CANNOT directly access the database - it must go through the backend API. This is a security best practice.

### 3. Volumes

- **Named volume** (`postgres-data`): Persists database data across container restarts
- **Bind mounts**: Allow live code editing during development

### 4. Environment Variables

Services use environment variables for configuration:

- Database credentials
- Service URLs
- Application settings

### 5. Health Checks

Each service has a health check to verify it's running correctly:

- Database: Checks PostgreSQL is accepting connections
- Backend: Checks HTTP endpoint responds
- Frontend: Depends on backend health

## Getting Started

### Prerequisites

- Docker Desktop installed
- Docker Compose (comes with Docker Desktop)
- No other services running on ports 3000, 4000, or 5432

### Running the Application

1. **Start all services**:

   ```bash
   docker compose up
   ```

   Add `-d` flag to run in detached mode:

   ```bash
   docker compose up -d
   ```

2. **Access the application**:

   - Open http://localhost:3000 in your browser
   - You should see the Task Manager interface

3. **Stop the services**:

   ```bash
   docker compose down
   ```

   To also remove volumes (delete all data):

   ```bash
   docker compose down -v
   ```

### Rebuilding After Code Changes

If you modify Dockerfiles or dependencies:

```bash
docker compose up --build
```

## Teaching Exercises

You must submit one screenshot per exercise in a zip file.

### Exercise 1: Verify Service Communication

**Objective**: Understand how services communicate with each other.

1. Start the application: `docker compose up -d`
2. Check all services are running:
   ```bash
   docker compose ps
   ```
3. View logs from each service:
   ```bash
   docker compose logs frontend
   docker compose logs backend
   docker compose logs database
   ```
4. Test the frontend can reach the backend:
   ```bash
   docker compose exec frontend ping backend
   ```
5. Try to ping the database from frontend (this should FAIL):

   ```bash
   docker compose exec frontend ping database
   ```

   Why does this fail? Because frontend is not on the backend-network!

6. Now try from backend (this should work but ping is not installed in the backend image we are using so it will fail):
   ```bash
   docker compose exec backend ping database
   ```

### Exercise 2: Test Data Persistence

**Objective**: Understand how volumes persist data across container restarts.

1. Add some tasks through the web interface
2. Stop the database container:
   ```bash
   docker compose stop database
   ```
3. Start it again:
   ```bash
   docker compose start database
   ```
4. Refresh the web page - your tasks should still be there!

5. Now completely remove the container (but keep the volume):
   ```bash
   docker compose down
   docker compose up -d
   ```
6. Tasks are still there because the volume persists

7. Remove everything including volumes:
   ```bash
   docker compose down -v
   docker compose up -d
   ```
8. Tasks are now gone - the volume was deleted

### Exercise 3: Explore Networks

**Objective**: Understand Docker network isolation.

1. List all networks created:
   ```bash
   docker network ls
   ```
2. Inspect the frontend network:

   ```bash
   docker network inspect docker-compose-example_frontend-network
   ```

   Notice which containers are connected

3. Inspect the backend network:

   ```bash
   docker network inspect docker-compose-example_backend-network
   ```

4. See which networks a specific container is connected to:
   ```bash
   docker inspect task_backend | grep Networks -A 10
   ```

### Exercise 4: Explore Volumes

**Objective**: Understand how Docker volumes store data.

1. List all volumes:
   ```bash
   docker volume ls
   ```
2. Inspect the postgres volume:

   ```bash
   docker volume inspect docker-compose-example_postgres-data
   ```

   Note the "Mountpoint" - this is where Docker stores the data on your host

3. Check the volume size:
   ```bash
   docker system df -v
   ```

### Exercise 5: Monitor Resource Usage

**Objective**: See how much resources each service uses.

1. View real-time stats:
   ```bash
   docker stats
   ```
   Press Ctrl+C to exit

### Exercise 6: Test Service Dependencies

**Objective**: Understand startup order and health checks.

1. Stop all services:
   ```bash
   docker compose down
   ```
2. Start them again and watch the startup order:

   ```bash
   docker compose up
   ```

   Notice:

   - Database starts first
   - Backend waits for database health check
   - Frontend waits for backend health check

3. What happens if a service is unhealthy?
   - Modify backend/app.py to make the health check fail
   - Rebuild and restart: `docker compose up --build`
   - Frontend won't start because backend is unhealthy

### Exercise 7: Scale Services

**Objective**: Learn about horizontal scaling.

1. Try scaling the backend service:
   ```bash
   docker compose up -d --scale backend=3
   ```
2. Check running containers:
   ```bash
   docker compose ps
   ```
3. Why does this fail? Because port 4000 is already bound!

4. To properly scale, you'd need a load balancer (like Nginx) and remove port mapping from backend. This is a more advanced topic.

### Exercise 8: Environment Variables

**Objective**: Understand how to configure services.

1. View environment variables in a container:
   ```bash
   docker compose exec backend env | grep DATABASE
   ```
2. Try changing the database password in docker compose.yml
3. Restart services:
   ```bash
   docker compose down -v
   docker compose up
   ```
4. Connection should still work with the new password

### Exercise 9: Debugging with Logs

**Objective**: Learn to troubleshoot issues using logs.

1. View logs from all services:
   ```bash
   docker compose logs
   ```
2. Follow logs in real-time:
   ```bash
   docker compose logs -f
   ```
3. View logs from specific service:
   ```bash
   docker compose logs -f backend
   ```
4. View last 20 lines:
   ```bash
   docker compose logs --tail=20
   ```

### Exercise 10: Execute Commands in Containers

**Objective**: Learn to interact with running containers.

1. Open a shell in the backend container:
   ```bash
   docker compose exec backend /bin/bash
   ```
2. Once inside, explore:
   ```bash
   ls -la
   cat requirements.txt
   python -c "import flask; print(flask.__version__)"
   exit
   ```
3. Connect to PostgreSQL database:
   ```bash
   docker compose exec database psql -U taskuser -d taskdb
   ```
4. Run SQL queries:
   ```sql
   SELECT * FROM tasks;
   \dt
   \q
   ```

### Exercise 11: Development Workflow

**Objective**: Understand bind mounts for development.

1. With services running, edit backend/app.py
2. Add a new endpoint:
   ```python
   @app.route('/api/hello')
   def hello():
       return jsonify({'message': 'Hello from Docker!'})
   ```
3. Flask auto-reloads - test immediately:
   ```bash
   curl http://localhost:4000/api/hello
   ```
4. No rebuild needed because of bind mount!

## Project Structure

```
docker compose-example/
├── docker compose.yml          # Main orchestration file
├── README.md                   # This file
├── init.sql                    # Database initialization
├── frontend/
│   ├── Dockerfile              # Frontend container definition
│   ├── package.json            # Node.js dependencies
│   └── app.js                  # Express server + HTML
└── backend/
    ├── Dockerfile              # Backend container definition
    ├── requirements.txt        # Python dependencies
    └── app.py                  # Flask REST API
```

## Common Commands Reference

### Starting and Stopping

```bash
docker compose up              # Start all services (foreground)
docker compose up -d           # Start all services (background)
docker compose down            # Stop and remove containers
docker compose down -v         # Stop and remove containers + volumes
docker compose stop            # Stop services without removing
docker compose start           # Start stopped services
docker compose restart         # Restart services
```

### Building

```bash
docker compose build           # Build all images
docker compose build --no-cache # Build without cache
docker compose up --build      # Build and start
```

### Monitoring

```bash
docker compose ps              # List running services
docker compose logs            # View logs from all services
docker compose logs -f         # Follow logs
docker compose logs backend    # Logs from specific service
docker compose top             # View running processes
```

### Executing Commands

```bash
docker compose exec backend bash        # Shell in backend container
docker compose exec database psql -U taskuser -d taskdb
docker compose run backend python -V    # Run one-off command
```

### Cleaning Up

```bash
docker compose down -v         # Remove containers and volumes
docker system prune            # Remove unused Docker objects
docker volume prune            # Remove unused volumes
```

## Troubleshooting

### Ports already in use

**Error**: "port is already allocated"

**Solution**: Stop the service using that port, or change the port mapping in docker compose.yml:

```yaml
ports:
  - "3001:3000" # Use port 3001 on host instead
```

### Services won't start

1. Check logs: `docker compose logs`
2. Verify health checks are passing: `docker compose ps`
3. Try rebuilding: `docker compose up --build`
4. Remove everything and start fresh: `docker compose down -v && docker compose up --build`

### Database connection errors

- Ensure database is healthy: `docker compose ps`
- Check environment variables are correct
- Verify backend is on the correct network

### Can't connect to localhost:3000

- Check if frontend container is running: `docker compose ps`
- Verify port mapping is correct in docker compose.yml
- Check firewall settings

## Additional Learning Resources

### Extend This Project

Try these challenges to learn more:

1. **Add Redis caching**: Add a Redis service and cache API responses
2. **Add Nginx**: Put Nginx in front as a reverse proxy
3. **Use .env files**: Move environment variables to a .env file
4. **Add tests**: Create a test service that runs unit tests
5. **Multi-stage builds**: Optimize Dockerfiles with multi-stage builds
6. **Production mode**: Create docker compose.prod.yml for production
7. **Health monitoring**: Add a health dashboard service

### Official Documentation

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
