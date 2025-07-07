## <div align="center"> User Acceptance Tests & Issue Tracking </div>

Each **User Acceptance Test (UAT)** in our project is directly linked to its corresponding **GitLab issue**.

- UAT scenarios are written as part of the **issue description**.
- Each issue includes:
    - 📌 User story
    - ✅ Acceptance criteria
    - 🧪 Test cases
- These descriptions serve as a reference for manual or automated acceptance testing.

You can find all testable issues here:

🔗 **Issue Board:**  
[https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/boards](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/boards)

---

### 🧾 Example Format in Issue Description

```text
Title: User can save circuit to their account

Labels: Front-end, 2 sp, Sprint 2, HIGH priority, Acceptance Criteria

Acceptance Criteria:
- Save button is visible and enabled after user edits circuit
- Saving sends data to backend API and returns 200 OK
- User sees success notification

Test case:
- Given a logged-in user
- When user places a gate and clicks "Save"
- Then circuit is persisted and reloadable
