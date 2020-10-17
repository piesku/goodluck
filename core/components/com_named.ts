import {instantiate} from "../entity.js";
import {Entity, Game} from "../game.js";
import {Has, World} from "../world.js";

export interface Named {
    Name: string;
}

export function named(Name: string) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Named;
        game.World.Named[entity] = {Name};
    };
}

export function find_first(world: World, name: string) {
    for (let i = 0; i < world.Signature.length; i++) {
        if (world.Signature[i] & Has.Named && world.Named[i].Name === name) {
            return i;
        }
    }
    throw `No entity named ${name}.`;
}

export function test_find_first(assert: any) {
    let game = new Game();
    instantiate(game, {
        Using: [named("foo")],
    });

    assert.equal(find_first(game.World, "foo"), 0);
}
