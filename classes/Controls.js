

export class Controls {
    constructor(player, canvas, spawnActors) {
        this.canvas = canvas;
        this.player = player;
        this.spawnActors = spawnActors;

        this.keys = {};

        this.left = "a";
        this.right = "d"
        this.jump = " ";

        this.stepSpeed = 10;
        this.jumpForce = -1200;

        this.canJump = false;
        this.canAttack = true;
        
        this.attackRight = "arrowright";
        this.attackLeft = "arrowleft";

        this.jumpAudio = new Audio("../assets/sounds/jump.wav");
        

        this.addEventListeners();
 
    }

    addEventListeners() {
        document.addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();
            
            if(key === this.left || key === this.right) {
                this.keys[key] = true;
            };


            if(key === this.jump && this.canJump) {
                this.player.velocityY = this.jumpForce;
                this.canJump = false;
            }

            if(key === this.attackLeft && this.canAttack) {
                this.keys[key] = true;
            }

            if(key === this.attackRight && this.canAttack) {
                this.keys[key] = true;
            }
        });

        
        document.addEventListener("keyup", (event) => {

            const key = event.key.toLowerCase();
            
            if(key === this.left || key === this.right || key === this.jump) {
                this.keys[key] = false;
            };

            if(key === this.attackLeft || key === this.attackRight) {
                this.keys[key] = false;
                this.canAttack = true;
            };

        });

    }


    updateMovement() {
        
        if(this.keys[this.left]) {
            this.player.velocityX -= this.stepSpeed;
            this.player.x -= this.stepSpeed;
        };
        
        if(this.keys[this.right]) {
            this.player.velocityX += this.stepSpeed;
            this.player.x += this.stepSpeed;
        };

        if(this.keys[this.attackLeft] && this.canAttack) {
            this.spawnActors.spawnProjectile(1);
            this.canAttack = false;
        }

        if(this.keys[this.attackRight] && this.canAttack) {
            this.spawnActors.spawnProjectile(2);
            this.canAttack = false;
        }


        if(this.keys[this.jump]) {
            this.player.y -= this.stepSpeed;
        }


        if(this.player.velocityY === 0) {
            this.canJump = true;
        }


        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > this.canvas.width) this.player.x = this.canvas.width - this.player.width;
    };
}