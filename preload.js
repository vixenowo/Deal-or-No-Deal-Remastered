const { ipcRenderer } = require('electron');

const audio = new Audio('./audio/coin_in.wav');
audio.preload = 'auto';

var IDLEaudio = new Audio('audio/mus_attract_2.wav');
IDLEaudio.play();

let COINTOTAL = 0


ipcRenderer.on('coin', (event, coinValue) => {
  // Ensure coinValue is a number (if it's a string, try to convert it)
  coinValue = parseFloat(coinValue);
  COINTOTAL = parseFloat(coinValue);

  if (isNaN(coinValue)) {
    console.error('Invalid coinValue:', coinValue);
    return; // Exit if coinValue is not a valid number
  }

  const coinElement = document.querySelector('.credits');

  if (audio.paused) {
    audio.play();
  } else {
    audio.currentTime = 0;
    audio.play();
  }

  function updateCoinValue() {
      let remainingAmount = 1.00 - coinValue; // Subtract from £1
  
      document.getElementById('normalremaining').innerText = "£" + remainingAmount.toFixed(2);

      if (remainingAmount <= 0.00) {
          document.getElementById('normalmode').innerHTML = '<span class="flashtext">PRESS START</span>';
      }
  }

  function updateCoinValueDoubles() {
      let remainingAmount2 = 2.00 - coinValue; // Subtract from £2
  
      document.getElementById('doubleremaining').innerText = "£" + remainingAmount2.toFixed(2);

      if (remainingAmount2 <= 0.00) {
          document.getElementById('doublemode').innerHTML = '<span class="flashtext">PRESS DOUBLE DEAL</span>';
      }
  }

  // Update the credits text
  if (coinElement) {
    coinElement.textContent = `CREDITS: £${coinValue.toFixed(2)}`;
  }

  // Call the functions to update values for both £1 and £2
  updateCoinValueDoubles();
  updateCoinValue();
});


ipcRenderer.on('startgame', (event) => {
  if (COINTOTAL >= 1.00){
    IDLEaudio.currentTime = 0;
    IDLEaudio.pause();
    var playaudio = new Audio('audio/mus_title.wav');
    playaudio.play();
    var playnarratoraudio = new Audio('audio/narrator/are_you_ready.wav');
    playnarratoraudio.play();
    const gridContainer = document.querySelector('.grid-container');
  
    const rows = 12;  // Example: Increase rows
  const cols = 20; // Example: Increase columns
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
  
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = document.createElement('div');
        tile.classList.add('grid-tile');
        
        // Calculate distance from the center
        const distance = Math.sqrt(
          Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
        );
  
        // Set animation delay based on distance
        tile.style.animationDelay = `${distance * 0.1}s`;
  
        // Set background position for the tile
        tile.style.backgroundPosition = `
          ${-col * (1280 / cols)}px
          ${-row * (720 / rows)}px
        `;
        gridContainer.appendChild(tile);
      }
    }
  }
});