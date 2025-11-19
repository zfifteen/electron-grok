const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendPing: () => ipcRenderer.send('ping'),
  onPong: (callback) => ipcRenderer.on('pong', callback),
  sendToPython: (data) => ipcRenderer.invoke('send-to-python', data),
  onPythonResponse: (callback) => ipcRenderer.on('python-response', callback),
});