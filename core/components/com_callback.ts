import {Entity, Game} from "../game";

type Callback = (game: Game, entity: Entity) => void;

export function callback(fn: Callback) {
    return (game: Game, entity: Entity) => {
        fn(game, entity);
    };
}
