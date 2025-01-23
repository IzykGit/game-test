

export class PathFinding {
    constructor(gameState, canvas, ctx) {

        this.gameState = gameState;
        this.canvas = canvas;
        this.ctx = ctx;

        const { player, enemies, attackArr, powerUps } = gameState;

        this.player = player;
        this.enemies = enemies;
        this.attackArr = attackArr;
        this.powerUps = powerUps;
    }


    updateGruntMovement() {
        const speed = 3.5;

        for(let i = 0; i < this.enemies.length; i++) {
            const dx = (this.player.x + this.player.width) - (this.enemies[i].x + 1);
            const dy = this.player.y - this.enemies[i].y;
    
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0 && this.enemies[i].velocityY === 0) {
                this.enemies[i].x += (dx / distance) * speed;
    
            }
        }
    }

    updatePathfinding() {
        this.updateGruntMovement();
    }
}