const { app, BrowserWindow } = require('electron');
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
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  pythonProcess = spawn('python', [path.join(__dirname, '../../python/backend.py')], { stdio: ['pipe', 'pipe', 'inherit'] });
  pythonProcess.stdout.on('data', (data) => {
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
    console.log('Python process exited with code', code);
  });
  createWindow();
});

ipcMain.on('ping', (event) => {
  event.sender.send('pong', 'pong response');
});

ipcMain.handle('send-to-python', async (event, data) => {
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
