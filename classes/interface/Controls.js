

export class Controls {
    constructor(player, canvas, gameState, inventory) {
        this.canvas = canvas;
        this.player = player;
        this.gameState = gameState;
        this.inventory = inventory;

        this.keys = {};

        this.left = "a";
        this.right = "d";
        this.crouch = "s";
        this.switchAttack = "e";
        this.jump = " ";

        this.stepSpeed = 2;
        this.jumpForce = -1200;

        this.canJump = true;
        this.canAttack = true;
        this.isCrouching = false;

        this.attackRight = "arrowright";
        this.attackLeft = "arrowleft";


        this.addEventListeners();

    }


    // activate action events
    addEventListeners() {
        document.addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();

            if (key === this.left || key === this.right || key === this.crouch) {
                this.keys[key] = true;
            }

            if (key === this.switchAttack) {
                this.gameState.updateSelectedAttack();
                this.inventory.setInventoryState();
            }

            if (key === this.jump && this.canJump) {
                this.player.velocityY = this.jumpForce;
                this.canJump = false;
            }

            if (key === this.attackLeft && this.canAttack && !this.isCrouching) {
                this.keys[key] = true;
                this.gameState.addAttack(1);
                this.canAttack = false;
            }

            if (key === this.attackRight && this.canAttack && !this.isCrouching) {
                this.keys[key] = true;
                this.gameState.addAttack(2);
                this.canAttack = false;
                
            }
        });

        // cancel actions events
        document.addEventListener("keyup", (event) => {

            const key = event.key.toLowerCase();

            if (key === this.left || key === this.right) {
                this.keys[key] = false;
            }

            if (key === this.crouch) {
                this.keys[key] = false;
                this.isCrouching = false;
                this.player.height = this.player.height * 2;
            }

            if (key === this.jump) {
                this.canJump = true;
            }

            if (key === this.attackLeft || key === this.attackRight) {
                this.keys[key] = false;
                this.canAttack = true;
            }

        });
    }

    // update actions performed by the player
    updateMovement() {

        if (this.keys[this.left]) {
            this.player.velocityX -= this.stepSpeed;
            this.player.x -= this.stepSpeed;
        };

        if (this.keys[this.right]) {
            this.player.velocityX += this.stepSpeed;
            this.player.x += this.stepSpeed;
        };

        if (this.keys[this.crouch] && !this.isCrouching) {
            this.player.height = this.player.height / 2;
            this.isCrouching = true;
        }


        if (this.player.velocityY !== 0) {
            this.canJump = false;
        }
        else {
            this.canJump = true;
        }
    };
}