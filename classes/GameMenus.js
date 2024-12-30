import { ctx } from "../script.js";

export class GameMenus {
    constructor() {
        
        if (GameMenus.instance) {
            return GameMenus.instance;
        }
        GameMenus.instance = this;
    }

    static getInstance() {
        if (!EntityManager.instance) {
            EntityManager.instance = new EntityManager();
        }
        return EntityManager.instance;
    }

    drawGameOver() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", window.innerWidth / 2, window.innerHeight / 2);
        ctx.font = "24px Arial";
        ctx.fillText("Press Escape to restart!", window.innerWidth / 2, window.innerHeight / 2 + 40);
    };


    drawPauseMenu() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", window.innerWidth / 2, window.innerHeight / 2);
        ctx.font = "24px Arial";
        ctx.fillText("Press ESC to resume", window.innerWidth / 2, window.innerHeight / 2 + 40);
    };
}