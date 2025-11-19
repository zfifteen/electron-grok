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

- Node.js 18.x or later
- Python 3.11+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/electron-grok.git
cd electron-grok

# Install dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Start development
npm run dev
```

### Building

```bash
# Build for production
npm run build

# Package for distribution
npm run dist
```

## Usage

1. Set your `XAI_API_KEY` environment variable.
2. Launch the application.
3. Start chatting with Grok in a single, ephemeral conversation.

## Development

### Project Structure

```
electron-grok/
├── src/
│   ├── main/          # Electron main process
│   ├── renderer/      # React frontend
│   └── shared/        # Shared utilities
├── python/            # Python backend
├── tests/             # Test files
├── docs/              # Documentation
└── build/             # Build configuration
```

### Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Type checking
npm run type-check
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
