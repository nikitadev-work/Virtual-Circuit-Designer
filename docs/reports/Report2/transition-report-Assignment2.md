# Assignment 2: Visual Circuit Designer
**Customer:** Mikhail Kuskov  
**Date:** June 15, 2025

## Team Members, Roles, and Contributions
- **Nikita Khripunkov** - Back-end. Developed an API for working with services and created a service for user authentication.
- **Islam Gabiullin** - Front-end. Designed an interactive UI prototype, built the base layout, and formed a built-in library of logic components.
- **Amir Gabiullin** - Back-end. Created a service for working with a database.
- **Iskander Kutakhmetov** - Runner Node. Researched graph engine and developed an initial simulator Proof of Concept (PoC).
- **Ernest Kudakaev** - Front-end. Integrated drag-and-drop workspace and basic functionality (Connection/Adding/Removing elements).

## Use Case Diagram
[Link to Use Case Diagram]  
(To better demonstrate the idea that the team has already implemented or plans to implement, we created a diagram that includes features from both MVPO and MVPI.)

## User Stories
- As a student, I want to create a schematic using a drag-and-drop interface so that I can easily design logic circuits directly in the browser without installing additional software.
- As a student, I want to connect components using lines and arrows to visually show data flow and relationships between circuit elements.
- As a user, I want access to a built-in library of logic components (AND, OR, NOT, Flip-Flop, etc.) so that I can use ready-made blocks when designing circuits.
- As a user, I want to save created schematics in my account so that I can return to them later and continue working.
- As a user, I want to load previously saved designs to edit or re-run them.
- As a user, I want to run a circuit simulation directly in the browser to interactively test its behavior without installing additional software.

## DEEEP Product Backlog
[Link to Product Backlog]  
(For better understanding by the customer and TA, we demonstrated the Backlog in "GitLab plan" with several sections.)

## Design: Data Model, UI, API

### Data Model (ER Diagram)
**Figure 1: ER-diagram of DB: tables users and circuits**  
The diagram, created in PlantUML, reflects the structure of the `users` and `circuits` tables. The `user_id - id` relationship indicates that each circuit belongs to one user. The `NOT NULL` fields correspond to constraints specified in the SQL query.

### UI Prototype
[Link to UI Prototype]

### API Design
We specified our API design using Postman. [Link to mock API (Postman)].

### Deployed MVP v0
[Link to Deployed MVP]

### Activity Tracking Sheet
[Link to Activity Tracking Sheet]

## Key Customer Feedback Points
1. **Add indicator blocks for interaction visualization**  
   Users need "active" elements (switches, push-buttons, LEDs) so that changing a state on the canvas (e.g., clicking a toggle) instantly shows signal propagation. Goal: make demos understandable for beginners who do not think in binary (0/1).
2. **Implement saving and loading of schemes**  
   Ensure the workflow "start - save - resume later" preserves all data, node positions, connections, and settings.  
   - MVP-1/2: Local save/load (using LocalStorage or similar).  
   - Later: Bind to user accounts for cross-device synchronization.
3. **Enable project sharing (MVP-3 - MVP-4)**  
   Provide public links:  
   - View-only URL for demonstration or homework checks.  
   - Optional edit-rights link for collaborative work.  
   - Long-term idea: Gallery of "Featured Projects" curated by tutors.
4. **Fix current usability bugs**  
   - Intermittent failure to remove logic elements (ghost nodes remain and affect the netlist).  
   - Lack of zoom in/zoom out on large canvases; add Ctrl+Scroll and Right-Click-to-pan.  
   - Verify that deletion/zoom actions do not break connections or the undo/redo stack.