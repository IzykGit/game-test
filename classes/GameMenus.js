
export class GameMenus {
    constructor(ctx) {
        this.ctx = ctx
    }
    
    drawGameOver() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        this.ctx.fillStyle = "white";
        this.ctx.font = "48px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("GAME OVER", window.innerWidth / 2, window.innerHeight / 2);
        this.ctx.font = "24px Arial";
        this.ctx.fillText("Press Escape to restart!", window.innerWidth / 2, window.innerHeight / 2 + 40);
    };


    drawPauseMenu() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        this.ctx.fillStyle = "white";
        this.ctx.font = "48px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("PAUSED", window.innerWidth / 2, window.innerHeight / 2);
        this.ctx.font = "24px Arial";
        this.ctx.fillText("Press ESC to resume", window.innerWidth / 2, window.innerHeight / 2 + 40);
    };
}