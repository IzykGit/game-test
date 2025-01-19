import { Controls } from "./classes/Controls.js";
import { GameMenus } from "./classes/GameMenus.js";
import { HandleGameActors } from "./classes/HandleGameActors.js";
import { Player } from "./classes/Player.js";
import { Spawner } from "./classes/Spawner.js";

const canvas = document.getElementById("root");
const ctx = canvas.getContext("2d");

const startMenu = document.getElementById("menu-screen");

const startButton = document.getElementById("start-button");

const volumeSlider = document.getElementById("volume-slider");
let musicVolume = parseFloat(volumeSlider.value);



volumeSlider.addEventListener("input", () => {
    musicVolume = parseFloat(volumeSlider.value)
    if (game.themeMusic) {
        game.themeMusic.volume = musicVolume
    }

});




class Main {
    constructor() {
        this.gameMenu = true;
        this.pause = false;
        this.isGameOver = false;

        this.themeMusic = null;

        this.player = new Player(50, 300, 40, 90, "blue");
        this.handleGameActors = new HandleGameActors(this.player, canvas, ctx);
        this.controls = new Controls(this.player, canvas);
        this.spawner = new Spawner(this.player)
        this.gameMenu = new GameMenus(ctx)

        this.initCanvas();
        this.addEventListeners();

        this.menus = new GameMenus();

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

    playThemeMusic() {
        if (!this.themeMusic) {
            this.themeMusic = new Audio("./assets/theme.mp3");
            this.themeMusic.loop = false;
        }

        this.themeMusic.addEventListener("ended", () => {
            this.themeMusic.currentTime = 0;
            this.themeMusic.play();
        });

        if (this.themeMusic.paused) {
            this.themeMusic.volume = musicVolume;
            this.themeMusic.play();
        }

    }

    pauseThemeMusic() {
        if (this.themeMusic && !this.themeMusic.paused) {
            this.themeMusic.pause();
        }
    }

    resumeThemeMusic() {
        if (this.themeMusic && this.themeMusic.paused) {
            this.themeMusic.play();
        }
    }




    gameLoop = (currentTime) => {
        if (this.gameMenu) return;
        if (this.pause) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // if (handler === 0) {
        //     this.menus.drawGameOver();
        //     this.pauseThemeMusic();
        //     this.isGameOver = true;
        //     return;
        // }

        this.controls.move();
        this.handleGameActors.updateActors();

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
                        this.resumeThemeMusic();
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
            this.gameLoop();
            this.playThemeMusic();
        })
    }


        destroy() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
        window.removeEventListener("resize", this.handleResize);
    }

}



const game = new Main();
game.gameLoop(0);
