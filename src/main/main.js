const { app, BrowserWindow, dialog } = require('electron');
const log = require('electron-log');
const { spawn, execSync } = require('child_process');
const path = require('path');
const { ipcMain } = require('electron');

let pythonProcess;
let buffer = '';

function findPython() {
  // Prefer a project-local venv if it exists
  const repoRoot = path.join(__dirname, '..', '..');
  const venvCandidates = [
    path.join(repoRoot, '.venv', 'bin', 'python3'),
    path.join(repoRoot, '.venv', 'bin', 'python'),
  ];

  for (const p of venvCandidates) {
    try {
      execSync(`"${p}" --version`, { stdio: 'pipe' });
      log.info(`Found Python executable (venv): ${p}`);
      return p;
    } catch (e) {
      // ignore
    }
  }

  const pythonCommands = ['python3', 'python'];
  for (const cmd of pythonCommands) {
    try {
      execSync(`${cmd} --version`, { stdio: 'pipe' });
      log.info(`Found Python executable: ${cmd}`);
      return cmd;
    } catch (e) {
      continue;
    }
  }
  return null;
}

function validateEnvironment() {
  const pythonCmd = findPython();
  if (!pythonCmd) {
    const error = 'Python is not installed or not in PATH. Please install Python 3.x to use this application.';
    log.error(error);
    dialog.showErrorBox('Python Not Found', error);
    app.quit();
    return null;
  }

  if (!process.env.XAI_API_KEY) {
    const error = 'XAI_API_KEY environment variable is not set. Please set it before launching the application.';
    log.error(error);
    dialog.showErrorBox('Missing API Key', error);
    app.quit();
    return null;
  }

  return pythonCmd;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
  }
}

app.whenReady().then(() => {
  const pythonCmd = validateEnvironment();
  if (!pythonCmd) return;

  pythonProcess = spawn(pythonCmd, [path.join(__dirname, '../../python/backend.py')], { stdio: ['pipe', 'pipe', 'inherit'] });
  log.info('Spawning Python backend process');
  pythonProcess.stdout.on('data', (data) => {
    log.debug('Received data from Python:', data.toString());
    buffer += data.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    lines.forEach(line => {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          const windows = BrowserWindow.getAllWindows();
          windows.forEach(win => win.webContents.send('python-response', response));
        } catch (e) {
          log.error('Failed to parse Python response:', e, 'Line:', line);
        }
      }
    });
  });
  pythonProcess.on('exit', (code) => {
    if (code !== 0) {
      const windows = BrowserWindow.getAllWindows();
      windows.forEach(win => win.webContents.send('backend-error', 'Lost connection to backend; please restart the app.'));
    }
    log.info('Python process exited with code', code);
    console.log('Python process exited with code', code);
  });
  createWindow();
});

ipcMain.on('ping', (event) => {
  event.sender.send('pong', 'pong response');
});

ipcMain.handle('send-to-python', async (event, data) => {
  log.info('Sending message to Python:', data);
  if (pythonProcess && pythonProcess.stdin) {
    const payload = JSON.stringify(data) + '\n';
    pythonProcess.stdin.write(payload);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('before-quit', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});
