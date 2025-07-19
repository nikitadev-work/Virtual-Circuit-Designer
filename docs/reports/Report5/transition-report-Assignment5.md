# Assignment 5: Quality Attributes and Architecture
## Project: Visual Circuit Designer
## Customer: Mikhail Kuskov

### Team Members
- **Nikitaa** - Back-end dev
  - Worked on configuring and maintaining the CI/CD pipelines.
  - Implemented the functionality for saving and loading user schematics.
  - Resolved several critical bugs that improved the system's stability and reliability.

### Product Backlog
- [GitLab Board](https://gitlab.pg.inopolis.university/team-45/visual-circuit-designer/-/boards)

### Sprint 5(4) Milestone
- [GitLab Milestone](https://gitlab.pg.inopolis.university/team-45/visual-circuit-designer/-/milestones/3#tab-issues)

### Sprint Tracking Table
- [Google Spreadsheet](https://docs.google.com/spreadsheets/d/150bC4k3ZNP6p4JFL7kn3t3tabBCRNF6K0K0P6/edit#gid=0)

### Product Roadmap
- **Link**: [Google Spreadsheet](https://docs.google.com/spreadsheets/d/150bC4k3ZNP6p4JFL7kn3t3tabBCRNF/edit#gid=7555302)
- **MVP v2 Deployment**: [http://85.168.81.168](http://85.168.81.168)
- **Launch Instructions**: [GitLab README](https://gitlab.pg.inopolis.university/team-45/visual-circuit-designer/-/blob/main/README.md)
- **Demo Video**: [Dropbox Link](https://www.dropbox.com/ace/41/1xxxxc6e4a2e87z1j15idx/775181221894997nov7-1key7-f6p6c6pygglind5vwe4us1jukat-4q0d1a0d1d-0)

### Testing Session Report
#### Main Findings and Improvements
- **One-click duplication of logic components**: Users noted the need for a faster way to duplicate logic components. This feature was requested to streamline workflow, reduce repetitive actions, and improve usability for circuit designers.
- **Persistent circuit state across refresh**: During testing, it was found that circuit state was not retained after refreshing the page. Addressing this led to improvements in how circuit data is saved and loaded (see completed issues #23, #8, #5, #4). Now, user schematics and circuit state persist across sessions, enhancing the overall user experience.
- **Use 0.1 instead of color palette on inputs**: Feedback indicated that using a color palette for input values was not intuitive for all users. It was suggested to replace this with explicit 0.1 values, making input configuration clearer and reducing confusion, especially for new users.
- **Dashboard usability and bug fixes**: Several frontend issues were addressed to improve the dashboard page (see completed issue #18). Usability was enhanced, and navigation became more intuitive after addressing user feedback.
- **System stability and deployment**: Critical bugs were fixed (see completed issue #19) and the deployment process was improved, including CI/CD setup and production deployment (see issues #20, #21, #23). This resulted in a more reliable and accessible application for testers and stakeholders.
- **Improved testing and logging**: New backend tests and a centralized logging system were implemented (see issues #21, #3). This made it easier to identify and resolve issues during the testing session, contributing to the overall robustness of the application.

### Conclusion
The testing session provided actionable insights, leading to several feature enhancements and bug fixes. User experience was significantly improved through better persistence, usability updates, and system reliability. All findings were documented and corresponding issues were resolved during the sprint.

### Retrospective
#### What Went Well
- **Consistent team performance**: 9 significant issues were closed during the sprint, including project deployment to production, CI/CD setup, implementing and saving user schematics, centralized logging, and dashboard enhancements.
- **Efficient customer feedback integration**: Most client comments were promptly addressed and reflected in the product, improving customer satisfaction and overall solution quality.
- **Completion of complex tasks**: Both front-end and back-end stories were delivered, with successful integration of new modules, test cases, and user stories.

#### Areas for Improvement
- **Test coverage planning**: Some tasks lacked sufficient test case coverage. More attention is needed on test planning and automation in the next development cycle.
- **Backlog management**: Tasks in the Deep Backlog require regular review to prevent accumulation and outdated tickets.
- **Balanced prioritization**: The sprint included many high-priority tasks, which increased workload. Better distribution of urgent and important tasks is needed in future sprints.

#### Plans for the Next Sprint
- Complete ongoing tasks (e.g., project sharing functionality).
- Improve automated test coverage and integrate test planning into the workflow.
- Conduct regular priority reviews and ensure more even task distribution across the team.

### Pull Requests with 10 New Tests
- [GitLab Frontend Tests](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/tree/main/frontend_/tests_/ref_type=heads)
  - In the last sprint, we focused on the stability of the front-end side, so tests were made only for it. In the upcoming sprint, tests will be made for the back-end side.

### CI and CD Workflow Run
- **Latest successful CI/CD pipeline**: [GitLab Commit](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/commit/15692a/6940434a0689052d2a8a007a9a87f1/24/)
  - Runs all tests, linter, and build and deployment project.

### README
- [GitLab README](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/blob/main/README.md)

### Workflow Issues
- [Merge Request #129](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/merge_requests/129)
- [Merge Request #124](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/merge_requests/124)

### Workflow Pull Requests
- [Merge Request #128](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/merge_requests/128)
- [Merge Request #116](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/merge_requests/116)