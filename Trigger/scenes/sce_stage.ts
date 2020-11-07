import {Action} from "../actions.js";
import {blueprint_box} from "../blueprints/blu_box.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {collide} from "../components/com_collide.js";
import {control_move} from "../components/com_control_move.js";
import {light_directional} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {trigger} from "../components/com_trigger.js";
import {instantiate} from "../entity.js";
import {Game, Layer} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, {
        Translation: [0, 0, 10],
        ...blueprint_camera(game),
    });

    // Light.
    instantiate(game, {
        Translation: [1, 1, 1],
        Using: [light_directional([1, 1, 1], 1)],
    });

    // Rotating cube.
    instantiate(game, {
        Using: [control_move(null, [0.1276794, 0.1448781, 0.2685358, 0.9437144]), move(0, Math.PI)],
        Children: [
            {
                Translation: [0, 4, 0],
                ...blueprint_box(game),
            },
        ],
    });

    // Trigger.
    instantiate(game, {
        Translation: [4, 0, 0],
        Using: [collide(false, Layer.None, Layer.Default), trigger(Action.Alert)],
    });
}
