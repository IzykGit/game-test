

export class Controls {
    constructor(player, canvas) {
        this.canvas = canvas;
        this.player = player;
        
        this.addEventListeners();

        this.keys = {};

        this.left = "a";
        this.right = "d"
        this.jump = "";

        this.canJump = true;
        this.canAttack = true;
        
        this.attackRight = "arrowright";
        this.attackLeft = "arrowleft";

        this.jumpAudio = new Audio('../assets/sounds/jump.wav');
        this.attackAudio = new Audio("../assets/sounds/laserShoot.wav")

    }

    addEventListeners() {
        document.addEventListener("keydown", (event) => { 
            
            const key = event.key.toLowerCase();
        
            if (!this.player.hasSpawned) return;
        
            switch(key) {
                case key === this.left:
                    this.keys[key] = true;
                    break;
                case key === this.right:
                    this.keys[key] = true;
                    break;
                case key === this.jump:
                    this.keys[key] = true;
                    break;
                case key === this.attackLeft:
                    this.keys[key] = true;
                    this.canAttack = false;
                    break;
                case key === this.attackRight:
                    this.keys[key] = true;
                    this.canAttack = false;
                    break;
                default:
                    return;
            }

        });
        
        document.addEventListener("keyup", (event) => {

            const key = event.key.toLowerCase();

            switch(key) {
                case key === this.left:
                    this.keys[key] = false;
                    break;
                case key === this.right:
                    this.keys[key] = false;
                    break;
                case key === this.jump:
                    this.keys[key] = false;
                    break;
                case key === this.attackLeft:
                    this.keys[key] = false;
                    break;
                case key === this.attackRight:
                    this.keys[key] = false;
                    break;
                default:
                    return;
            }
        });
    }


    move() {
        const step = 5;
        
        if (this.left) {
            this.player.x -= step;
            this.player.velocityX = -10;   
        }

        if (this.right) {
            this.player.x += step;
            this.player.velocityX = 10;
        }

        if (this.canJump && this.velocityY === 0) {
            this.jumpAudio.play(); 
            this.velocityY = -20; 
            this.canJump = false; 
        }

        if (this.attackRight && this.canAttack) {
            this.attackAudio.play();
            
        }

        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > this.canvas.width) this.player.x = this.canvas.width - this.player.width;
    };
}