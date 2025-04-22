const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('node:path');
const fs = require('fs');
const electronLocalshortcut = require('electron-localshortcut');

let mainWindow;
let coinCounter = 0.00;
let idleMode = true;

const settingsPath = path.join(__dirname, 'settings.json');

let settings = {};
try {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
} catch (err) {
  console.error('Error reading settings.json:', err);
  settings = { fullscreen: false, monitor: 1 }; // Default fallback
}

if (typeof settings.fullscreen !== 'boolean' || !Number.isInteger(settings.monitor)) {
  console.warn('Invalid settings, applying defaults.');
  settings = { fullscreen: false, monitor: 1 };
}

const createWindow = () => {
    const displays = screen.getAllDisplays();
    const targetDisplay = displays[settings.monitor - 1] || displays[0];
  
    const screenWidth = targetDisplay.bounds.width;
    const screenHeight = targetDisplay.bounds.height;
    const windowWidth = 1280;
    const windowHeight = 720;
  
    const x = targetDisplay.bounds.x + (screenWidth - windowWidth) / 2;
    const y = targetDisplay.bounds.y + (screenHeight - windowHeight) / 2;
  
    mainWindow = new BrowserWindow({
      x: Math.round(x), 
      y: Math.round(y),
      width: windowWidth,
      height: windowHeight,
      fullscreen: settings.fullscreen,
      useContentSize: true, 
      resizable: false,
      titleBarOverlay: {
        height: 60,
      },
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
  
  mainWindow.loadFile('index.html');
  //mainWindow.setMenuBarVisibility(false)
  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  // Register keyboard shortcuts
  electronLocalshortcut.register(mainWindow, 'Enter', () => {
    if (idleMode) {
      mainWindow.webContents.send('coinsinserted');
      coinCounter += 0.25;
      console.log(`Coin counter: £${coinCounter.toFixed(2)}`);
      mainWindow.webContents.send('coin', coinCounter.toFixed(2), true);
    }
  });

  electronLocalshortcut.register(mainWindow, 'X', () => {
    if (idleMode) {
      idleMode = false;
      mainWindow.webContents.send('startgame');
    }
  });

  /*
  electronLocalshortcut.register(mainWindow, 'Q', () => {
    mainWindow.loadFile('test/game.html');
  });
  */

  ipcMain.on('reduce-coin', (event, amount) => {
    if (coinCounter >= amount) {
      coinCounter -= amount;
      console.log(`Coins remaining: ${coinCounter}`);
      event.sender.send('coin', coinCounter.toFixed(2), false);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on('toggle-fullscreen', () => {
    const isFullScreen = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFullScreen);
  });

  ipcMain.on('startgame', () => {
    mainWindow.loadFile('gameplay.html');
  });
  
});
