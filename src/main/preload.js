const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendPing: () => ipcRenderer.send('ping'),
  onPong: (callback) => {
    ipcRenderer.on('pong', callback);
    return () => ipcRenderer.removeListener('pong', callback);
  },
  sendToPython: (data) => ipcRenderer.invoke('send-to-python', data),
  onPythonResponse: (callback) => {
    ipcRenderer.on('python-response', callback);
    return () => ipcRenderer.removeListener('python-response', callback);
  },
  onBackendError: (callback) => {
    ipcRenderer.on('backend-error', callback);
    return () => ipcRenderer.removeListener('backend-error', callback);
  },
});