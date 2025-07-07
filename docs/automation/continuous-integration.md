# <div align="center"> Continuous Integration </div>

This document describes the CI pipeline that runs on every commit or merge to the `main` branch.

---

## <div align="center">  CI Pipeline Steps  </div>

1. **Checkout**  
   GitLab Runner clones the repository and checks out the `main` branch.

2. **Install Dependencies & Lint**
    - **Frontend**
      ```bash
      cd frontend
      npm ci
      npm run lint
      ```
    - **Backend**
      ```bash
      cd backend/API_service
      npm ci
      npm run lint
      ```

3. **Run Tests**
    - **Frontend**
      ```bash
      cd frontend
      npm test
      npm run build
      ```
    - **Backend**
      ```bash
      cd backend/API_service
      npm test
      ```

4. **Static Analysis & Type Checking**
    - ESLint for JavaScript/TypeScript
    - `tsc --noEmit` for type safety

5. **Build Docker Images**
   ```bash
   docker build -t registry.gitlab.pg.innopolis.university/team-45/vcd-frontend:latest \
     -f frontend/Dockerfile frontend
   docker build -t registry.gitlab.pg.innopolis.university/team-45/vcd-backend:latest \
     -f backend/API_service/Dockerfile backend/API_service
6. **Push to Container Registry**

   docker push registry.gitlab.pg.innopolis.university/team-45/vcd-frontend:latest

   docker push registry.gitlab.pg.innopolis.university/team-45/vcd-backend:latest

**See the full CI configuration** 
https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/blob/main/.gitlab-ci.yml