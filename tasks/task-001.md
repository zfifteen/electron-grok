# Task 001: Initialize Electron Project Structure

You are an expert software engineer implementing the Electron-Grok desktop app step by step.

## Objective
Set up the basic Electron project structure following the architecture in MISSION.md.

Always follow the constraints and style in `MISSION.md` and `CODING_STYLE.md` when making changes.

## Coding Style (applies to all tasks)
- Write the smallest amount of code that satisfies the current task; do not add features, abstractions, or hooks “just in case.”
- Prefer simplifying or deleting existing code over adding new layers or scaffolding.
- Keep control flow flat and explicit (use guard clauses over deep nesting) and avoid extra branches that do not earn their keep.
- Use clear, plain-language names that match the domain; avoid clever patterns that need comments to explain.
- Do not add logging, configuration, CLI flags, or other behavior beyond what is explicitly required by these tasks.

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
