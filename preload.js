const { ipcRenderer } = require('electron');

const audio = new Audio('./audio/coin_in.wav');
audio.preload = 'auto';

ipcRenderer.on('coin', (event, coinValue) => {
  // Ensure coinValue is a number (if it's a string, try to convert it)
  coinValue = parseFloat(coinValue);

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
