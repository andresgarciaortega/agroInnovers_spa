const { contextBridge, ipcRenderer } = require('electron');

// Exponer las funciones necesarias al proceso de renderizado (React)
contextBridge.exposeInMainWorld('electron', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info')
});
