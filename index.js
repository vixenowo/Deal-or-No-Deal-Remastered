const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const electronLocalshortcut = require('electron-localshortcut');

let mainWindow; 
let coinCounter = 0.00;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 735,
    resizable: false,
    trafficLightPosition: { x: 8, y: 8 },
    titleBarOverlay: {
      height: 60
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  mainWindow.loadFile('index.html')
  //mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  electronLocalshortcut.register(mainWindow, 'ENTER', () => {
    coinCounter += 0.25;
    console.log(`Coin counter: £${coinCounter.toFixed(2)}`); 

    mainWindow.webContents.send('coin', coinCounter.toFixed(2));
  });

  electronLocalshortcut.register(mainWindow, 'X', () => {
    mainWindow.webContents.send('startgame');
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
