# <div align="center"> Automated Tests </div>

Automated testing is a core part of our development workflow. All test suites are executed during CI/CD to ensure the stability, correctness, and maintainability of the codebase.

---

## <div align="center"> ✅ Purpose ✅ </div>

Automated tests are designed to:
- Catch bugs and regressions early
- Validate the expected behavior of components and services
- Enable safe refactoring
- Enforce code style and structure

---

## <div align="center"> 🔧 Tools & Frameworks 🔧 </div>

| Tool                    | Usage                                                                 |
|-------------------------|-----------------------------------------------------------------------|
| **Jest**                | Main test runner for unit and integration tests (frontend)           |
| **React Testing Library** | Simulates user interactions with the UI                              |
| **Supertest**           | Tests HTTP requests to backend APIs                                   |
| **ESLint**              | Static code analysis for style and errors                            |
| **Prettier**            | Auto-formatting of code according to defined style                   |

---

## <div align="center"> 📁 Test Structure 📁 </div>

### Frontend

| Type         | File Location                                |
|--------------|----------------------------------------------|
| Unit Tests   | `frontend/__tests__/unit.test.js`            |
| Integration  | `frontend/__tests__/integration.test.js`     |


---

## 🧪 Running Tests Locally

```bash
# Run all tests in frontend
cd frontend
npm test

# Run linter
npm run lint

