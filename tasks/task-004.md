# Task 004: IPC Bridge Establishment

You are an expert software engineer implementing the Electron-Grok desktop app step by step.
Follow the coding style constraints described in Task 001.

## Objective
Set up Electron IPC for communication between the main and renderer processes with a secure preload bridge.

## Steps
1. In `src/main/`, create `preload.js` to expose safe IPC channels (e.g., `'send-to-python'`, `'python-response'`) using `contextBridge.exposeInMainWorld`.
2. In `main.js`, configure `BrowserWindow` with the `preload` script and secure settings: `contextIsolation: true` and `nodeIntegration: false` in `webPreferences`.
3. In the renderer (via the preload context), use the exposed API on `window` to send and receive messages instead of accessing `ipcRenderer` directly.
4. Test IPC: send a `'ping'` from the renderer, handle it in the main process, and send a reply back to confirm the round trip.
5. Ensure no secrets (e.g., API keys) are exposed to the renderer; only pass non-sensitive data over IPC.

## Verification
- A console log in the renderer shows the expected ping response from the main process.

After completing this task, read and execute the next: tasks/task-005.md
