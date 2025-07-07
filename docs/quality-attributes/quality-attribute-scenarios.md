# <div align="center"> Quality Attribute Scenarios </div>

---

## <div align="center"> Front-end </div>

### 1. Modularity

**Definition:**  
Partitioning the system into small independent, loosely coupled modules or components, each performing strictly assigned roles.

**Why is this important?**  
The digital circuit drawing interface consists of many areas (block palette, canvas, property panel, debug panel). Clear modularity allows changing or adding, for example, a new type of block without the risk of breaking the rest of the UI.

#### Quality Scenario:
Adding a new "D-trigger" block to the palette should affect no more than 2 modules (`PaletteModule` and `BlockRendererModule`).  
A full frontend build should complete without errors, and all existing UI E2E tests should pass.

- **Metric:** Number of changed modules ≤ 2
- **Success Condition:** CI build and E2E tests are 100% successful

**Test Plan:**
1. Implement support for the "D-trigger" in `PaletteModule` and `BlockRendererModule`.
2. Make a commit and run a full build in CI—check that only these two modules are changed in the builder report.
3. Run E2E tests (Playwright/Cypress)—ensure all scenarios pass.
4. Confirm that build time increased by no more than 5% compared to the previous successful run.

---

### 2. Modifiability

**Definition:**  
The degree to which the system can easily accommodate both minor and global changes, with minimal effort.

**Why is this important?**  
New requirements appear regularly (e.g., supporting export in JSON or SVG). We must quickly implement these features without deeply rewriting the existing architecture.

#### Quality Scenario:
Implementation of the "Export diagram to SVG" function should take no more than 8 hours of development and affect no more than 5 code files.

- **Metric:** Task execution time ≤ 8 hours; changed files ≤ 5
- **Success Condition:** After implementation, all existing unit and integration tests pass.

**Test Plan:**
1. Record the start and end time of SVG exporter development in the tracker.
2. Check with `git diff --stat` that no more than 5 files are affected.
3. Run unit and integration tests in CI—ensure all tests pass.
4. Add a new API test to validate SVG export (compare to a reference fragment).

---

### 3. Testability

**Definition:**  
The extent to which the system supports writing, executing, and automating tests (unit, integration, E2E, etc.).

**Why is this important?**  
A complex UI (drag-and-drop, dynamic effects, backend integration) requires that each release is reliable and no regressions leak into production.

#### Quality Scenario:
For every new user flow (e.g., "create a diagram → add a D-trigger → download SVG"), there must be an E2E test that runs in ≤ 10 seconds and covers at least 3 key scenarios (success, cancellation, server error).

- **Metric:** Time to run one E2E test ≤ 10 seconds; number of scenarios ≥ 3
- **Success Condition:** CI pipeline passes in 100% of runs, without flakiness.

**Test Plan:**
1. Write an E2E test (Playwright/Cypress) for the described flow and three outcomes.
2. Run locally and in CI, measure average runtime.
3. Ensure runtime is ≤ 10 seconds and all scenarios yield expected results.
4. For any UI change, update test selectors/steps and keep runtime metric.

---

## <div align="center"> Back-end </div>

### 1. Performance Efficiency

#### a) Time Behaviour

**Definition:**  
The response time of the system under typical conditions.

**Quality Scenario:**
- **Source:** Authorized user
- **Stimulus:** Run a simulation
- **Artifact:** Running node service
- **Environment:** Production
- **Response:** Convert scheme to Verilog and get output
- **Response Measure:** Average simulation response time < 10 seconds (no timeouts)

**Test Plan:**
- Use automated test scripts to simulate user requests for circuit simulation.
- Measure response time over multiple runs in production.
- Ensure all responses are under 10 seconds.

---

#### b) Resource Utilization

**Definition:**  
Efficient use of server resources (CPU) during intensive operations.

**Quality Scenario:**
- **Source:** Authorized user
- **Stimulus:** Run simulation for a large circuit
- **Artifact:** Running node service
- **Environment:** Production
- **Response:** Get output after simulation
- **Response Measure:** CPU usage does not exceed 70% during simulation

**Test Plan:**
- Launch simulations of large circuits.
- Monitor CPU usage using server metrics tools.
- Verify CPU usage remains below 70% throughout.

---

#### c) Capacity

**Definition:**  
The maximum number of parallel simulations the system can handle with acceptable resource usage.

**Quality Scenario:**
- **Source:** Authorized users
- **Stimulus:** Start 100 parallel circuit simulations
- **Artifact:** Running node service
- **Environment:** Production
- **Response:** Get result after each simulation
- **Response Measure:** Total memory usage remains below 50% while running 100 simulations in parallel

**Test Plan:**
- Use load testing tools to start 100 simulations concurrently.
- Monitor total server memory usage.
- Ensure memory usage is < 50% of available RAM at all times.

---

