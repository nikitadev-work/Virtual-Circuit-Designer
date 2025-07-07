
# <div align="center"> Continuous Deployment (CD) </div>

This project uses an automated deployment system based on GitLab CI/CD. Below is a detailed description of how the deployment process works after updates to the `main` branch.

---

## <div align="center">  Overview </div>

1. **A developer merges into the `main` branch.**
2. The **CI pipeline** runs:
   - Linting, testing, and building all services.
3. If successful, the **GitLab Runner**:
   - Builds Docker images for all services.
   - Pushes them to the production server.
4. On the server, the following commands are executed:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```
5. **All services are restarted automatically with the latest version.**

---

## <div align="center"> Deployment Details </div>

### <div align="center"> Services Included </div>

- `backend/` – microservices: API, Authentication, DB, RunningNode
- `frontend/` – user interface
- `grafana/` – monitoring stack using Loki and Promtail

### <div align="center"> Docker Compose Usage </div>

- `docker-compose.yml` – used in production
- `docker-compose.dev.yml` – used for local development

To redeploy the stack manually, run:

```bash
docker-compose -f docker-compose.yml pull
docker-compose -f docker-compose.yml up -d
```

---

## <div align="center"> Monitoring & Logging </div>

Monitoring configuration files:

- `loki-config.yaml` – log aggregation
- `promtail-config.yml` – log forwarding agent

---

## <div align="center"> Deployment Conditions </div>

- All CI jobs must pass successfully.
- The commit must be merged into the `main` branch.
- The `.gitlab-ci.yml` file must include stages:
  - `build`, `test`, `docker build`, `deploy`

---

## <div align="center"> Related Files </div>

- `.gitlab-ci.yml` — CI/CD pipeline configuration
- `docker-compose.yml` — production deployment
- `docker-compose.dev.yml` — development environment
- `loki-config.yaml`, `promtail-config.yml` — logging configuration
