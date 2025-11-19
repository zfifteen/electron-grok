# Task 008: (Intentionally Skipped)

You are an expert software engineer implementing the Electron-Grok desktop app step by step.
Follow the coding style constraints described in Task 001.

## Objective
Keep the application ephemeral; do not add any conversation persistence in this version.

## Steps
1. Do not introduce any storage of messages to disk (no electron-store, localStorage, or filesystem persistence).
2. Ensure the conversation exists only in memory; when the app restarts, the conversation starts fresh.

## Verification
- Restarting the app always starts a new, empty conversation.

After completing this task, read and execute the next: tasks/task-009.md
