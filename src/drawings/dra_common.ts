import {Entity, Game} from "../game";

export type Drawing = (game: Game, entity: Entity) => void;
