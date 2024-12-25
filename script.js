import { Player } from "./classes/Player.js";
import { generateLevel } from "./scripts/levelGen.js";


const canvas = document.getElementById("root");
const ctx = canvas.getContext("2d");
ctx.translate(0, canvas.height);
ctx.scale(1, -1);

const player = new Player(50, 0, 30, 30, "blue", 1);




const setWindowSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }

}

setWindowSize();
window.addEventListener("resize", setWindowSize);

const keys = {};

const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.applyGravity(canvas); 
    player.move(keys, canvas); 
    player.drawPlayer(ctx);

    requestAnimationFrame(gameLoop);
    
};

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

gameLoop();
