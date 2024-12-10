const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false, // No habilitar integración de Node.js
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // Opcional, si necesitas cargar un archivo de preload
    },
  });

  // Cargar la aplicación React, que estará corriendo en el servidor de desarrollo
  mainWindow.loadURL('http://localhost:5173');  // Si usas `npm start`, React se sirve en localhost:3000
//   mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
