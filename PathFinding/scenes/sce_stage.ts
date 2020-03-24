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

    let vert2face: Record<number, Array<number>> = {};
    for (let fi = 0; fi < mesh.IndexCount; fi += 3) {
        for (let vi = 0; vi < 3; vi++) {
            let v = mesh.IndexArray[fi + vi];
            if (vert2face[v]) {
                vert2face[v].push(fi);
            } else {
                vert2face[v] = [fi];
            }
        }
    }

    let graph: Record<number, Array<number>> = {};
    for (let faceidx = 0; faceidx < mesh.IndexCount; faceidx += 3) {
        graph[faceidx / 3] = [];
        let v1 = mesh.IndexArray[faceidx + 0];
        let v2 = mesh.IndexArray[faceidx + 1];
        let v3 = mesh.IndexArray[faceidx + 2];

        for (let vertfaceidx of vert2face[v1]) {
            if (
                vertfaceidx !== faceidx &&
                (mesh.IndexArray[vertfaceidx + 0] === v2 ||
                    mesh.IndexArray[vertfaceidx + 1] === v2 ||
                    mesh.IndexArray[vertfaceidx + 2] === v2)
            ) {
                graph[faceidx / 3].push(vertfaceidx / 3);
                break;
            }
        }

        for (let vertfaceidx of vert2face[v2]) {
            if (
                vertfaceidx !== faceidx &&
                (mesh.IndexArray[vertfaceidx + 0] === v3 ||
                    mesh.IndexArray[vertfaceidx + 1] === v3 ||
                    mesh.IndexArray[vertfaceidx + 2] === v3)
            ) {
                graph[faceidx / 3].push(vertfaceidx / 3);
                break;
            }
        }

        for (let vertfaceidx of vert2face[v3]) {
            if (
                vertfaceidx !== faceidx &&
                (mesh.IndexArray[vertfaceidx + 0] === v1 ||
                    mesh.IndexArray[vertfaceidx + 1] === v1 ||
                    mesh.IndexArray[vertfaceidx + 2] === v1)
            ) {
                graph[faceidx / 3].push(vertfaceidx / 3);
                break;
            }
        }
    }

    console.log(vert2face);
    console.log(graph);
}
