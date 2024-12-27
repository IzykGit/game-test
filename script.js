import { handlePlayer, resetGameEntities, updateEntities } from "./scripts/HandleEntities.js";

export const canvas = document.getElementById("root");
export const ctx = canvas.getContext("2d");

const startMenu = document.getElementById("menu-screen");

const startButton = document.getElementById("start-button")

const volumeSlider = document.getElementById("volume-slider")
let musicVolume = parseFloat(volumeSlider.value);

volumeSlider.addEventListener("input", () => {
    musicVolume = parseFloat(volumeSlider.value)
});

console.log(volumeSlider.value)
console.log(musicVolume)

class Main {
    constructor() {
        this.gameMenu = true;
        this.pause = false;
        this.isGameOver = false;

        this.themeMusic = null;
        this.pauseAudio = new Audio("./sounds/pause.wav");

        this.initCanvas();
        this.addEventListeners();
    }

    initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            startMenu.width = window.innerWidth;
            startMenu.height = window.innerHeight;
        });
    }

    playThemeMusic() {
        if (!this.themeMusic) {
            this.themeMusic = new Audio("./assets/Pixel Dreams-2.mp3");
            this.themeMusic.loop = false;
        }

        this.themeMusic.volume = musicVolume;
        this.themeMusic.play();

        this.themeMusic.addEventListener("ended", () => {
            this.themeMusic.currentTime = 0;
            this.themeMusic.play();
        });
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


    drawPauseMenu() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
        ctx.font = "24px Arial";
        ctx.fillText("Press ESC to resume", canvas.width / 2, canvas.height / 2 + 40);
    }

    drawGameOver() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.font = "24px Arial";
        ctx.fillText("Press Escape to restart!", canvas.width / 2, canvas.height / 2 + 40);
    }

    gameLoop = (currentTime) => {
        if (this.gameMenu) return;
        if (this.pause) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateEntities(currentTime);
        const handler = handlePlayer(ctx, canvas);

        if (handler === 0) {
            this.drawGameOver();
            this.pauseThemeMusic();
            this.isGameOver = true;
            return;
        }

        requestAnimationFrame(this.gameLoop);
    };

    resetGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        resetGameEntities();
        this.isGameOver = false;
        this.pause = false;

        this.themeMusic.currentTime = 0;
        this.playThemeMusic();

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
                        this.pauseAudio.play();
                        this.drawPauseMenu();
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
        })

        document.addEventListener("DOMContentLoaded", () => {
            this.playThemeMusic();
        });
    }
}



const game = new Main();
game.gameLoop(0);
