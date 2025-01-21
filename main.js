import { Controls } from "./classes/Controls.js";
import { GameMenus } from "./classes/GameMenus.js";
import { HandleGameActors } from "./classes/HandleGameActors.js";
import { Player } from "./classes/Player.js";
import { SpawnActors } from "./classes/SpawnActors.js";

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

        this.player = new Player(50, window.innerHeight - 52, 25, 50, "blue");
        this.handleGameActors = new HandleGameActors(this.player, canvas, ctx);
        this.controls = new Controls(this.player, canvas, this.handleGameActors);
        this.gameMenu = new GameMenus(ctx)

        this.menus = new GameMenus();

        this.previousTime = performance.now();
        this.gameLoop = this.gameLoop.bind(this)
        requestAnimationFrame(this.gameLoop)
    }

    initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        window.addEventListener("resize", () => {
            if (window.innerWidth < 1920) {
                canvas.width = window.innerWidth;
                startMenu.width = window.innerWidth;
            }
            else {
                canvas.width = 1920;
                startMenu.width = 1920;
            }

            canvas.height = window.innerHeight;
            startMenu.height = canvas.height;
        });
    }





    gameLoop = (currentTime) => {
        if (this.gameMenu) return;
        if (this.pause) return;

        const deltaTime = (currentTime - this.previousTime) / 1000;
        this.previousTime = currentTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // if (handler === 0) {
        //     this.menus.drawGameOver();
        //     this.pauseThemeMusic();
        //     this.isGameOver = true;
        //     return;
        // }

        this.controls.updateMovement();
        this.handleGameActors.updateActors(deltaTime);

        requestAnimationFrame(this.gameLoop);
    };

    resetGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        resetGameEntities();
        this.isGameOver = false;
        this.pause = false;

        this.themeMusic.currentTime = 0;

        startMenu.style.display = "flex";
        startButton.disabled = false;

        this.gameMenu = true;
    }

    addEventListeners() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                if (this.isGameOver) {
                    this.resetGame();

                } else if (!this.gameMenu){

                    this.pause = !this.pause;
                    if (!this.pause) {
                        this.pauseAudio.play();
                        this.gameLoop(performance.now());
                    } else {
                        this.pauseThemeMusic();
                        this.menus.drawPauseMenu()
                        this.pauseAudio.play();
                    }

                }
            }
        });

        startButton.addEventListener("click", () => {
            console.log("clicked")
            startButton.disabled = true;
            startMenu.style.display = "none";
            this.gameMenu = false;
            this.gameLoop(0);
        })
    }


    destroy() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
        window.removeEventListener("resize", this.handleResize);
    }

}



new Main();

