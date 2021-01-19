const {BrowserWindow} = require('electron')

class MainWindow extends BrowserWindow {
  constructor(file, isDev) {
    super({
      title: 'SysTop',
      width: isDev ? 800 : 355,
      height: 500,
      icon: './assets/icons/icon.png',
      resizable: isDev,
      backgroundColor: 'white',
      webPreferences: {
        nodeIntegration: true,
      }
    });

    this.loadFile(file)
    if (isDev) {
      this.webContents.openDevTools()
    }
  }

}

module.exports = MainWindow
