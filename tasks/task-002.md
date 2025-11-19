# Task 002: Set Up Vite for Renderer Process

You are an expert software engineer implementing the Electron-Grok desktop app step by step.
Follow the coding style constraints described in Task 001.

## Objective
Configure Vite for the React-based renderer process.

## Steps
1. In `src/renderer/`, run `npm create vite@latest . -- --template react-ts` (use existing if present).
2. Install dependencies for the renderer: `npm install`.
3. Install Zustand for state management: `npm install zustand`.
4. Create a basic `App.tsx` with a simple hello message to verify React is wired correctly.
5. Update `vite.config.ts` for Electron integration (e.g., set `base` to `'./'` so built assets load correctly from the file protocol).
6. In `main.js`, load the renderer from the Vite dev server in development, or from the built files in production.

## Verification
- Run `npm run dev` in the renderer; it builds without errors.
- The Electron window loads the React app and shows the hello message.

After completing this task, read and execute the next: tasks/task-003.md
