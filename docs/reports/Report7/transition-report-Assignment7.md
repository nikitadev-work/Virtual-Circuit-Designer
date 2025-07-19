# Visual Circuit Designer
## Assignment 7: Delivering a Valuable Product

**Project:** Visual Circuit Designer  
**Customer:** Mikhail Kuskov  
**Team:** Team-45, Innopolis University  
**Date:** July 2025

## Team Information

| Name                  | Role          | Email                                     | Git Username    |
|-----------------------|---------------|-------------------------------------------|-----------------|
| Nikita Khripunkov     | Back-end      | n.khripunkov@innopolis.university         | @Nikita123_321  |
| Islam Gainullin       | Front-end     | is.gainullin@innopolis.university         | @bimbiriim      |
| Amir Gabdullin        | Back-end      | am.gabdullin@innopolis.university         | @amirich6       |
| Iskander Kutlakhmetov | Runner Node   | i.kutlahmetov@innopolis.university        | @Iskan229       |
| Ernest Kudakaev       | Front-end     | e.kudakaev@innopolis.university           | @ba6kir         |

**Sprint Contributions:**
- **Iskander**: Authored the Sprint report (planning, review, retrospective).
- **Nikita**: Created an endpoint for deletion in the API and corrected the deployment of the runner node.
- **Amir**: Fixed bugs on the back-end to achieve stable operation of the circuit simulation module.
- **Ernest & Islam**: Implemented circuit simulation and fixed bugs.

**Non-participating members:** None

## Usefulness and Transition Report

This report summarizes the meeting with the customer to discuss the product's status, usage, deployment, and future plans. The report is available in the repository at [docs/reports/...](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/tree/main/docs/reports?ref_type=heads).

### Product Status

#### Completed Features
- **Core Editing Interface**:
  - Drag-and-drop component placement (AND, OR, NOT, XOR, I/O).
  - Connection system with logic lines/arrows.
  - Component manipulation (rotate, flip, add output pins).
  - Keyboard shortcuts for deletion.
- **User System**:
  - Email/password authentication.
  - Token-based API protection.
- **Project Management**:
  - Project creation with name propagation.
  - Dashboard with project listing/search.
  - Grid/List view toggle (persistent preference).
  - Backend-powered saving/loading (POST/GET).
  - Modular block saving with layout metadata.
- **Simulation & Validation**:
  - Backend simulation via POST /simulate endpoint.
  - Visual circuit validation pre-save.
  - Input/output port validation.
- **System Features**:
  - Centralized logging.
  - GitLab CI/CD pipelines.
  - Docker Compose environment.
  - Canvas performance optimizations.

#### Pending Features
- **Export Functionality**:
  - Circuit export as standard formats (Verilog/VHDL).
  - Image/PDF export of diagrams.
  - Simulation data export (CSV/JSON).
- **Simulation Enhancement**:
  - Real-time in-canvas visualization.
  - Waveform analysis tools.
  - Multi-clock domain support.
  - Component timing analysis.
- **Advanced Features**:
  - Real-time collaboration.
  - Custom component creation.
  - Version history/rollback.
  - Sub-circuit abstraction.
- **System Improvements**:
  - Mobile/responsive interface.
  - Additional auth providers (GitHub, Microsoft).
  - Performance benchmarking tools.

### Customer Usage
- **Usage Frequency and Method**:
  - The customer is not currently using the product in production environments.
  - Future educational usage planned for laboratory sessions at Innopolis University.
  - Potential adoption contingent on product completion and feature satisfaction.
  - Intended as a teaching tool for digital logic design courses.
- **Deployment Status**:
  - Not yet deployed on customer infrastructure.
  - Currently running on team's development/staging environment.
  - Deployment readiness confirmed through Docker/CI/CD pipeline.
  - Test deployment available at [test deploy](http://85.198.81.168/).
- **Transition Measures**:
  - Full repository handover with documentation transfer.
  - Deployment procedure explanation.
  - Post-transition support period.

### Customer's Future Plans
- **Post-Delivery Plans**:
  - Integration with FPGA hardware for real-world circuit implementation.
  - Development of educational materials for student laboratories.
  - Use as a teaching tool in digital logic design courses.
  - Potential adoption in Innopolis University curriculum.
  - Enhancement for research applications in hardware design.
- **Continued Collaboration**:
  - Interest in ongoing development beyond course requirements.
  - Openness to further collaboration under academic/research partnerships.
  - Potential continuation as:
    - Faculty-supervised student project.
    - Research initiative with university funding.
    - Open-source community project.
  - Customer statement: *"It would be beneficial to continue development even after the course to create a fully finished product."*
- **Next Steps**:
  - **Short-term (1-3 months)**:
    - Complete pending features (export functionality, simulation enhancements).
    - Conduct pilot testing in an educational setting.
    - Gather student feedback for improvements.
  - **Mid-term (3-6 months)**:
    - Develop FPGA integration capabilities.
    - Create curriculum-aligned teaching materials.
    - Implement mobile/responsive interface.
  - **Long-term (6+ months)**:
    - Add real-time collaboration features.
    - Develop hardware interfacing modules.
    - Expand component library for advanced courses.

### Customer Feedback on README
- **Clarity**: The customer expressed high satisfaction with the clarity of the README, noting its well-organized structure, straightforward setup instructions, clearly outlined deployment steps, and intuitive usage guidelines, particularly for users familiar with circuit design tools.
- **Deployment Instructions**: The customer successfully deployed the Visual Circuit Designer on their infrastructure using the provided instructions, reporting no issues and noting that even team members with limited technical expertise could follow them effectively.
- **Additional Sections**:
  - **[Role Distribution (for customer)](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/blob/main/README.md?ref_type=heads#-team-members-)**: Defines responsibilities for team members (developers, designers, administrators) to ensure efficient collaboration and maintenance. Extended version available at [CONTRIBUTING.md](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/blob/main/docs/development/CONTRIBUTING.md#--team-members-and-contributions--).
  - **[Description and Usage in README (for customer)](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/blob/main/README.md#description-and-usage)**: Splits the Usage section into a "Description" (overview of purpose and features) and a "Usage" section (step-by-step instructions with examples) to enhance user onboarding.

### Meeting Transcript and Recording
The full transcript and recording of the customer meeting are available at [this link](https://www.dropbox.com/scl/fi/073rozopcxjrhtm5umz04/FeedBack.mp4?rlkey=h9rns9246ya1i1xzotu5shlif&st=bgwlb548&dl=0).

## Regular Activities
- **Product Backlog and Sprint Milestone**: [Link to Sprint milestone](https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer/-/milestones/4#tab-issues) with sprint goal, completed issues, pull requests, and groomed product backlog.
- **Sprint Tracking Table**: [Link to Sprint tracking sheet](https://docs.google.com/spreadsheets/d/1SGbc4nW3ZNP6p4rJFL7kns3ftsbBbcRCNFcaKKOpOF8/edit?pli=1&gid=0#gid=0).
- **MVP Roadmap**: [Link to extended MVP Roadmap](https://docs.google.com/spreadsheets/d/1SGbc4nW3ZNP6p4rJFL7kns3ftsbBbcRCNFcaKKOpOF8/edit?pli=1&gid=725595302#gid=725595302) with at least two additional versions and team commentary.
- **Demo Day Rehearsal**: [Link to video rehearsal](https://www.dropbox.com/scl/fi/tzv669acdxpt1kjk0al8t/SomeDiscussion.mp4?rlkey=vs01gxb9g8srxq2kwdtowrtrk&st=9bt2rdyh&dl=0) meeting all demo day presentation requirements.