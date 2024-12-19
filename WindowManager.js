const gameElement = document.querySelector('.game');

function scaleGame() {
const { innerWidth: screenWidth, innerHeight: screenHeight } = window;

const scale = Math.min(screenWidth / 1280, screenHeight / 720);

gameElement.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', scaleGame);

window.addEventListener('load', scaleGame);