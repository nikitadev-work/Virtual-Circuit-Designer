# Visual Circuit Designer Assignment 2022
## Quality Attributes and Architecture

### Project: Visual Circuit Designer
**Customer:** Mikhail Kusikov  
**Team-to:** Innopolis University  

### Team Members
| Name                | Role        | Email                               | Git Username   |
|---------------------|-------------|-------------------------------------|----------------|
| Nikita Khripomilov  | Back-end    | n_khripunkov@inopolis.university   | @Nikita123_321 |
| Islam Gatrullin     | Team-end    | n_gabdrill@inopolis.university     | @iambrink      |
| Amir Gabdullin      | Back-end    | am_gabdullin@inopolis.university   | @amirch6       |
| Iskander Kutlakhmotor | Runner Node | i_kutlahmetov@inopolis.university  | @Iskan229      |
| Ernest Kutilaiev    | Front-end   | e_kutlaiev@inopolis.university     | @Iskdir        |

### Sprint Contributions
- **Iskander**: Authored the Sprint report (planning, review, retrospective).  
- **Nikita**: Assisted with drafting and polishing the LaTeX.  
- **Amir**: Implemented all back-end work: simulation endpoint, DB integration, bug fixes.  
- **Ernest & Islam**: Handled front-end: dashboard UI, playground fixes, drag-and-drop, zoom, delete shortcuts.  
**Non-participating members:** None  
**Date:** July 2025

## Sprint 5 Process

### Backlog Grooming & Sprint Planning
Our team is currently in the 5th sprint (not the 6th, as sprint counting starts from 0). This is reflected in the issue board and other documentation.

During grooming, we filtered the deep backlog to focus on delivering MVP 3 - Personal Project Workspace.  
**Selection logic:** Prioritized tasks that unblock the end-to-end flow: register → create → draw → validate → save.  
**Refinement:** Each issue was rewritten to include a clear User Story, Acceptance Criteria, and Test Case, then sized in story-points (SP) using Planning Poker.  
**Milestone:** Eight refined tickets (total 28 SP) were pulled into Sprint 5 and linked to the MVP 3 GitHub milestone.

#### Table 1: Sprint 5
| Ticket Title                                   | SP | Area                          |
|------------------------------------------------|----|-------------------------------|
| #24 Automatic Post-Registration Login          | 3  | Front-end Dashboard Redirect  |
| #26 Automatic Post-Grid Filter When Saving     | 2  | Front-end Schemas            |
| #27 Dashboard View Toggle (Grid / List)        | 4  | Front-end Project List       |
| #28 Persistent Project List Between Playground & Dashboard | 2 | Front-end                   |
| #29 Back-End Logical-Circuit Simulation        | 4  | Back-end Critical            |
| #30 Back-End Core Bug-Fixes                    | 4  | Back-end                     |
| #31 Playground Core Bug Fixes (Drag-and-Drop, Zoom) | 4 | Front-end                   |
| #32 Delete Components & Connections with Backspace/Delete | 2 | Front-end                 |

**Link to product backlog:** [GitLab Boards](https://gitlab.gg.inapolis.university/team-45/visual-circuit-designer/boards)

### Sprint Review
**Velocity:** 26 SP committed → 26 SP completed (100% completion).  
**Demo highlights:**
- **Instant onboarding:** New users now land directly on their personal dashboard (#24).  
- **Project name propagation:** Zero re-typing when saving schemas (#26).  
- **Dashboard grid/list toggle:** Improves project discoverability for power users (#27).  
- **True persistence:** Dashboard pulls projects/schemas from the DB; nothing "disappears" on refresh (#28).  
- **First server-side simulation:** AND/OR/NOT network up to 1,000 gates in <500 ms (#29).  
- **Stability:** Eliminated race condition and memory leak, 0 failed API tests (#30).  
- **UX polish:** Accurate drag-and-drop, smooth zoom, and keyboard deletes with undo support (#31, #32).

### Sprint Retrospective
#### Table 2: Sprint Retrospective Expanded View
| Could Be Improved                     | Action Items (Next Sprint)                            |
|---------------------------------------|------------------------------------------------------|
| Clear MVP-3 focus                    | Nightly self-healing for staging                     |
| Staging outages (2x)                 | Kubernetes staging: dump DB + restart                |
| Daily stand-ups parsed with QA last 4h | Crunjdo: dump DB + restart                          |

### Completed Features
- **Playground Core Bug Fixes (Drag-and-Drop, Zoom):** Resolved interaction issues for a smoother user experience.  
- **Critical Back-End Bug Fixes:** Improved stability and core logic of the backend.  
- **Back-End Logical-Circuit Simulation:** Core simulation logic is working and integrated with the backend.  
- **Persistent Project List Between Playground & Dashboard:** Ensures project list consistency across views.  
- **Dashboard View Toggle (Grid / List):** Users can toggle between two display modes.  
- **Project Name Auto-Fill When Saving Schemas:** Suggests default names to speed up schema saving.  
- **Automatic Post-Registration Login & Dashboard Redirect:** Streamlines onboarding process.

### Still Pending
- **Export & Representation of Schematics:** Add button for exporting or parsing schematic files.  
- **Display Component Coordinates:** Show position info for precise editing.  
- **Save Dashboard State in LocalStorage:** Preserve user preferences more generally.  
- **Project Deletion Behavior:** Fix inconsistency in project deletion behavior.  
- **Full Simulation Implementation:** Simulation works on the backend but lacks full integration and UX.

### Key Feedback Points
- Retain schematic file parsing button.  
- Enable viewing coordinates of components on the canvas.  
- Save dashboard preferences (view mode, filters) using LocalStorage.  
- Address inconsistent project deletion behavior.  
- Add an overview explaining the internal system architecture.  
- Prioritize completion of already planned features.  
- Finish and polish the full simulation workflow.

### Customer User-Testing Session
**Video:** [Dropbox Link](https://www.dropbox.com/s/2/.../2)

### Quality Assurance and Documentation
- **Quality Characteristics and Attribute Scenarios:** [quality-attribute-scenarios.md](https://gitlab.pg.inopolis.university/team-45/visual-circuit-designer/blob/main/docs/quality-attributes/quality-attribute-scenarios.md)  
- **Quality Assurance Automated Tests:** [automated-tests.md](https://gitlab.pg.inopolis.university/team-45/visual-circuit-designer/blob/main/docs/quality-assurance/automated-tests.md)  
- **Quality Assurance User Tests:** [user-acceptance-tests.md](https://gitlab.pg.inopolis.university/team-45/visual-circuit-designer/blob/main/docs/quality-assurance/user-acceptance-tests.md)  
- **Continuous Delivery:** [continuous-delivery.md](https://gitlab.pg.inopolis.university/team-45/visual-circuit-designer/blob/main/docs/automation/continuous-delivery.md)  
- **Continuous Integration:** [continuous-integration.md](https://gitlab.pg.inopolis.university/team-45/visual-circuit-designer/blob/main/docs/automation/continuous-integration.md)  
- **CHANGELOG:** [CHANGELOG.md](https://gitlab.pg.inopolis.university/team-45/visual-circuit-designer/blob/main/CHANGELOG.md?ref_type=heads)