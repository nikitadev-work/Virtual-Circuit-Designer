# Visual Circuit Designer Assignment 3

## Customer
Mikhail Kuskov

## Date
June 22, 2025

## Team Members, Roles, and Contributions
- **Nikita Khripunkov** - Back-end: Created the logic for authentication and JWT token generation.
- **Islam Gainullin** - Front-end/UI: Designed dashboard page and implemented adjustments to implement authorization from the front-end.
- **Amir Gabdullin** - Back-end: Developed the logic for saving the user in the database and verifying the login data.
- **Iskander Kutlakhmnetov** - Runner Node: Wrote a Verilog Implementation in Python to correctly process incoming information and implement the execution of circuits.
- **Ernest Kudaknev** - Front-end: Expanded the functionality of the workspace (Added button animation, calling a window when right-clicking, and hiding/opening the sidebar).

## Git Repository & Sprint Links
- **GitLab Repository**: GitLab repository
- **Milestone Link**: link
- **Main Goal of the Upcoming Sprint**:
  - Implement the work of the simplest logical circuits.
  - Fix bugs (Problem associated with connecting logical components when moving away).
  - Design a dashboard page and implement its functionality (Opening saved projects, viewing them, interacting with settings).
- **Items with Estimates, Assignments, and Acceptance Criteria**: Implemented in issue board on GitLab.

## Story Points Tracking
- **Tracking Sheet Link**: link
- **Total Story Points in Product Backlog**: 10 SP
- **Story Points Planned for Sprint**: 15 SP
- **Story Points Completed**: 10 SP

## Sprint Retrospective
### What Went Well
- Met deadlines for all planned tasks.
- Solved problematic issues related to the server and determined a more optimal deployment strategy.
- Held a useful meeting with the customer.

### What Wasn't Good
- The team meeting was not very productive.
- Difficulties in merging branches in Git.

### What We Will Change
- Be more realistic about task timing.
- Better organize work with branches.

## Git Workflow Description
### Branching Strategy
- **Main Branch**: Contains the current version of the project.
- **Develop Branch**: Where all changes are sent and from which they get to the main branch.
- **Commit Message Convention**: Previously undefined, will establish an agreement for future sprints.
- **Pull/Merge Request Process**: Handled by the person who made the last commit that needs to be merged.
- **Proof of Participation**:
  - All members created branches and merge requests.
  - All members reviewed at least one merge request and commented.

## MVP V1 Delivery
### Link to Deployed MVP
- [Link placeholder]

### Core Functionality
- **User Authentication System**:
  - Secure user registration and login functionality.
  - Personalized user profiles for project management.
- **Interactive Circuit Design**:
  - Intuitive drag-and-drop interface for placing logic gates (AND, OR, NOT, etc.).
  - Ability to rotate and connect circuit components.
  - Input/output definition for circuit simulation.
- **Project Management**:
  - Save/load functionality for circuit designs.
  - Database storage of user projects.
  - Workspace organization tools.

### MVP Implementation (Version 1)
- Authentication system (registration/login).
- Basic logic gate components.
- Canvas editing and connection tools.
- Persistent storage of circuit designs.

## Customer Testing Recording
### Key Feedback
- Combine the 1/0 and Components sidebars into one for easier navigation.
- Add the ability to select multiple workspace components and create duplicates.
- Implement local history feature (similar to PyCharm) for returning to previous project versions.
- Adjust component text positions during rotation or reflection to remain fixed.
- Fix bugs with connections moving when zooming out.
- Consider JSON transfer options for circuit data: convert to Verilog on front-end or send to back-end for processing with Icarus Verilog.

## Learning Points
- Evaluate all possible options for transferring circuit data via JSON to the back-end, either converting to Verilog on the front-end or processing on the back-end with Icarus Verilog.

## Presentation
- **Slides Link**: [Link placeholder]
- **Presented at**: June 23, 2025

## Product Progress Summary
### Current Status
The current version implements core functionality for creating and managing digital logic circuits, including:
- User authentication with secure registration and login.
- Basic logic gates (AND, OR, etc.) with a drag-and-drop interface.
- Component rotation and wire connections.
- Save/load functionality with database storage.
- Backend handles HTTP requests, and Docker configuration ensures proper service communication.

### Next Steps (Sprint 3 for MVP2)
- Fix workspace bugs.
- Implement logic circuit execution and front-end/back-end interaction.
- Implement dashboard page functionality.
- Additional details on GitLab.