

export class Controls {
    constructor(player) {

        this.player = player;
        this.addEventListeners();

        this.keys = {};

        this.left = "a";
        this.right = "d"
        this.jump = "";
        
        this.attackRight = "arrowright";
        this.attackLeft = "arrowleft";

        this.jumpAudio = new Audio('../assets/sounds/jump.wav')

    }

    addEventListeners() {
        document.addEventListener("keydown", (event) => { 
            
            const key = event.key.toLowerCase();
        
            if (!this.player.hasSpawned) return;
        
            if (this.jump) {
                this.player.jump();
            }
        
            if (key === this.attackLeft && this.player.playerHealth > 0 && canAttack) {
                createProjectile(2)
                canAttack = false;
            }
            if(key === this.attackRight && this.player.playerHealth > 0 && canAttack) {
                createProjectile(1)
                canAttack = false;
            }
        });
        
        document.addEventListener("keyup", (event) => {
        
            keys[event.key] = false;
        
            if (event.key === " ") {
                this.player.canJump = true;
            }
        
        
            if (event.key === "ArrowLeft" && this.player.playerHealth > 0) {
                canAttack = true;
            }
            if(event.key === "ArrowRight" && this.player.playerHealth > 0) {
                canAttack = true;
            }
        });


        
    }


    movement() {

    }
}