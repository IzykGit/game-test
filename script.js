import { handlePlayer, resetGame, updateEntities } from "./scripts/HandleEntities.js";


export const canvas = document.getElementById("root");
export const ctx = canvas.getContext("2d");



const setWindowSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setWindowSize();
window.addEventListener("resize", setWindowSize);

let pause = false;


const drawPauseMenu = () => {

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    

    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Press ESC to resume', canvas.width / 2, canvas.height / 2 + 40);
}

const drawGameOver = () => {

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    

    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ENDED', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Game Over! Press Escape to restart!', canvas.width / 2, canvas.height / 2 + 40);
}

let isGameOver = false

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (isGameOver) {
            resetGame();
            isGameOver = false;
            gameLoop(performance.now());
        } else {

            pause = !pause;
            if (!pause) {
                gameLoop(performance.now());
            } else {
                drawPauseMenu();
            }
        }
    }
});



const gameLoop = (currentTime) => {
    if(pause) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateEntities(currentTime);
    const handler = handlePlayer(ctx, canvas);

    if(handler === 0) {
        drawGameOver()
        isGameOver = true;
        return;
    }

    requestAnimationFrame(gameLoop);
};


gameLoop(0);
