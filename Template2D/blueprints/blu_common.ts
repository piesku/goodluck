import {Quat, Rad, Vec2, Vec3} from "../../common";
import {Entity, Game} from "../game";

type Mixin = (game: Game, entity: Entity) => void;

export interface Blueprint {
    Translation?: Vec3;
    Rotation?: Quat;
    Scale?: Vec3;
    Using?: Array<Mixin>;
    Children?: Array<Blueprint>;
}

export interface Blueprint2D {
    Translation?: Vec2;
    Rotation?: Rad;
    Scale?: Vec2;
    Using?: Array<Mixin>;
    Children?: Array<Blueprint2D>;
}
