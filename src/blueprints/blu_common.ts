import {Entity, Game} from "../game";
import {Quat, Vec3} from "../math";

type Mixin = (game: Game) => (entity: Entity) => void;

export interface Blueprint {
    translation?: Vec3;
    rotation?: Quat;
    scale?: Vec3;
    using?: Array<Mixin>;
    children?: Array<Blueprint>;
}
