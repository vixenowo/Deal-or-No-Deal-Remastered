const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('node:path');
const fs = require('fs');
const electronLocalshortcut = require('electron-localshortcut');

let mainWindow;
let coinCounter = 0.00;
let idleMode = true;

// Path to settings.json
const settingsPath = path.join(__dirname, 'settings.json');

// Load settings.json
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
  
    // Calculate center position
    const screenWidth = targetDisplay.bounds.width;
    const screenHeight = targetDisplay.bounds.height;
    const windowWidth = 1280;
    const windowHeight = 720;
  
    const x = targetDisplay.bounds.x + (screenWidth - windowWidth) / 2;
    const y = targetDisplay.bounds.y + (screenHeight - windowHeight) / 2;
  
    // Create the BrowserWindow
    mainWindow = new BrowserWindow({
      x: Math.round(x), // Ensure integers for pixel alignment
      y: Math.round(y),
      width: windowWidth,
      height: windowHeight,
      fullscreen: settings.fullscreen,
      useContentSize: true, // Maintain internal resolution
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

  // Handle IPC for reducing coins
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
  
});
