import {Entity, Game} from "../game";
import {Quat, Vec3} from "../math";

type Mixin = (game: Game, entity: Entity) => void;

export interface Blueprint {
    Translation?: Vec3;
    Rotation?: Quat;
    Scale?: Vec3;
    Using?: Array<Mixin>;
    Children?: Array<Blueprint>;
}
