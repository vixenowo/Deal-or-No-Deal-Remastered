const { ipcRenderer, contextBridge } = require('electron');

const audio = new Audio('./audio/coin_in.wav');
audio.preload = 'auto';

const IDLEaudio = new Audio('audio/mus_attract_2.wav');
const thebanker = new Audio('audio/banker_01.wav');
const videomusic = new Audio('audio/mus_attract_vid.wav');
contextBridge.exposeInMainWorld('electronAPI', {
  playIdleAudio: () => {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html') {
      IDLEaudio.play();
    }
  }
});

var gameplayidleaudio = new Audio('audio/bed_01.wav');

let COINTOTAL = 0;
let idlemode_localvar = true;

let selectedNumber = 0;
let RandomBoxNumber = 0;

let idleModeNumber = 1;

function getRandomNumberFromList() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20, 40, 50, 75, 100, 200];
  const randomIndex = Math.floor(Math.random() * numbers.length);
  selectedNumber = numbers[randomIndex];
}

function getRandomBoxNumber() {
  RandomBoxNumber = Math.floor(Math.random() * 16) + 1;
}

getRandomNumberFromList();
getRandomBoxNumber();

function playCrowdAudio(number) {
  let audioPath;

  if (number >= 10) {
    const badFileNumber = Math.floor(Math.random() * 4) + 1;
    audioPath = `audio/crowd/bad/${String(badFileNumber)}.wav`;
  }
  else if (number < 10) {
    const goodFileNumber = Math.floor(Math.random() * 3) + 1;
    audioPath = `audio/crowd/good/${String(goodFileNumber)}.wav`;
  }

  const audio = new Audio(audioPath);
  audio.play();
}

function playBoxNarratorAudio(number) {
  if (idlemode_localvar){
    const audio = new Audio(`audio/numbers/${String(number).padStart(2, '0')}.wav`); // Format the number as "01", "02", etc.
    audio.play();
  }
}

ipcRenderer.on('coinsinserted', (event) => {
  idlemode_localvar = false;
  document.getElementById('idlemode').style.display = "none";
  document.getElementById('credits').style.display = "block";
  document.getElementById('credits').classList.remove('creditsflashing')
  gameplayidleaudio.currentTime = 0
  gameplayidleaudio.pause();
  
  document.getElementById('trailer').style.display = "none";
  document.getElementById('trailer').currentTime = 0;
  document.getElementById('trailer').pause();
  document.getElementById('idlemode').style.display = "none";
document.getElementById('boxreveal').style.display = "none";
  document.getElementById('roomtable').style.display = "none";
  document.getElementById('boxanimation').currentTime = 0;
  document.getElementById('boxanimation').pause();

  document.getElementById('videomusic').currentTime = 0;
  document.getElementById('videomusic').pause();

  
});

function idlemodeloop() {
  if (idlemode_localvar) {
    setTimeout(function () {
      if (idlemode_localvar) {
        getRandomNumberFromList();
        getRandomBoxNumber();

        document.getElementById('idlemode').style.display = "block";
        document.getElementById('credits').style.display = "none";
        const gridContainer = document.querySelector('.idlelogos');
        const rows = 12;
        const cols = 20;
        const centerRow = Math.floor(rows / 2);
        const centerCol = Math.floor(cols / 2);
        const tileWidth = (1280 / cols);
        const tileHeight = (720 / rows);

        gridContainer.innerHTML = '';

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
    }, 8000);


    setTimeout(function () {
      if (idlemode_localvar) {
        document.getElementById('demonstration').style.display = "flex";
        const tiles = document.querySelectorAll('.idlelogos-tile');
        tiles.forEach(tile => {
          tile.classList.remove('idlelogos-tile');
          tile.classList.add('idlelogos-tile-reverse');

          setTimeout(function () {
            tile.classList.remove('idlelogos-tile-reverse');
          }, 3000);
        });
      }
    }, 15000);

    // 1/3 chance goes here
    if (idlemode_localvar) {

      switch (idleModeNumber) {
        case 1:
          console.log("Idle Mode 1 activated");

          setTimeout(function () {
            if (idlemode_localvar) {
              IDLEaudio.currentTime = 0;
              IDLEaudio.pause();
              gameplayidleaudio.play();
            }
          }, 15000);


          setTimeout(function () {
            document.getElementById('ticketnumbervisual').innerText = selectedNumber;
            document.getElementById('boxnumbervisual').innerText = RandomBoxNumber;

            document.getElementById('boxreveal').style.display = "block";
            document.getElementById('roomtable').style.display = "block";

            const boxTicketPrice = document.getElementById('boxticketprice');

            const colors = {
              1: 'rgb(43, 43, 169)',
              2: 'rgb(46, 46, 179)',
              3: 'rgb(58, 58, 184)',
              4: 'rgb(70, 70, 201)',
              5: 'rgb(77, 77, 220)',
              6: 'rgb(87, 87, 232)',
              7: 'rgb(95, 95, 237)',
              8: 'rgb(127, 127, 246)',
            };

            boxTicketPrice.style.backgroundColor = colors[selectedNumber] || 'rgb(110, 13, 13)';

            document.getElementById('boxanimation').play();
            document.getElementById('boxticketprice').style.display = "none";

            setTimeout(function () {
              document.getElementById('boxticketprice').style.display = "flex";
            }, 1000);

            playBoxNarratorAudio(RandomBoxNumber)

            setTimeout(function () {
              if (idlemode_localvar) {

                if (selectedNumber <= 8) {
                  document.getElementById('ticket_' + selectedNumber).classList.add('ticketleftout')
                }
                if (selectedNumber >= 10) {
                  document.getElementById('ticket_' + selectedNumber).classList.add('ticketrightout')
                }

              }
            }, 500);

            setTimeout(function () {
              if (idlemode_localvar) {
                playCrowdAudio(selectedNumber);
              }
            }, 1100);

            setTimeout(function () {
              if (idlemode_localvar) {
                var moneyflip = new Audio('audio/money_flip.wav');
                moneyflip.play();
              }
            }, 1500);

            // reset back to normal
            setTimeout(function () {
              if (idlemode_localvar) {
                gameplayidleaudio.currentTime = 0;
                gameplayidleaudio.pause();
                document.getElementById('idlemode').style.display = "none";
                document.getElementById('credits').classList.remove('creditsflashing');
                document.getElementById('credits').textContent = `CREDITS: £${COINTOTAL.toFixed(2)}`;
                document.getElementById('demonstration').style.display = "none";
                document.getElementById('ticket_' + selectedNumber).classList.remove('ticketrightout')
                document.getElementById('ticket_' + selectedNumber).classList.remove('ticketleftout')
                document.getElementById('boxreveal').style.display = "none";
                document.getElementById('roomtable').style.display = "none";
                document.getElementById('boxanimation').currentTime = 0;
                document.getElementById('boxanimation').pause();
                idlemodeloop();
              }
            }, 4000);

          }, 20000);

          break;
        case 2:
          console.log("Idle Mode 2 activated");

          setTimeout(function () {
            if (idlemode_localvar) {
              videomusic.play();
            }
          }, 15000);
          setTimeout(function () {
            if (idlemode_localvar) {
              document.getElementById('trailer').play();
            }
          }, 15500);

          setTimeout(function () {
            if (idlemode_localvar) {
              document.getElementById('demonstration').style.display = "none";
              document.getElementById('trailer').style.display = "block";
            }

            setTimeout(function () {
              if (idlemode_localvar) {
                gameplayidleaudio.currentTime = 0;
                gameplayidleaudio.pause();
                document.getElementById('trailer').style.display = "none";
                document.getElementById('trailer').currentTime = 0;
                document.getElementById('trailer').pause();
                document.getElementById('idlemode').style.display = "none";
                document.getElementById('credits').classList.remove('creditsflashing');
                document.getElementById('credits').textContent = `CREDITS: £${COINTOTAL.toFixed(2)}`;
                document.getElementById('demonstration').style.display = "none";
                document.getElementById('ticket_' + selectedNumber).classList.remove('ticketrightout')
                document.getElementById('ticket_' + selectedNumber).classList.remove('ticketleftout')
                document.getElementById('boxreveal').style.display = "none";
                document.getElementById('roomtable').style.display = "none";
                document.getElementById('boxanimation').currentTime = 0;
                document.getElementById('boxanimation').pause();
                idlemodeloop();
              }
            }, 24000);

          }, 15000);


          break;
        case 3:
          console.log("Idle Mode 3 activated");
          var phone = new Audio('audio/phone_ring.wav');
          var offer = new Audio('audio/banker_offer.wav');

          setTimeout(function () {
            if (idlemode_localvar) {
              phone.play();
            }
          }, 15000);
          setTimeout(function () {
            if (idlemode_localvar) {
              thebanker.play();
            }
          }, 15500);
          setTimeout(function () {
            if (idlemode_localvar) {
              offer.play();
            }
          }, 20000);

          break;
      }

      // Increment and reset the idleModeNumber
      idleModeNumber = idleModeNumber < 3 ? idleModeNumber + 1 : 1;


    }
    // 1/3 chance goes here
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


  if (playSound == true) {
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
  if (COINTOTAL >= 1.00) {
    IDLEaudio.currentTime = 0;
    IDLEaudio.pause();
    var playaudio = new Audio('audio/mus_title.wav');
    playaudio.play();
    var playnarratoraudio = new Audio('audio/narrator/are_you_ready.wav');
    playnarratoraudio.play();
    const gridContainer = document.querySelector('.startani');

    ipcRenderer.send('reduce-coin', 1.00);

    setTimeout(function () {
      ipcRenderer.send('startgame');
    }, 5000);

    const rows = 12;
    const cols = 20;
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    const tileWidth = Math.floor(1280 / cols) + 5;
    const tileHeight = Math.floor(720 / rows) + 5;    

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
