import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Component, LIGHT} from "./com_index.js";

export interface Light extends Component {
    color: Vec3;
    intensity: number;
}

export function light(color: Vec3 = [1, 1, 1], range: number = 1) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= LIGHT;
        game[LIGHT][entity] = {color, intensity: range ** 2} as Light;
    };
}

export interface LightDetails {
    count: number;
    positions: Float32Array;
    details: Float32Array;
}
