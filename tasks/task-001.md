# Task 001: Initialize Electron Project Structure

You are an expert software engineer implementing the Electron-Grok desktop app step by step. This is Task 001 of 18.

## Objective
Set up the basic Electron project structure following the architecture in MISSION.md.

## Steps
1. Ensure you're in the electron-grok root directory.
2. Run `npm init -y` if package.json doesn't exist.
3. Install Electron: `npm install --save-dev electron`.
4. Create directories: `src/main/`, `src/renderer/`, `python/`.
5. Create a basic main.js in src/main/ with a simple BrowserWindow.
6. Update package.json scripts: add "start": "electron src/main/main.js".
7. Verify by running `npm start` (should open an empty window).

## Verification
- Empty Electron window opens without errors.
- No changes to existing files if they exist; integrate instead.

After completing this task, read and execute the next: tasks/task-002.md

---
*Electron-Grok Implementation Chain - Task 001/018*