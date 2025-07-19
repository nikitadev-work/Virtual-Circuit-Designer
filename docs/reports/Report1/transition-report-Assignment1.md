# Visual Circuit Designer Report

## Team Assignments

- **Nikita Khripunkov** - Back-end
  - UserFlow of the web-service
  - Creating API for user registration
- **Islam Gaudullin** - Front-end and Designer
  - Design the visual prototype of the web-service in the first week
  - Basic layout of the prototype using HTML, CSS, JS
- **Amir Gaudullin** - Back-end
  - Creating API for user registration
- **Iskander Kutlakhmetov** - Runner Node
  - Research and learn about working with graphs and reproducing simulations
- **Ernest Kudakavev** - Front-end
  - Basic layout of the prototype using HTML, CSS, JS

**Date**: June 7, 2025

## Interview Script with Improvement Notes

### Initial Interview Script

1. **How will you evaluate our project, what criteria are taken into account?**
2. **Is it acceptable to implement only the first part of the project, i.e., make a web service for creating circuits, but not implement integration with real FPGAs, creating custom blocks, and publishing them, to meet deadlines?**
   - **Improvement (Principle 1)**: Original question focused on constraints (deadlines) and sought approval. Improved question: *In your current workflow, how do you handle circuit design when you can't access real FPGA hardware?*  
     - Focuses on their actual behavior and needs, revealing whether a partial solution would work.
3. **What should the minimum working version of the project look like to be accepted as a completed project? Is it possible to partially implement all functionality, only 1-2 functions from each, to save time? Is it possible not to use NN in the project to simplify development and save time, especially for the first version?**
   - **Improvement (Principle 2)**: Original question focused on constraints (saving time, simplifying development). Improved question: *Have you ever used a tool that was missing [critical feature X]? How did you work around it, and what problems did it cause?*  
     - Forces them to recall actual experiences rather than speculate.
4. **Are there any wishes for the design? Is it possible to make it more modern than in the references, so that students do not feel uncomfortable?**
5. **How should the system work? Should it be event-driven (instantaneous change of pin and the project) or more complex with step-by-step execution (like processes in PCs)?**
   - **Improvement (Principle 3)**: Original question was a leading, binary question assuming known options. Improved question: *Talk me through how you currently simulate circuits. What works well, and what causes delays or errors?*  
     - Open-ended, lets them explain their process without steering the answer.
6. **What specific logic components and blocks should be included in the MVP library (e.g., basic: AND/OR/NOT gates, multipliers, registers), and what are the requirements for their parameterization (number of inputs, base width, etc.)?**
7. **What level of interaction and simulation fidelity do you expect in the first prototype (MVP)? For example, is waveform display and basic timing diagram enough, or do you need support for more accurate timing analysis and latency checking?**
8. **What are the main tasks that the front-end should perform in the first version (e.g., drawing a block diagram, connecting components with lines, saving the project)?**

## Interview Notes/Transcript

### Summary of Interview
- The customer wants a service with great functionality, important for teaching students.
- Freedom in design is allowed, but it must be in a modern style.
- No plans to interact with external devices like FPGAs; this step is optional.

### Link to the Recording
- Technical issues prevented audio recording, but all important points were manually noted and will be considered in future work.

### Link to the Miro Board
- (Not provided in the original document)

### Qualitative Analysis Table
- (Not provided in the original document)

## Learnings from Interview and Product Research

### Key Learning Points
1. Tools that work directly in the browser are in high demand, especially for rapid prototyping and educational projects.
2. Programs like Quartus and Vivado require powerful hardware, are difficult to set up, take up a lot of space, and have outdated interfaces.
3. Students want to create their own modules and use/modify others' modules.
4. The ability to collaborate on projects (like Google Docs) will speed up learning.
5. Simulation with signal visualization is required (similar to Logisim, but for HDL).

## MVP Versions

- **MVP v0**: Basic interface without business logic. Realization of permutation of logical operators. Test version of the design concept.
- **MVP v1**: Connecting back-end with front-end. User registration and adding users to the database.
- **MVP v2**: Logic of circuits, compilation to Verilog, and simulation. Fixed UI and UX. Final version of design.
- **MVP v3**: Bug fixes, ready product.

## Core Value Point for Customer
The team must decide on the final product:
1. A product made from scratch, based only on the team’s own background, with less functionality.
2. A product that borrows ideas from competitors’ products but has more functionality than option 1.

## Next Steps for the Team

1. **Project Preparation**
   - Initialize repository (GitLab)
   - Set up a basic frontend project
   - Determine the type of project proposed by the customer
2. **Basic UI (UX Concept)**
   - Set up layout: left sidebar (component panel), central workspace (canvas)
   - Work out basic style: background, canvas grid, basic colors, fonts
   - Implement block selection/deletion
3. **Implementation of Moving Logical Operators**
   - Create basic nodes: AND, OR, NOT, XOR, NOR, NAND
   - Enable free movement of nodes on the canvas
   - Enable connecting blocks with lines (wires/arrows)
4. **Test Version of the Design Concept**
   - Conduct internal testing (test UX)
   - Configure basic interactive actions: moving blocks, connecting/disconnecting blocks, removing lines
   - Conduct a feedback session in the team
5. **Presentation Preparation**
   - Prepare a link to a working prototype
   - Document the current state (what works / what is not implemented)