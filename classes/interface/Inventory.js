

export class Inventory {
    constructor(player, canvas, ctx) {
        this.player = player;
        this.canvas = canvas;
        this.ctx = ctx;


        this.selectedAttack = "projectiles"

        this.eventBus = new EventTarget();
    }

    setInventoryState() {
        if(this.selectedAttack === "projectiles") {
            this.selectedAttack = "bombs";
        }
        else {
            this.selectedAttack = "projectiles";
        }
    }

    drawInventory() {
        this.ctx.fillStyle = "grey"
        this.ctx.font = "30px serif";
        this.ctx.fillText(`Projectiles: ${this.player.projectileAmmo}/10`, 50, 150);
        this.ctx.font = "30px serif";
        this.ctx.fillText(`Bombs: ${this.player.bombAmmo}/5`, 50, 200);

        if(this.selectedAttack === "projectiles") {
            this.ctx.fillStyle = "blue"
            this.ctx.font = "30px serif";
            this.ctx.fillText(`Projectiles: ${this.player.projectileAmmo}/10`, 50, 150);
        }
        
        if(this.selectedAttack === "bombs") {
            this.ctx.fillStyle = "blue"
            this.ctx.font = "30px serif";
            this.ctx.fillText(`Bombs: ${this.player.bombAmmo}/5`, 50, 200);
        }
        
    }
}