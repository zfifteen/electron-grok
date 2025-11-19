# Task 005: Integrate Python with IPC

You are an expert software engineer implementing the Electron-Grok desktop app step by step.
Follow the coding style constraints described in Task 001.

## Objective
Connect the Python backend to Electron via IPC using `child_process`.

## Steps
1. In `main.js`, use `{ spawn }` from `child_process` to start `python/backend.py` when the app is ready.
2. Handle the `'send-to-python'` IPC channel: serialize a JSON payload (e.g., `{ id, message }`) as a single line (`JSON.stringify(...) + '\n'`), write it to the Python process `stdin`, and listen for line-delimited responses from `stdout`.
3. In `backend.py`, read line-delimited JSON from `stdin`, parse it into `{ id, message }`, call Grok with the message, then write a JSON response `{ id, reply }` followed by `\n` and flush `stdout`.
4. In `main.js`, on each response line from Python, parse the JSON and emit a `'python-response'` IPC event back to the renderer with the parsed data.
5. Handle the Python process lifecycle: spawn on app ready, log errors if the process exits unexpectedly, and ensure the process is cleanly killed when the app closes.

## Verification
- Sending a message from the renderer results in a Grok response being returned and displayed via the IPC pipeline.

After completing this task, read and execute the next: tasks/task-006.md
