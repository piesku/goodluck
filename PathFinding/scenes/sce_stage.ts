import {from_euler} from "../../common/quat.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional} from "../components/com_light.js";
import {render_basic} from "../components/com_render_basic.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.GL.clearColor(1, 1, 1, 1);

    // Camera.
    instantiate(game, {
        ...blueprint_camera(game),
        Translation: [0, 100, 0],
        Rotation: from_euler([0, 0, 0, 0], 90, 180, 0),
    });

    // Light.
    instantiate(game, {
        Translation: [1, 1, 1],
        Using: [light_directional([1, 1, 1], 1)],
    });

    instantiate(game, {
        Using: [render_diffuse(game.MaterialDiffuseGouraud, game.MeshTerrain, [0.3, 0.9, 0.9, 1])],
    });

    instantiate(game, {
        Translation: [0, 0.3, 0],
        Using: [render_basic(game.MaterialBasicWireframe, game.MeshNavmesh, [1, 1, 0, 1])],
    });

    let mesh = game.MeshNavmesh;

    let faces_containing: Record<number, Array<number>> = {};
    for (let i = 0; i < mesh.IndexCount; i++) {
        let face = Math.floor(i / 3);
        let vert = mesh.IndexArray[i];
        if (faces_containing[vert]) {
            faces_containing[vert].push(face);
        } else {
            faces_containing[vert] = [face];
        }
    }

    let graph: Record<number, Array<number>> = {};
    let face_count = mesh.IndexCount / 3;
    for (let face = 0; face < face_count / 3; face++) {
        graph[face] = [];
        let v1 = mesh.IndexArray[face * 3 + 0];
        let v2 = mesh.IndexArray[face * 3 + 1];
        let v3 = mesh.IndexArray[face * 3 + 2];

        for (let other of faces_containing[v1]) {
            if (
                other !== face &&
                (mesh.IndexArray[other * 3 + 0] === v2 ||
                    mesh.IndexArray[other * 3 + 1] === v2 ||
                    mesh.IndexArray[other * 3 + 2] === v2)
            ) {
                graph[face].push(other);
                break;
            }
        }

        for (let other of faces_containing[v2]) {
            if (
                other !== face &&
                (mesh.IndexArray[other * 3 + 0] === v3 ||
                    mesh.IndexArray[other * 3 + 1] === v3 ||
                    mesh.IndexArray[other * 3 + 2] === v3)
            ) {
                graph[face].push(other);
                break;
            }
        }

        for (let other of faces_containing[v3]) {
            if (
                other !== face &&
                (mesh.IndexArray[other * 3 + 0] === v1 ||
                    mesh.IndexArray[other * 3 + 1] === v1 ||
                    mesh.IndexArray[other * 3 + 2] === v1)
            ) {
                graph[face].push(other);
                break;
            }
        }
    }

    console.log(faces_containing);
    console.log(graph);
}
