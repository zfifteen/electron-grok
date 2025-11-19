# Task 014: End-to-End QA

You are an expert software engineer implementing the Electron-Grok desktop app step by step.
Follow the coding style constraints described in Task 001.

## Objective
Verify the end-to-end chat flow and tighten the implementation against the documented constraints.

## Steps
1. Run the app in development mode and exercise the full chat flow: send user messages and confirm Grok responses appear correctly in the UI.
2. Confirm conversations are ephemeral: restart the app and verify the message list is empty on launch.
3. Verify that no multi-conversation UI, shortcuts, import/export, or extra chrome have been introduced.
4. Trigger common failure modes (e.g., kill the Python process, remove `XAI_API_KEY`) and confirm the UI shows clear, minimal error messages.
5. Fix any bugs discovered during these manual checks.

## Verification
- App runs end-to-end and satisfies the functional success criteria in `MISSION.md` for this minimal MVP.
- No out-of-scope features (persistence, multi-convo, shortcuts, import/export) are present.

After completing this task, read and execute the next: tasks/task-015.md
