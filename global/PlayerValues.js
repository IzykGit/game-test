import { Player } from "../classes/Player.js";


let player = new Player(50, 300, 40, 90, "blue");

export const getPlayer = () => {
    return player;
}