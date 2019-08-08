import {Entity, Game} from "../game.js";
import {Component, ROTATE} from "./com_index.js";

export interface Rotate extends Component {
    x: number;
    y: number;
    z: number;
}

export function rotate(x: number, y: number, z: number) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= ROTATE;
        game[ROTATE][entity] = <Rotate>{x, y, z};
    };
}
