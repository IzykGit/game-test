

export class Inventory {
    constructor(canvas, ctx) {
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
        if(this.selectedAttack === "projectiles") {
            this.ctx.font = "30px serif";
            this.ctx.fillText("Projectiles", 50, 150);
        }
        
        if(this.selectedAttack === "bombs") {
            this.ctx.font = "30px serif";
            this.ctx.fillText("Bombs", 50, 150);
        }
        
    }
}