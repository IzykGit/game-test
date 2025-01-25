import { Collisions } from "./classes/physics/Collisions.js";
import { Controls } from "./classes/interface/Controls.js";
import { GameMenus } from "./classes/interface/GameMenus.js";
import { Player } from "./classes/actors/Player.js";
import { Physics } from "./classes/physics/Physics.js";
import { SpawnActors } from "./classes/actions/SpawnActors.js";
import { GameState } from "./classes/states/GameState.js";
import { EnemyHandler } from "./classes/actions/EnemyHandler.js";
import { Inventory } from "./classes/interface/Inventory.js";

const canvas = document.getElementById("root");
const ctx = canvas.getContext("2d");

const startMenu = document.getElementById("menu-screen");

const startButton = document.getElementById("start-button");

class Main {
    constructor() {
        this.gameMenu = true;
        this.pause = false;
        this.isGameOver = false;

        this.themeMusic = null;

        this.initCanvas();
        this.addEventListeners();

        // initializing main classes
        this.player = new Player(50, window.innerHeight - 52, 25, 50, "blue", ctx);
        this.gameState = new GameState(this.player, canvas, ctx)
        this.inventory = new Inventory(this.player, canvas, ctx)

        this.spawnActors = new SpawnActors(this.gameState, canvas, ctx);
        this.collisions = new Collisions(this.gameState, canvas, ctx)
        this.physics = new Physics(this.gameState, canvas, ctx)
        this.enemyHandler = new EnemyHandler(this.gameState, canvas, ctx)

        this.gameMenu = new GameMenus(ctx);
        this.controls = new Controls(this.player, canvas, this.gameState, this.inventory);

        // gettting previous time for deltaTime
        this.previousTime = performance.now();
        this.gameLoop = this.gameLoop.bind(this)
        requestAnimationFrame(this.gameLoop)
    }


    // setting canvas size based on screen size
    initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }


    // gameloop
    gameLoop = (currentTime) => {
        if (this.gameMenu) return;
        if (this.pause) return;

        const deltaTime = (currentTime - this.previousTime) / 1000;
        this.previousTime = currentTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.controls.updateMovement(); 
        this.physics.updatePhysics(deltaTime);
        this.collisions.updateCollisions()
        this.player.updatePlayer(currentTime);
        this.spawnActors.spawnUpdate(currentTime);
        this.enemyHandler.updatePathfinding(currentTime);
        this.gameState.updateActors();
        this.inventory.drawInventory();


        requestAnimationFrame(this.gameLoop);
    };


    // resetting main classes
    resetGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        resetGameEntities();
        this.isGameOver = false;
        this.pause = false;

        startMenu.style.display = "flex";
        startButton.disabled = false;

        this.gameMenu = true;
    }


    // handling pause menu and start button
    addEventListeners() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                if (this.isGameOver) {
                    this.resetGame();

                } else if (!this.gameMenu) {

                    this.pause = !this.pause;
                    if (!this.pause) {
                        this.pauseAudio.play();
                        this.gameLoop(performance.now());
                    } else {
                        this.gameMenu.drawPauseMenu()
                    }

                }
            }
        });

        startButton.addEventListener("click", () => {
            startButton.disabled = true;
            startMenu.style.display = "none";
            this.gameMenu = false;
            this.gameLoop(0);
        })
    }

    // event listeners cleanup
    destroy() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
        window.removeEventListener("resize", this.handleResize);
    }

}

new Main();

