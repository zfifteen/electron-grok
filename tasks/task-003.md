# Task 003: Python Backend Setup

You are an expert software engineer implementing the Electron-Grok desktop app step by step.
Follow the coding style constraints described in Task 001.

## Objective
Initialize the Python backend with the xAI SDK.

## Steps
1. In `python/`, create `requirements.txt` with `xai-sdk-python` and `pyyaml` (matching `MISSION.md`).
2. Run `pip install -r requirements.txt` (assume a virtual environment if needed).
3. Create `backend.py`: load the `XAI_API_KEY` from the environment and initialize the Grok client using the xAI SDK.
4. Add a simple function to send a test message to Grok and return the response (print it to stdout for now).
5. Handle errors gracefully (e.g., missing API key, network errors) and print clear error messages.

## Verification
- Run `python python/backend.py` with `XAI_API_KEY` set in the environment and confirm you get a response from Grok.

After completing this task, read and execute the next: tasks/task-004.md
