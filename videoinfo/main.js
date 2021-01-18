const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain } = electron;
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadFile('index.html');
  console.log('App is now ready');
});

ipcMain.on('videoPath', (event, path) => {
  /* ffmpeg.ffprobe(path, () => (err, metadata) => {
    mainWindow.webContents.send('video:metadata', metadata.format.duration);
  }); */
  console.log('here');
  mainWindow.webContents.send('video:metadata', 4.0);
});
