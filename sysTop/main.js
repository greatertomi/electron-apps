const { app, BrowserWindow, Menu, ipcMain, Tray } = require('electron')
const log = require('electron-log')
const Store = require('./app/js/Store')
const MainWindow = require('./MainWindow')
const path = require('path')

// Set env
process.env.NODE_ENV = 'production'

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'

let mainWindow
let tray

const store = new Store({
  configName: 'user-settings',
  default: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 5
    }
  }
})

function createMainWindow() {
  mainWindow = new MainWindow('./app/index.html', isDev)
}

app.on('ready', () => {
  createMainWindow()

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.send('settings:get', store.get('settings'))
  })

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  mainWindow.on('close', e => {
    if (!app.isQuitting) {
      e.preventDefault()
      mainWindow.hide()
    }
    return true
  })

  const icon = path.join(__dirname, 'assets', 'icons', 'tray_icon.png')
  tray = new Tray(icon)

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => {
          app.isQuitting = true
          app.quit()
        }
      }
    ])
    tray.popUpContextMenu(contextMenu)
  })

  mainWindow.on('ready', () => (mainWindow = null))
})

// Set Settings
ipcMain.on('settings:set', (e, value) => {
  store.set('settings', value)
  mainWindow.webContents.send('settings:get', store.get('settings'))
})

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Navigation',
        click: () => mainWindow.webContents.send('nav:toggle')
      }
    ]
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
]

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.allowRendererProcessReuse = true
