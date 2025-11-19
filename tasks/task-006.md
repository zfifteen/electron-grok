# Task 006: Basic Message Sending/Receiving UI

You are an expert software engineer implementing the Electron-Grok desktop app step by step.
Follow the coding style constraints described in Task 001.

## Objective
Implement a simple chat UI for sending and receiving messages.

## Steps
1. In `App.tsx`, create an input field, send button, and message list.
2. Use a Zustand store to hold the messages array (each with role, content, and timestamp).
3. On send, add the user message to the store and invoke the `'send-to-python'` IPC channel with the message text.
4. On `'python-response'`, add the AI message to the store.
5. Render messages in order with timestamps so the conversation is easy to follow.

## Verification
- You can type and send a message; both user and AI messages appear in the UI.

After completing this task, read and execute the next: tasks/task-007.md
