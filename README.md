# Electron-Grok

A native desktop application providing intuitive access to xAI's Grok AI model through a modern Electron interface.

## Features

- **Native Desktop Experience**: Cross-platform Electron app for macOS, Windows, and Linux
- **Real-time Chat Interface**: Seamless conversation with Grok AI
- **Ephemeral Conversations**: Chat history is kept in memory only and cleared on restart
- **Minimal UI**: Clean, responsive single-conversation view
- **Performance Optimized**: Fast startup and responsive interactions

## Installation

### Prerequisites

- Node.js 18.x or 20.x (use nvm to manage versions)
- npm (bundled with Node)
- Python 3.10+ (python3 in PATH)
- pip
- XAI_API_KEY (string, provided by xAI)

### Setup (zsh)

1. Clone the repository and install root dependencies:

   ```zsh
   cd /path/to/electron-grok
   npm install
   ```

2. Install renderer dependencies:

   ```zsh
   cd src/renderer
   npm install
   cd ../..
   ```

3. Install Python dependencies (recommended: virtualenv):

   ```zsh
   python3 -m venv .venv
   source .venv/bin/activate
   pip install --upgrade pip
   pip install -r python/requirements.txt
   ```

4. Export your API key for the session (temporary):

   ```zsh
   export XAI_API_KEY="sk_live_your_real_key_here"
   ```

Notes:
- The Python requirements file lives at `python/requirements.txt`.
- The Electron main process will spawn the Python backend automatically when the app starts.

## Development

Start the renderer dev server (Vite) and then run Electron in a separate shell.

# Terminal A — start renderer
```zsh
cd src/renderer
npm run dev
```

# Terminal B — start Electron (with Python venv activated if used)
```zsh
cd /path/to/electron-grok
source .venv/bin/activate   # only if you created the venv above
export XAI_API_KEY="sk_live_your_real_key_here"
npm run start
```

Notes:
- In development the renderer is served from http://localhost:5173; the Electron main process expects that URL.
- If Electron can't find `python3`, it will try `python`. Ensure one of them is installed and available in PATH.

## Building & Packaging

1. Build the renderer for production:

   ```zsh
   cd src/renderer
   npm run build
   cd ../..
   ```

2. Package the Electron app using electron-builder (root):

   ```zsh
   # For a local unsigned macOS build
   export CSC_IDENTITY_AUTO_DISCOVERY=false
   npm run build
   ```

Output artifacts will be placed in `./dist` per the project build configuration.

### Troubleshooting

- "XAI_API_KEY environment variable is not set": export `XAI_API_KEY` before running `npm run start`.
- "Python Not Found" or similar: make sure `python3` or `python` is installed and on PATH. Use Homebrew or pyenv to install Python 3 if needed.
- Renderer dev server failing: run `cd src/renderer && npm install` and retry `npm run dev`.
- Packaging failures: check Node/electron versions and ensure you have appropriate macOS tooling if you need signed packages. For unsigned/test builds, set `CSC_IDENTITY_AUTO_DISCOVERY=false` as shown above.

### Smoke tests

1. Verify installed versions:

   ```zsh
   node -v
   npm -v
   python3 --version
   ```

2. Start the renderer and Electron as described in Development. In the Electron app DevTools, confirm the renderer loads and the UI is responsive.

3. Send a test message in the UI and confirm a JSON reply is returned by the Python backend.

## Usage

To run the built app (after packaging) open the artifact in `./dist` or run locally in dev mode as shown above.

## Project Structure

```
electron-grok/
├── src/
│   ├── main/          # Electron main process (src/main/main.js)
│   └── renderer/      # React + Vite frontend (src/renderer)
├── python/            # Python backend and requirements (python/backend.py, python/requirements.txt)
├── static/            # static assets
└── README.md
```

### Development Commands (summary)

```bash
# Install all dependencies (root + renderer)
npm install
cd src/renderer && npm install

# Start renderer (dev server)
cd src/renderer && npm run dev

# Start Electron (in a separate shell; make sure XAI_API_KEY is exported)
npm run start

# Build renderer for production
cd src/renderer && npm run build

# Package app (root)
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run build
```

### Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Python with xAI SDK
- **Desktop**: Electron for cross-platform distribution
- **State**: Zustand for minimal state management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the [CODING_STYLE.md](CODING_STYLE.md) principles
- Write tests for new features
- Update documentation as needed
- Ensure cross-platform compatibility

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [xAI](https://x.ai/) for the Grok API
- [Electron](https://electronjs.org/) for the desktop framework
- [React](https://reactjs.org/) for the UI framework

## Support

For questions or issues, please open an issue on GitHub or contact the maintainers.
