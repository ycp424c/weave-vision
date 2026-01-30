import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import path from 'path'
import { mkdirSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { LibraryManager } from './library/libraryManager'
import { registerLibraryProtocols } from './library/protocol'
import { registerIpcHandlers } from './ipcHandlers'
import { restoreLastLibraryIfPossible } from './appState'
import { registerAppMenu } from './menu'

const libraryManager = new LibraryManager()

let userDataDir = path.join(process.cwd(), '.resource-manager', is.dev ? 'dev-user-data' : 'user-data')
try {
  mkdirSync(userDataDir, { recursive: true })
} catch {
  userDataDir = path.join(app.getPath('temp'), 'resource-manager', is.dev ? 'dev-user-data' : 'user-data')
  mkdirSync(userDataDir, { recursive: true })
}
app.setPath('userData', userDataDir)
app.setPath('cache', path.join(userDataDir, 'cache'))
app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('disable-gpu-sandbox')

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    title: '织影-WeaveVision',
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.resource.manager')

  registerLibraryProtocols(libraryManager)

  await restoreLastLibraryIfPossible(libraryManager)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = createWindow()
  registerAppMenu(mainWindow)
  registerIpcHandlers(mainWindow, libraryManager)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
