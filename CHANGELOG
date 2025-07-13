# Changelog

All notable changes to this project are documented in this file.

This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) principles and adheres to [Semantic Versioning](https://semver.org/).

---

## [0.1.0] - 2025-06-14

### MVP0

First version focused on foundational UI, component interaction, and development environment setup.

#### Added

- UI shell with navigation, sidebar, and canvas zones.
- Logic component library: AND, OR, NOT, XOR, I/O.
- Drag-and-drop support and repositioning of components.
- Connection system for drawing logic lines and arrows.
- Login screen UI with input validation (no backend).
- Docker Compose setup for frontend, backend, and database.

---

### Summary

This version delivers a working prototype for editing digital logic diagrams with basic interactivity and local deployment support.

---

## [1.0.0] - 2025-06-22

### MVP1

This version introduced user authentication and basic backend-connected saving/loading.

#### Added

- User authentication with email/password and OAuth (Google).
- Token-based API protection and session management.
- Context menu with actions: rotate, flip, add output pins.
- UI enhancements including tooltips and interactive elements.
- Backend circuit saving/loading for logged-in users.

#### Fixed

- Canvas logic element deletion bugs.
- Zoom scaling performance and layout stability.

---

### Summary

MVP1 makes the app secure and user-specific, enabling persistent editing and basic stateful interactions.

---

## [2.0.0] - 2025-07-06

### MVP2

This milestone introduced backend-powered data storage, autosaving features, and CI/CD for production readiness.

#### Added

- Circuit saving and loading via backend API (POST/GET).
- Dashboard page with ability to list and search user projects.
- Modular block saving with layout and component metadata.
- Autosave every 60 seconds or after 20 changes with toast notifications.
- Conflict resolution and restore dialogs.
- Centralized logging (frontend and backend) integrated with ELK/Loki.
- GitLab CI/CD pipeline for automated production deployments.
- Environment configuration for local development with .env.dev.

#### Fixed

- Input/output port validation and improved snapping on canvas grid.

---

### Summary

MVP2 delivers a stable infrastructure for saving, managing, and restoring circuits. It supports backend persistence, logging, autosave, and deploy automation.

---

## [3.0.0] - 2025-07-13

### MVP3

This version transforms the app into a self-contained, user-centric workspace with persistent backend support and browser-based simulation.

#### Added

- Automatic post-registration login and redirect to the user dashboard.
- Project creation flow with name propagation to the playground for consistent saves.
- Grid/List view toggle on the dashboard with persistent user preference.
- Fully persistent dashboard project list, hydrated from the database.
- Visual validation of circuit layout and metadata before saving.
- Backend-powered circuit simulation via POST /simulate endpoint.
- Support for deleting components and connections using keyboard shortcuts.
- Playground improvements for drag, drop, and zoom interactions.
- Optimized rendering performance and reduced resource consumption.
- Fixed CORS issues and improved error handling in frontend and backend.

#### Fixed

- Drag misalignment during circuit editing.
- Zoom jittering and limits.
- Lost project listings and inconsistent UI states.
- Memory leaks in simulation worker and unhandled promise rejections.

---

### Summary

MVP3 adds user-friendly features, backend-powered simulation, and completes the transition to a persistent, account-based experience.
It focuses on polish: improving UX, increasing reliability, and preparing for real-time collaborative features in future versions.