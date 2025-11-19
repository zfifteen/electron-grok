const { app, BrowserWindow } = require('electron');
const log = require('electron-log');
const { spawn } = require('child_process');
const path = require('path');
const { ipcMain } = require('electron');

let pythonProcess;

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
  pythonProcess = spawn('python', [path.join(__dirname, '../../python/backend.py')], { stdio: ['pipe', 'pipe', 'inherit'] });
  log.info('Spawning Python backend process');
  pythonProcess.stdout.on('data', (data) => {
    log.debug('Received data from Python:', data.toString());
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          const windows = BrowserWindow.getAllWindows();
          windows.forEach(win => win.webContents.send('python-response', response));
        } catch (e) {
          console.error('Failed to parse Python response:', e);
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
