const { ipcRenderer } = require('electron');

const audio = new Audio('./audio/coin_in.wav');
audio.preload = 'auto';

var IDLEaudio = new Audio('audio/mus_attract_2.wav');
IDLEaudio.play();

var gameplayidleaudio = new Audio('audio/bed_01.wav');

let COINTOTAL = 0;
let idlemode_localvar = true;


ipcRenderer.on('coinsinserted', (event) => {
  idlemode_localvar = false;
  document.getElementById('idlemode').style.display = "none";
  document.getElementById('credits').classList.remove('creditsflashing')
  gameplayidleaudio.currentTime = 0
  gameplayidleaudio.pause();
});

function idlemodeloop() {
  if (idlemode_localvar) {
    setTimeout(function () {
      if (idlemode_localvar) {
        document.getElementById('credits').style.display = "none";
        const gridContainer = document.querySelector('.idlelogos');
        const rows = 12;  
        const cols = 20;  
        const centerRow = Math.floor(rows / 2);
        const centerCol = Math.floor(cols / 2);
        const tileWidth = (1280 / cols);  
        const tileHeight = (720 / rows); 
  
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const tile = document.createElement('div');
            tile.classList.add('idlelogos-tile');
            
            const distance = Math.sqrt(
              Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
            );
  
            tile.style.animationDelay = `${distance * 0.1}s`;
  
            tile.style.backgroundPosition = `
              ${-col * tileWidth}px
              ${-row * tileHeight}px
            `;
  
            tile.style.width = `${tileWidth}px`;
            tile.style.height = `${tileHeight}px`;
  
            gridContainer.appendChild(tile);
          }
        }
      }

      setTimeout(function () {
        if (idlemode_localvar) {
          document.getElementById('credits').style.display = "block";
          document.getElementById('credits').innerText = "INSERT CREDIT";
          document.getElementById('credits').classList.add('creditsflashing')
        }
      }, 2000);
    }, 5000);

    setTimeout(function () {
      if (idlemode_localvar) {
        document.getElementById('demonstration').style.display = "block";
        const tiles = document.querySelectorAll('.idlelogos-tile');
        tiles.forEach(tile => {
          IDLEaudio.currentTime = 0;
          IDLEaudio.pause();
          gameplayidleaudio.play();
          tile.classList.remove('idlelogos-tile');
          tile.classList.add('idlelogos-tile-reverse');
        });
      }
    }, 10000);
  }
}

idlemodeloop();

ipcRenderer.on('coin', (event, coinValue, playSound) => {
  coinValue = parseFloat(coinValue);
  COINTOTAL = parseFloat(coinValue);

  const coinElement = document.querySelector('.credits');

  if (isNaN(coinValue)) {
    console.error('Invalid coinValue:', coinValue);
    return; 
  }


  if (playSound == true){
    if (audio.paused) {
      audio.play();
    } else {
      audio.currentTime = 0;
      audio.play();
    }
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

  if (coinElement) {
    coinElement.textContent = `CREDITS: £${COINTOTAL.toFixed(2)}`;
  }

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
    const gridContainer = document.querySelector('.startani');

    ipcRenderer.send('reduce-coin', 1.00);
  
    const rows = 12;  
    const cols = 20;  
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    const tileWidth = (1280 / cols);  
    const tileHeight = (720 / rows); 
  
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = document.createElement('div');
        tile.classList.add('grid-tile');
        
        const distance = Math.sqrt(
          Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
        );
  
        tile.style.animationDelay = `${distance * 0.1}s`;
  
        tile.style.backgroundPosition = `
          ${-col * tileWidth}px
          ${-row * tileHeight}px
        `;

        tile.style.width = `${tileWidth}px`;
        tile.style.height = `${tileHeight}px`;

        gridContainer.appendChild(tile);
      }
    }
  }
});
