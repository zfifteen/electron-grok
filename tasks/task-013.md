# Task 013: Error Handling and Logging

You are an expert software engineer implementing the Electron-Grok desktop app step by step.
Follow the coding style constraints described in Task 001.

## Objective
Implement simple, user-friendly error handling without extra UI chrome.

## Steps
1. Add error boundaries in React components.
2. Catch errors from the Python process and display clear, user-friendly messages (e.g., "Lost connection to backend; please restart the app").
3. Surface API and IPC errors to the user as concise messages in the UI rather than raw stack traces.
4. Optionally use `electron-log` or simple console/file logging for internal diagnostics, but do not expose any "View Logs" button or logs UI in settings.

## Verification
- Errors are caught gracefully and show helpful, minimal error messages to the user.
- There is no "View Logs" or similar logs UI in the app.

After completing this task, read and execute the next: tasks/task-014.md
