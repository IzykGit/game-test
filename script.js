import { handlePlayer, updateEntities } from "./scripts/HandleEntities.js";


export const canvas = document.getElementById("root");
export const ctx = canvas.getContext("2d");



const setWindowSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setWindowSize();
window.addEventListener("resize", setWindowSize);


const gameLoop = (currentTime) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateEntities(currentTime);
    handlePlayer(ctx, canvas);

    requestAnimationFrame(gameLoop);
    
};


gameLoop(0);
